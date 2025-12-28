#!/bin/bash
# Unified build script
# Runs both buildNodeData.js and mdbook build

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=========================================="
echo "  Library of Time - Build Script"
echo "=========================================="
echo ""

# Step 1: Build nodeData.js from markdown files
echo "Step 1: Building nodeData.js from markdown files..."
echo "---------------------------------------------------"
node "$SCRIPT_DIR/buildNodeData.js"

if [ $? -ne 0 ]; then
    echo "Error: buildNodeData.js failed!"
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
    echo ""
    echo "Build complete (nodeData.js only)"
    exit 0
fi

mdbook build

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ mdbook build complete! Output is in Docs/book/"
else
    echo "Error: mdbook build failed!"
    exit 1
fi

echo ""
echo "=========================================="
echo "  All builds complete!"
echo "=========================================="

