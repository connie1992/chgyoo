/*
   页面对象与页面文件路径映射表
   @author: gaodachuan 2018.7.24
   因为webpack无法在编译后动态加载路径文件,因此
   用映射表将页面文件映射到对象上,在运行时进行
   懒加载
 */
import util from '../libs/util';
import {homeRoute} from './router';
import {getUserMenu} from '@/api/permission';
import store from '@/store';

const routerMap = {
  Index: (resolve) => require(['../views/index.vue'], resolve),
  routes: [],
  generateRootRoute: function () {
    // 获取用户对应的权限信息
    return new Promise(resolve => {
      getUserMenu(store.getters.getUserInfo.id).then(res => {
        if (util.isSuccess(res)) {
          // 设置菜单
          store.commit('setMenu', res.data.data);
          //根据后台菜单和权限配置,动态增加路由
          let me = this;
          me.routes = [];
          // 创建主页面路由
          let mainRoute = {
            path: '/',
            name: '/',
            component: (resolve) => require(['../views/index.vue'], resolve),
            meta: {
              icon: ' iconfont icon-tubiao115',
              url: '/'
            },
            children: [
              homeRoute
            ]
          };
          me.routes.push(mainRoute);
          res.data.data.forEach(function (item) {
            let haveChild = item.children && item.children.length > 0;
            let parentRouteItem = null;
            if (haveChild) {
              // 一级文件夹
              parentRouteItem = me.createRouteItem(item, '/', true);
              me.routes.push(parentRouteItem);
              me.generateRoute(item.children, 1, parentRouteItem);
            } else {
              // 一级菜单
              let add = null;
              if (item.param) {
                // 带参数
                add = me.findRouteItem(mainRoute.children, item);
              }
              if (add) {
                // 已经有相应的路由了，
                add.meta.menuPathMap[item.url] = item.menuPath;
                add.meta.iconMap[item.url] = item.icon;
                add.meta.titleMap[item.url] = item.name;
                add.meta.permissionMap[item.url] = item.permission;
              } else {
                mainRoute.children.push(me.createRouteItem(item, '', false));
              }
            }
          });
          console.log('----------------自定义配置的路由为 : ------------------');
          console.log(me.routes);
          store.commit('setRouteFlag', true);
          store.commit('setRouters', me.routes);
          resolve(me.routes);
        } else {
          resolve(false);
        }
      });
    });
  },
  createRouteItem (item, prefix, isMain) {
    let menuPathMap = {};
    menuPathMap[item.url] = item.menuPath;
    let iconMap = {};
    iconMap[item.url] = item.icon;
    let titleMap = {};
    titleMap[item.url] = item.name;
    let permissionMap = {};
    permissionMap[item.url] = item.permission;
    return {
      path: prefix + item.routePath,
      component: resolve => require([isMain ? '../views/index.vue' : `../views/${item.pagePath}.vue`], resolve),
      meta: {
        icon: item.icon,
        permission: item.permission,
        routeFullPath: item.routeFullPath,
        menuPathMap: menuPathMap,
        iconMap: iconMap,
        titleMap: titleMap,
        permissionMap: permissionMap
      },
      name: item.routeUrl,
      children: []
    };
  },
  findRouteItem (routes, item) {
    let result = null;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].meta.routeFullPath == item.routeFullPath) {
        result = routes[i];
        break ;
      } else if (routes[i].children && routes[i].children.length > 0) {
        result = this.findRouteItem(routes[i].children, item);
      }
      if (result) {
        break;
      }
    }
    return result;
  },
  //子路由递归生成方法
  generateRoute(children, level, parentRouteItem) {
    let me = this;
    children.forEach(function (item) {
      let route = null;
      // 判断是否是带参数的路由组件，避免重复添加
      // if (item.routeFullPath == '/chg-budget/make') {
      //   console.log('参数路由……');
      // }
      if (item.param) {
        route = me.findRouteItem(me.routes, item);
      }
      if (route == null) {
        route = me.createRouteItem(item, '', false);
        parentRouteItem.children.push(route);
      } else {
        route.meta.menuPathMap[item.url] = item.menuPath;
        route.meta.iconMap[item.url] = item.icon;
        route.meta.titleMap[item.url] = item.name;
        route.meta.permissionMap[item.url] = item.permission;
      }

      if (item.children.length > 0 && level <= 5) {
        // 父节点
        me.generateRoute(item.children, level + 1, route);
      }
    });
  }
};
export default routerMap;
