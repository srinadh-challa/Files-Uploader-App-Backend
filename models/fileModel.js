//fileModel.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../files.json');

function readFiles() {
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeFiles(files) {
  fs.writeFileSync(filePath, JSON.stringify(files, null, 2));
}

module.exports = {
  getAll: () => {
    return readFiles();
  },
  getById: (id) => {
    const files = readFiles();
    return files.find((f) => f.id === id);
  },
  save: (fileData) => {
    const files = readFiles();
    const fileWithTimestamp = {
      ...fileData,
      uploadedAt: new Date().toISOString(), // Add uploaded time
    };
    files.push(fileWithTimestamp);
    writeFiles(files);
    return fileWithTimestamp;
  },
  update: (id, updatedData) => {
    const files = readFiles();
    const fileIndex = files.findIndex((f) => f.id === id);
    if (fileIndex !== -1) {
      files[fileIndex] = { ...files[fileIndex], ...updatedData };
      writeFiles(files);
      return files[fileIndex];
    }
    return null;
  },
  // Delete a file by ID
  delete: (id) => {
    const files = readFiles();
    const updatedFiles = files.filter((f) => f.id !== id);
    writeFiles(updatedFiles);
  },
};
