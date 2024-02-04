import { request, METHOD } from '@/utils/request';

/**
 * 获取表单分类树
 */
export async function queryFormTree(params) {
  if (params == null) {
    params = {};
  }
  params.ShowWaiting = false;
  return request('/Form/QueryFormTree', METHOD.POST, params);
}

/**
 * 获取表单列表
 */
export async function queryFormList(params) {
  if (params == null) {
    params = {};
  }
  params.ShowWaiting = false;
  return request('/Form/QueryFormList', METHOD.POST, params);
}

/**
 * 获取表单分页列表
 */
export async function queryPageFormList(params) {
  if (params == null) {
    params = {};
  }
  params.ShowWaiting = false;
  return request('/Form/QueryPageFormList', METHOD.POST, params);
}

/**
 * 获取表单详细
 */
export async function queryFormDetail(params) {
  if (params == null) {
    params = {};
  }
  params.ShowWaiting = false;
  return request('/Form/QueryFormDetail', METHOD.POST, params);
}

/**
 * 查询表单级联树
 */
export async function queryFormCascaderTree(params) {
  if (params == null) {
    params = {};
  }
  params.ShowWaiting = false;
  return request('/Form/QueryFormCascaderTree', METHOD.POST, params);
}

/**
 * 保存表单详细
 */
export async function saveForm(params) {
  return request('/Form/SaveForm', METHOD.POST, params);
}

/**
 * 删除表单
 */
export async function deleteForm(params) {
  return request('/Form/DeleteForm', METHOD.POST, params);
}

/**
 * 发布表单
 */
export async function publishForm(params) {
  return request('/Form/PublishForm', METHOD.POST, params);
}

/**
 * 设计表单
 */
export async function desingeForm(params) {
  return request('/Form/DesingeForm', METHOD.POST, params);
}

/**
 * 复制表单
 */
export async function copyForm(params) {
  return request('/Form/CopyForm', METHOD.POST, params);
}

/**
 * 使用表单查询数据
 */
export async function queryFormData(params) {
  if (params == null) {
    params = {};
  }
  params.ShowWaiting = false;
  return request('/Form/QueryFormData', METHOD.POST, params);
}

/**
 * 用程序编码获取程序ID
 */
export async function getFormIdByCode(params) {
  if (params == null) {
    params = {};
  }

  params.ShowWaiting = false;
  return request('/Form/GetFormIdByCode', METHOD.POST, params);
}

/**
 * 查询接口数据
 */
export async function queryData(url, params) {
  if (params == null) {
    params = {};
  }
  params.ShowWaiting = false;
  return request(url, METHOD.POST, params);
}

/**
 * 保存表单分类
 */
export async function SaveCate(params) {
  return request('/Form/SaveCate', METHOD.POST, params);
}

/**
 * 删除表单分类
 */
export async function DeleteCate(params) {
  return request('/Form/DeleteCate', METHOD.POST, params);
}

/**
 * 查询分类列表
 */
export async function QueryCateList() {
  return request('/Form/QueryCateList', METHOD.POST);
}

export default {
  queryFormTree,
  queryFormList,
  queryFormDetail,
  queryFormCascaderTree,
  queryFormData,
  getFormIdByCode,
  saveForm,
  deleteForm,
  publishForm,
  desingeForm,
  copyForm,
  queryPageFormList,
  queryData,
  QueryCateList,
  SaveCate,
  DeleteCate,
};
