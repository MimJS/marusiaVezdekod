const fs = require("fs");
const path = require("path");
const db = require("./database.json");
function randomNumber(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const savedb = () => {
  fs.writeFile(
    path.join(__dirname, "./database.json"),
    JSON.stringify(db),
    (v) => console.log(v)
  );
  return;
};

module.exports = ({ request, session, version }) => {
  let { command } = request;
  command = command.toLowerCase();
  const { user_id } = session;
  const edibleItems = [
    "Яблоко",
    "Апельсин",
    "Гранат",
    "Помидор",
    "Огурец",
    "Арбуз",
  ];
  const notEdibleItems = [
    "Мяч",
    "Ноутбук",
    "Машина",
    "Стол",
    "Браслет",
    "Провод",
  ];
  let item = null;
  let showButtons = false;
  const isEdible = Math.round(Math.random());
  if (isEdible) {
    item = edibleItems[randomNumber(0, edibleItems.length - 1)];
  } else {
    item = notEdibleItems[randomNumber(0, edibleItems.length - 1)];
  }
  const user = db.games.find((v) => v.user_id == user_id);
  console.log(user);
  let text = null;
  if (user && user?.active) {
    if (command == "выброшу" || command == "съем") {
      if (
        (command == "выброшу" && user.isEdible == 0) ||
        (command == "съем" && user.isEdible == 1)
      ) {
        user.score += 1;
        user.isEdible = isEdible;
        savedb();
        text = `Правильно!
У вас ${user.score} очков.
Следующий предмет: ${item}.
Съедите или выбросите ?`;
        showButtons = true;
      } else {
        text = `Увы, но это не правильно!
Вы набрали ${user.score} очков.
Чтобы начать игру скажите "Старт"`;
        user.score = 0;
        user.active = false;
        savedb();
      }
    } else {
      text = 'Я вас не понимаю. Для ответа скажите "выброшу" или "съем"';
      showButtons = true;
    }
  }
  if (!user && command == "старт") {
    db.games.push({
      user_id,
      score: 0,
      active: true,
      isEdible,
    });
    savedb();
    text = `Добро пожаловать в игру "Съедобное - несъедобное"/
Предмет: ${item}.
Выбросите или съедите ?`;
    showButtons = true;
  } else if (!user?.active && command == "старт") {
    user.active = true;
    savedb();
    text = `Начинаем.
Предмет: ${item}.
Выбросите или съедите ?`;
showButtons = true
  } else if ((!user && command != "старт") || !user.active) {
    text = `Чтобы начать игру, скажите "Старт"`;
  }

  return {
    response: {
      text,
      tts: text,
      end_session: false,
      buttons: showButtons
        ? [
            {
              title: "Съем",
            },
            {
              title: "Выброшу",
            },
          ]
        : [],
    },
    session,
    version,
  };
};
