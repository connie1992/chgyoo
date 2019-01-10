import {findRoute} from '@/libs/tools';
const hasPermission = {
  install (Vue, options) {
    Vue.directive('haspermission', {
      bind (el, binding, vnode) {
        let routers = vnode.context.$store.state.user.routers;
        let permissions = findRoute(routers, vnode.context.$route.name);
        if (permissions && !permissions.includes(binding.value)) {
          let node = el.parentNode;
          node.removeChild(el);
        }
      }
    });
  }
};

export default hasPermission;
