const fs = require('fs');

const data = fs.readFileSync('tags.txt', 'utf8');
const lines = data.split(/\r?\n/).filter(line => line.trim() !== '');

const xsdData = fs.readFileSync('pain.013.001.08.xsd', 'utf8');
const xsdLines = xsdData.split(/\r?\n/);

for (const tagPath of lines) {
    const tagParts = tagPath.split('.');
    let currentTag = 'Document';
    let found = false;
    let lastLineNumber = null;

    for (let tagIndex = 0; tagIndex < tagParts.length; tagIndex++) {
        found = false;
        
        for (let i = 0; i < xsdLines.length; i++) {
            const line = xsdLines[i];
            if (line.includes('<xs:element') && line.includes(`name="${currentTag}"`)) {
                lastLineNumber = i + 1;
                
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
        console.log(`${tagPath}: ${lastLineNumber}`);
    }
}