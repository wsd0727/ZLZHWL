<!--
 * @Date: 2022-08-26 16:29:24
 * @LastEditors: piplns piplns@163.com
 * @LastEditTime: 2024-04-18 16:27:03
 * @FilePath: /Workflow-Vue3/src/components/selectResult.vue
-->
<template>
  <div class="select-result l">
    <p class="clear">已选（{{total}}）
      <a @click="emits('del')">清空</a>
    </p>
    <ul>
      <template v-for="({type, data, cancel}) in list" :key="type">
        <template v-if="type === 'role'">
          <li v-for="item in data" :key="item.roleId">
            <img src="@/assets/images/workflow/icon_role.png">
            <span>{{item.roleName}}</span>
            <img src="@/assets/images/workflow/cancel.png" @click="cancel(item)">
          </li>
        </template>
        <template v-if="type === 'department'">
          <li v-for="item in data" :key="item.id">
            <img src="@/assets/images/workflow/icon_file.png">
            <span>{{item.departmentName}}</span>
            <img src="@/assets/images/workflow/cancel.png" @click="cancel(item)">
          </li>
        </template>
        <li v-for="item in data" :key="item.id">
          <img src="@/assets/images/workflow/icon_people.png">
          <span>{{item.VNAME}}</span>
          <img src="@/assets/images/workflow/cancel.png" @click="cancel(item)">
        </li>
      </template>
    </ul>
  </div>
</template>
<script setup>
defineProps({
  total: {
    type: Number,
    default: 0
  },
  list: {
    type: Array,
    default: () => [{ type: 'role', data, cancel }]
  }
})
let emits = defineEmits(['del'])
</script>

<style lang="scss">
.select-result {
  width: 276px;
  height: 100%;
  font-size: 12px;
  p {
    display: block;
    height: 32px;
    margin: 0;
    line-height: 32px;
  }

  ul {
    width: 100%;
    height: 460px;
    overflow-y: auto;
    margin: 0;
    padding: 10px;

    li {
      list-style: none;
      line-height: 20px;
      margin-bottom: 5px;
      padding-left: 10px;

      span {
        vertical-align: middle;
      }

      img {
        &:first-of-type {
          width: 14px;
          vertical-align: middle;
          margin-right: 5px;
        }

        &:last-of-type {
          float: right;
          margin-top: 2px;
          width: 14px;
        }
      }
    }
  }

  p {
    padding-left: 19px;
    padding-right: 20px;
    line-height: 37px;
    border-bottom: 1px solid #f2f2f2;

    a {
      float: right;
    }
  }
}
</style>