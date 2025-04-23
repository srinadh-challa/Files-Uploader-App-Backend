// fileController.js
const cloudinary = require('../cloudinary');
const FileModel = require('../models/fileModel');

// Upload a file to Cloudinary
// backend code: file upload route (e.g., using express)

// const cloudinary = require('../cloudinary'); // Assuming Cloudinary is initialized
const fs = require('fs'); // Using fs to store metadata in a JSON file (or use a database)

const { v4: uuidv4 } = require('uuid'); // npm install uuid

exports.uploadFile = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const metadata = {
      id: uuidv4(), // 🔑 Add unique ID
      url: result.secure_url,
      public_id: result.public_id,
      uploadedAt: new Date(),
    };

    const saved = FileModel.save(metadata);

    res.status(200).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// In fileController.js
exports.getAllMediaAssets = async (req, res) => {
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        max_results: 100, // Adjust this as needed (max: 500)
      });
  
      const files = result.resources.map((file) => ({
        public_id: file.public_id,
        url: file.secure_url,
        uploadedAt: file.created_at,
        format: file.format,
        type: file.resource_type,
      }));
  
      res.status(200).json({ success: true, data: files });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };
  

// Get all files
// exports.getFiles = async (req, res) => {
//   try {
//     const files = await FileModel.getAll();
//     res.status(200).json({ success: true, data: files });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// Delete a file (from Cloudinary and the database)
exports.deleteFile = async (req, res) => {
    const { fileId } = req.params;
    console.log('Deleting Cloudinary file with public_id:', fileId);
  
    try {
      // Directly attempt to delete the file from Cloudinary using public_id
      const cloudinaryResult = await cloudinary.uploader.destroy(fileId);
      console.log('Cloudinary delete result:', cloudinaryResult);
  
      if (cloudinaryResult.result !== 'ok' && cloudinaryResult.result !== 'not found') {
        return res.status(500).json({ success: false, error: 'Failed to delete file from Cloudinary' });
      }
  
      // Optional: If you’re also storing in DB, delete from there
      try {
        await FileModel.delete(fileId); // Only if fileId = public_id in DB
        console.log('File deleted from local DB.');
      } catch (dbErr) {
        console.warn('File not found in local DB or DB delete failed:', dbErr.message);
      }
  
      res.status(200).json({ success: true, message: 'File deleted successfully' });
    } catch (err) {
      console.error('Delete error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  };
  
  
