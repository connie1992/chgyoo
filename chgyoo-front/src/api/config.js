/* eslint-disable no-unused-vars */
/*
 * @Author: gaodachuan
 * @Date: 2018.7.12
 * @Last Modified by: chenhuogu
 * @Last Modified time: 2018.12.29
 * @Usag: 修改了拦截器无法取消请求的Bug，token获取优化
 */
import axios from 'axios';
import Auth from '../libs/auth';
import store from '../store/index.js';
import {router} from '../router/index';
// import Routers from '../router/router';
import qs from 'qs';
import {Message} from 'iview';

let base = '/';
var getTokenLock = false,
  CancelToken = axios.CancelToken,
  requestList = [],
  source =  CancelToken.source();

const CANCEL_MSG = 'request cancel';



/**
 * 阻止短时间内的重复请求
 * @param {string} url - 当前请求地址
 * @param {function} c - 中断请求函数
 * @description 每个请求发起前先判断当前请求是否存在于RequestList中，
 *              如果存在则取消该次请求，如果不存在则加入RequestList中，
 *              当请求完成后500ms时，清除RequestList中对应的该请求。
 */
function stopRepeatRequest(url, c) {
  for (let i = 0; i < requestList.length; i++) {
    if (requestList[i] == url) {
      c();
      return;
    }
  }
  requestList.push(url);
}

const service = axios.create({
  baseURL: process.env.BASE_API, // node环境的不同，对应不同的baseURL
  timeout: 5000, // 请求的超时时间
  withCredentials: true // 允许携带cookie
});
//axios默认配置
service.defaults.timeout = 5000;

/**
 * Token校验
 * @description 校验Token是否过期，如果Token过期则重新获取新Token
 *              自动获取Token：过期时自动调用获取Token接口。注意：当有任一请求在获取Token时，其余请求将顺延，直至新Token获取完毕
 */
function checkToken() {
  return new Promise(resolve => {
    if (Auth.hasToken()) {
      resolve(true);
    } else {
      if (getTokenLock) {
        setTimeout(function () {
          // 这里处理promise回调非常重要，不然promise处理链会堵塞
          checkToken().then(ok => {
            resolve(ok);
          });
        }, 500);
      } else {
        getTokenLock = true;
        store.dispatch('getNewToken').then(ok => {
          getTokenLock = false;
          if (ok) {
            resolve(true);
          } else {
            console.log('获取token失败');
            resolve(false);
          }
        });
      }
    }
  });
}

/**
 * request拦截器，检查用户状态，检查token
 */
service.interceptors.request.use(config => {
  let cancel;
  config.cancelToken = new CancelToken(function executor(c) {
    cancel = c;
  });
  // 1. 首先判断是否操作超时，如果超时的话需要回到登录界面
  console.log(`request拦截---${config.url} 检查用户状态：--------------`);
  Auth.checkUserStatus();
  let currentPath = router.currentRoute.name;
  if ((currentPath != 'login' && !Auth.logined) || (currentPath != 'locking' && Auth.locked)) {
    console.log('request拦截---用户操作时间过期，需要重新登录');
    // 重置Cookie和路由
    store.dispatch('logout').then(() => {
      router.push({name: 'login'});
    });
    // 中断请求
    cancel(CANCEL_MSG);
    return config;
  } else {
    // 2. 检查token是否失效
    if (config.url.indexOf('getJessionid') >= 0) {
      // 获取token方法不需要拦截，直接过去
      return config;
    }  else {
      // 检查是否有token
      return new Promise(resolve => {
        checkToken().then(ok => {
          if (ok) {
            /*console.log('设置请求头……');
            console.log(config.url);
            console.log(store.state.user.token);*/
            config.headers.token = store.state.user.token;
            resolve(config);
          } else {
            console.log('中断此次请求……');
            cancel(CANCEL_MSG);
            resolve(config);
          }
        });
      });
    }
  }
}, (err) => {
  console.log('request拦截报错');
  // 接口请求出错可在此处统一处理
  console.log(err);
  return Promise.resolve(err);
});

// 后台请求返回统一处理接口
service.interceptors.response.use((data) => {
 /* console.log('请求返回……');
  console.log(data);*/
  if ((data.status && data.status != 200)) {
    Message.error('请求失败，请联系管理员');
  } else if (data.data.code == 500) {
    Message.error(data.data.msg.length > 10 ? '请求失败' : data.data.msg);
    console.log(data.data.msg);
  }
  return data;
}, (err) => {
  if (!err.response) {
    console.log('错误的返回');
    console.log(err);
    // alert('非法的返回');
  } else if (err.response.status === 504 || err.response.status === 404) {
    alert('服务器找不到');
  } else if (err.response.status === 403) {
    alert('权限不足,请联系管理员');
  } else {
    alert('未知错误');
  }
  return Promise.resolve(err);
});

//POST请求
export function postRequest(url, params) {
  return service({
    method: 'post',
    url: `${base}${url}`,
    data: qs.stringify(params, {arrayFormat: 'brackets'}),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    cancelToken: source.token
  }).catch(function(thrown){
    if(axios.isCancel(thrown)){
      console.log('post request canceled', thrown.message);
    }else{
      console.log(`post throw exception:${thrown.message}`);
    }
  });
}

//Get请求,可以在url中传参,也可以通过param对象传参
export function getRequest(url, params) {
  return service({
    method: 'get',
    data: params,
    url: `${base}${url}`
  }).catch(function(thrown){
    if(axios.isCancel(thrown)){
      console.log('get request canceled', thrown.message);
    }else{
      console.log(`post throw exception:${thrown.message}`);
    }
  });
}

//上传文件
export function uploadFileRequest(url, params) {
  return service({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

//
export function putRequest(url, params) {
  return service({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = '';
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
      }
      return ret;
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}


