import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const isDevelopment = process.env.NODE_ENV === 'development'

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  // 不通过mutation修改state时报错
  strict: isDevelopment,
  // 通过mutation修改state后在控制台输出相关信息
  plugins: isDevelopment ? [createLogger()] : []
})
