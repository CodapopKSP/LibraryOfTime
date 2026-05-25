#!/bin/bash
# Unified build script
# Runs actions/buildNodeData.js, mdbook build, and (optionally) the single-file HTML bundler

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# README shields.io badge colors (names or hex without #)
export LOT_README_BADGE_LIBRARY_ENTRIES_COLOR=blue
export LOT_README_BADGE_LIBRARY_SIZE_COLOR=orange
export LOT_README_BADGE_TEST_COVERAGE_COLOR=brightgreen

echo "=========================================="
echo "  Library of Time - Build Script"
echo "=========================================="
echo ""

# Step 1: Build nodeData.js from markdown files
echo "Step 1: Building nodeData.js from markdown files..."
echo "---------------------------------------------------"
node "$SCRIPT_DIR/actions/buildNodeData.js"

if [ $? -ne 0 ]; then
    echo "Error: actions/buildNodeData.js failed!"
    exit 1
fi

echo ""
echo "✓ nodeData.js build complete!"
echo ""

# Step 2: Build mdbook documentation
echo "Step 2: Building mdbook documentation..."
echo "------------------------------------------"

cd "$SCRIPT_DIR/Docs" || exit 1

if ! command -v mdbook &> /dev/null; then
    echo "Warning: mdbook is not installed."
    echo "Skipping mdbook build. Install with: cargo install mdbook"
else
    mdbook build

    if [ $? -eq 0 ]; then
        echo ""
        echo "✓ mdbook build complete! Output is in Docs/book/"
    else
        echo "Error: mdbook build failed!"
        exit 1
    fi
fi

cd "$SCRIPT_DIR" || exit 1

echo ""
echo "Step 3: Bundling and minifying site (release.py)..."
echo "---------------------------------------------------"

if ! command -v python3 &> /dev/null; then
    echo "Warning: python3 is not installed."
    echo "Skipping HTML bundle. Install Python 3 and: pip install -r actions/requirements.txt"
elif ! python3 -c "import bs4, minify_html, PIL" 2>/dev/null; then
    echo "Warning: bundler dependencies are not installed."
    echo "Skipping HTML bundle. Install with:"
    echo "  pip install -r actions/requirements.txt"
else
    cd "$SCRIPT_DIR/actions" || exit 1
    python3 release.py

    if [ $? -eq 0 ]; then
        echo ""
        echo "✓ HTML bundle complete!"
        echo "  Open actions/dist/minified.html in a browser (~1.6 MB single-file site)"
    else
        echo "Error: release.py failed!"
        exit 1
    fi
fi

echo ""
echo "=========================================="
echo "  All builds complete!"
echo "=========================================="

