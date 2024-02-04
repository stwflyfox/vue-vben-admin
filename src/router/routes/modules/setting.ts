import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const about: AppRouteModule = {
  path: '/setting',
  name: 'Setting',
  component: LAYOUT,
  redirect: '/setting/businessTables',
  meta: {
    hideChildrenInMenu: false,
    icon: 'ion:settings-outline',
    title: '系统设置',
    orderNo: 11,
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
  ],
};

export default about;
