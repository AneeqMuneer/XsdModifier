# ✨ XSD Formatter

A sophisticated utility for modifying XML Schema Definition (XSD) files by programmatically updating minOccurs attributes across specified element paths.


## 🚀 What It Does  
This tool streamlines the process of updating minOccurs attributes within XSD schemas. It excels at efficiently handling bulk modifications when multiple element paths need to be set as required (minOccurs="1"), saving valuable development time.


## 📁 Folder Structure & Setup

### 1. 🗂️ Place Your XSD File  
Drop your target XSD file into the `XSDs` directory.

### 2. 🏷️ Configure Tag Paths  
List all the element paths you want to modify in the `tags.txt` file.  
Use dot notation (`.`) to indicate parent-child relationships.  
**Example:**  
To modify the `def` element inside the `abc` parent tag, write: `abc.def`

Each path should be written on a new line.

### 3. 📝 Set the Target Filename  
Open `XsdFormatter.js` and update the `filename` variable on **line 6** to match your XSD file name.

### 4. ▶️ Run the Script  
Use Node.js to execute the script: `node XsdFormatter.js`


### 5. 📦 Get the Updated File  
Once processed, the modified XSD will be saved in the `UpdatedXSDs` directory.