/*
  用户状态管理
  name: 姓名
  book: 帐号
  token: 令牌
 */
import {getRequest} from '../../api/config';
import Auth from '../../libs/auth';
import {getBreadCrumbList} from '../../libs/tools';
import {homeRoute} from '../../router/router';
import util from '@/libs/util';

const user = {
  state: {
    // 用户名
    name: '',
    book: '',
    token: '',
    menu: [],
    breadCrumbList: [],
    routed: false,
    homeRoute: homeRoute,
    userInfo: {},
    currentAccount: {},
    currentBook: '',
    routers: []
  },
  fetch: getRequest,
  mutations: {
    setUser: (state, data) => {
      state.name = data;
    },
    setUserInfo: (state, data) => {
      state.userInfo = data;
      if (data.user) {
        Auth.setUserInfo(data);
      }  else {
        Auth.removeUserInfo();
      }
    },
    setToken: (state, data) => {
      if (data) {
        sessionStorage.setItem('token', data);
        Auth.setToken(data);
        Auth.setLoginStatus();
      } else {
        sessionStorage.removeItem('token');
        Auth.removeToken();
        Auth.removeLoginStatus();
      }
      state.token = data;
    },
    setMenu: (state, data) => {
      state.menu = data;
      // Auth.setMenu(data);
    },
    setRouteFlag: (state, flag) => {
      state.routed = flag;
    },
    setBreadCrumb(state, routeMetched) {
      state.breadCrumbList = getBreadCrumbList(routeMetched, state.homeRoute);
    },
    setCurrentBook(state, book) {
      state.currentBook = book;
    },
    setRouters(state, routers) {
      state.routers = routers;
    }
  },
  actions: {
    // 登出
    logout({commit}) {
      return new Promise((resolve) => {
        commit('setToken', '');
        commit('setMenu', [], {root: true});
        commit('setUserInfo', {});
        commit('setRouteFlag', false);
        commit('setRouters', []);
        resolve();
      });
    },
    // 获取新Token
    getNewToken({commit, state}) {
      return new Promise((resolve) => {
        getRequest('getJessionid').then((res) => {
          if (util.isSuccess(res)) {
            console.log('请求token成功，重新设置token……');
            commit('setToken', res.data.data);
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    }
  },
  getters: {
    getMenuTree: function (state) {
      // 若安全要求不高,则可以将有权限的路由存在state和sessionStorage中
      return state.menu.length == 0 ? Auth.getMenu() : state.menu;
    },
    getUserInfo: function (state) {
      return state.userInfo.user ? state.userInfo.user : (Auth.getUserInfo() ? Auth.getUserInfo().user : '');
    },
    getAccounts: function (state) {
      return state.userInfo.books ? state.userInfo.books : Auth.getUserInfo().books;
    }
  }
};

export default user;
