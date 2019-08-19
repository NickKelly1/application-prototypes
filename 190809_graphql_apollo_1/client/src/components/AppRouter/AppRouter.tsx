import React from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '../../@types/infer-prop-types';
import LoginPage from '../pages/LoginPage/LoginPage';
import { Router, Route, Switch } from 'react-router';
import { UrlStateProvider } from '../../hooks/use-url-state';
import LaunchesPage from '../pages/LaunchesPage/LaunchesPage';
import LaunchPage from '../pages/LaunchPage/LaunchPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import FourZeroFourPage from '../pages/FourZeroFourPage/FourZeroFourPage';
import { appHistory } from '../../app/history';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Layout from '../../Layout/Layout';
import CartPage from '../pages/CartPage/CartPage';
import { ROUTES } from '../../app/routes';

export const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

const propTypes = {
  //
};
const defaultProps = {
  //
};
type PropTypes = InferPropTypes<typeof propTypes, typeof defaultProps>;

/**
 * @description
 * AppRouter
 *
 * @param props
 */
const AppRouter: React.FC<PropTypes> = (props) => {
  const { data } = useQuery(IS_LOGGED_IN);

  if (!data.isLoggedIn) return <LoginPage />

  return (
    <Router history={appHistory}>
      <Route render={(routerProps) => (
        <UrlStateProvider router={routerProps}>
          <Layout>
            <Switch>
              <Route exact path={ROUTES.HOME_PAGE.template()} component={LaunchesPage} />
              <Route exact path={ROUTES.LAUNCH_PAGE.template()} component={LaunchPage} />
              <Route exact path={ROUTES.PROFILE_PAGE.template()} component={ProfilePage} />
              <Route exact path={ROUTES.CART_PAGE.template()} component={CartPage} />
              <Route exact path={ROUTES.LOGIN_PAGE.template()} component={LoginPage} />
              <Route component={FourZeroFourPage} />
            </Switch>
          </Layout>
        </UrlStateProvider>
      )} />
    </Router>
  );
};

AppRouter.propTypes = propTypes;
AppRouter.defaultProps = defaultProps;

export default AppRouter;