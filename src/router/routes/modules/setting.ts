import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const about: AppRouteModule = {
  path: '/setting',
  name: 'setting',
  component: LAYOUT,
  redirect: '/setting/businessTables',
  meta: {
    hideChildrenInMenu: false,
    icon: 'ion:settings-outline',
    title: '系统设置',
    orderNo: 20,
  },
  children: [
    {
      path: 'businessTables',
      name: 'businessTables',
      component: () => import('@/views/setting/Tables.vue'),
      meta: {
        title: '业务表',
      },
    },
    {
      path: 'applibrary',
      name: 'applibrary',
      component: () => import('@/views/setting/Applibrary.vue'),
      meta: {
        title: '应用程序',
      },
    },
    {
      path: 'program',
      name: 'program',
      component: () => import('@/views/setting/Program.vue'),
      meta: {
        title: '应用程序编辑',
        hideMenu: true,
      },
    },
    {
      path: 'form',
      name: 'form',
      component: () => import('@/views/setting/Form.vue'),
      meta: {
        title: '表单',
      },
    },
  ],
};

export default about;
