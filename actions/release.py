from bs4 import BeautifulSoup
from PIL import Image
import minify_html
import base64
import io
import os
import re
import sys

IMAGES_FOLDER = "OnMakingLoTImages"

def log(msg):
    print(f"[bundle] {msg}")

def main():
    with open('../index.html', 'r', encoding='utf-8') as in_file:
        soup = BeautifulSoup(in_file, 'lxml')

        # Extract linked tags from the HTML
        scripts = soup.body.find_all('script')
        styles_link = soup.find('link', rel='stylesheet')
        favicon = soup.find('link', rel='icon')

        # Read linked files and extract into strings
        scripts_text = parse_scripts(scripts)
        styles_text = parse_styles(styles_link)

        # Inline images referenced from the stylesheet
        styles_text = inline_css_images(styles_text)

        # Inline images referenced from the HTML DOM
        inline_dom_images(soup)

        # Remove linked tags from the original document
        for tag in soup(['script', 'style', 'link']):
            tag.decompose()

        # Re-append assets
        new_script_tag = soup.new_tag('script', defer=True)
        new_script_tag.string = scripts_text
        soup.body.append(new_script_tag)

        new_style_tag = soup.new_tag('style')
        new_style_tag.string = styles_text
        soup.head.append(new_style_tag)

        if favicon:
            new_favicon_tag = soup.new_tag(
                "link", rel="icon",
                href='data:image/x-icon;base64,' + parse_favicon(favicon)
            )
            soup.head.append(new_favicon_tag)

        # Save full, then minified
        pretty_html = soup.prettify()
        with open('./full.html', "w", encoding="utf-8") as file:
            file.write(pretty_html)

        minified = minify_html.minify(
            pretty_html,
            minify_js=True,
            minify_css=True,
            remove_processing_instructions=True
        )
        unescaped_minified = minified.replace('\\\\', '\\')
        with open('minified.html', 'w', encoding="utf-8") as out_file:
            out_file.write(unescaped_minified)

        log("Done. Wrote full.html and minified.html")

# ---------- Helpers ----------

def normalize_path(rel_path: str) -> str:
    """
    Convert an HTML/CSS path to a real FS path rooted one level up.
    Handles './' and leading '/'.
    """
    if not rel_path:
        return rel_path
    p = rel_path.strip().strip('\'"')
    # strip query/hash
    p = p.split('?', 1)[0].split('#', 1)[0]
    # remove leading './' or '/'
    if p.startswith("./"):
        p = p[2:]
    if p.startswith("/"):
        p = p[1:]
    return os.path.normpath(os.path.join("..", p))

def encode_png_to_data_uri(path: str) -> str:
    with Image.open(path) as im:
        buf = io.BytesIO()
        im.save(buf, format='PNG', optimize=True, compress_level=9)
        data = base64.b64encode(buf.getvalue()).decode('utf-8')
        return f"data:image/png;base64,{data}"

def is_our_png(path_like: str) -> bool:
    if not path_like:
        return False
    core = path_like.split('?', 1)[0].split('#', 1)[0]
    # Allow both '/OnMakingLoTImages/' and 'OnMakingLoTImages/'
    return IMAGES_FOLDER.lower() + "/" in core.lower() and core.lower().endswith(".png")

def parse_scripts(scripts):
    all_contents = ''
    for tag in scripts:
        file_path = tag.get('src')
        if not file_path:
            continue
        path = f'../{file_path}'
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        all_contents += '\n' + content
    return all_contents

def parse_styles(styles_link):
    if not styles_link:
        return ''
    path = f"../{styles_link['href']}"
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def inline_dom_images(soup: BeautifulSoup) -> None:
    # <img src>
    for el in soup.find_all('img', src=True):
        src = el['src']
        if is_our_png(src):
            fs = normalize_path(src)
            try:
                el['src'] = encode_png_to_data_uri(fs)
                log(f"Inlined IMG src: {src}")
            except FileNotFoundError:
                log(f"WARNING: not found {fs} for {src}")

    # <img srcset> and <source srcset>
    for el in soup.find_all(['img', 'source']):
        if not el.has_attr('srcset'):
            continue
        parts = [p.strip() for p in el['srcset'].split(',')]
        new_parts = []
        for part in parts:
            if not part:
                continue
            tokens = part.split()
            url = tokens[0]
            descriptor = " ".join(tokens[1:]) if len(tokens) > 1 else ""
            if is_our_png(url):
                fs = normalize_path(url)
                try:
                    url = encode_png_to_data_uri(fs)
                    log(f"Inlined SRCSET entry: {tokens[0]}")
                except FileNotFoundError:
                    log(f"WARNING: not found {fs} for {tokens[0]}")
            new_parts.append((url + (" " + descriptor if descriptor else "")).strip())
        if new_parts:
            el['srcset'] = ", ".join(new_parts)

    # <link rel="preload" as="image" href="...">
    for ln in soup.find_all('link', rel=True, href=True):
        if ln.get('rel') and 'preload' in [r.lower() for r in ln['rel']] and ln.get('as', '').lower() == 'image':
            href = ln['href']
            if is_our_png(href):
                fs = normalize_path(href)
                try:
                    ln['href'] = encode_png_to_data_uri(fs)
                    log(f"Inlined PRELOAD href: {href}")
                except FileNotFoundError:
                    log(f"WARNING: not found {fs} for {href}")

    # inline style="background-image:url(...)"
    url_re = re.compile(r"url\(\s*(['\"]?)([^)'\"]+)\1\s*\)")
    for el in soup.find_all(style=True):
        style_text = el['style']
        def repl(m):
            path_like = m.group(2)
            if is_our_png(path_like):
                fs = normalize_path(path_like)
                try:
                    uri = encode_png_to_data_uri(fs)
                    log(f"Inlined inline-style url(): {path_like}")
                    return f"url({uri})"
                except FileNotFoundError:
                    log(f"WARNING: not found {fs} for {path_like}")
            return m.group(0)
        el['style'] = url_re.sub(repl, style_text)

def inline_css_images(css_text: str) -> str:
    """
    Replace url(...) in CSS that reference our image folder with data URIs.
    """
    if not css_text:
        return css_text
    url_re = re.compile(r"url\(\s*(['\"]?)([^)'\"]+)\1\s*\)")
    def repl(match):
        path_like = match.group(2)
        if is_our_png(path_like):
            fs = normalize_path(path_like)
            try:
                uri = encode_png_to_data_uri(fs)
                log(f"Inlined CSS url(): {path_like}")
                return f"url({uri})"
            except FileNotFoundError:
                log(f"WARNING: not found {fs} for {path_like}")
                return match.group(0)
        return match.group(0)
    return url_re.sub(repl, css_text)

def parse_favicon(favicon):
    favicon_link = favicon['href']
    path = f'../{favicon_link}'
    with Image.open(path) as image:
        resized_image = image.resize((32, 32))
        buf = io.BytesIO()
        image.save(buf, format='PNG', compress_level=9)
        return base64.b64encode(buf.getvalue()).decode('utf-8')

if __name__ == "__main__":
    # Make logs flush promptly when run from some shells/CI
    sys.stdout.reconfigure(line_buffering=True)
    main()
