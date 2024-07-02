<template>
  <div class="val_table">
    <vxe-table ref="xTableRef" v-bind="attrs" class="mytable-scrollbar" :data="data" size="mini" width="100%" :edit-rules="rules" :span-method="mergeRowFn?mergeRowFn:mergeRowMethod" :min-height="minHeight" :height="height" stripe round :row-config="{ isCurrent: true, isHover: true, useKey: true}" :column-config="{resizable: true}" @radio-change="radioChangeEvent" :checkbox-config="{trigger:'row',...attrs['checkbox-config']}" @checkbox-change="checkboxChange" @checkbox-all="checkboxAllChange">
      <vxe-column width="50" field="drag" align="center" v-if="hasDragRow" fixed="left">
        <template #default>
          <div class="drag-btn">
            <i class="vxe-icon-sort"></i>
          </div>
        </template>
      </vxe-column>
      <!-- <vxe-column width="50" field="drag" align="center" fixed="left">
        <template #default>
          <div class="drag-btn">
            <i class="vxe-icon-sort"></i>
          </div>
        </template>
      </vxe-column> -->
      <slot />
      <template #empty>
        <el-empty description="没有更多数据了！" :image-size="100"  />
      </template>
    </vxe-table>
  </div>
</template>

<script>
export default {
  name: 'miniTable',
  inheritAttrs: false
}
</script>
<script setup name="miniTable">
import Sortable from 'sortablejs'

const attrs = useAttrs()
const props = defineProps({
  data: Array,
  height: {
    type: [Number, String],
    default: ""
  },
  minHeight: {
    type: [Number, String],
    default: ""
  },
  rules: {
    type: Object,
    default: {}
  },
  mergeRow: {
    type: Array,
    default: []
  },
  hasDragRow: {
    type: Boolean,
    default: false
  },
  mergeRowFn: {
    type: Function,
    default: null
  }
})
const Init = ref(null)
const emit = defineEmits(['change', 'dragRow'])
const xTableRef = ref(null)
const radioChangeEvent = val => {
  emit('change', val)
}
/** 复选事件 */
const checkboxChange = val => {
  let { checked, row, rowIndex } = val
  let selectRecords = xTableRef.value.getCheckboxRecords();
  emit('change', {
    selectRow: selectRecords,
    row,
    rowIndex,
    checked,
    isFull: false
  })
}
/** 全选事件  */
const checkboxAllChange = val => {
  let { checked } = val
  let selectRecords = xTableRef.value.getCheckboxRecords();
  emit('change', {
    selectRow: selectRecords,
    checked,
    isFull: true
  })
}
/** 列合并 */
const mergeRowMethod = ({ row, _rowIndex, column, visibleData }) => {
  if (!props.mergeRow) return
  const fields = props.mergeRow
  const cellValue = row[column.field]
  if (cellValue && fields.includes(column.field)) {
    const prevRow = visibleData[_rowIndex - 1]
    let nextRow = visibleData[_rowIndex + 1]
    if (prevRow && prevRow[column.field] === cellValue) {
      return { rowspan: 0, colspan: 0 }
    } else {
      let countRowspan = 1
      while (nextRow && nextRow[column.field] === cellValue) {
        nextRow = visibleData[++countRowspan + _rowIndex]
      }
      if (countRowspan > 1) {
        return { rowspan: countRowspan, colspan: 1 }
      }
    }
  }
}

/** 拖拽功能 */
let sortable1
const rowDrop = () => {
  const $table = xTableRef.value
  sortable1 = new Sortable.create($table.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
    handle: '.drag-btn',
    onEnd: (sortableEvent) => {
      console.log("🚀 ~ file: mini.vue:113 ~ sortable1=newSortable.create ~ sortableEvent:", sortableEvent)
      const newIndex = sortableEvent.newIndex
      const oldIndex = sortableEvent.oldIndex
      const currRow = props.data.splice(oldIndex, 1)[0]
      props.data.splice(newIndex, 0, currRow)
      emit("dragRow", {
        row: currRow,
        oldIndex,
        newIndex,
      });
    }
  })
}
let initTime
nextTick(() => {
  // 加载完成之后在绑定拖动事件
  initTime = setTimeout(() => {
    rowDrop()
  }, 300)
})
onUnmounted(() => {
  clearTimeout(initTime)
  if (sortable1) {
    sortable1.destroy()
  }
})

defineExpose({ xTable: xTableRef });
</script>
<style lang="scss" scoped>
:deep(.vxe-table--render-default .vxe-header--column:not(.col--ellipsis)) {
  padding: 5px 0 !important;
}
.drag-btn {
  width: 100%;
  height: 100%;
  cursor: move;
  font-size: 14px;
  color: #000;
  i {
    font-weight: bold;
  }
}
.vxe-body--row.sortable-ghost,
.vxe-body--row.sortable-chosen {
  background-color: #f5f8dd;
}
</style>