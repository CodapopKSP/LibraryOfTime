# Bundler
The `release.py` compresses the Library of Time project into a single .html file. The file can then be ran on client side without the need for a web server or even an internet connection. Specifically:

- JS files are compressed into a single string and embeded in a `<script>` tag at the bottom of the page
- CSS files are copied into a single `<style>` tag in the page he ader
- the favicon gets compressed and converted to a base64 string and embedded in the page header


# Run locally

(optional) Create a virtual environment 
```bash
python -m venv ./env

./env/Scripts/activate   
```

Install dependencies
```bash
pip install -r requirements.txt
```

Run
```bash
py release.py
```

# Output
The Bundler will generate two HTML files. `full.html` is a mere copy of the entire repo in a single file, including all comments and white spaces. `minified.html` is the highly optimized and compressed version.

Thanks to a GitHub Action, an up to date version of `minified.html` will be generated as a Release on every commit on the main branch of the repository.
