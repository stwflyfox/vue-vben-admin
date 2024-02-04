import { request, METHOD } from '@/utils/request';

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(loginForm) {
  return request('/Auth/Login', METHOD.GET, loginForm);
}

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function checkUnion(data) {
  return request('/System/CheckUnionid', METHOD.POST, data);
}

/**
 * 获取系统版本
 */
export async function getSystemVersion() {
  return request('/System/GetSystemVersion', METHOD.POST);
}

/**
 * 修改密码
 */
export async function changePassword(params) {
  return request('/System/ChangePassword', METHOD.POST, params);
}

/**
 * 获取用户列表
 */
export async function queryUsers() {
  return request('/Admin/QueryUsers', METHOD.POST);
}

export default {
  login,
  queryUsers,
  getSystemVersion,
  changePassword,
};
