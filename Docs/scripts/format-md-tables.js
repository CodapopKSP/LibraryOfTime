#!/usr/bin/env node
/**
 * Align markdown table columns in Docs/src/*.md files.
 * Usage: node Docs/scripts/format-md-tables.js
 */

const fs = require('fs');
const path = require('path');

const DOCS_SRC = path.join(__dirname, '..', 'src');

function isTableLine(line) {
  const trimmed = line.trim();
  return trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 1;
}

function parseRow(line) {
  const parts = line.trim().split('|');
  return parts.slice(1, parts.length - 1).map((cell) => cell.trim());
}

function isSeparatorRow(cells) {
  return cells.length > 0 && cells.every((cell) => /^:?-+:?$/.test(cell));
}

function formatTable(tableLines) {
  const rows = tableLines.map(parseRow);
  const numCols = Math.max(...rows.map((row) => row.length));

  const padded = rows.map((row) => {
    const copy = [...row];
    while (copy.length < numCols) {
      copy.push('');
    }
    return copy;
  });

  const widths = Array(numCols).fill(0);
  for (const row of padded) {
    if (isSeparatorRow(row)) {
      continue;
    }
    for (let i = 0; i < numCols; i++) {
      widths[i] = Math.max(widths[i], row[i].length);
    }
  }

  for (let i = 0; i < numCols; i++) {
    widths[i] = Math.max(widths[i], 3);
  }

  return padded.map((row) => {
    const cells = row.map((cell, i) => {
      if (isSeparatorRow(row)) {
        return '-'.repeat(widths[i]);
      }
      return cell.padEnd(widths[i]);
    });
    return `| ${cells.join(' | ')} |`;
  });
}

function processContent(content) {
  const lines = content.split('\n');
  const result = [];
  let changed = false;
  let i = 0;

  while (i < lines.length) {
    if (isTableLine(lines[i])) {
      const tableStart = i;
      while (i < lines.length && isTableLine(lines[i])) {
        i++;
      }
      const tableLines = lines.slice(tableStart, i);
      const formatted = formatTable(tableLines);
      if (formatted.join('\n') !== tableLines.join('\n')) {
        changed = true;
      }
      result.push(...formatted);
    } else {
      result.push(lines[i]);
      i++;
    }
  }

  return { content: result.join('\n'), changed };
}

function walkDir(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = walkDir(DOCS_SRC);
let updatedCount = 0;

for (const filePath of files) {
  const original = fs.readFileSync(filePath, 'utf8');
  const { content, changed } = processContent(original);
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
    console.log(path.relative(DOCS_SRC, filePath));
  }
}

console.log(`Updated ${updatedCount} file(s).`);
