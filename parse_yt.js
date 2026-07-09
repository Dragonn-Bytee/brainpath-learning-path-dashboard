const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\uditk\\.gemini\\antigravity-ide\\brain\\674d865b-4879-4ddb-bd5b-77f2eb35ee65\\.system_generated\\steps\\22\\content.md';

if (!fs.existsSync(filePath)) {
  console.log('File does not exist:', filePath);
  process.exit(1);
}

const data = fs.readFileSync(filePath, 'utf8');

// Look for video title:
const titleMatch = data.match(/<title>([^<]+)<\/title>/);
console.log('Video Title tag:', titleMatch ? titleMatch[1] : 'Not found');

const ogTitleMatch = data.match(/property="og:title"\s+content="([^"]+)"/);
console.log('OG Title:', ogTitleMatch ? ogTitleMatch[1] : 'Not found');

const ogDescMatch = data.match(/property="og:description"\s+content="([^"]+)"/);
console.log('OG Description:', ogDescMatch ? ogDescMatch[1] : 'Not found');

// Let's also do the same for the Pinterest file (step 11)
const pinFilePath = 'C:\\Users\\uditk\\.gemini\/\/antigravity-ide\\brain\\674d865b-4879-4ddb-bd5b-77f2eb35ee65\\.system_generated\\steps\\11\\content.md';
if (fs.existsSync(pinFilePath)) {
  const pinData = fs.readFileSync(pinFilePath, 'utf8');
  const pinTitle = pinData.match(/<title>([^<]+)<\/title>/);
  console.log('Pin Title tag:', pinTitle ? pinTitle[1] : 'Not found');
  const pinOgTitle = pinData.match(/property="og:title"\s+content="([^"]+)"/);
  console.log('Pin OG Title:', pinOgTitle ? pinOgTitle[1] : 'Not found');
  const pinOgDesc = pinData.match(/property="og:description"\s+content="([^"]+)"/);
  console.log('Pin OG Description:', pinOgDesc ? pinOgDesc[1] : 'Not found');
}
