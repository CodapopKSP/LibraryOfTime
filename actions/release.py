from bs4 import BeautifulSoup
from PIL import Image
import minify_html
import base64
import io
import os
import re

IMAGES_FOLDER = "OnMakingLoTImages"

def main():
    with open('../index.html', 'r', encoding='utf-8') as in_file:
        soup = BeautifulSoup(in_file, 'lxml')

        # Extract linked tags from the HTML
        scripts = soup.body.find_all('script')
        styles_link = soup.find('link', rel='stylesheet')
        favicon = soup.find('link', rel='icon')

        # Read linked files and extract into strings
        scripts = parse_scripts(scripts)
        styles = parse_styles(styles_link)

        # Inline images used in CSS from our images folder
        styles = inline_css_images(styles)

        favicon_data = parse_favicon(favicon)

        # Inline <img> and srcset images from our images folder
        inline_html_images(soup)

        # Remove linked tags from the original document
        for tag in soup(['script', 'style', 'link']):
            tag.decompose()

        # Append new tags
        new_script_tag = soup.new_tag('script', defer=True)
        new_script_tag.string = scripts
        soup.body.append(new_script_tag)

        new_style_tag = soup.new_tag('style')
        new_style_tag.string = styles
        soup.head.append(new_style_tag)

        new_favicon_tag = soup.new_tag("link", rel="icon",
                                       href='data:image/x-icon;base64,' + favicon_data)
        soup.head.append(new_favicon_tag)

        # Save to HTML file (full)
        pretty_html = soup.prettify()
        with open('./full.html', "w", encoding="utf-8") as file:
            file.write(pretty_html)

        # Minify HTML file and save again
        minified = minify_html.minify(
            pretty_html,
            minify_js=True,
            minify_css=True,
            remove_processing_instructions=True
        )

        # The JS minifier doesn't parse correctly escape sequences:
        # replace all double slashes "\\" with single ones "\"
        unescaped_minified = minified.replace('\\\\', '\\')

        with open('minified.html', 'w', encoding="utf-8") as out_file:
            out_file.write(unescaped_minified)

# ---------- Helpers ----------

def normalize_path(rel_path: str) -> str:
    """
    Turn a path from HTML/CSS into a real filesystem path rooted one level up.
    """
    # strip quotes and whitespace
    rel_path = rel_path.strip().strip('\'"')
    # remove leading "./"
    if rel_path.startswith("./"):
        rel_path = rel_path[2:]
    return os.path.normpath(os.path.join("..", rel_path))

def encode_png_to_data_uri(path: str) -> str:
    """
    Open a PNG, re-encode with optimization, and return a data URI string.
    """
    with Image.open(path) as im:
        buf = io.BytesIO()
        # Keep as PNG, optimize/compress
        im.save(buf, format='PNG', optimize=True, compress_level=9)
        data = base64.b64encode(buf.getvalue()).decode('utf-8')
        return f"data:image/png;base64,{data}"

def is_our_png(path_like: str) -> bool:
    """
    Checks if a referenced path points into IMAGES_FOLDER and is a .png
    (ignores possible query strings like ?v=1).
    """
    if not path_like:
        return False
    core = path_like.split('?', 1)[0].split('#', 1)[0]
    return (IMAGES_FOLDER + "/") in core and core.lower().endswith(".png")

# Returns a string containing the content of all script tags
def parse_scripts(scripts):
    scripts_paths = list(map(lambda el: el.get('src'), scripts))  # Extract file names
    all_contents = ''

    # Iterate over file names, extract the content to a string
    for file_path in scripts_paths:
        path = f'../{file_path}'  # Adjust path for scripts directory
        with open(path, 'r', encoding='utf-8') as file:  # encoding for unicode
            content = file.read()
            all_contents += '\n' + content

    return all_contents

# Returns a string containing the content of the stylesheet
def parse_styles(styles_link):
    styles_path = styles_link['href']  # Extract file name
    path = f'../{styles_path}'  # Adjust path for styles directory
    with open(path, 'r', encoding='utf-8') as file:
        return file.read()

def inline_html_images(soup: BeautifulSoup) -> None:
    """
    Replaces <img src> and srcset items that reference our images folder with data URIs.
    """
    # <img src="...">
    for img in soup.find_all('img', src=True):
        src = img['src']
        if is_our_png(src):
            fs_path = normalize_path(src)
            img['src'] = encode_png_to_data_uri(fs_path)

    # <img srcset="a.png 1x, b.png 2x">
    for img in soup.find_all('img', srcset=True):
        parts = [p.strip() for p in img['srcset'].split(',')]
        new_parts = []
        for part in parts:
            if not part:
                continue
            # split like "path 2x" or "path 400w"
            tokens = part.split()
            if len(tokens) == 0:
                continue
            url = tokens[0]
            descriptor = " ".join(tokens[1:]) if len(tokens) > 1 else ""
            if is_our_png(url):
                fs_path = normalize_path(url)
                url = encode_png_to_data_uri(fs_path)
            new_parts.append((url + (" " + descriptor if descriptor else "")).strip())
        if new_parts:
            img['srcset'] = ", ".join(new_parts)

def inline_css_images(css_text: str) -> str:
    """
    Replaces url(...) references to our images with data URIs.
    Leaves other URLs unchanged.
    """
    url_re = re.compile(r"url\(\s*(['\"]?)([^)'\"]+)\1\s*\)")

    def repl(match):
        quote, path_like = match.group(1), match.group(2)
        if is_our_png(path_like):
            fs_path = normalize_path(path_like)
            try:
                return f"url({encode_png_to_data_uri(fs_path)})"
            except FileNotFoundError:
                # If somehow missing, fall back to original reference
                return match.group(0)
        return match.group(0)

    return url_re.sub(repl, css_text)

# Returns a string containing the Base64 conversion of a favicon image
def parse_favicon(favicon):
    favicon_link = favicon['href']
    path = f'../{favicon_link}'  # Adjust path for static directory

    with Image.open(path) as image:
        resized_image = image.resize((32, 32))  # Shrink favicon to appropriate size

        # Convert the resized image to bytes
        buf = io.BytesIO()
        resized_image.save(buf, format='PNG', compress_level=9)
        buf.seek(0)  # Move to the beginning of the buffer

        # Read the bytes from the buffer
        image_data = buf.read()

        base64_encoded_image = base64.b64encode(image_data)
        base64_string = base64_encoded_image.decode('utf-8')  # Convert base64 bytes to string

        return base64_string

if __name__ == "__main__":
    main()