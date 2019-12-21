import React from 'react';
import { makeStyles, Theme, useTheme, Grid, Paper, Typography } from '@material-ui/core';
import { Exercises } from '../../../exercises/exercises';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  paperPrimary: {
    padding: theme.spacing(5),
    textAlign: 'center',
  },
  paperSecondary: {
    padding: theme.spacing(10),
    textAlign: 'center',
  },
}));

export const DashboardsPage: React.FC = () => {
  const theme = useTheme();
  // console.log('text', theme.palette.text);
  const classes = useStyles();

  return (
    <>
      <Exercises />
    </>
    // <Grid container spacing={2} alignContent="center" alignItems="center" justify="center">
    //   <Grid container item xs={12} alignContent="center" alignItems="center" justify="center">
    //     <Grid container item xs={4} alignContent="center" alignItems="center" justify="center">
    //       <Paper className={classes.paperPrimary}>
    //         <Typography variant="body1">
    //           first
    //         </Typography>
    //       </Paper>
    //     </Grid>
    //     <Grid container item xs={4} alignContent="center" alignItems="center" justify="center">
    //       <Paper className={classes.paperSecondary}>
    //         <Typography variant="body2">
    //           second
    //         </Typography>
    //       </Paper>
    //     </Grid>
    //     <Grid container item xs={4} alignContent="center" alignItems="center" justify="center">
    //       <Paper>
    //         <Typography variant="h3">
    //           third
    //         </Typography>
    //       </Paper>
    //     </Grid>
    //   </Grid>
    //   <Grid container item xs={12}>Grid 2</Grid>
    //   <Grid container item xs={12}>Grid 3</Grid>
    // </Grid>
  );
}