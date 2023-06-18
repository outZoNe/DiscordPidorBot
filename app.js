import { Client, GatewayIntentBits, REST, Routes } from 'discord.js'
import log4js from 'log4js'
import _sample from 'lodash/sample.js'
import _countBy from 'lodash/countBy.js'
import _each from 'lodash/each.js'
import { CMD_PIDOR_DETECT, CMD_PIDOR_INFO, CMD_PIDOR_TOP, COMMAND_LIST } from './src/commands.js'
import Datastore from 'nedb'
import moment from 'moment-timezone'
import { scheduleJob } from 'node-schedule'
import 'dotenv/config'
import { AUDIO_LIST } from './src/audio.js'

log4js.configure('config/log4js.json')
const logger = log4js.getLogger()

const usersCollection = new Datastore({ filename: 'database/users' })
usersCollection.loadDatabase()

const rest = new REST({
  version: '10'
}).setToken(process.env.BOT_TOKEN)
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
})

scheduleJob('0 12 * * *', () => {
  findFag()
})

try {
  await rest.put(Routes.applicationCommands(process.env.BOT_ID), { body: COMMAND_LIST })
} catch (err) {
  logger.error(err)
}

client.on('ready', () => {
  console.log(`Bot connected as ${client.user.tag}!`)
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) {
    return
  }

  if (interaction.commandName === CMD_PIDOR_DETECT) {
    interaction.reply('Начинаю расчет пидарасов!').then(() => {
      findFag()
    }).catch(err => {
      logger.error(err)
    })
  }

  if (interaction.commandName === CMD_PIDOR_TOP) {
    usersCollection.find({}, (err, res) => {
      let gaysTop = _countBy(res, 'id')
      gaysTop = Object.fromEntries(Object.entries(gaysTop).sort((a, b) => a[1] >= b[1] ? -1 : 1))

      let msg = 'Топ пидоров:\n'
      _each(gaysTop, (val, key) => {
        msg += '<@' + key + '> дырок: ' + val + '\n'
      })

      interaction.reply(msg).then(() => {
      }).catch(err => {
        logger.error(err)
      })
    })
  }

  if (interaction.commandName === CMD_PIDOR_INFO) {
    interaction.reply(
      'Чтобы найти пидора сегодня используйте команду: /' + CMD_PIDOR_DETECT + '\n' +
      'Чтобы получить список пидоров используйте команду: /' + CMD_PIDOR_TOP + '\n' +
      'Так же не забывайте, что бот будет искать пидоров сам. Каждый день в 12:00 по МСК'
    ).then(() => {
    }).catch(err => {
      logger.error(err)
    })
  }
})

const findFag = () => {
  client.channels.fetch(process.env.CHANNEL_ID).then(async channel => {
    try {
      const guild = await client.guilds.fetch(process.env.SERVER_ID)
      const members = await guild.members.fetch({ force: true })
      const guildUsers = []
      members.forEach(el => {
        if (el.user.bot === false) {
          guildUsers.push(el.user)
        }
      })

      const sendAudio = () => {
        client.channels.fetch(process.env.CHANNEL_ID).then(async channel => {
          channel.send({ files: [_sample(AUDIO_LIST)] })
        })
      }

      const randomUser = _sample(guildUsers)
      const today = moment().tz('Europe/Moscow').format('Y-MM-DD')
      usersCollection.find({ createdAt: today }, (err, res) => {
        if (res?.length) {
          channel.send('Сегодня пидор уже найден!\nЭто: <@' + res[0]?.id + '>')
          sendAudio()
        } else {
          usersCollection.insert({ ...randomUser, createdAt: today })
          channel.send('Кручу верчу пидора найти хачу!\nЭто ты: <@' + randomUser.id + '>')
          sendAudio()
        }
      })
    } catch (err) {
      logger.error(err)
    }
  })
}

client.login(process.env.BOT_TOKEN).then(() => {})
