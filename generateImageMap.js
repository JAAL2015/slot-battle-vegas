// generateImageMap.js
const fs = require('fs');
const path = require('path');

// Function to pad numbers with leading zeros
const padNumber = (num, size) => {
  let s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
};

// Path to output file
const outputFilePath = path.join(__dirname, 'imageMap.js');

// Total number of images
const totalImages = 1621;

// Starting part of the file
let fileContent = `// imageMap.js\nconst imagePaths = [\n`;

// Generate imports and add to file content
for (let i = 0; i <= totalImages; i++) {
  const paddedNum = padNumber(i, 4);
  fileContent += `  require('../../assets/strip/LasVegas_${paddedNum}.jpg'),\n`;
}

// Closing part of the file
fileContent += `];\n\nexport default imagePaths;\n`;

// Write the content to the file
fs.writeFileSync(outputFilePath, fileContent);

console.log(`imageMap.js has been generated with ${totalImages + 1} images.`);
