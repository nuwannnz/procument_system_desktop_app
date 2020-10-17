/* eslint-disable import/prefer-default-export */
import routes from './routes.json';

export type MenuItemType = {
  index: number;
  title: string;
  roleLevel: number;
  link: string;
};

export const MenuItemList: MenuItemType[] = [
  {
    index: 1,
    title: 'Create Users',
    roleLevel: 1,
    link: routes.CREATE_USERS,
  },
  {
    index: 2,
    title: 'View Users',
    roleLevel: 1,
    link: routes.VIEW_USERS,
  },
  {
    index: 3,
    title: 'Budget',
    roleLevel: 2,
    link: routes.BUDGET,
  },
  {
    index: 4,
    title: 'Invoices',
    roleLevel: 4,
    link: routes.INVOICE,
  },
  {
    index: 5,
    title: 'Orders',
    roleLevel: 4,
    link: routes.ORDERS,
  },
  {
    index: 6,
    title: 'Sites',
    roleLevel: 3,
    link: routes.SITES,
  },
  {
    index: 7,
    title: 'Returns',
    roleLevel: 3,
    link: routes.RETURN_REQUESTS,
  },
];
