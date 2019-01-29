const state = {
  vmMap: {}
};

const getters = {

};

export default {
  state: state,
  mutations: {
    setVmMap(state, payload) {
      if (state.vmMap[payload.path]) {
        state.vmMap[payload.path].push(payload.component);
      } else {
        state.vmMap[payload.path] = [payload.component];
      }
    }
  },
  actions: {},
  getters: getters
};
