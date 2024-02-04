// import { Notify } from '@opentiny/vue';

import { LOGIN_INFO_KEY, TOKEN_KEY } from '@/enums/cacheEnum';

import CryptoJS from 'crypto-js';

export function isDef(v) {
  return v !== undefined && v !== null;
}

export function isNullOrEmpty(data) {
  if (data !== undefined && data != null && data !== '') {
    return false;
  }
  return true;
}

/**
 * Remove an item from an array.
 */
export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

export function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]';
}

export function Encrypt(str) {
  const _KEY = 'd22c46e8e6074295ba2b53fcd63ea071'; //32位
  const _IV = 'd93b7fcd1a0e40ff'; //16位
  var key = CryptoJS.enc.Utf8.parse(_KEY);
  var iv = CryptoJS.enc.Utf8.parse(_IV);

  var encrypted = '';

  var srcs = CryptoJS.enc.Utf8.parse(str);
  encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.ciphertext.toString();
}

// 解密方法
export function Decrypt(word) {
  const _KEY = 'd22c46e8e6074295ba2b53fcd63ea071'; // 32位
  const _IV = 'd93b7fcd1a0e40ff'; // 16位
  var key = CryptoJS.enc.Utf8.parse(_KEY);
  var iv = CryptoJS.enc.Utf8.parse(_IV);
  let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  let decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

export function guid() {
  var str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  str = str.replace(/-/g, '').toUpperCase();
  return str;
}

const _toString = Object.prototype.toString;

const BASE_URL =
  location.href.toLowerCase().indexOf('localhost') >= 0 || location.href.indexOf('127.0.') >= 0
    ? 'http://localhost:1188'
    : '';

export function openUrl(url, params, includeLoginInfo = true) {
  url = BASE_URL + url;
  url += url.indexOf('?') >= 0 ? '&' : '?';
  url += 'args=' + encodeURIComponent(JSON.stringify(params));
  if (includeLoginInfo) {
    url += '&LoginInfo=' + encodeURIComponent(sessionStorage.getItem(LOGIN_INFO_KEY));
  }

  window.open(url);
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  sessionStorage.setItem(TOKEN_KEY, `Bearer ${token}`);
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function getloginInfo() {
  var cryptLoginInfo = sessionStorage.getItem(LOGIN_INFO_KEY);
  if (cryptLoginInfo != undefined) {
    var str = Decrypt(cryptLoginInfo);
    return JSON.parse(str);
  } else {
    return null;
  }
}

export function setloginInfo(LoginInfo) {
  const encryptLoginInfo = Encrypt(JSON.stringify(LoginInfo));
  sessionStorage.setItem(LOGIN_INFO_KEY, encryptLoginInfo);
}

export function removeloginInfo() {
  sessionStorage.removeItem(LOGIN_INFO_KEY);
}

/**
 * 页面按钮权限
 */
export function SetButtonPermission(MenuCode, code) {
  var loginfo = getloginInfo();
  var _Disabled = false;
  if (!isNullOrEmpty(loginfo.PermissionsList)) {
    //屏蔽按钮
    if (
      !isNullOrEmpty(loginfo.PermissionsList.PermissButtonList) &&
      loginfo.PermissionsList.PermissButtonList.length > 0
    ) {
      var item = loginfo.PermissionsList.PermissButtonList.find(
        (p) => p.MenuCode == MenuCode && p.PermissionsCode == code,
      );
      if (!isNullOrEmpty(item)) {
        _Disabled = true;
      }
    }
  }
  return _Disabled;
}

//表格操作按钮权限
export function SetOperationPermission(MenuCode, code) {
  var loginfo = getloginInfo();
  var _Disabled = false;
  if (!isNullOrEmpty(loginfo.PermissionsList)) {
    if (
      !isNullOrEmpty(loginfo.PermissionsList.PermissOperationList) &&
      loginfo.PermissionsList.PermissOperationList.length > 0
    ) {
      loginfo.PermissionsList.PermissOperationList.forEach((d) => {
        if (d.MenuCode == MenuCode && d.PermissionsCode == code) {
          _Disabled = true;
        }
      });
    }
  }
  return _Disabled;
}

//表格列权限
export function SetColumnPermission(MenuCode, columnList) {
  var loginfo = getloginInfo();
  if (!isNullOrEmpty(loginfo.PermissionsList)) {
    if (
      !isNullOrEmpty(loginfo.PermissionsList.PermissColumnList) &&
      loginfo.PermissionsList.PermissColumnList.length > 0
    ) {
      loginfo.PermissionsList.PermissColumnList.forEach((d) => {
        if (d.MenuCode == MenuCode) {
          //删除列
          var _row = columnList.findIndex((p) => p.dataIndex == d.PermissionsCode);
          if (_row >= 0) {
            columnList.splice(_row, 1);
          }
        }
      });
    }
  }
  return columnList;
}

//深度拷贝
export function clone(data) {
  var obj = JSON.parse(JSON.stringify(data));
  return obj;
}

//映射属性值
export function map(sou, des) {
  var temp = this.clone(des);

  for (var s in sou) {
    temp[s] = this.clone(sou[s]);
  }

  return temp;
}

export function range(startAt, size) {
  return [...Array(size).keys()].map((i) => i + startAt);
}

//获取字符串中的数字
export function getNumber(str) {
  if (this.isNullOrEmpty(str)) return str;
  return str.replace(/[^0-9]/gi, '');
}

//获取元素在数组中的索引号
export function indexOf(array, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == value) {
      return i;
    }
  }
}

