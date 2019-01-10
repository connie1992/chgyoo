import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import VueRouter from 'vue-router';
import {routers} from './router';
import routerMap from '../router/mapping.js';
import store from '../store/index.js';
import Auth from '../libs/auth';

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
  mode: 'history',
  routes: routers
};

export const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  Util.title(to.meta.title);
  console.log('router拦截：--------------');
  console.log(to);
  console.log('检查用户登录状态：');
  Auth.checkUserStatus();
  if (Auth.locked && to.name !== 'locking') {
    // 用户锁定
    next({replace: true, name: 'locking'});
  } else if (!Auth.locked && to.name === 'locking' && Auth.logined) {
    // 去主页
    next({replace: true, name: 'home'});
  } else {
    if (!Auth.logined || Auth.logined == 'false') {
      // 未登录，去登录界面
      console.log('未登录');
      // 登录状态失效，两种情况，1：没有登录，2：长时间没有操作，需要退出重新登录
      if (to.name == 'login') {
        next();
      } else {
        store.dispatch('logout').then(() => {
          next({replace: true, name: 'login'});
        });
      }
    } else {
      if (store && store.state.user.routed == false) {
        console.log('刷新页面了，需要重新加载动态路由');
        routerMap.generateRootRoute().then(data => {
          if (data) {
            router.addRoutes(data);
            if (Auth.logined && to.name === 'login') {
              // 已经登录了，无需跳转到登录，直接去主页
              next({replace: true, name: 'home'});
            } else if (to.name == '/') {
              next({replace: true, name: 'home'});
            } else {
              let redirect = to.redirectedFrom;
              next({replace: true, path: redirect});
            }
          } else {
            store.dispatch('logout').then(() => {
              next({replace: true, name: 'login'});
            });
          }
        });
      } else {
        if (Auth.logined && to.name === 'login') {
          // 已经登录了，无需跳转到登录，直接去主页
          next({replace: true, name: 'home'});
        } else if (to.name == '/') {
          next({replace: true, name: 'home'});
        } else {
          next();
        }
      }
    }
  }
});

router.afterEach((to) => {
  //Util.openNewPage(router.app, to.name, to.params, to.query);
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});
