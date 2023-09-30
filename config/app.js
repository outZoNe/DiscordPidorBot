import { CMD_PIDOR_DETECT, CMD_PIDOR_INFO, CMD_PIDOR_TOP } from './commands.js'
import moment from 'moment-timezone'

export const BotInfoMsg = `
* СПРАВКА по боту: \`/${CMD_PIDOR_INFO}\` или \`!${CMD_PIDOR_INFO}\`
* Чтобы найти пидора сегодня используйте команду: \`/${CMD_PIDOR_DETECT}\` или \`!${CMD_PIDOR_DETECT}\`
* Чтобы получить список пидоров используйте команду: \`/${CMD_PIDOR_TOP}\` или \`!${CMD_PIDOR_TOP}\` можно с параметрами: \`<start_date>\` \`<end_date>\`
> Например: \`/${CMD_PIDOR_TOP} ${moment.tz('Europe/Moscow').startOf('month').format('YYYY-MM-DD')} ${moment.tz('Europe/Moscow').endOf('month').format('YYYY-MM-DD')}\` или \`!${CMD_PIDOR_TOP} ${moment.tz('Europe/Moscow').startOf('month').format('YYYY-MM-DD')} ${moment.tz('Europe/Moscow').endOf('month').format('YYYY-MM-DD')}\`

Так же не забывайте, что бот будет искать пидоров сам. Каждый день в \`12:00\` по МСК
`