//将Undefined转换为null
export function changeUndefined(values) {
  for (let key in values) {
    if (values[key] == undefined) {
      values[key] = null;
    }

    if (values[key] instanceof Array) {
      for (var j = 0; j < values[key].length; j++) {
        changeUndefined(values[key][j]);
      }
    }
  }
}

export function alert(message) {
  var context =
    '<div style="position: relative; padding: 20px;  line-height: 24px;  word-break: break-all;  font-size: 14px;  overflow: auto;">' +
    message +
    '</div>';
  layer.open({
    type: 1,
    content: context,
    title: '提示',
    skin: 'layui-layer-molv',
    btn: ['确定'],
    // eslint-disable-next-line object-shorthand
    success: function (layero, index) {
      this.enterConfirm = function (event) {
        if (event.keyCode === 32) {
          $('.layui-layer-btn0').click();
          return false; //阻止系统默认回车事件
        }
      };
      $(document).on('keydown', this.enterConfirm); //监听键盘事件
    },
    end: function () {
      $(document).off('keydown', this.enterConfirm); //解除键盘事件
    },
  });
}

export function success(message) {
  // Vue.prototype.$message.success(message);
  // Notify({
  //   type: 'info',
  //   message: message,
  //   position: 'top-right',
  //   duration: 2000,
  //   customClass: 'my-custom-cls',
  // });
}

export function warn(message) {
  // Vue.prototype.$message.warning(message);
  this.warning(message);
}

export function warning(message) {
  // Vue.prototype.$message.warning(message);
  // var context = '<div style="position: relative; padding: 20px;  line-height: 24px;  word-break: break-all;  font-size: 14px;  overflow: auto;">' + message + '</div>'
  layer.open({
    type: 1,
    content: message,
    title: '提醒',
    skin: 'layui-layer-molv',
    btn: ['确定'],
    success: function (layero, index) {
      this.enterConfirm = function (event) {
        if (event.keyCode === 32) {
          $('.layui-layer-btn0').click();
          return false; //阻止系统默认回车事件
        }
      };
      $(document).on('keydown', this.enterConfirm); //监听键盘事件

      // 点击确定按钮回调事件
      $('.layui-layer-btn0').on('click', function () {
        console.log('peace and love');
      });
    },
    end: function () {
      $(document).off('keydown', this.enterConfirm); //解除键盘事件
    },
  });
}

export function error(message) {
  var context =
    '<div style="position: relative; padding: 20px;  line-height: 24px;  word-break: break-all;  font-size: 14px;  overflow: auto;">' +
    message +
    '</div>';
  layer.open({
    type: 1,
    content: context,
    title: '错误',
    skin: 'layui-layer-molv',
    btn: ['确定'],
    success: function (layero, index) {
      this.enterConfirm = function (event) {
        if (event.keyCode === 32) {
          $('.layui-layer-btn0').click();
          return false; //阻止系统默认回车事件
        }
      };
      $(document).on('keydown', this.enterConfirm); //监听键盘事件

      // 点击确定按钮回调事件
      $('.layui-layer-btn0').on('click', function () {
        console.log('peace and love');
      });
    },
    end: function () {
      $(document).off('keydown', this.enterConfirm); //解除键盘事件
    },
  });
}

export function toNumber(val) {
  if (isNullOrEmpty(val)) {
    return 0;
  } else {
    return Number(val);
  }
}

