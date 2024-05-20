from bs4 import BeautifulSoup
import minify_html
import base64

def main():
    with open('../index.html', 'r', encoding='utf-8') as in_file:
        soup = BeautifulSoup(in_file, 'lxml')

        # Extract linked tags from the HTML
        scripts = soup.find_all('script')
        styles = soup.find('link', rel='stylesheet')
        favicon = soup.find('link', rel='icon')

        # Read linked files and extract into strings
        scripts = parse_scripts(scripts)
        styles = parse_styles(styles)
        favicon_link = parse_favicon(favicon)

        # Remove linked tags from the original document
        for tag in soup(['script', 'style', 'link']):
            tag.decompose()

        # print(scripts)
        # print(styles)
        # print(favicon_link)


# Returns a string containing the content of all script tags
def parse_scripts(scripts):
    scripts_paths = list(map(lambda el: el.get('src'), scripts))    # Extract file names
    all_contents = ''

    # Iterate over file names, extract the content to a string
    for file_path in scripts_paths:
        path = f'../{file_path}'    # Adjust path for scripts directory

        with open(path, 'r', encoding='utf-8') as file:     # Read file; encoding is necessary to read foreign unicode characters
            content = file.read()
            all_contents += '\n' + content

    return all_contents

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

    # Open the image file in binary mode
    with open(path, "rb") as image_file:
        image_data = image_file.read()

        base64_encoded_image = base64.b64encode(image_data)
        base64_string = base64_encoded_image.decode('utf-8')    # Convert base64 bytes to string

        return base64_string

if __name__ == "__main__":
    main()