import {findRoute} from '@/libs/tools';

const checkPermission = (vnode, value, el) => {
  let routers = vnode.context.$store.state.user.routers;
  let route = vnode.context.$route;
  let permissions = findRoute(routers, route.name,  route.path);
  // 判断是否是可复用界面
  if (permissions && !permissions.includes(value)) {
    el.style.display = 'none';
  } else {
    el.style.display = 'inline-block  ';
  }
};

const hasPermission = {
  install (Vue, options) {
    Vue.directive('haspermission', {
      bind (el, binding, vnode) {
        // 判断是否是可复用界面
        let arr = binding.value.split(';');
        if (arr[1] || arr.length == 1) {
          console.log(`自定义指令 bind……${binding.value}`);
          checkPermission(vnode, arr[0], el);
        }
      },
      update (el, binding, vnode) {
        // 判断是否是可复用界面
        if (binding.value.indexOf(';') > 0 && binding.value != binding.oldValue) {
          console.log(`自定义指令 update……${binding.value}  --- ${binding.oldValue}---`);
          checkPermission(vnode, binding.value.substring(0, binding.value.indexOf(';')), el);
        }
      }
    });
  }
};

export default hasPermission;
