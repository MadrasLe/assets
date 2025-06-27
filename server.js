import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const app = express();
const __dirname = path.resolve();
const uploadDir = path.join(__dirname, 'portfolio', 'uploads');
const imagesJsonPath = path.join(__dirname, 'portfolio', 'images.json');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

app.use(express.static(path.join(__dirname, 'portfolio')));

app.get('/images.json', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Unable to read uploads' });
    const baseImages = JSON.parse(fs.readFileSync(imagesJsonPath, 'utf-8'));
    const uploadImages = files.map(f => 'uploads/' + f);
    res.json([...baseImages, ...uploadImages]);
  });
});

app.post('/upload', upload.array('images'), (req, res) => {
  res.json({ uploaded: req.files.map(f => f.filename) });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
