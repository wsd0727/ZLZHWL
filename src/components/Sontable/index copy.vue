<template>
    <div class="app-BBS">
        <HotTable ref="hotTableComponent" :settings="hotSettings" />
    </div>
</template>
  
<script setup>
import { defineComponent } from 'vue';


import { HotTable } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import Handsontable from 'handsontable'
import 'handsontable/dist/handsontable.full.css';
import 'handsontable/languages'// 语言设置



registerAllModules();
// const tableData = ref([
//     ['', 'Ford', 'Volvo', 'Toyota', 'Honda'],
//     ['2016', 10, 11, 12, 13],
//     ['2017', 20, 11, 14, 13],
//     ['2018', 30, 15, 12, 13]
// ])

const tableData = ref(
    [
        { zhidu: 'zhidu', shurukuang: 'Mercedes A 160', date: 2017, time: '', comesInBlack: 'yes', password: '', available: true, select: '' },
        { shurukuang: 'Mercedes A 160', date: 2017, time: '', comesInBlack: 'yes', password: '', available: false },


    ])

const hotSettings = ref({
    language: 'zh-CN', // 语言设置
    licenseKey: 'non-commercial-and-evaluation', // 隐藏版权文字
    width: 'auto', // 表格宽度
    height: '300', // 表格高度、设置以后才会出现scroll
    // data: Handsontable.helper.createSpreadsheetData(10, 26), // 列表初始化数据
    data: tableData.value, // 表格数据也可根据实际项目需要进行设置
    startRows: 1, // 初始化行数,无data属性时生效(该值小于minRows时,以minRows为准)
    startCols: 3, // 初始化列数,无data属性时生效(该值小于minCols时,以minCols为准)
    minRows: 1, // 最少行数(当初始化数据小于该值时,以该值为准)
    minCols: 3, // 最少列数(当初始化数据小于该值时,以该值为准)
    minSpareCols: 0, // 列的最小留白数
    minSpareRows: 0, // 行的最小留白数
    // colHeaders: true, // 是否展示列表头,默认是A,B,C等字母,可以['列1','列2']进行自定义展示
    // colHeaders: ['V', 'Ti（NTM）', 'Ti（ETM）'],// 自定义表格的表头
    colHeaders: ['只读', '文本', '密码', '日期', '时间', '多选', '下拉', '',],// 自定义表格的表头
    rowHeaders: true, // 是否展示行表头,默认是1,2,3等数据,可以['行1','行2']进行自定义展示
    colWidths: 150, // 列宽度
    dropdownMenu: false, // 表头展示下拉菜单,可以自定义展示
    className: 'htCenter', // 单元格文字对齐方式(htLeft,htRight,htCenter)
    currentRowClassName: 'my-selectRow', // 给选中行添加自定义class类名
    currentColClassName: 'my-selectCol', // 给选中列添加自定义class类名
    autoWrapRow: true, // 文字是否自动换行(当没有设置colWidths时生效)
    fixedRowsTop: 0, // 列表内容从上面开始,固定定位的行数(不包含行表头)
    fixedColumnsLeft: 1, // 列表内容从左面开始,固定定位的列数(不包含列表头)
    fillHandle: true, // 是否开启拖拽复制操作(true,false,'horizontal'水平复制,'vertical'垂直复制)
    contextMenu: {
        // 单元格右击展示菜单
        items: {
            row_above: {
                name: '上面插入一行'
            },
            row_below: {
                name: '下面插入一行'
            },
            col_left: {
                name: '左侧插入一列'
            },
            col_right: {
                name: '右侧插入一列'
            },
            remove_row: {
                name: '移除本行'
            },
            remove_col: {
                name: '移除本列'
            },
            alignment: {
                name: '对齐方式'
            },
            make_read_only: {
                name: '只读'
            },
            // 'borders':{
            //   name: '边框'
            // },
            copy: {
                name: '复制'
            },
            cut: {
                name: '剪切'
            },
            separator: Handsontable.plugins.ContextMenu.SEPARATOR,
            clear_custom: {
                name: '清空所有单元格数据',
                callback: function () {
                    this.clear()
                }
            }
        }
    },
    columns: [
        {
            readOnly: true,
            type: 'text',
            data: 'zhidu',
        },
        {
            type: 'text',
            data: 'shurukuang',
            // validator(val, callback) {
            // }
        },
        {
            type: 'password',
            data: 'password',
        },
        {
            type: 'date',
            data: 'date',
            // dateFormat: 'MM/DD/YYYY',
            dateFormat: 'YYYY-MM-DD',
            correctFormat: true,
            defaultDate: '01/01/1900',
            // datePicker additional options
            // (see https://github.com/dbushell/Pikaday#configuration)
            datePickerConfig: {
                // First day of the week (0: Sunday, 1: Monday, etc)
                firstDay: 0,
                showWeekNumber: true,
                disableDayFn(date) {
                    // Disable Sunday and Saturday
                    return date.getDay() === 0 || date.getDay() === 6;
                }
            }
        },
        {
            type: 'time',
            data: 'time',
            timeFormat: 'h:mm:ss a',
            correctFormat: true
        },
        {
            data: 'available',
            type: 'checkbox'
        },
        // {
        //     data:'select',
        //     editor: 'select',
        //     selectOptions: ['Kia', 'Nissan', 'Toyota', 'Honda']
        // },
        {
            data: 'select',
            type: 'dropdown',
            source: ['yellow', 'red', 'orange', 'green', 'blue', 'gray', 'black', 'white']
        }
    ]


})
onMounted(() => {
    hotSettings.value = Handsontable.helper.createSpreadsheetData(10, 26)
});

</script>
  
<style lang="scss" scoped></style>
  