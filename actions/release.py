from bs4 import BeautifulSoup
from PIL import Image
import minify_html
import base64
import io
import re
import os

def main():
    with open('../index.html', 'r', encoding='utf-8') as in_file:
        soup = BeautifulSoup(in_file, 'lxml')

        # Extract linked tags from the HTML
        scripts = soup.body.find_all('script')
        styles = soup.find('link', rel='stylesheet')
        favicon = soup.find('link', rel='icon')

        # Read linked files and extract into strings
        scripts = parse_scripts(scripts)
        styles = parse_styles(styles)
        favicon_data = parse_favicon(favicon)

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

        new_favicon_tag = soup.new_tag("link", rel="icon", href='data:image/x-icon;base64,'+favicon_data)
        soup.head.append(new_favicon_tag)

        # Save to HTML file (full)
        pretty_html = soup.prettify()
        with open('./full.html', "w", encoding="utf-8") as file:
            file.write(pretty_html)
        
        # Minify HTML file and save again
        minified = minify_html.minify(pretty_html, minify_js=True, minify_css=True, remove_processing_instructions=True)

        # The JS minifier doesn't parse correctly escape sequences: replace all double slashes "\\" with single ones "\"
        unescaped_minified = minified.replace('\\\\', '\\')    

        with open('minified.html', 'w', encoding="utf-8") as out_file:
            out_file.write(unescaped_minified)


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
    
    # Pattern to match image src attributes in HTML strings within JavaScript
    # This matches src="OnMakingLoTImages/filename.ext" or src='OnMakingLoTImages/filename.ext'
    image_pattern = r'src=["\']OnMakingLoTImages/([^"\']+)["\']'
    
    def replace_image_src(match):
        image_filename = match.group(1)
        image_path = f'../OnMakingLoTImages/{image_filename}'
        data_uri = image_to_data_uri(image_path)
        
        if data_uri:
            return f'src="{data_uri}"'
        else:
            # If image conversion failed, return original
            return match.group(0)
    
    # Replace all image references with data URIs
    processed_content = re.sub(image_pattern, replace_image_src, js_content)
    
    return processed_content

# Returns a string containing the content of all style tags
def parse_styles(styles):
    styles_path = styles['href']  # Extract file name
    path = f'../{styles_path}'    # Adjust path for styles directory

    with open(path, 'r') as file:
        return file.read()

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
        base64_encoded = base64.b64encode(image_data).decode('utf-8')
        return f"data:{mime_type};base64,{base64_encoded}"

if __name__ == "__main__":
    main()