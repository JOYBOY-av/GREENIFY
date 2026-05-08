const fs = require('fs');
const crypto = require('crypto');
const imghash = require('imghash');
const ExifParser = require('exif-parser');
const Tesseract = require('tesseract.js');

exports.processFile = async (filePath, mimetype) => {
  const result = {
    sha256: null,
    phash: null,
    exif: null,
    ocrText: null,
    warnings: []
  };

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    result.sha256 = hashSum.digest('hex');
    if (mimetype.startsWith('image/')) {
      try {
        result.phash = await imghash.hash(filePath);
      } catch (err) {
        console.error('Phash Error:', err.message);
      }
      if (mimetype === 'image/jpeg') {
        try {
          const parser = ExifParser.create(fileBuffer);
          const exifData = parser.parse();
          result.exif = exifData;
          if (exifData.tags && exifData.tags.DateTimeOriginal) {
            const dateTaken = new Date(exifData.tags.DateTimeOriginal * 1000);
            const now = new Date();
            const diffDays = Math.abs((now - dateTaken) / (1000 * 60 * 60 * 24));
            if (diffDays > 30) {
              result.warnings.push(`Photo is older than 30 days (${diffDays.toFixed(0)} days).`);
            } else if (dateTaken > now) {
              result.warnings.push('Photo date is in the future.');
            }
          }
        } catch (err) {
          console.error('EXIF Parser Error:', err.message);
        }
      }
      try {
        const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
        if (text && text.trim().length > 0) {
          result.ocrText = text.trim();
        }
      } catch (err) {
        console.error('OCR Error:', err.message);
      }
    }

  } catch (error) {
    console.error('File processing error:', error);
  }

  return result;
};
