/* eslint-disable react/jsx-one-expression-per-line */
import React, { ReactNode, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory } from 'react-router';
import { RootState } from '../../store';
import { logout, selectAuthToken, selectAuthEmail } from '../login/loginSlice';
import routes from '../../constants/routes.json';

import SideBar from './SideBar';
import BudgetPage from '../../containers/BudgetPage';
import CreateUsersPage from '../../containers/CreateUsersPage';
import ViewUsersPage from '../../containers/ViewUsersPage';
import SitesPage from '../../containers/SitesPage';
import OrdersPage from '../../containers/OrdersPage';

export default function Dashboard() {
  const history = useHistory();
  const dispatch = useDispatch();

  const authToken = useSelector((state: RootState) => selectAuthToken(state));
  const authEmail = useSelector((state: RootState) => selectAuthEmail(state));

  useEffect(() => {
    if (authToken.length === 0) {
      // not logged in
      history.push(routes.LOGIN);
    }
  }, [authToken, history]);

  return (
    <div className="d-flex vh-100 w-100">
      <div className="h-100" style={{ width: '20%' }}>
        <SideBar />
      </div>

      <div className="h-100 container" style={{ width: '80%' }}>
        <Switch>
          <Route path={routes.BUDGET} component={BudgetPage} />
          <Route path={routes.CREATE_USERS} component={CreateUsersPage} />
          <Route path={routes.VIEW_USERS} component={ViewUsersPage} />
          <Route path={routes.SITES} component={SitesPage} />
          <Route path={routes.ORDERS} component={OrdersPage} />
        </Switch>
      </div>
    </div>
  );
}
