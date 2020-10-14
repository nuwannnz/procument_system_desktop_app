/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { RootState } from '../../store';
import { logout, selectAuthToken, selectAuthEmail } from '../login/loginSlice';
import routes from '../../constants/routes.json';

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
  }, [authToken]);

  return (
    <div>
      <h1>Dashboard {authEmail}</h1>
      <Button onClick={() => dispatch(logout())}>Log out</Button>
    </div>
  );
}
