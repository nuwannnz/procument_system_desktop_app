import React from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MenuItemList, MenuItemType } from '../../constants/MenuItems';
import { RootState } from '../../store';
import { logout, selectAuthRole } from '../login/loginSlice';

const SideBarMenuItem = ({ menu }: { menu: MenuItemType }) => (
  <Link
    to={menu.link}
    className="p-3"
    style={{ backgroundColor: 'white', color: 'black' }}
  >
    {menu.title}
  </Link>
);

export default function SideBar() {
  const dispatch = useDispatch();
  const role = useSelector((state: RootState) => selectAuthRole(state));

  return (
    <div
      className="d-flex flex-column h-100 justify-content-between"
      style={{ backgroundColor: 'white' }}
    >
      <div className="d-flex flex-column ">
        {MenuItemList.filter((m) => m.roleLevel >= role).map((m) => (
          <SideBarMenuItem key={m.index} menu={m} />
        ))}
      </div>
      <Button onClick={() => dispatch(logout())}>Log out</Button>
    </div>
  );
}
