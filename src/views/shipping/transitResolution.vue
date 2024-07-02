<!-- 中转拆分 -->
<template>
    <teleport to="#custemPageBtn">
        <el-button type="primary" size="default" @click="saveData" :loading="pageLoading">保存</el-button>
    </teleport>
    <div class="transitResolution">
        <!-- <Form class="query-form" ref="formRefTop" label-width="50px" v-model:formData="formConfig.formValue"
            :formConfig="formConfig.formColumns" inline @select="formSelect" @enter="queryEvent" /> -->
        <MasterForm ref="MasterFormRef1" v-model:formData="formConfig.formValue" :formConfig="formConfig.formColumns"
            :formRules="formConfig.formRules" :tableConfig="[]" :infoConfig="[]" :showHistory="false"
            @select="mainSelect" />
        <formGroup ref="formGroupRef" class="group" title="拆分信息" v-model:visable="formOpen">
            <div>
                <el-card v-for="(item, index) in dataList" :key="index">
                    <template #header>
                        <div class="card-header">
                            <span>拆分单{{ index + 1 }}</span>
                            <el-icon v-if="dataList.length > 1" @click="clickDel(index)">
                                <Close />
                            </el-icon>
                        </div>
                    </template>

                    <MasterForm ref="MasterFormRef2" v-model:formData="dataList[index]"
                        :formConfig="resolutionConfig.formColumns" :formRules="resolutionConfig.formRules"
                        :tableConfig="tableConfig" />


                </el-card>

            </div>

            <div class="addBtn">
                <el-button type="primary" size="large" @click="clickAdd">添加</el-button>

            </div>

        </formGroup>

    </div>
</template>

<script setup>
import Form from "@/components/Form";
import formGroup from "@/components/Form/formGroup"
import miniTable from "@/components/Tables/mini"
import { Search } from "@element-plus/icons-vue";
import TextOverflow from "@/components/TextOverflow"
import { getPageConfig, getTableData, axiosSave } from "@/api/system/page";
import MasterForm from "@/components/MasterForm";
import Etable from "@/components/Tables/edit";

import {
    getFormValue,
    deepClone,
    getShowCFG,
    getFormRule,
    getUrlParams,
} from "@/utils/index";

const props = defineProps({
    currentData: Array,
    config: Object
})
const emits = defineEmits(['close'])

const BILLNO = computed(() => props.currentData[0].BILLNO || "")

console.log(props)

const { proxy } = getCurrentInstance();
const formGroupRef = ref(null)
//   const tableRef = ref(null)
//   const listHeight = ref(0)
//   const miniTableHeight = ref(200)
//   const PZHeight = ref(300)
const pageLoading = ref(false)
const formOpen = ref(true)
const dataList = ref([])

const MasterFormRef1 = ref(null)
const MasterFormRef2 = ref(null)
// watch(dataList, (val) => {
//     console.log("🚀 ~ watch ~ val:", val)

// }, {
//     immediate: true
// })

watch(dataList, newArr => {

    if (!newArr.length) return
    let allArr = []
    newArr.forEach((item, index) => {
        let numArr = []
        if (newArr[index].SUBLIST.length) {
            newArr[index].SUBLIST.forEach((items, indexs) => {
                if (resolutionConfig.formBase.SUBLIST[indexs].BILLNO == newArr[index].SUBLIST[indexs].BILLNO) {
                    let num = 0
                    num += newArr[index].SUBLIST[indexs].CHANGENUM || 0
                    numArr[indexs] = num
                }
            })
            console.log(numArr)
        }
        allArr[index] = numArr
    })
    let sumArray = [];
    for (let i = 0; i < allArr[0].length; i++) {
        let sum = 0;
        for (let j = 0; j < allArr.length; j++) {
            sum += allArr[j][i];
        }
        sumArray.push(sum);
    }


    sumArray.forEach((item, index) => {
        console.log("🚀 ~ sumArray.forEach ~ item:", item)
        dataList.value.forEach((items, indexs) => {
            // items.SUBLIST[index].REMAINSPLITAMOUNT = resolutionConfig.formBase.SUBLIST[index].REMAINSPLITAMOUNT - (items.SUBLIST[index].CHANGENUM || 0)
            items.SUBLIST[index].REMAINSPLITAMOUNT = resolutionConfig.formBase.SUBLIST[index].REMAINSPLITAMOUNT - (item || 0)
        })
    })



}, {
    deep: true
})

// 上面的
const formConfig = reactive({
    formBase: {}, // 表单源数据
    formValue: {}, // form数据
    formColumns: [], // form配置(已过滤显示)
    formRules: {}, // form验证
    formType: "", // DTL ADD
    buttonList: [], // 表单中的按钮
    showDetail: false, // 是否显示表单 ， 初始时不显示，详情数据查询后显示
});

// 拆分信息的表单
const resolutionConfig = reactive({
    formBase: {}, // 表单源数据
    formValue: {}, // form数据
    formColumns: [], // form配置(已过滤显示)
    formRules: {}, // form验证
    formType: "", // DTL ADD
    buttonList: [], // 表单中的按钮
    showDetail: false, // 是否显示表单 ， 初始时不显示，详情数据查询后显示
});

