import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const createTPL = () => (
    {
        state() {
            return {
                rawJSON: '',
                JSON: void 0,
            }
        },
        mutations: {
            changeRawJSON(state, rawJSON) {
                state.rawJSON = rawJSON;
            },

            changeJSON(state, JSON) {
                state.JSON = JSON;
            }
        }
    }
)

export default new Vuex.Store({
    modules: {
        header: createTPL(),
        request: createTPL(),
        respond: createTPL(),
    }
});