/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import DashboardPage from './containers/DashboardPage';
import HomePage from './containers/HomePage';
import LoginPage from './containers/LoginPage';
import SideBar from './features/dashboard/SideBar';

// Lazily load routes and code split with webpack
const LazyCounterPage = React.lazy(() =>
  import(/* webpackChunkName: "CounterPage" */ './containers/CounterPage')
);

const CounterPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyCounterPage {...props} />
  </React.Suspense>
);

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.LOGIN} component={LoginPage} />
        <Route path={routes.DASHBOARD} component={DashboardPage} />
      </Switch>
    </App>
  );
}
