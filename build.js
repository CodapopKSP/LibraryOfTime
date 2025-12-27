/*
    |==================|
    |    Build Script  |
    |==================|
    
    Converts markdown files from Docs/src to nodeData.js format
*/

const fs = require('fs');
const path = require('path');

// Map directory names to node types
const directoryToType = {
    'StandardTime': 'Standard Time',
    'ComputingTime': 'Computing Time',
    'DecimalTime': 'Decimal Time',
    'OtherTime': 'Other Time',
    'SolarCalendars': 'Solar Calendar',
    'LunisolarCalendars': 'Lunisolar Calendar',
    'LunarCalendars': 'Lunar Calendar',
    'SolilunarCalendars': 'Solilunar Calendar',
    'ProposedCalendars': 'Proposed Calendar',
    'OtherCalendars': 'Other Calendar',
    'AstronomicalData': 'Astronomical Data',
    'PopCulture': 'Pop Culture',
    'PoliticalCycles': 'Politics'
};

// Convert name (from markdown header) to ID, ignoring parentheses
function nameToId(name) {
    // Remove anything in parentheses if all characters inside are uppercase
    // (handles nested parentheses by removing from inside out)
    let cleaned = name;
    let prev = '';
    while (cleaned !== prev) {
        prev = cleaned;
        // Remove parentheses if content is all uppercase (like timezone codes: AST, ICT, CST)
        cleaned = cleaned.replace(/\(([A-Z\s]+)\)/g, (match, content) => {
            // Check if all non-space characters are uppercase
            const nonSpaceChars = content.replace(/\s/g, '');
            return nonSpaceChars.length > 0 && nonSpaceChars === nonSpaceChars.toUpperCase() ? '' : match;
        });
    }
    cleaned = cleaned.trim();
    
    // Handle special characters (Greek letters, etc.)
    // Convert Δ (Delta) to "delta"
    cleaned = cleaned.replace(/Δ/g, 'delta');
    cleaned = cleaned.replace(/Đại lịch/g, 'dai-lich');
    cleaned = cleaned.replace(/Kali Ahargaṅa/g, 'kali-ahargana');
    cleaned = cleaned.replace(/Baháʼí/g, 'bahai');
    
    // Replace spaces and special characters with hyphens
    // Convert to lowercase and handle special cases
    return cleaned
        .toLowerCase()
        .replace(/\s+/g, '-')           // Spaces to hyphens
        .replace(/[^\w\-]/g, '')        // Remove special chars except hyphens and word chars
        .replace(/-+/g, '-')            // Multiple hyphens to single
        .replace(/^-|-$/g, '');         // Remove leading/trailing hyphens
}

// Map markdown filenames to node IDs (kept for reference, but not used for ID generation)
function filenameToId(filename) {
    const baseName = filename.replace(/\.md$/, '');
    
    // Convert PascalCase to kebab-case
    return baseName
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();
}

