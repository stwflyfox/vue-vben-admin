import { request, METHOD } from '@/utils/request';

/**
 * 查询业务表列表
 */
export async function QueryPageTableList(params) {
  return request('/Table/QueryPageTableList', METHOD.POST, params);
}

/**
 * 查询业务表列表
 */
export async function queryTableList(params) {
  return request('/Table/QueryTableList', METHOD.POST, params);
}

/**
 * 保存业务表
 */
export async function SaveBusinessTable(params) {
  return request('/Table/SaveBusinessTable', METHOD.POST, params);
}

/**
 * 删除业务表数据
 */
export async function RemoveBusinessTable(params) {
  return request('/Table/RemoveBusinessTable', METHOD.POST, params);
}

/**
 * 停用业务表数据
 */
export async function StopBusinessTable(params) {
  return request('/Table/StopBusinessTable', METHOD.POST, params);
}

/**
 * 查询业务表列表
 */
export async function GetPayType(params) {
  return request('/Table/GetPayType', METHOD.POST, params);
}

/**
 * 查询数据库表
 */
export async function QueryDBTables(params) {
  return request('/Table/QueryDBTables', METHOD.POST, params);
}

/**
 * 保存复制业务表
 */
export async function SaveCopyTable(params) {
  return request('/Table/SaveCopyTable', METHOD.POST, params);
}

/**
 * 保存复制业务表
 */
export async function QueryDtoList() {
  return request('/Table/QueryDtoList', METHOD.POST);
}

export default {
  queryTableList,
  SaveBusinessTable,
  RemoveBusinessTable,
  GetPayType,
  QueryDBTables,
  StopBusinessTable,
  QueryPageTableList,
  SaveCopyTable,
  QueryDtoList,
};