const tableConfig = ref([]);
const tableCFG = reactive({
    tableColumns: [],
    allColumns: [],
    hasTableTools: true, // 是否有操作栏
    hasSeq: false, // 是否显示序号
    hasCheck: false, // 是否需要多选图标
    hasDragRow: false, // 是否支持 拖拽
    toolsConfig: [],
    expandID: "",
    loading: false,
    hasFill: false, // 表格补位
    hasEmpty: false,
    height: 100,
    rowClassEval: "", // 行加背景色的条件
    mergeCFG: null, // 表尾合计的配置  字段
    mergeRowField: [], // 需要合并的字段
    treeID: null, // 树形表格 的可展开的节点id
    SelectType: null,
    // tableButtons: ["EDIT", "DELETE"],
    tableButtons: ["EDIT"],
    EtableRules: {},
    //   cellHeight: storeSettings.value.rowHeight, // 单元格的行高
    isHeaderFilter: false, // 是否启用头部过滤
    headerConfig: [], // 配置的查询条件
    queryJson: {}, // 查询条件
});

onMounted(() => {
    getPageCFG();
});



const mainSelect = (val) => {
    resolutionConfig.formBase = deepClone(val.data)
    dataList.value.forEach(ele => {
        for (let key in ele) {
            ele[key] = val.data[key]
        }
    });
}

const clickAdd = () => {
    // dataList.value.push(resolutionConfig.formBase)

    let obj = deepClone(dataList.value[dataList.value.length - 1])
    // console.log(arr)
    obj.SUBLIST.forEach((item, index) => {
        console.log(item.REMAINSPLITAMOUNT)
        // item.CHANGENUM = null
        item.CHANGENUM = 0
    })
    dataList.value.push(obj)
}
const clickDel = (index) => {
    dataList.value.splice(index, 1)
}

const saveData = () => {
    MasterFormRef1.value.submitForm().then(valid => {
        MasterFormRef2.value[0].submitForm().then(valid => {

            let flagArr = false
            dataList.value.forEach((items, indexs) => {
                flagArr = items.SUBLIST.filter(ele => ele.REMAINSPLITAMOUNT < 0)
            })
            if (flagArr.length) {
                return ElMessage.error('分配量不可超出可分配量～')

            }
            let INNERVOLIST = dataList.value.map(ele => {
                return {
                    ...ele,
                    DTLVOLIST: ele.SUBLIST
                }
            })
            let portData = {
                ...formConfig.formValue,
                INNERVOLIST,
            }

            getTableData("oms/shipOrder/splitOrder", portData).then((res) => {
                ElMessage({
                    message: "保存成功",
                    type: "success",
                });
                emits("close")
            });

        })
    })

}

function getPageCFG() {
    let ids = props.config.OTHER.split(',')

    let pageID = {
        APPID: "",
        DATA: {},
        KEY: "",
        MODULEID: ids[0],
        PAGEID: ids[1],
        VERSION: "",
    };

    getPageConfig(pageID).then((res) => {
        console.log("🚀 ~ getPageConfig ~ res:", res)
        const { COLUMNS, SUBTABLE, SLOTCFG } =
            res.RESULT;

        formConfig.formColumns = COLUMNS;
        // formConfig.formBase = getFormValue(COLUMNS);
        // formConfig.formValue = JSON.parse(JSON.stringify(formConfig.formBase));
        formConfig.formValue = JSON.parse(JSON.stringify(props.currentData[0]))
        console.log("🚀 ~ getPageConfig ~ formConfig.formValue:", formConfig.formValue)
        formConfig.formRules = getFormRule(COLUMNS);

        resolutionConfig.formColumns = [...SUBTABLE[0].QUERY,
        { FIELD: "SUBLIST", LABEL: "子表", COL: 24, CONTROLS: "subTable", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, }
        ]
        resolutionConfig.formBase = getFormValue(resolutionConfig.formColumns);
        resolutionConfig.formValue = JSON.parse(JSON.stringify(resolutionConfig.formBase));
        resolutionConfig.formRules = getFormRule(resolutionConfig.formColumns);

        // dataList.value = [deepClone(resolutionConfig.formBase)]
        dataList.value = [deepClone(resolutionConfig.formBase)]


        // tableCFG.tableColumns = getShowCFG(SUBTABLE[0].COLUMNS)
        // tableCFG.allColumns = SUBTABLE[0].COLUMNS
        // tableConfig.tableData = [{}]
        // tableConfig.EtableRules = getFormRule(SUBTABLE[0].COLUMNS)

        tableConfig.value = [{
            _rowConfig: { FIELD: "SUBLIST", LABEL: "子表", COL: 24, CONTROLS: "subTable", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
            FIELD: "SUBLIST",
            BUTTON: [{ ACTION: "EDIT" }],
            COLUMNS: SUBTABLE[0].COLUMNS,

        }]

    });
}


</script>
<style lang="scss" scoped>
.transitResolution {
    background-color: #fff;
    padding: 20px;
}

.addBtn {
    text-align: center;
    margin-top: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
}
</style>