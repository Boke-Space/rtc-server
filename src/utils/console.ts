import nodeChalk from 'chalk';

export const chalk = nodeChalk;
export const INFO = (v) =>
    console.log(`${chalk.bgBlueBright.black(' INFO ')} ${chalk.blueBright(v)}`)
export const SUCCESS = (v) =>
    console.log(`${chalk.bgGreenBright.black(' SUCCESS ')} ${chalk.greenBright(v)}`)
export const ERROR = (v) =>
    console.log(`${chalk.bgRedBright.black(' ERROR ')} ${chalk.redBright(v)}`)
export const WARN = (v) =>
    console.log(`${chalk.bgHex('#FFA500').black(' WARN ')} ${chalk.hex('#FFA500')(v)}`)
