import { SlashCommandBuilder, SlashCommandStringOption } from 'discord.js'

export const CMD_PIDOR_DETECT = 'pidor_detect'
export const CMD_PIDOR_TOP = 'pidor_top'
export const CMD_PIDOR_INFO = 'pidor_info'

export const pidorDetectCmd = new SlashCommandBuilder().setName(CMD_PIDOR_DETECT).setDescription('Найти пидора')
export const pidorTopCmd = new SlashCommandBuilder().setName('pidor_top').setDescription('Получить топ пидоров')
  .addStringOption(new SlashCommandStringOption().setName('start_date').setDescription('начальная дата поиска').setRequired(false))
  .addStringOption(new SlashCommandStringOption().setName('end_date').setDescription('конечная дата поиска').setRequired(false))
export const pidorInfoCmd = new SlashCommandBuilder().setName(CMD_PIDOR_INFO).setDescription('Инструкция по боту')
