<!--
 * @Date: 2022-08-26 17:18:14
 * @LastEditors: piplns piplns@163.com
 * @LastEditTime: 2024-04-18 16:56:31
 * @FilePath: /Workflow-Vue3/src/components/selectBox.vue
-->
<template>
  <ul class="select-box">
    <template v-for="(elem, i) in list" :key="i">
      <template v-if="elem.type === 'role'">
        <li v-for="item in elem.data" :key="item.roleId" class="check_box" :class="{active: elem.isActive && elem.isActive(item), not: elem.not}" @click="elem.change(item)">
          <a :title="item.description" :class="{active: elem.isActiveItem && elem.isActiveItem(item)}">
            <img src="@/assets/images/workflow/icon_role.png">{{item.roleName}}
          </a>
        </li>
      </template>
      <template v-if="elem.type === 'department'">
        <li v-for="item in elem.data" :key="item.id" class="check_box" :class="{not: !elem.isDepartment}">
          <a v-if="elem.isDepartment" :class="elem.isActive(item) && 'active'" @click="elem.change(item)">
            <img src="@/assets/images/workflow/icon_file.png">{{item.departmentName}}</a>
          <a v-else><img src="@/assets/images/workflow/icon_file.png">{{item.departmentName}}</a>
          <i @click="elem.next(item)">下级</i>
        </li>
      </template>
      <template v-if="elem.type === 'employee'">
        <li v-for="item in elem.data" :key="item.id" class="check_box">
          <a :class="elem.isActive(item) && 'active'" @click="elem.change(item)" :title="item.departmentNames">
            <img src="@/assets/images/workflow/icon_people.png">{{item.VNAME}}
          </a>
        </li>
      </template>
    </template>
  </ul>
</template>
<script setup>
defineProps({
  list: {
    type: Array,
    default: () => []
  }
})
</script>
<style lang="scss">
.select-box {
  height: 420px;
  // overflow-y: auto;
  list-style: none;
  li {
    position: relative;
    display: flex;
    align-items: center;
    list-style: none;
    line-height: 20px;
    margin-bottom: 5px;
    padding-left: 20px;
    i {
      float: right;
      padding-left: 24px;
      padding-right: 10px;
      color: #3195f8;
      font-size: 12px;
      cursor: pointer;
      background: url(~@/assets/images/workflow/next_level_active.png) no-repeat
        10px center;
      border-left: 1px solid rgb(238, 238, 238);
    }

    a {
      cursor: pointer;
      &::before {
        position: absolute;
        width: 14px;
        height: 14px;
        border: 1px solid #dcdfe6;
        border-radius: 2px;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        content: "";
      }
      &.active {
        &::after {
          background: url(/src/assets/images/workflow/check_box.png) no-repeat
            center;
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          top: 5px;
          left: 3px;
          content: "";
        }
      }
    }

    a.active + i {
      color: rgb(197, 197, 197);
      background-image: url(~@/assets/images/workflow/next_level.png);
      pointer-events: none;
    }

    img {
      width: 14px;
      vertical-align: middle;
      margin-right: 5px;
    }
  }
}
</style>