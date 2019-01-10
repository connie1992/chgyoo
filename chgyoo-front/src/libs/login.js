import {getUserInfo} from '@/api/permission';
import store from '../store';
import {router} from '../router';
import routerMap from '../router/mapping';
import util from '@/libs/util';


const login = (userName) => {
  return new Promise(resolve => {
    store.commit('setUser', userName);
    getUserInfo(userName).then(res => {
      if (util.isSuccess(res)) {
        store.commit('setUserInfo', res.data.data);
        routerMap.generateRootRoute().then(data => {
          if (data !== false) {
            router.addRoutes(data);
            router.push({name: 'home'});
            resolve(true);
          } else {
            console.log('获取菜单失败');
            store.commit('setToken', '');
            resolve(false);
          }
        });
      } else {
        console.log('获取用户信息失败');
        store.commit('setToken', '');
        resolve(false);
      }
    });
  });

}

export default login;



