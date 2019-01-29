import Vue from 'vue';
import iView from 'iview';
import i18n from './locale';
import auth from './libs/auth';
import config from './config/config';
import {router} from './router/index';
import {postRequest, getRequest, putRequest, uploadFileRequest} from './api/config';
import store from './store/index.js';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import './assets/iconfont/iconfont.css';
import './assets/iconfont/iconfont.js';
import './mock';
import './styles/common.less';
import hasPermission from './directive/hasPermission';
// treegrid
import ZkTable from 'vue-table-with-tree-grid-icon';
// 彩色图标
import SvgIcon from './components/svgIcon/index';
// 带彩色图标按钮
import SvgIconBtn from './components/svgIconBtn/index';
// 工具条
import Toolbar from './components/toolbar/index';
// 表格组件封装，带页码等
import Tables from './components/tables/index';
// modal封装
import EditModal from '@/components/modals/editModal/index';
// 删除modal
import DeleteModal from '@/components/modals/delete/index';

import util from '@/libs/util';
Vue.use(hasPermission);
Vue.use(ZkTable);
Vue.use(SvgIcon);
Vue.use(SvgIconBtn);
Vue.use(Toolbar);
Vue.use(Tables);
Vue.use(EditModal);
Vue.use(DeleteModal);

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
});

//定义全局变量
Vue.prototype.$post = postRequest;
Vue.prototype.$fetch = getRequest;
Vue.prototype.$put = putRequest;
Vue.prototype.$upload = uploadFileRequest;
Vue.prototype.$config = config;
Vue.prototype.$Auth = auth;
Vue.prototype.$util = util;
Vue.prototype.$isSuccess = util.isSuccess;

// 全局设置message的配置，如果只需要使用范围在组件内部的话，可以在组件内的mounted方法设置
Vue.prototype.$Message.config({
  top: 200,
  duration: 2
});

Date.prototype.Format = function(fmt)
{ //author: meizz
  let o = {
    'M+' : this.getMonth()+1,                 //月份
    'd+' : this.getDate(),                    //日
    'h+' : this.getHours(),                   //小时
    'm+' : this.getMinutes(),                 //分
    's+' : this.getSeconds(),                 //秒
    'q+' : Math.floor((this.getMonth()+3)/3), //季度
    'S'  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+'').substr(4 - RegExp.$1.length));
  for(let k in o)
    if(new RegExp('('+ k +')').test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (('00'+ o[k]).substr((''+ o[k]).length)));
  return fmt;
};

new Vue({
  el: '#app',
  router: router,
  i18n,
  store: store,
  render: h => h(App)
});
