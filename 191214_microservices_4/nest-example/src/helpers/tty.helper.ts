const Reset = '\x1b[0m';
const Bright = '\x1b[1m';
const Dim = '\x1b[2m';
const Underscore = '\x1b[4m';
const Blink = '\x1b[5m';
const Reverse = '\x1b[7m';
const Hidden = '\x1b[8m';

const FgBlack = '\x1b[30m';
const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';
const FgBlue = '\x1b[34m';
const FgMagenta = '\x1b[35m';
const FgCyan = '\x1b[36m';
const FgWhite = '\x1b[37m';

const BgBlack = '\x1b[40m';
const BgRed = '\x1b[41m';
const BgGreen = '\x1b[42m';
const BgYellow = '\x1b[43m';
const BgBlue = '\x1b[44m';
const BgMagenta = '\x1b[45m';
const BgCyan = '\x1b[46m';
const BgWhite = '\x1b[47m';

export const tty = {
  Reset(inp: string | number | boolean) { return `${Reset}${inp}\x1b[0m`; },
  Bright(inp: string | number | boolean) { return `${Bright}${inp}\x1b[0m`; },
  Dim(inp: string | number | boolean) { return `${Dim}${inp}\x1b[0m`; },
  Underscore(inp: string | number | boolean) { return `${Underscore}${inp}\x1b[0m`; },
  Blink(inp: string | number | boolean) { return `${Blink}${inp}\x1b[0m`; },
  Reverse(inp: string | number | boolean) { return `${Reverse}${inp}\x1b[0m`; },
  Hidden(inp: string | number | boolean) { return `${Hidden}${inp}\x1b[0m`; },

  FgBlack(inp: string | number | boolean) { return `${FgBlack}${inp}\x1b[0m`; },
  FgRed(inp: string | number | boolean) { return `${FgRed}${inp}\x1b[0m`; },
  FgGreen(inp: string | number | boolean) { return `${FgGreen}${inp}\x1b[0m`; },
  FgYellow(inp: string | number | boolean) { return `${FgYellow}${inp}\x1b[0m`; },
  FgBlue(inp: string | number | boolean) { return `${FgBlue}${inp}\x1b[0m`; },
  FgMagenta(inp: string | number | boolean) { return `${FgMagenta}${inp}\x1b[0m`; },
  FgCyan(inp: string | number | boolean) { return `${FgCyan}${inp}\x1b[0m`; },
  FgWhite(inp: string | number | boolean) { return `${FgWhite}${inp}\x1b[0m`; },

  BgBlack(inp: string | number | boolean) { return `${BgBlack}${inp}\x1b[0m`; },
  BgRed(inp: string | number | boolean) { return `${BgRed}${inp}\x1b[0m`; },
  BgGreen(inp: string | number | boolean) { return `${BgGreen}${inp}\x1b[0m`; },
  BgYellow(inp: string | number | boolean) { return `${BgYellow}${inp}\x1b[0m`; },
  BgBlue(inp: string | number | boolean) { return `${BgBlue}${inp}\x1b[0m`; },
  BgMagenta(inp: string | number | boolean) { return `${BgMagenta}${inp}\x1b[0m`; },
  BgCyan(inp: string | number | boolean) { return `${BgCyan}${inp}\x1b[0m`; },
  BgWhite(inp: string | number | boolean) { return `${BgWhite}${inp}\x1b[0m`; },
} as const;
