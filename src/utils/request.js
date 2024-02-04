import axios from 'axios';
import { LOGIN_INFO_KEY } from '@/enums/cacheEnum';
import { isNullOrEmpty } from './util';
import { useUserStore } from '@/store/modules/user';
import { getToken } from './auth';

// 跨域认证信息 header 名
const xsrfHeaderName = 'Authorization';

const baseURL =
  location.href.toLowerCase().indexOf('localhost') >= 0 || location.href.indexOf('127.0.') >= 0
    ? 'http://localhost:1188'
    : '';

// create an service instance
const service = axios.create({
  timeout: 1000 * 60 * 20, // 20分钟
});

service.interceptors.request.use(
  function (config) {
    config.headers['Content-Type'] = 'application/json';

    const cryptLoginInfo = sessionStorage.getItem(LOGIN_INFO_KEY);
    if (location.href.indexOf('login') < 0 && cryptLoginInfo == undefined) {
      return;
    }

    var token = getToken();

    //
    if (!isNullOrEmpty(token)) {
      config.headers[xsrfHeaderName] = token;

      if (!isNullOrEmpty(cryptLoginInfo)) {
        config.headers['LoginInfo'] = cryptLoginInfo;
      }
    }

    var showWaiting = true;

    //不显示提示
    try {
      if (config.data != undefined) {
        if (config.data.ShowWaiting != undefined && config.data.ShowWaiting == false) {
          showWaiting = false;
        }
      }
    } catch (err) {
      /* empty */
    }

    if (showWaiting)
      layer.load(2, {
        shade: 0.01,
        content: '<span style="font-size:14px;padding-left:30px">正在处理中,请稍等...</span>',
        success: function (layero) {
          layero.find('.layui-layer-content').css({
            position: 'fixed',
            left: '-50px',
            top: '-20px',
            'background-color': '#ffffff',
            width: '220px',
            height: '70px',
            'padding-top': '25px',
            textAlign: 'center',
            backgroundPositionX: '20px',
            backgroundPositionY: '50%',
            border: '1px silver solid',
            'vertical-align': 'middle',
          });
        },
      });
    // }

    return config;
  },
  function (error) {
    layer.closeAll('loading'); //关闭加载层

    if (error.response != undefined) {
      if (error.response.status == 401) {
        layer.alert(
          error.response.data.message,
          {
            title: '发生异常' + error.response.data.code,
            skin: 'layui-layer-molv',
          },
          function () {
            useUserStore().logout();
          },
        );
      } else {
        layer.alert(error.response.data.message + ' ' + error.config.url, {
          title: '发生异常' + error.response.data.code,
          skin: 'layui-layer-molv',
        });
      }
    } else {
      layer.alert('发生异常：' + error.message + ' ' + error.config.url, {
        title: '网络异常',
        skin: 'layui-layer-molv',
      });
    }
    return Promise.reject(error);
  },
);

service.interceptors.response.use(
  function (response) {
    layer.closeAll('loading'); //关闭加载层

    return response.data;
  },
  function (error) {
    layer.closeAll('loading'); //关闭加载层

    if (error.response != undefined) {
      if (error.response.status == 401) {
        if (error.response.data.message != undefined) {
          layer.alert(
            error.response.data.message,
            {
              title: '发生异常' + error.response.data.code,
              skin: 'layui-layer-molv',
            },
            function () {
              useUserStore().logout();
            },
          );
        } else {
          layer.alert(
            '接口未授权，将返回登录页!' + ' ' + error.config.url,
            {
              title: '发生异常',
              skin: 'layui-layer-molv',
            },
            function () {
              useUserStore().logout();
            },
          );
        }
      } else {
        layer.alert(error.response.data.message + ' ' + error.config.url, {
          title: '发生异常' + error.response.data.code,
          skin: 'layui-layer-molv',
        });
      }
    } else {
      layer.alert('发生异常：' + error.message + ' ' + error.config.url, {
        title: '网络异常',
        skin: 'layui-layer-molv',
      });
    }

    return Promise.reject(error);
  },
);

// 认证类型
const AUTH_TYPE = {
  BEARER: 'Bearer',
  BASIC: 'basic',
  AUTH1: 'auth1',
  AUTH2: 'auth2',
};

// http method
const METHOD = {
  GET: 'get',
  POST: 'post',
};

/**
 * service请求
 * @param url 请求地址
 * @param method {METHOD} http method
 * @param params 请求参数
 * @returns {Promise<serviceResponse<T>>}
 */
async function request(url, method, params) {
  switch (method) {
    case METHOD.GET:
      return service.get(baseURL + url, {
        params,
      });
    case METHOD.POST:
      return service.post(baseURL + url, params);
    default:
      return service.get(baseURL + url, {
        params,
      });
  }
}

/**
 * 加载 service 拦截器
 * @param interceptors
 * @param options
 */
function loadInterceptors(interceptors, options) {
  const { request, response } = interceptors;
  // 加载请求拦截器
  request.forEach((item) => {
    let { onFulfilled, onRejected } = item;
    if (!onFulfilled || typeof onFulfilled !== 'function') {
      onFulfilled = (config) => config;
    }
    if (!onRejected || typeof onRejected !== 'function') {
      onRejected = (error) => Promise.reject(error);
    }
    service.interceptors.request.use(
      (config) => onFulfilled(config, options),
      (error) => onRejected(error, options),
    );
  });
  // 加载响应拦截器
  response.forEach((item) => {
    let { onFulfilled, onRejected } = item;
    if (!onFulfilled || typeof onFulfilled !== 'function') {
      onFulfilled = (response) => response;
    }
    if (!onRejected || typeof onRejected !== 'function') {
      onRejected = (error) => Promise.reject(error);
    }
    service.interceptors.response.use(
      (response) => onFulfilled(response, options),
      (error) => onRejected(error, options),
    );
  });
}

export { METHOD, AUTH_TYPE, request, loadInterceptors };
