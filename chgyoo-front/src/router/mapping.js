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
  generateRootRoute: function () {
    // 获取用户对应的权限信息
    return new Promise(resolve => {
      getUserMenu(store.getters.getUserInfo.id).then(res => {
        if (util.isSuccess(res)) {
          // 设置菜单
          store.commit('setMenu', res.data.data);
          //根据后台菜单和权限配置,动态增加路由
          let me = this;
          let routes = [];
          // 创建主页
          let mainRoute = {
            path: '/',
            name: '/',
            component: (resolve) => require(['../views/index.vue'], resolve),
            meta: {
              icon: ' iconfont icon-tubiao115',
            },
            children: [
              homeRoute
            ]
          };
          routes.push(mainRoute);
          res.data.data.forEach(function (item) {
            let haveChild = item.children && item.children.length > 0;
            let parentRouteItem = null;
            if (haveChild) {
              parentRouteItem = {
                path: '/' + util.splitRoute(item.routeUrl),
                meta: {
                  title: item.name,
                  icon: item.icon,
                },
                name: item.routeUrl,
                component: routerMap.Index,
                children: []
              };
              parentRouteItem = me.generateRoute(item.children, 1, parentRouteItem);
              routes.push(parentRouteItem);
            } else {
              mainRoute.children.push(
                {
                  path: util.splitRoute(item.routeUrl),
                  component: resolve => require([`../views/${item.pagePath}.vue`], resolve),
                  meta: {
                    icon: item.icon,
                    title: item.name,
                    permission: item.permission
                  },
                  name: item.routeUrl
                }
              );
            }
          });
          console.log('----------------自定义配置的路由为 : ------------------');
          console.log(routes);
          store.commit('setRouteFlag', true);
          store.commit('setRouters', routes);
          resolve(routes);
        } else {
          resolve(false);
        }
      });
    });
  },

  //子路由递归生成方法
  generateRoute(children, level, parentRouteItem) {
    if (level > 5) {
      return null;
    }
    else {
      let me = this;
      children.forEach(function (item) {
        let route = {
          path: util.splitRoute(item.routeUrl),
          meta: {
            title: item.name,
            icon: item.icon,
            permission: item.permission
          },
          name: item.routeUrl,
          children: [],
          component: resolve => require([`../views/${item.pagePath}.vue`], resolve)
        };
        if (item.children.length > 0) {
          // 叶子节点
          route = me.generateRoute(item.children, level + 1, route);
        }
        parentRouteItem.children.push(route);
      });
      return parentRouteItem;
    }
  }
};
export default routerMap;
