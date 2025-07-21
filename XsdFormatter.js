const fs = require('fs');

const data = fs.readFileSync('tags.txt', 'utf8');
const lines = data.split(/\r?\n/).filter(line => line.trim() !== '');

const filename = 'pain.013.001.08.xsd';

let xsdData = fs.readFileSync(`./XSDs/${filename}`, 'utf8');
let xsdLines = xsdData.split(/\r?\n/);

let modified = false;

for (const tagPath of lines) {
    const tagParts = tagPath.split('.');
    let currentTag = 'Document';
    let found = false;
    let lastLineNumber = null;
    let minOccurs = null;

    for (let tagIndex = 0; tagIndex < tagParts.length; tagIndex++) {
        found = false;
        
        for (let i = 0; i < xsdLines.length; i++) {
            const line = xsdLines[i];
            if (line.includes('<xs:element') && line.includes(`name="${currentTag}"`)) {
                lastLineNumber = i + 1;
                
                if (tagIndex === tagParts.length - 1) {
                    const minOccursMatch = line.match(/minOccurs="([^"]+)"/);
                    if (minOccursMatch) {
                        xsdLines[i] = line.replace(/minOccurs="[^"]+"/, 'minOccurs="1"');
                        modified = true;
                    } else {
                        xsdLines[i] = line.replace('<xs:element', '<xs:element minOccurs="1"');
                        modified = true;
                    }
                    minOccurs = "1";
                }
                
                const typeMatch = line.match(/type="([^"]+)"/);
                if (typeMatch) {
                    const typeValue = typeMatch[1];
                    
                    if (tagIndex < tagParts.length - 1) {
                        let typeFound = false;
                        for (let j = 0; j < xsdLines.length; j++) {
                            const typeLine = xsdLines[j];
                            if (typeLine.includes(`name="${typeValue}"`) && typeLine.includes('<xs:complexType')) {
                                typeFound = true;
                                currentTag = tagParts[tagIndex + 1];
                                break;
                            }
                        }
                        
                        if (!typeFound) {
                            found = false;
                            break;
                        }
                    }
                }
                
                found = true;
                break;
            }
        }

        if (!found) {
            break;
        }
    }

    if (found) {
        console.log(`${tagPath}: ${lastLineNumber} -- minOccurs=${minOccurs} Added`);
    } else {
        console.error(`${tagPath}: Not Found`);
    }
}

if (modified) {
    const updatedFilename = `Updated ${filename}`;
    fs.writeFileSync(`./UpdatedXSDs/${updatedFilename}`, xsdLines.join('\n'));
    console.log(`\n\n${updatedFilename} created successfully`);
}