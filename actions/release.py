from bs4 import BeautifulSoup
from PIL import Image
import minify_html
import base64
import io
import re
import os
import json
from urllib.parse import quote

OUTPUT_DIR = 'dist'


def load_readme_badge_config():
    config_path = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', 'readmeBadges.json'))
    with open(config_path, 'r', encoding='utf-8') as config_file:
        return json.load(config_file)


def readme_badge_regex(alt_text):
    return re.compile(rf'!\[{re.escape(alt_text)}\]\(https://img\.shields\.io/badge/[^)]+\)')


def main():
    with open('../index.html', 'r', encoding='utf-8') as in_file:
        soup = BeautifulSoup(in_file, 'lxml')

        # Extract linked tags from the HTML
        scripts = soup.body.find_all('script')
        style_links = soup.find_all('link', rel='stylesheet')
        favicon = soup.find('link', rel='icon')

        # Preserve analytics scripts (in head) before they get removed
        analytics_scripts = []
        for tag in soup.find_all('script'):
            src = tag.get('src') or ''
            if '_vercel' in src or 'vercel' in src or (tag.string and 'window.va' in (tag.string or '')):
                analytics_scripts.append((tag.name, tag.attrs, tag.string))

        # Preserve SEO <link> tags (canonical, alternate); other links are rebuilt or inlined
        seo_links = []
        for link in list(soup.find_all('link')):
            rel = link.get('rel')
            if isinstance(rel, list):
                rel = rel[0] if rel else None
            if rel in ('canonical', 'alternate'):
                seo_links.append(link.extract())

        # Read linked files and extract into strings
        scripts = parse_scripts(scripts)
        styles = parse_styles(style_links)
        favicon_data = parse_favicon(favicon)

        # Remove linked tags from the original document
        for tag in soup(['script', 'style', 'link']):
            tag.decompose()

        # Re-insert analytics scripts at start of head (va stub must load before bundle)
        for tag_name, attrs, string in reversed(analytics_scripts):
            new_tag = soup.new_tag(tag_name, **attrs)
            if string:
                new_tag.string = string
            soup.head.insert(0, new_tag)

        # Append new tags
        new_script_tag = soup.new_tag('script', defer=True)
        new_script_tag.string = scripts
        soup.body.append(new_script_tag)

        new_style_tag = soup.new_tag('style')
        new_style_tag.string = styles
        soup.head.append(new_style_tag)

        new_favicon_tag = soup.new_tag("link", rel="icon", href='data:image/x-icon;base64,'+favicon_data)
        soup.head.append(new_favicon_tag)

        for seo_link in seo_links:
            soup.head.append(seo_link)

        inline_content_images_in_html(soup)

        os.makedirs(OUTPUT_DIR, exist_ok=True)

        # Save to HTML file (full)
        pretty_html = soup.prettify()
        full_path = os.path.join(OUTPUT_DIR, 'full.html')
        with open(full_path, "w", encoding="utf-8") as file:
            file.write(pretty_html)

        # Minify HTML file and save again
        # minify_js=False: the JS minifier causes scope collisions (e.g. weekNames->w vs local const w)
        # leading to "w is not defined" ReferenceError in production
        minified = minify_html.minify(pretty_html, minify_js=False, minify_css=True, remove_processing_instructions=True)

        minified_path = os.path.join(OUTPUT_DIR, 'minified.html')
        with open(minified_path, 'w', encoding="utf-8") as out_file:
            out_file.write(minified)

        minified_bytes = os.path.getsize(minified_path)
        update_readme_minified_size_badge(minified_bytes)

        print(f"Wrote {full_path} and {minified_path}")


# Returns a string containing the content of all script tags
def parse_scripts(scripts):
    scripts_paths = list(map(lambda el: el.get('src'), scripts))    # Extract file names
    all_contents = ''

    # Iterate over file names, extract the content to a string
    for file_path in scripts_paths:
        path = f'../{file_path}'    # Adjust path for scripts directory

        with open(path, 'r', encoding='utf-8') as file:     # Read file; encoding is necessary to read foreign unicode characters
            content = file.read()
            
            # Process images in the JavaScript content
            content = process_images_in_js(content)
            
            all_contents += '\n' + content

    return all_contents

# Process image references in JavaScript content and convert them to data URIs
def process_images_in_js(js_content):
    """Find image references in JavaScript content and replace them with base64 data URIs"""

    # Matches src="Content/..." in HTML strings inside bundled JS (modals, etc.)
    image_pattern = r'src=["\']Content/([^"\']+)["\']'

    def replace_image_src(match):
        rel_path = match.group(1)
        image_path = os.path.normpath(os.path.join('..', 'Content', rel_path.replace('/', os.sep)))
        data_uri = image_to_data_uri(image_path)

        if data_uri:
            print(f"Successfully converted Content/{rel_path} to data URI")
            return f'src="{data_uri}"'

        print(f"Failed to convert Content/{rel_path}, leaving src unchanged")
        return match.group(0)

    return re.sub(image_pattern, replace_image_src, js_content)

