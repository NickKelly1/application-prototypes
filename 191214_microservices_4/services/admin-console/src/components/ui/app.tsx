import React from 'react';
import Container from '@material-ui/core/Container';
import { ThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Header } from './layout/header';
import { Footer } from './layout/footer';
import { Exercises } from '../exercises/exercises';
import { AuthServiceProvider } from '../services/auth-service/provider/auth-service-provider';
import { theme } from '../../style/theme';
import { DashboardsPage } from './pages/dashboards/dashboards-page';

export const App: React.FC = () => (
  <>
    <ThemeProvider theme={theme}>
      {/* https://stackoverflow.com/questions/48186478/custom-theme-background-color */}
      {/* <CssBaseline /> */}
      {/* <AuthServiceProvider connect={false}> */}
        {/* <Container maxWidth="lg" fixed={false} > */}
          <Header />
          <Exercises />
          <Footer />
        {/* </Container> */}
      {/* </AuthServiceProvider> */}
    </ThemeProvider>
  </>
);
