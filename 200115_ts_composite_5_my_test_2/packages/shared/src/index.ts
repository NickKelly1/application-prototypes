import chalk from 'chalk';

export function sharedLogger(message: string): [string, string, string] {
  const msg = chalk.red('hello :) I\'m chalk. and I\'m red!!!');
  console.log(message, msg);
  return [message, msg, 'test'];
}
