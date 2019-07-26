import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AboutPage from '../pages/about-page/AboutPage';
import SplashPage from '../pages/splash-page/SplashPage';
import Nav from '../nav/Nav';
import './Router.scss';

const Router = () => {
  console.log('eslint blocker');

  return (
    <BrowserRouter>
      <div className="route-container">
        <header>Blog</header>
        <div className="nav-body-wrapper">
          <div className="nav-wrapper">
            <Nav />
          </div>
          <div className="body-wrapper">
            <Route path="/" exact component={SplashPage} />
            <Route path="/about" exact component={AboutPage} />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default Router;
