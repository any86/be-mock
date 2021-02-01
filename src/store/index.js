import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    rawJSON: '',
    JSON: void 0,

  },
  mutations: {
    changeRawJSON(state, rawJSON) {
      state.rawJSON = rawJSON;
    },

    changeJSON(state, JSON) {
      state.JSON = JSON;
    }
  }
});