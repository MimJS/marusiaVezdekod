const db = require("./database.json");
const fs = require("fs");
const path = require("path");

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

const getCard = () => {
  const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 2, 3, 4, 11];
  const ruValues = [
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    "валет",
    "дама",
    "король",
    "туз",
  ];
  const number = randomNumber(0, values.length - 1);
  return {
    count: values[number],
    display: ruValues[number] + " пики",
  };
};

const buttons = [{ title: "Ещё" }, { title: "Хватит" }];

module.exports = ({ request, session, version }) => {
  const { original_utterance } = request;
  const command = original_utterance.toLowerCase();
  const gameCMD = ["ещё", "хватит"];
  const { user_id } = session;
  const user = db.games.find((v) => v.user_id == user_id);
  if (!user && command == "старт") {
    const card = getCard();
    db.games.push({
      user_id,
      active: true,
      score: card.count,
    });
    savedb();
    return {
      response: {
        text: `Добро пожаловать в 21 очко!
Давайте начнём.
Ваша начальная карта: ${card.display}.
Ещё или хватит ?`,
        tts: `Добро пожаловать в 21 очко!
Давайте начнём.
Ваша начальная карта: ${card.display}.
Ещё или хватит ?`,
        buttons,
        end_session: false,
      },
      session,
      version,
    };
  } else if ((!user || !user?.active) && command != "старт") {
    return {
      response: {
        text: `Для начала игры скажите "Старт"`,
        tts: `Для начала игры скажите "Старт"`,
        end_session: false,
      },
      session,
      version,
    };
  } else if (!user?.acitve && command == "старт") {
    const card = getCard();
    user.active = true;
    user.score = card.count;
    savedb();
    return {
      response: {
        text: `Вы вытащили карту: ${card.display}.
Ещё или хватит?`,
        tts: `Вы вытащили карту: ${card.display}.
Ещё или хватит?`,
        end_session: false,
        buttons,
      },
      session,
      version,
    };
  }
  console.log(gameCMD.includes(command), command);
  if (user && user?.active && gameCMD.includes(command)) {
    if (command == "ещё") {
      const card = getCard();
      if (card.count + user.score > 21) {
        user.active = false;
        user.score = false;
        savedb();
        return {
          response: {
            text: `Увы, но вы проиграли.
Вы вытащили карты, сумма которых больше 21!
Чтобы сыграть ещё, скажите "Старт"`,
            tts: `Увы, но вы проиграли.
Вы вытащили карты, сумма которых больше 21!
Чтобы сыграть ещё, скажите "Старт"`,
            end_session: false,
          },
          session,
          version,
        };
      } else {
        user.score += card.count;
        savedb();
        return {
          response: {
            text: `Вы вытащили: ${card.display}.
Ещё или хватит ?`,
            tts: `Вы вытащили: ${card.display}.
Ещё или хватит ?`,
            buttons,
            end_session: false,
          },
          session,
          version,
        };
      }
    }
    if (command == "хватит") {
      user.active = false;
      const score = user.score;
      savedb();
      return {
        response: {
          text: `Поздравляю, вы набрали: ${score} очков.
Чтобы сыграть ещё раз, скажите "Старт"`,
          tts: `Поздравляю, вы набрали: ${score} очков.
Чтобы сыграть ещё раз, скажите "Старт"`,
          end_session: false,
        },
        session,
        version,
      };
    }
  }
  if (user && user?.active && !gameCMD.includes(command)) {
    return {
      response: {
        text: `Я вас не понимаю. Скажите "Ещё" или "Хватит" для игры`,
        tts: `Я вас не понимаю. Скажите "Ещё" или "Хватит" для игры`,
        end_session: false,
        buttons,
      },
      version,
      session,
    };
  }
};
