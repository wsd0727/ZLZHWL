<template>
  <div class="docs-wrap" v-if="docList.length">
    <div class="doc-item" v-for="item in docList" :key="item.BILLNO" @click="openDoc(item)">
      <fileIcon filename="folder" />
        <div class="doc-title text-ellipsis" >
            {{ item.DOCTITLE }}
        </div>
    </div>
    
  </div>
</template>

<script setup name="">
import { getVchartData } from "#/dashboard/index";
const router = useRouter();
const props = defineProps({
  height: Number,
  CFG: Object,
});

const docList = ref([]);
const PK_CLASS = inject("PK_CLASS");
const QueryJson = inject("QueryJson");

function getData() {
  let query = {
     ...QueryJson.value,
    BEGINDATE: "",
    ENDDATE: "",
  };
  getVchartData(props.CFG.url, query).then((res) => {
    docList.value = res.RESULT.RECORDS ;
  });
}

watch(PK_CLASS, val => {
  getData();
}, {
  immediate: true
})

watch(props.CFG , val => {
  if(val.refresh>1){
    getData();
  }
})


function openDoc(){
  router.push({ path: '/project/getProjectMenu/document' });
}

</script>

<style scoped lang="scss">
.docs-wrap{
    display: flex;
    flex-wrap: wrap;
    .doc-item{
        width: 25%;
        display: flex;
        flex-direction: column;
        cursor: pointer;
        text-align: center;
        margin-top: 20px;
        font-size: 12px;
        color: #333;
        .FileIcon{
            width: 30px;
            height: 30px;
            font-size: 30px;
        }
        &:hover .doc-title{
          color: var(--el-color-primary);
        }
        .doc-title{
          width: 100%;
        }
    }
}
</style>
