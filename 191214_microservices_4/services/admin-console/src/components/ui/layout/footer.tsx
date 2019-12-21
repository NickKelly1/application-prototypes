import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { muscles } from '../../exercises/store';



export const Footer: React.FC = () => {
  const [tab, setTab] = useState("what");

  return (
    <Paper>
      <Tabs
        textColor="primary"
        indicatorColor="primary"
        value={0}
        onChange={(evt) => {
          console.log('Tabs::onChange', evt);
        }}
        centered
      >
        {muscles.map((group, index) => (
          <Tab key={group} label={group} />
        ))};
      </Tabs>
    </Paper>
  )
}