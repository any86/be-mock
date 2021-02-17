import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state() {
        return {
            activeProject: {},
        }
    },
    mutations: {
        setActiveProject(state, project) {
            state.activeProject = project;
        },
    }
});