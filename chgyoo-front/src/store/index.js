/*
 * @Author: gaodachuan
 * @Date: 2018.7.12
 * @Last Modified by:
 * @Last Modified time:
 * @Usag: store类定义;
 */
import Vuex from 'vuex';
import Vue from 'vue';
import data from './modules/data.js';
import user from './modules/user.js';

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {

  },
  modules: {
    data,
    user
  }
});
