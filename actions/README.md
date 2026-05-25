# Build scripts

## `buildNodeData.js`

Generates `Content/nodeData.js` from markdown in `Docs/src`, and updates the Library Entries and Test Coverage badges in the root `README.md`. Run from the repo root via `bash build.sh` (Step 1) or:

```bash
node actions/buildNodeData.js
```

Badge colors are set by environment variables exported from `build.sh`.

## `release.py`

The bundler compresses the Library of Time project into a single .html file. The file can then be ran on client side without the need for a web server or even an internet connection. Specifically:

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
The bundler writes two HTML files under `dist/` (gitignored):

- `dist/full.html` — single file with inlined JS/CSS and readable formatting (~1.7 MB)
- `dist/minified.html` — compressed version for releases; open this in a browser to test the offline build

After a successful run, `release.py` also updates the size badge in the repo root `README.md` from `dist/minified.html`.

Thanks to a GitHub Action, an up to date version of `dist/minified.html` will be generated as a Release on every commit on the main branch of the repository.
