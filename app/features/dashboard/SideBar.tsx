import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MenuItemList, MenuItemType } from '../../constants/MenuItems';
import { RootState } from '../../store';
import { selectAuthRole } from '../login/loginSlice';

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
  const role = useSelector((state: RootState) => selectAuthRole(state));

  return (
    <div
      className="d-flex flex-column h-100"
      style={{ backgroundColor: 'white' }}
    >
      {MenuItemList.filter((m) => m.roleLevel >= role).map((m) => (
        <SideBarMenuItem key={m.index} menu={m} />
      ))}
    </div>
  );
}
