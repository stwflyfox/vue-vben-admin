import {
    request,
    METHOD
  } from '@/utils/request'

  /**
 * 获取下载模板归属系统
 */
export async function GetSystemType() {
    
    return request('/System/GetSystemType', METHOD.GET)
  
  }

  export default {
    GetSystemType   
  }