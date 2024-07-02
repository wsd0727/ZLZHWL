/*
 * @Date: 2022-08-25 15:35:18
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2022-09-21 14:37:04
 * @FilePath: /Workflow-Vue3/src/plugins/lib.js
 */
import { computed } from 'vue'
import useWorkFlowStore from "@/store/modules/workflow";
const workFlowStore = useWorkFlowStore();

const mapState = () => {
  return Object.fromEntries(
    Object.keys(workFlowStore.state).map(
      key => [key, computed(() => workFlowStore.state[key])]
    )
  )
}

const mapGetters = () => {
  return Object.fromEntries(
    Object.keys(workFlowStore.getters).map(
      getter => [getter, computed(() => workFlowStore.getters[getter])]
    )
  )
}

const mapMutations = () => {
  return Object.fromEntries(
    Object.keys(workFlowStore._mutations).map(
      mutation => [mutation, value => workFlowStore.commit(mutation, value)]
    )
  )
}

const mapActions = () => {
  return Object.fromEntries(
    Object.keys(workFlowStore._actions).map(
      action => [action, value => workFlowStore.dispatch(action, value)]
    )
  )
}

export { mapState, mapGetters, mapMutations, mapActions }