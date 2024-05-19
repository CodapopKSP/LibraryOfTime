import minify_html

with open('../index.html', 'r', encoding='utf-8') as in_file:
    html_string = in_file.read()
    minified = minify_html.minify(html_string, minify_js=True, minify_css=True, remove_processing_instructions=True)

    with open('minified.html', 'w') as out_file:
        out_file.write(minified)