// Parse markdown file to extract node data
function parseMarkdownFile(filePath, directory) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Extract name from title (first line starting with #)
    let name = '';
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('# ')) {
            name = lines[i].substring(2).trim();
            break;
        }
    }
    
    // Extract epoch and confidence from table
    let epoch = '';
    let confidence = '';
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Look for table header with Epoch
        if (line.includes('Epoch') && line.includes('Confidence') && line.startsWith('|')) {
            // Found header, next non-separator line should be data
            for (let j = i + 1; j < lines.length; j++) {
                const dataLine = lines[j].trim();
                // Skip separator lines (containing dashes or colons)
                if (dataLine.match(/^\|[\s\-:]+\|/)) {
                    continue;
                }
                // Parse data row
                if (dataLine.startsWith('|')) {
                    const cells = dataLine.split('|').map(cell => cell.trim()).filter(cell => cell);
                    if (cells.length >= 2) {
                        epoch = cells[0] || '';
                        confidence = cells[1] || '';
                    }
                }
                break;
            }
            break;
        }
    }
    
    // Extract sections (Overview, Info, Accuracy, Source)
    let overview = ``;
    let info = ``;
    let accuracy = ``;
    let source = ``;
    
    let currentSection = null;
    let sectionContent = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check for section headers
        if (line.startsWith('#### Overview')) {
            if (currentSection && sectionContent.length > 0) {
                const content = sectionContent.join('\n').trim();
                if (currentSection === 'overview') overview = content;
                else if (currentSection === 'info') info = content;
                else if (currentSection === 'accuracy') accuracy = content;
                else if (currentSection === 'source') source = content;
            }
            currentSection = 'overview';
            sectionContent = [];
            continue;
        } else if (line.startsWith('#### Info')) {
            if (currentSection && sectionContent.length > 0) {
                const content = sectionContent.join('\n').trim();
                if (currentSection === 'overview') overview = content;
                else if (currentSection === 'info') info = content;
                else if (currentSection === 'accuracy') accuracy = content;
                else if (currentSection === 'source') source = content;
            }
            currentSection = 'info';
            sectionContent = [];
            continue;
        } else if (line.startsWith('#### Accuracy')) {
            if (currentSection && sectionContent.length > 0) {
                const content = sectionContent.join('\n').trim();
                if (currentSection === 'overview') overview = content;
                else if (currentSection === 'info') info = content;
                else if (currentSection === 'accuracy') accuracy = content;
                else if (currentSection === 'source') source = content;
            }
            currentSection = 'accuracy';
            sectionContent = [];
            continue;
        } else if (line.startsWith('#### Source')) {
            if (currentSection && sectionContent.length > 0) {
                const content = sectionContent.join('\n').trim();
                if (currentSection === 'overview') overview = content;
                else if (currentSection === 'info') info = content;
                else if (currentSection === 'accuracy') accuracy = content;
                else if (currentSection === 'source') source = content;
            }
            currentSection = 'source';
            sectionContent = [];
            continue;
        } else if (line.startsWith('---')) {
            // End of metadata section, stop collecting
            if (currentSection && sectionContent.length > 0) {
                const content = sectionContent.join('\n').trim();
                if (currentSection === 'overview') overview = content;
                else if (currentSection === 'info') info = content;
                else if (currentSection === 'accuracy') accuracy = content;
                else if (currentSection === 'source') source = content;
            }
            break;
        }
        
        // Collect content for current section
        if (currentSection && line.trim() !== '') {
            sectionContent.push(line);
        }
    }
    
    // Handle last section if file ends without separator
    if (currentSection && sectionContent.length > 0) {
        const content = sectionContent.join('\n').trim();
        if (currentSection === 'overview') overview = content;
        else if (currentSection === 'info') info = content;
        else if (currentSection === 'accuracy') accuracy = content;
        else if (currentSection === 'source') source = content;
    }
    
    // Get node type and ID
    const filename = path.basename(filePath);
    const type = directoryToType[directory] || null;
    const id = nameToId(name);
    
    return {
        name: name,
        id: id,
        type: type,
        epoch: epoch,
        confidence: confidence,
        overview: overview,
        info: info,
        accuracy: accuracy,
        source: source
    };
}

