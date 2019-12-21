import { Theme, createMuiTheme } from "@material-ui/core";
import { Styles } from "@material-ui/core/styles/withStyles";
import * as colors from '@material-ui/core/colors';


export const theme: Theme = createMuiTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    type: 'dark',
    primary: colors.amber,
    // secondary: colors.lightBlue,
    // background: colors.grey[400],
    // background: {
    //   paper: colors.blueGrey[400],
    //   default: colors.grey[800],
    // },
    text: {
      // primary: colors.common.white[800],
      // secondary: colors.common.white[400],
      // disabled: colors.common.white[400],
      // hint: colors.common.white[400],
      // secondary: colors.lightBlue[400],
      // disabled: colors.grey[400],
      // hint: colors.indigo[400],
    },
  },
});
