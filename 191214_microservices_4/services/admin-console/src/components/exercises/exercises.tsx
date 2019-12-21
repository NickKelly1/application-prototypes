import React, { useState } from 'react';
import { Grid, Paper, withStyles, makeStyles } from '@material-ui/core';
import { initialExercises, muscles } from './store';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: 20,
    marginTop: 10,
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
}));

export const Exercises = () => {
  const classes = useStyles(); 
  const [ exercises, setExercises ] = useState(initialExercises);

  return (
    <>
      <Grid container spacing={1} justify='center' alignItems='center'>
        <Grid item xs justify='center' alignItems='center'>
          <Paper className={classes.paper}>
            Left Pane
          </Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classes.paper}>
            Right Pane
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}
