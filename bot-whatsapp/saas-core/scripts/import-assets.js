
const fs = require('fs');
const path = require('path');

const sourceDir = 'C:/Users/PC/.gemini/antigravity/brain/1cb95989-cff9-4beb-92a3-eea2895f326b';
const targetDir = path.join(__dirname, '../public/images/uploads');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const files = [
    { src: 'uploaded_media_0_1769429443511.jpg', dest: 'brand-1.jpg' },
    { src: 'uploaded_media_1_1769429443511.jpg', dest: 'brand-2.jpg' },
    { src: 'uploaded_media_2_1769429443511.jpg', dest: 'brand-3.jpg' },
    { src: 'uploaded_media_3_1769429443511.jpg', dest: 'brand-4.jpg' },
    { src: 'uploaded_media_4_1769429443511.jpg', dest: 'brand-5.jpg' }
];

files.forEach(file => {
    const srcPath = path.join(sourceDir, file.src);
    const destPath = path.join(targetDir, file.dest);

    try {
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied ${file.src} to ${file.dest}`);
        } else {
            console.error(`Source file not found: ${srcPath}`);
        }
    } catch (err) {
        console.error(`Error copying ${file.src}:`, err);
    }
});