export function isNumber(val) {
  var regPos = /^\d+(\.\d+)?$/; //非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
}

//获取当前系统时间
export function Now() {
  return this.dateformat(new Date(), 'yyyy-MM-dd hh:mm:ss');
}

export function dateformat(dt, fmt) {
  var o = {
    'M+': dt.getMonth() + 1, //月份
    'd+': dt.getDate(), //日
    'h+': dt.getHours(), //小时
    'm+': dt.getMinutes(), //分
    's+': dt.getSeconds(), //秒
    'q+': Math.floor((dt.getMonth() + 3) / 3), //季度
    S: dt.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
      );
    }
  }
  return fmt;
}

export function today() {
  var dt = new Date();
  return dateformat(dt, 'yyyy-MM-dd');
}

export function getHyperlinktext(info) {
  var name = '';
  if (!isNullOrEmpty(info)) {
    var startIdx = info.indexOf('>');
    var endIdx = info.indexOf('</a>');
    name = info.substr(startIdx + 1, endIdx - startIdx - 1);
  }
  return name;
}

/**
 * 深拷贝
 * @param data
 */
export function cloneDeep(data) {
  return JSON.parse(JSON.stringify(data));
}

/**
 * 树转数组
 * @param tree
 * @param hasChildren
 */
export function treeToList(tree = [], hasChildren = false) {
  let queen = [];
  const out = [];
  queen = queen.concat(JSON.parse(JSON.stringify(tree)));
  while (queen.length) {
    const first = queen.shift();
    if (first?.children) {
      queen = queen.concat(first.children);
      if (!hasChildren) delete first.children;
    }
    out.push(first);
  }
  return out;
}

/**
 * 数组转树
 * @param list
 * @param tree
 * @param parentId
 * @param key
 */
export function listToTree(list = [], tree = [], parentId = 0, key = 'parentId') {
  list.forEach((item) => {
    if (item[key] === parentId) {
      const child = {
        ...item,
        children: [],
      };
      listToTree(list, child.children, item.id, key);
      if (!child.children?.length) delete child.children;
      tree.push(child);
    }
  });
  return tree;
}

/**
 * 获取树节点 key 列表
 * @param treeData
 */
export function getTreeKeys(treeData) {
  const list = treeToList(treeData);
  return list.map((item) => item.key);
}

/**
 * 循环遍历出最深层子节点，存放在一个数组中
 * @param deepList
 * @param treeData
 */
export function getDeepList(deepList, treeData) {
  treeData?.forEach((item) => {
    if (item?.children?.length) {
      getDeepList(deepList, item.children);
    } else {
      deepList.push(item.key);
    }
  });
  return deepList;
}

/**
 * 将后台返回的含有父节点的数组和第一步骤遍历的数组做比较,如果有相同值，将相同值取出来，push到一个新数组中
 * @param uniqueArr
 * @param arr
 */
export function uniqueTree(uniqueArr, arr) {
  const uniqueChild = [];
  for (const i in arr) {
    for (const k in uniqueArr) {
      if (uniqueArr[k] === arr[i]) {
        uniqueChild.push(uniqueArr[k]);
      }
    }
  }
  return uniqueChild;
}

/**
 * 是否选中
 * @param selectedKeys
 * @param eventKey
 */
export function isChecked(selectedKeys, eventKey = '') {
  return selectedKeys.indexOf(eventKey) !== -1;
}

/**
 * 处理左侧树数据
 * @param data
 * @param targetKeys
 * @param direction
 */
export function handleLeftTreeData(data, targetKeys, direction = 'right') {
  data.forEach((item) => {
    if (direction === 'right') {
      item.disabled = targetKeys.includes(item.key);
    } else if (direction === 'left') {
      if (item.disabled && targetKeys.includes(item.key)) item.disabled = false;
    }
    if (item.children) handleLeftTreeData(item.children, targetKeys, direction);
  });
  return data;
}

/**
 * 处理右侧树数据
 * @param data
 * @param targetKeys
 * @param direction
 */
export function handleRightTreeData(data, targetKeys, direction = 'right') {
  const list = treeToList(data);
  const arr = [];
  const tree = [];
  list.forEach((item) => {
    if (direction === 'right') {
      if (targetKeys.includes(item.key)) {
        const content = { ...item };
        if (content.children) delete content.children;
        arr.push({ ...content });
      }
    } else if (direction === 'left') {
      if (!targetKeys.includes(item.key)) {
        const content = { ...item };
        if (content.children) delete content.children;
        arr.push({ ...content });
      }
    }
  });
  listToTree(arr, tree, 0);
  return tree;
}

