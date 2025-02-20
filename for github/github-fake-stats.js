const fs = require("fs");
const path = require("path");
const prompt = require("prompt-sync")();
const simpleGit = require("simple-git");

const git = simpleGit();
const FILE_PATH = path.join(__dirname, "commit_history.txt");

/**
 * Генерирует случайное количество коммитов для одного дня
 */
function getRandomCommitCount() {
  return Math.floor(Math.random() * 5) + 1; // От 1 до 5 коммитов в день
}

/**
 * Генерирует случайную дату и время в пределах указанного дня
 */
function getRandomTimeInDay(date) {
  const randomHours = Math.floor(Math.random() * 24);
  const randomMinutes = Math.floor(Math.random() * 60);

  return new Date(date.setHours(randomHours, randomMinutes, 0));
}

/**
 * Создаёт случайные коммиты
 */
async function generateCommits(startDate, endDate) {
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    if (Math.random() > 0.2) {
      // 70% вероятность коммитов в этот день
      const commitCount = getRandomCommitCount();
      console.log(`📅 ${currentDate.toDateString()} → ${commitCount} коммитов`);

      for (let i = 0; i < commitCount; i++) {
        const commitDate = getRandomTimeInDay(new Date(currentDate));
        const formattedDate = commitDate.toISOString();

        // Фиктивное изменение файла
        fs.appendFileSync(FILE_PATH, `Commit on ${formattedDate}\n`);

        // Добавляем файлы в индекс
        await git.add(FILE_PATH);

        // Делаем коммит с нужной датой
        await git.commit(`Random commit ${i + 1}`, { "--date": formattedDate });

        console.log(`✅ Коммит ${i + 1} в ${formattedDate}`);
      }
    } else {
      console.log(`🚫 ${currentDate.toDateString()} → Без коммитов`);
    }

    // Переход к следующему дню
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Отправляем изменения в удалённый репозиторий
  await git.push();
  console.log("🚀 Все коммиты запушены!");
}

// 🛠️ Получаем ввод от пользователя
const startDateStr = prompt("Введите стартовую дату (YYYY-MM-DD): ");
const endDateStr = prompt("Введите конечную дату (YYYY-MM-DD): ");

// Преобразуем в Date
const startDate = new Date(startDateStr);
const endDate = new Date(endDateStr);

// Проверяем корректность дат
if (isNaN(startDate) || isNaN(endDate) || startDate >= endDate) {
  console.log("❌ Ошибка: Введите корректные даты.");
  process.exit(1);
}

generateCommits(startDate, endDate).catch(console.error);
