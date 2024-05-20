from bs4 import BeautifulSoup
import minify_html

def main():
    with open('../index.html', 'r', encoding='utf-8') as in_file:
        soup = BeautifulSoup(in_file, 'lxml')

        scripts = soup.find_all('script')
        styles = soup.find('link', rel='stylesheet')
        favicon = soup.find('link', rel='icon')

        scripts = parse_scripts(scripts)
        styles = parse_styles(styles)
        favicon_link = parse_favicon(favicon)

        print(scripts)
        print(styles)
        print(favicon_link)


def parse_scripts(scripts):
    scripts = list(map(lambda el: el.get('src'), scripts))

    return scripts

def parse_styles(styles):
    styles = styles['href']

    return styles

def parse_favicon(favicon):
    favicon_link = favicon['href']

    return favicon_link

if __name__ == "__main__":
    main()