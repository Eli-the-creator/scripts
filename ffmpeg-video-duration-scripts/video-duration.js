// *** Docs ***
//
// Last parap to specify the path to the folder:
//
// node video-duration.js /path/to/folder

const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

const folderPath = process.argv[2];

async function getVideoDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata.format.duration);
    });
  });
}

async function calculateTotalDuration(folderPath) {
  let totalDuration = 0;

  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    if (
      fs.lstatSync(filePath).isFile() &&
      file.match(/\.(mp4|mkv|avi|mov|flv)$/i)
    ) {
      try {
        const duration = await getVideoDuration(filePath);
        totalDuration += duration;
      } catch (err) {
        console.error(`Ошибка при обработке файла ${file}:`, err);
      }
    }
  }

  // Преобразуем секунды в часы, минуты и секунды
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);
  const seconds = Math.floor(totalDuration % 60);

  console.log(`Общая продолжительность: ${hours}ч ${minutes}м ${seconds}с`);
}

calculateTotalDuration(folderPath);