# Returns a string containing the content of all linked stylesheets
def parse_styles(style_links):
    all_contents = ''
    for link in style_links:
        styles_path = link.get('href')
        if not styles_path:
            continue
        path = f'../{styles_path}'
        with open(path, 'r', encoding='utf-8') as file:
            all_contents += '\n' + file.read()
    return inline_content_svg_urls_in_css(all_contents)


def inline_content_svg_urls_in_css(css_text):
    """Replace url(../Content/*.svg) with data URIs so inlined <style> still resolves offline."""
    pattern = r'url\((["\']?)(\.\./Content/[^"\')]+\.svg)\1\)'

    def repl(match):
        rel = match.group(2).replace("/", os.sep)
        file_path = os.path.normpath(os.path.join(os.path.dirname(__file__), rel))
        if not os.path.isfile(file_path):
            print(f"Warning: SVG not found for CSS inline: {file_path}")
            return match.group(0)
        with open(file_path, "rb") as f:
            raw = f.read()
        b64 = base64.b64encode(raw).decode("ascii")
        return f'url("data:image/svg+xml;base64,{b64}")'

    return re.sub(pattern, repl, css_text)


def inline_content_images_in_html(soup):
    """Replace <img src="Content/..."> with data URIs so the minified single-file build works offline."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    for img in soup.find_all('img'):
        src = img.get('src')
        if not src or not src.startswith('Content/'):
            continue
        path = os.path.normpath(os.path.join(script_dir, '..', src))
        data_uri = image_to_data_uri(path)
        if data_uri:
            img['src'] = data_uri
            print(f"Inlined HTML img: {src}")
        else:
            print(f"Warning: could not inline HTML img {src} (missing or too large)")


# Returns a string containing the Base64 conversion of a favicon image
def parse_favicon(favicon):
    favicon_link = favicon['href']
    path = f'../{favicon_link}'    # Adjust path for static directory

    with Image.open(path) as image:
        resized_image = image.resize((32, 32))  # Shrink favicon to appropriate size

        # Convert the resized image to bytes
        buf = io.BytesIO()
        resized_image.save(buf, format='PNG', compress_level=9)
        buf.seek(0)  # Move to the beginning of the buffer
        
        # Read the bytes from the buffer
        image_data = buf.read()
        
        base64_encoded_image = base64.b64encode(image_data)
        base64_string = base64_encoded_image.decode('utf-8')    # Convert base64 bytes to string
        
        return base64_string

# Returns a base64 data URI for an image file
def image_to_data_uri(image_path):
    """Convert an image file to a base64 data URI"""
    if not os.path.exists(image_path):
        print(f"Warning: Image file not found: {image_path}")
        return ""
    
    try:
        # Get file extension to determine MIME type
        _, ext = os.path.splitext(image_path.lower())
        mime_types = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
        }
        mime_type = mime_types.get(ext, 'image/png')
        
        with open(image_path, 'rb') as image_file:
            image_data = image_file.read()
            
            # Check if image is too large for data URI (browsers typically limit to ~2MB)
            if len(image_data) > 2 * 1024 * 1024:  # 2MB limit
                print(f"Warning: Image {os.path.basename(image_path)} is too large ({len(image_data)} bytes) for data URI")
                return ""
            
            base64_encoded = base64.b64encode(image_data).decode('utf-8')
            data_uri = f"data:{mime_type};base64,{base64_encoded}"
            
            # Debug: Print info about the conversion
            print(f"Converted {os.path.basename(image_path)}: {len(image_data)} bytes -> {len(data_uri)} chars")
            
            # Validate the data URI format
            if not data_uri.startswith('data:') or ';base64,' not in data_uri:
                print(f"Warning: Invalid data URI format for {os.path.basename(image_path)}")
                return ""
            
            return data_uri
    except Exception as e:
        print(f"Error converting {image_path}: {e}")
        return ""


def format_minified_size_for_badge(num_bytes):
    """Human-readable size for the README shields.io badge."""
    if num_bytes >= 1024 * 1024:
        mb = num_bytes / (1024 * 1024)
        return f'{mb:.1f} MB' if mb < 10 else f'{int(round(mb))} MB'
    if num_bytes >= 1024:
        return f'{round(num_bytes / 1024)} KB'
    return f'{num_bytes} B'


def update_readme_minified_size_badge(minified_bytes):
    """Set README.md size badge to the minified single-file output size."""
    badge_cfg = load_readme_badge_config()['librarySize']
    alt_text = badge_cfg['altText']
    shields_color = badge_cfg['shieldsColor']
    readme_path = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', 'README.md'))
    size_label = format_minified_size_for_badge(minified_bytes)
    badge_url = (
        f'https://img.shields.io/badge/'
        f'{quote(alt_text, safe="")}-{quote(size_label, safe="")}-{shields_color}'
    )
    new_line = f'![{alt_text}]({badge_url})'
    badge_re = readme_badge_regex(alt_text)

    with open(readme_path, 'r', encoding='utf-8') as readme_file:
        content = readme_file.read()

    if not badge_re.search(content):
        print('Warning: README.md size badge not found; skipping badge update')
        return

    new_content = badge_re.sub(new_line, content, count=1)
    with open(readme_path, 'w', encoding='utf-8') as readme_file:
        readme_file.write(new_content)

    print(f'Updated README.md size badge: {size_label} ({shields_color})')


if __name__ == "__main__":
    main()