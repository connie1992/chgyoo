import Cookies from 'js-cookie';

const authToken = {
  // 当Token超时后采取何种策略
  // jumpAuthPage  每次请求时判断Token是否超时，若超时则跳转到授权页面
  // getNewToken  每次请求时判断Token是否超时，若超时则获取新Token (推荐)
  tokenTimeoutMethod: 'getNewToken',

  // 在Cookie中记录登录状态的key
  loginKey: 'isLogin',

  locked: false,

  logined: true,


  // -------------检查用户状态，是否锁定/登录-----------------
  checkUserStatus: function () {
    if (this.getLocking()) {
      this.locked = true;
    } else {
      this.locked = false;
      this.logined = this.isLogin() ? true : false;
    }
    // console.log(`-------------用户状态： locked = ${this.locked}，logined = ${this.logined}----------`);
  },
  // -------------设置锁定状态-----------------
  setLocking: function(locking) {
    Cookies.set('locking', locking);
  },
  getLocking: function() {
    Cookies.get('locking');
  },
  // -------------设置登录状态-----------------
  setLoginStatus: function () {
    // TODO: 设置超时登录时间，在该时间范围内没有任何请求操作则自动删除
    console.log('登录状态最长时间更新');
    var maxAge = new Date(new Date().getTime() + 60 * 60 * 1000);
    Cookies.set(this.loginKey, 'true', {
      expires: maxAge
    });
  },

  isLogin: function () {
    return Cookies.get(this.loginKey);
  },

  removeLoginStatus: function () {
    Cookies.remove(this.loginKey);
  },

  // --------------设置Token--------------------------
  hasToken: function () {
    return Cookies.get('token');
  },

  setToken: function (token) {
    // TODO: 设置token，并填写有效期，30秒更新一次token
    var maxAge = new Date(new Date().getTime() + 30 * 1000);
    Cookies.set('token', token, {
      expires: maxAge
    });
  },

  removeToken: function () {
    Cookies.remove('token');
  },

  // -------------------设置菜单-----------------
  setMenu: function(menu) {
    localStorage.setItem('menu', JSON.stringify(menu));
  },

  getMenu: function() {
    return JSON.parse(localStorage.getItem('menu'));
  },

  removeMenu: function() {
    localStorage.removeItem('menu');
  },

  // -------------------设置用户信息-----------------
  setUserInfo: function(info) {
    localStorage.setItem('userInfo', JSON.stringify(info));
  },

  getUserInfo: function() {
    return JSON.parse(localStorage.getItem('userInfo'));
  },

  removeUserInfo: function () {
    localStorage.removeItem('userInfo');
  },
};

export default authToken;