// Convert markdown link syntax to HTML anchor tags
function convertMarkdownLinks(text) {
    return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

// Convert markdown tables to HTML tables
function convertMarkdownTables(text) {
    // Process line by line to find table blocks
    // Tables can have single or double newlines between rows
    const lines = text.split('\n');
    const result = [];
    let i = 0;
    
    while (i < lines.length) {
        const line = lines[i].trim();
        
        // Check if this line starts a table (starts and ends with |)
        if (line.startsWith('|') && line.endsWith('|')) {
            // Collect all consecutive table lines (including blank lines between rows)
            const tableLines = [line];
            let j = i + 1;
            let separatorIndex = -1;
            
            // First pass: collect all table lines
            let lastWasBlank = false;
            while (j < lines.length) {
                const nextLine = lines[j].trim();
                
                // Stop at blank line (potential table boundary)
                if (nextLine === '') {
                    lastWasBlank = true;
                    // Check if we have a complete table already
                    if (separatorIndex > 0 && tableLines.length > separatorIndex + 1) {
                        // Check if next non-blank line starts a new table (header, not separator)
                        let k = j + 1;
                        while (k < lines.length && lines[k].trim() === '') k++;
                        if (k < lines.length) {
                            const potentialHeader = lines[k].trim();
                            if (potentialHeader.startsWith('|') && potentialHeader.endsWith('|')) {
                                // Check if it's NOT a separator (likely a new table header)
                                const isSeparator = /^\|[\s\-:|]+\|$/.test(potentialHeader) && /[\-:]/.test(potentialHeader);
                                if (!isSeparator) {
                                    // This is likely a new table header, stop here
                                    break;
                                }
                            }
                        }
                    }
                    // Allow one blank line within table
                    j++;
                    continue;
                }
                
                if (nextLine.startsWith('|') && nextLine.endsWith('|')) {
                    // Before adding, check if this might be a new table
                    // If we have a complete table and just passed a blank line, this might be a new table
                    if (lastWasBlank && separatorIndex > 0 && tableLines.length > separatorIndex + 1) {
                        // Check if this line is a separator (part of current table) or a header (new table)
                        const isSeparator = /^\|[\s\-:|]+\|$/.test(nextLine) && /[\-:]/.test(nextLine);
                        if (!isSeparator) {
                            // This looks like a new table header (not a separator), stop before adding it
                            break;
                        }
                    }
                    
                    tableLines.push(nextLine);
                    lastWasBlank = false;
                    
                    // Check if this is a separator line
                    if (separatorIndex === -1 && 
                        /^\|[\s\-:|]+\|$/.test(nextLine) && 
                        /[\-:]/.test(nextLine)) {
                        separatorIndex = tableLines.length - 1;
                    }
                    
                    j++;
                } else {
                    break; // End of table
                }
            }
            
            // Check if we have a valid complete table
            if (separatorIndex > 0 && separatorIndex < tableLines.length - 1) {
                // Parse header row
                const headerRow = tableLines[0];
                const headerCells = headerRow.split('|').map(cell => cell.trim()).filter(cell => cell);
                const headerHtml = headerCells.map(cell => `<th>${cell}</th>`).join('');
                
                // Parse data rows (skip separator line)
                const dataRows = tableLines.slice(separatorIndex + 1);
                const rowsHtml = dataRows.map(row => {
                    const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
                    const cellsHtml = cells.map(cell => `<td>${cell}</td>`).join('');
                    return `<tr>${cellsHtml}</tr>`;
                }).join('');
                
                // Determine table class based on number of columns
                let tableClass = '';
                if (headerCells.length <= 2) {
                    tableClass = ' class="table-short"';
                } else if (headerCells.length <= 3) {
                    tableClass = ' class="table-long"';
                } else {
                    tableClass = ' class="table-very-very-long"';
                }
                
                result.push(`<table${tableClass}><tr>${headerHtml}</tr>${rowsHtml}</table>`);
                i = j;
                continue;
            }
        }
        
        // Not a table line, keep as is
        result.push(lines[i]);
        i++;
    }
    
    // Rejoin with single newlines (will be converted to \n\n later for non-table content)
    return result.join('\n');
}

// Format the node data object as JavaScript code
function formatNodeData(nodeData) {
    // Process each field: convert tables first, then links, then escape
    const processField = (text) => {
        // First convert markdown tables to HTML (this removes newlines from tables)
        let processed = convertMarkdownTables(text);
        // Then convert markdown links
        processed = convertMarkdownLinks(processed);
        return processed;
    };
    
    const overview = processField(nodeData.overview);
    const info = processField(nodeData.info);
    const accuracy = processField(nodeData.accuracy);
    const source = processField(nodeData.source);
    
    // Escape backticks, handle template literals, and convert newlines to \n
    // But preserve HTML tables (they're already single-line)
    const escapeForTemplate = (str) => {
        // Split by HTML tables to preserve them
        const parts = str.split(/(<table[^>]*>.*?<\/table>)/g);
        
        return parts.map((part, index) => {
            // If it's an HTML table, just escape backticks and ${, don't touch newlines
            if (part.startsWith('<table')) {
                return part
                    .replace(/`/g, '\\`')
                    .replace(/\${/g, '\\${');
            }
            // Otherwise, do full escaping including newlines
            return part
                .replace(/`/g, '\\`')
                .replace(/\${/g, '\\${')
                .replace(/\n/g, '\\n\\n')
                .replace(/\r/g, '');
        }).join('');
    };
    
    return `    {
        name: \`${nodeData.name}\`,
        id: \`${nodeData.id}\`,
        type: \`${nodeData.type}\`,
        epoch: \`${nodeData.epoch}\`,
        confidence: \`${nodeData.confidence}\`,
        overview: \`${escapeForTemplate(overview)}\`,
        info: \`${escapeForTemplate(info)}\`,
        accuracy: \`${escapeForTemplate(accuracy)}\`,
        source: \`${escapeForTemplate(source)}\`
    }`;
}

// Map type names to variable names (matching nodeData.js)
const typeToVariableName = {
    'Standard Time': 'standardTimeData',
    'Computing Time': 'computingTimeData',
    'Decimal Time': 'decimalTimeData',
    'Other Time': 'otherTimeData',
    'Solar Calendar': 'solarCalendarsData',
    'Lunisolar Calendar': 'lunisolarCalendarsData',
    'Lunar Calendar': 'lunarCalendarsData',
    'Solilunar Calendar': 'solilunarCalendarsData',
    'Proposed Calendar': 'proposedCalendars',
    'Other Calendar': 'otherCalendars',
    'Astronomical Data': 'astronomicalData',
    'Pop Culture': 'popCultureData',
    'Politics': 'politicalCycles'
};

// Parse SUMMARY.md to get the ordered list of files
function parseSummaryForFileOrder() {
    const summaryPath = path.join(__dirname, 'Docs/src/SUMMARY.md');
    const summaryContent = fs.readFileSync(summaryPath, 'utf8');
    const lines = summaryContent.split('\n');
    
    const fileOrder = [];
    let currentDirectory = null;
    
    for (const line of lines) {
        // Match markdown links: [Text](Directory/Filename.md)
        const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
            const filePath = linkMatch[2];
            // Skip category index files (e.g., "StandardTime/StandardTime.md")
            const pathParts = filePath.split('/');
            if (pathParts.length === 2) {
                const dir = pathParts[0];
                const file = pathParts[1];
                // Check if it's a category index (directory name matches filename without .md)
                const baseName = file.replace(/\.md$/, '');
                if (dir === baseName) {
                    // This is a category index, extract directory name
                    currentDirectory = dir;
                    continue;
                }
                // This is a regular file, add it to order
                fileOrder.push({
                    directory: currentDirectory || dir,
                    filename: file
                });
            }
        }
    }
    
    return fileOrder;
}

// Get all markdown files from a directory (excluding category index files)
function getMarkdownFiles(dirPath, dirName) {
    const files = fs.readdirSync(dirPath);
    const markdownFiles = [];
    
    for (const file of files) {
        if (file.endsWith('.md')) {
            // Skip category index files (e.g., "LunarCalendars.md" in "LunarCalendars" directory)
            if (file === `${dirName}.md` || file === 'SUMMARY.md') {
                continue;
            }
            markdownFiles.push(file);
        }
    }
    
    return markdownFiles;
}

// Format an array of node data objects
function formatNodeDataArray(nodeDataArray, variableName) {
    if (nodeDataArray.length === 0) {
        return `const ${variableName} = [];\n`;
    }
    
    const items = nodeDataArray.map(nodeData => formatNodeData(nodeData)).join(',\n\n');
    return `const ${variableName} = [\n${items}\n];\n`;
}

// Main build function
function build() {
    const docsSrcPath = path.join(__dirname, 'Docs/src');
    const outputPath = path.join(__dirname, 'nodeData.js');
    
    console.log('Parsing SUMMARY.md for file order...');
    const fileOrder = parseSummaryForFileOrder();
    
    // Create a map of (directory, filename) -> order index
    const fileOrderMap = new Map();
    fileOrder.forEach((fileInfo, index) => {
        const key = `${fileInfo.directory}/${fileInfo.filename}`;
        fileOrderMap.set(key, index);
    });
    
    console.log(`Found ${fileOrder.length} files in SUMMARY.md`);
    console.log('Scanning markdown files in:', docsSrcPath);
    
    // Group node data by type
    const nodeDataByType = {};
    Object.values(directoryToType).forEach(type => {
        nodeDataByType[type] = [];
    });
    
    // Process each directory
    const directories = fs.readdirSync(docsSrcPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    let totalFiles = 0;
    
    for (const dirName of directories) {
        const dirPath = path.join(docsSrcPath, dirName);
        const markdownFiles = getMarkdownFiles(dirPath, dirName);
        
        console.log(`\nProcessing ${dirName} (${markdownFiles.length} files)...`);
        
        for (const filename of markdownFiles) {
            const filePath = path.join(dirPath, filename);
            try {
                const nodeData = parseMarkdownFile(filePath, dirName);
                
                if (nodeData.type && nodeData.id) {
                    // Store the file path for sorting
                    nodeData._filePath = `${dirName}/${filename}`;
                    nodeData._order = fileOrderMap.get(nodeData._filePath) ?? Infinity;
                    nodeDataByType[nodeData.type].push(nodeData);
                    totalFiles++;
                    console.log(`  ✓ ${filename} -> ${nodeData.name}`);
                } else {
                    console.warn(`  ✗ ${filename} - missing type or id`);
                }
            } catch (error) {
                console.error(`  ✗ ${filename} - error:`, error.message);
            }
        }
    }
    
    console.log(`\nTotal files processed: ${totalFiles}`);
    
    // Sort each type's array by order from SUMMARY.md
    console.log('\nSorting nodes by SUMMARY.md order...');
    for (const type in nodeDataByType) {
        nodeDataByType[type].sort((a, b) => {
            return a._order - b._order;
        });
        // Remove temporary properties
        nodeDataByType[type].forEach(node => {
            delete node._filePath;
            delete node._order;
        });
    }
    
    // Generate JavaScript output
    const typeOrder = [
        'Standard Time',
        'Computing Time',
        'Decimal Time',
        'Other Time',
        'Solar Calendar',
        'Lunisolar Calendar',
        'Lunar Calendar',
        'Solilunar Calendar',
        'Proposed Calendar',
        'Other Calendar',
        'Astronomical Data',
        'Pop Culture',
        'Politics'
    ];
    
    const variableDeclarations = [];
    const arrayReferences = [];
    
    for (const type of typeOrder) {
        const variableName = typeToVariableName[type];
        const nodeDataArray = nodeDataByType[type] || [];
        variableDeclarations.push(formatNodeDataArray(nodeDataArray, variableName));
        arrayReferences.push(`    ${variableName}`);
    }
    
    const jsOutput = `
//|-------------------|
//|     Node Data     |
//|-------------------|
//
// Generated from markdown files in Docs/src
// Total nodes: ${totalFiles}

${variableDeclarations.join('\n')}
const nodeDataArrays = [
${arrayReferences.join(',\n')}
];

`;
    
    fs.writeFileSync(outputPath, jsOutput, 'utf8');
    console.log('\nGenerated:', outputPath);
    console.log('Build complete!');
}

// Run the build
build();