/**
 * 树数据展平
 * @param list
 * @param dataSource
 */
export function flatten(list, dataSource) {
  list.forEach((item) => {
    dataSource.push(item);
    if (item.children) flatten(item.children, dataSource);
  });
  return dataSource;
}

/**
 * 树节点
 * @param list
 * @param dataSource
 */
export function findNode(arr, id, field = 'id') {
  arr.forEach((item) => {
    //利用foreach循环遍历
    if (item[field] == id) {
      //判断递归结束条件
      return item;
    } else if (item.children.length > 0) {
      //判断chlidren是否有数据
      findNode(item.children, id, field); //递归调用
    }
  });
}

/**
 * 查找表单设计里的字段
 * @param list
 * @param dataSource
 */
export function findFormFieldByKey(list, key) {
  var result;

  list.forEach((field) => {
    if (field.type == 'batch') {
      field.list.forEach((batch) => {
        if (batch.key == key) {
          result = batch;
        }
      });
    } else if (field.type == 'table') {
      field.trs.forEach((tr) => {
        tr.tds.forEach((td) => {
          td.list.forEach((record) => {
            if (record.key == key) {
              result = record;
            }
          });
        });
      });
    } else {
      if (field.key == key) {
        result = field;
      }
    }
  });

  return result;
}

export function toBool(val) {
  if (isNullOrEmpty(val)) {
    return false;
  } else if (val == 0 || val == '0') {
    return false;
  } else if (val == 1 || val == '1') {
    return true;
  } else if (typeof val == 'string' && val.toLowerCase() == 'false') {
    return false;
  } else if (typeof val == 'string' && val.toLowerCase() == 'true') {
    return true;
  } else if (typeof val == 'boolean') {
    return val;
  } else {
    return false;
  }
}

export function PadLeft(len, charStr) {
  var s = this + '';
  return new Array(len - s.length + 1).join(charStr, '') + s;
}

export function PadRight(len, charStr) {
  var s = this + '';
  return s + new Array(len - s.length + 1).join(charStr, '');
}

//去除字符串头尾空格或指定字符
export function Trim(charStr, c) {
  if (c == null || c == '') {
    var str = charStr.replace(/^s*/, '');
    var rg = /s/;
    var i = str.length;
    while (rg.test(str.charAt(--i)));
    return str.slice(0, i + 1);
  } else {
    var rg = new RegExp('^' + c + '*');
    var str = charStr.replace(rg, '');
    rg = new RegExp(c);
    var i = str.length;
    while (rg.test(str.charAt(--i)));
    return str.slice(0, i + 1);
  }
}
//去除字符串头部空格或指定字符
export function TrimStart(charStr, c) {
  if (c == null || c == '') {
    var str = charStr.replace(/^s*/, '');
    return str;
  } else {
    var rg = new RegExp('^' + c + '*');
    var str = charStr.replace(rg, '');
    return str;
  }
}

//去除字符串尾部空格或指定字符
export function TrimEnd(charStr, c) {
  if (c == null || c == '') {
    var str = charStr;
    var rg = /s/;
    var i = str.length;
    while (rg.test(str.charAt(--i)));
    return str.slice(0, i + 1);
  } else {
    var str = charStr;
    var rg = new RegExp(c);
    var i = str.length;
    while (rg.test(str.charAt(--i)));
    return str.slice(0, i + 1);
  }
}

export default {
  LOGIN_INFO_KEY,
  PadLeft,
  PadRight,
  Trim,
  TrimStart,
  TrimEnd,
  isNullOrEmpty,
  indexOf,
  clone,
  map,
  Encrypt,
  Decrypt,
  guid,
  getNumber,
  toNumber,
  isNumber,
  toBool,
  getToken,
  setToken,
  clearToken,
  getloginInfo,
  setloginInfo,
  removeloginInfo,
  openUrl,
  range,
  SetButtonPermission,
  SetOperationPermission,
  SetColumnPermission,
  changeUndefined,
  alert,
  success,
  warning,
  warn,
  error,
  Now,
  dateformat,
  today,
  getHyperlinktext,
  findNode,
  flatten,
  getDeepList,
  getTreeKeys,
  handleLeftTreeData,
  handleRightTreeData,
  isChecked,
  uniqueTree,
  findFormFieldByKey,
};
