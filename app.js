import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import {
  CMD_PIDOR_DETECT,
  CMD_PIDOR_INFO,
  CMD_PIDOR_TOP,
  pidorDetectCmd,
  pidorInfoCmd,
  pidorTopCmd,
} from "./config/commands.js";
import { scheduleJob } from "node-schedule";
import "dotenv/config";
import {
  botInfo,
  congratulateCelebration,
  fagotDetect,
  fagotsTop,
  findFag,
  logger,
} from "./src/app/AppService.js";

const rest = new REST({
  version: "10",
}).setToken(process.env.BOT_TOKEN);

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

scheduleJob("0 12 * * *", () => {
  findFag("Кручу верчу пидора найти хачу!\n");
});

scheduleJob("5 12 * * *", async () => {
  await congratulateCelebration(client);
});

try {
  await rest.put(Routes.applicationCommands(process.env.BOT_ID), {
    body: [pidorDetectCmd, pidorTopCmd, pidorInfoCmd],
  });
} catch (err) {
  logger.error(err);
}

export let appInteraction = null;

client.on("ready", () => {
  console.log(`Bot connected as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (message.channel.id === process.env.CHANNEL_ID) {
    appInteraction = message;

    if (message.content.indexOf("!" + CMD_PIDOR_DETECT) === 0) {
      fagotDetect();
    } else if (message.content.indexOf("!" + CMD_PIDOR_TOP) === 0) {
      const msg = message.content?.replace(/\s+/g, " ")?.split(" ");
      await fagotsTop(msg[1], msg[2]);
    } else if (message.content.indexOf("!" + CMD_PIDOR_INFO) === 0) {
      botInfo();
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  appInteraction = interaction;

  if (interaction.commandName === CMD_PIDOR_DETECT) {
    fagotDetect();
  } else if (interaction.commandName === CMD_PIDOR_TOP) {
    await fagotsTop(
      interaction.options.getString("start_date"),
      interaction.options.getString("end_date"),
    );
  } else if (interaction.commandName === CMD_PIDOR_INFO) {
    botInfo();
  }
});

client.login(process.env.BOT_TOKEN).then(() => {});
