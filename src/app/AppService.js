import Datastore from "nedb-promises";
import log4js from "log4js";
import { getSortableFagots, getUsers } from "../user/UserRepository.js";
import _each from "lodash/each.js";
import { getMonthFagot, getYearFagot } from "../user/UserService.js";
import _sample from "lodash/sample.js";
import { AUDIO_LIST } from "../../config/audio.js";
import moment from "moment-timezone";
import { createUser } from "../user/UserManager.js";
import { appInteraction, client } from "../../app.js";
import { BotInfoMsg } from "../../config/app.js";
import { holidayMessages } from "../../config/holidays.js";

log4js.configure("config/log4js.json");
export const logger = log4js.getLogger();

export const usersCollection = new Datastore({ filename: "database/users" });
usersCollection
  .load()
  .then(() => {})
  .catch((err) => {
    logger.error(err);
  });

export const fagotDetect = () => {
  appInteraction
    .reply("Кручу верчу пидора найти хачу!")
    .then(() => {
      findFag("");
    })
    .catch((err) => {
      logger.error(err);
    });
};

export const fagotsTop = async (startDate = undefined, endDate = undefined) => {
  const gaysTop = await getSortableFagots(startDate, endDate);

  let subMsg = "";
  if (startDate && endDate) {
    subMsg = ` за период с ${startDate} по ${endDate}`;
  }

  let msg = `Топ пидоров${subMsg}:\n`;
  _each(gaysTop, (val, key) => {
    msg += `<@${key}> дырок: ${val}\n`;
  });

  if (!startDate && !endDate) {
    msg += (await getMonthFagot()) ?? "";
    msg += (await getYearFagot()) ?? "";
  }

  appInteraction
    .reply(msg)
    .then(() => {})
    .catch((err) => {
      logger.error(err);
    });
};

export const botInfo = () => {
  appInteraction
    .reply(BotInfoMsg)
    .then(() => {})
    .catch((err) => {
      logger.error(err);
    });
};

export const findFag = (argMsg = "") => {
  client.channels
    .fetch(process.env.CHANNEL_ID)
    .then(async (channel) => {
      const guildUsers = [];
      channel?.members?.forEach(
        (el) => el.user.bot === false && guildUsers.push(el.user),
      );

      const sendAudio = () => {
        client.channels.fetch(process.env.CHANNEL_ID).then(async (channel) => {
          channel.send({ files: [_sample(AUDIO_LIST)] });
        });
      };

      const today = moment().tz("Europe/Moscow").format("Y-MM-DD");
      const users = await getUsers({ createdAt: today })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          logger.error(err);
        });

      if (users.length === 0) {
        const randomUser = _sample(guildUsers);

        createUser({ ...randomUser, createdAt: today })
          .then(async () => {
            let msg = argMsg + "Это ты: <@" + randomUser.id + ">";
            msg += (await getMonthFagot()) ?? "";
            msg += (await getYearFagot()) ?? "";
            channel.send(msg);
          })
          .catch((err) => {
            logger.error(err);
          });
      }

      if (users.length > 0) {
        channel.send("Сегодня пидор уже найден!\nЭто: <@" + users[0]?.id + ">");
      }

      channel.send(await getRandomGif());
      sendAudio();
    })
    .catch((err) => {
      logger.error(err);
    });
};

const getRandomGif = async () => {
  const genres = [
    "bonk",
    "blush",
    "smile",
    "slap",
    "kick",
    "happy",
    "wink",
    "poke",
    "dance",
  ];
  const randomGenre = Math.floor(Math.random() * genres.length);
  const url = `https://api.waifu.pics/sfw/${genres[randomGenre]}`;
  const imgNotFound = "https://i.waifu.pics/-J_3FPf.gif";

  return fetch(url).then((res) =>
    res
      .json()
      .then((data) => data.url ?? imgNotFound)
      .catch((err) => {
        logger.error(err);
        return imgNotFound;
      }),
  );
};

export const congratulateCelebration = async (client) => {
  const channel = await client.channels.fetch(process.env.CHANNEL_ID);
  const today = moment().tz("Europe/Moscow").format("MM-DD");
  const holiday = holidayMessages[today];

  if (holiday) {
    const message = `${holiday.message}\n${holiday.link ? holiday.link : ""}`;
    channel.send(message);
  }
};
