import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AboutPage from '../pages/about-page/AboutPage';
import SplashPage from '../pages/splash-page/SplashPage';

const Router = () => {
  console.log('eslint blocker');

  return (
    <BrowserRouter>
      <span>Router</span>
      <Route path="/" exact component={SplashPage} />
      <Route path="/about" exact component={AboutPage} />
    </BrowserRouter>
  );
};

export default Router;
