import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';


export const Header: React.FC = () => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h3" gutterBottom color="inherit">
            Exercise Database
          </Typography>
        </Toolbar>
      </AppBar>
      Header
    </div>
  );
}
