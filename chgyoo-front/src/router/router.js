/**
 * 路由表定义,采用懒加载方式加载相关view的js
 * @author Gaodachuan in 2018.7.28
 *
 */
export const routers = [
  {
    path: '/error',
    component: (resolve) => require(['../views/error/error-page'], resolve),
    children: [
      {
        path: '403',
        component: (resolve) => require(['../views/error/403'], resolve)
      },
      {
        path: '404',
        component: (resolve) => require(['../views/error/404'], resolve),
        children: [{
          path: '404-1',
          component: (resolve) => require(['../views/error/testrouter'], resolve)
        }],
        meta: {
          title: ''
        }
      },
      {
        path: '500',
        component: (resolve) => require(['../views/error/500'], resolve),
        meta: {
          title: '服务器内部错误'
        }
      }
    ]
  }, {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录'
    },
    component: (resolve) => require(['../views/login'], resolve)
  }, {
    path: '/iconfont',
    component: (resolve) => require(['../assets//iconfont/icon-demo'], resolve),
    name: 'iconfont',
    meta: {
      title: 'iconfont组件库'
    }
  }, {
    path: '*',
    redirect: '/error/404'
  }];

export const homeRoute = {
  path: '/home',
  name: 'home',
  component: (resolve) => require(['../views/home'], resolve),
  meta: {
    icon: ' iconfont icon-tubiao115',
    title: '主页',
    url: '/home'
  }
};
