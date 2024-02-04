import { request, METHOD } from '@/utils/request';

/**
 * 获取应用程序分类树
 */
export async function queryProgramTree(params) {
  if (params == null) {
    params = {};
  }
  params.ShowWaiting = false;
  return request('/Program/QueryProgramTree', METHOD.POST, params);
}

/**
 * 获取应用程序列表
 */
export async function queryProgramList(params) {
  if (params == null) {
    params = {};
  }
  params.ShowWaiting = false;
  return request('/Program/QueryProgramList', METHOD.POST, params);
}

/**
 * 获取应用程序分页列表
 */
export async function queryPageProgramList(params) {
  if (params == null) {
    params = {};
  }
  params.ShowWaiting = false;
  return request('/Program/QueryPageProgramList', METHOD.POST, params);
}

/**
 * 获取应用程序详细
 */
export async function queryProgramDetail(params) {
  if (params == null) {
    params = {};
  }
  params.ShowWaiting = false;
  return request('/Program/QueryProgramDetail', METHOD.POST, params);
}

/**
 * 查询应用程序明细(加上联系人转换)
 */
export async function queryProgramBuildDetail(params) {
  if (params == null) {
    params = {};
  }
  params.ShowWaiting = false;
  return request('/Program/QueryProgramBuildDetail', METHOD.POST, params);
}

/**
 * 查询应用程序级联树
 */
export async function queryProgramCascaderTree(params) {
  if (params == null) {
    params = {};
  }
  params.ShowWaiting = false;
  return request('/Program/QueryProgramCascaderTree', METHOD.POST, params);
}

/**
 * 保存应用程序详细
 */
export async function saveProgram(params) {
  return request('/Program/SaveProgram', METHOD.POST, params);
}

/**
 * 删除应用程序
 */
export async function deleteProgram(params) {
  return request('/Program/DeleteProgram', METHOD.POST, params);
}

/**
 * 发布应用程序
 */
export async function publishProgram(params) {
  return request('/Program/PublishProgram', METHOD.POST, params);
}

/**
 * 复制应用程序
 */
export async function copyProgram(params) {
  return request('/Program/CopyProgram', METHOD.POST, params);
}

/**
 * 使用应用程序查询数据
 */
export async function queryProgramData(params) {
  if (params == null) {
    params = {};
  }
  params.ShowWaiting = false;
  return request('/Program/QueryProgramData', METHOD.POST, params);
}

/**
 * 用程序编码获取程序ID
 */
export async function getProgramIdByCode(params) {
  if (params == null) {
    params = {};
  }

  params.ShowWaiting = false;
  return request('/Program/GetProgramIdByCode', METHOD.POST, params);
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
 * 保存应用程序详细
 */
export async function savePersonalise(params) {
  return request('/Program/SavePersonalise', METHOD.POST, params);
}

/**
 * 查询个性化列表
 */
export async function queryPersonaliseList(params) {
  return request('/Program/QueryPersonaliseList', METHOD.POST, params);
}

/**
 * 导出应用程序
 */
export async function OutExportProgram(params) {
  return request('/Program/OutExportProgram', METHOD.POST, params);
}

/**
 * 保存应用程序分类
 */
export async function SaveCate(params) {
  return request('/Program/SaveCate', METHOD.POST, params);
}

/**
 * 删除应用程序分类
 */
export async function DeleteCate(params) {
  return request('/Program/DeleteCate', METHOD.POST, params);
}

/**
 * 查询分类列表
 */
export async function QueryCateList() {
  return request('/Program/QueryCateList', METHOD.POST);
}

export default {
  queryProgramTree,
  queryProgramList,
  queryProgramDetail,
  queryProgramBuildDetail,
  queryProgramCascaderTree,
  queryProgramData,
  getProgramIdByCode,
  saveProgram,
  deleteProgram,
  publishProgram,
  copyProgram,
  queryPageProgramList,
  queryData,
  savePersonalise,
  queryPersonaliseList,
  OutExportProgram,
  QueryCateList,
  SaveCate,
  DeleteCate,
};
