Create .py file to read html, match on script import (screw it, do it with regex)

For each extracted file, open file, minify it and append to str
Then append script tag to header. Doing this with regex could be a bit of a PITA, but it could be fun

Open styles.css and copy to style tag in head

BONUS: convert image to b64 and insert that too in the html

Lastly save output to .html file


First try using [minify-html]; see if by chance it imports the scripts automatically (doubt it)
But it does minify everything! So we can paste JS and CSS without minifying it first. 

Lastly publish as github action to automatically create a release with the extracted .html