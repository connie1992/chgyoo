import {postRequest} from './config';

// 系统参数权限地址
const sysUrl = 'sysConfig/';
export const getParamsData = (params) => {
  console.log(params);
  return postRequest(`${sysUrl}pageQuery`, params);
};

export const addUpdata = (params) => {
  console.log(params);
  return postRequest(`${sysUrl}addOrUpdate`, params);
};

// 数据权限地址
const authUrl = 'authData/';

export const getAuthData = (params) => {
  return postRequest(`${authUrl}pageQuery`, params);
};

export const authDataAddUpdate = (params) => {
  return postRequest(`${authUrl}addOrUpdate`, params);
};

export const setStatus = (params) => {
  return postRequest(`${authUrl}changeStatus`, params);
};

// 通知公共地址
const publicNoticeUrl = 'publicNotice/';

export const getPublicNotice = (params) => {
    return postRequest(`${publicNoticeUrl}pageQuery`, params);
};

export const publicNoticeAddUpdate = (params) => {
    return postRequest(`${publicNoticeUrl}addOrUpdate`, params);
};