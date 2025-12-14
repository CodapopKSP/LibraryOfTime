# Managing the mdBook

## Editing Documentation

All documentation edits should be made in the `src` folder. The markdown files in `src` are the source of truth for the book content.

## Building the Book

After making any edits to the documentation, rebuild the book by running:

```bash
mdbook build
```

This command should be run from the `Docs` directory. It will generate the HTML files in the `book` directory based on the markdown files in `src`.