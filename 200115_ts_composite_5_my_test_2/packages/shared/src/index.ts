import chalk from 'chalk';

export function sharedLogger(message: string) {
  console.log(chalk.red('hello :) I\'m chalk'));
  console.log('------ sharedLogger ----', message);
}
