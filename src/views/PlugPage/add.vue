<template>
  <div class="zt-Tracking">
    <el-scrollbar class="leftContent">
      <div class="contentBor">
        <div class="QueryClass">
          <el-input v-model="input3" size="default" :prefix-icon="Search" placeholder="搜索" class="input-with-select">
          </el-input>
        </div>
        <div class="treeContent">
          <el-tree :data="Treedata" :props="{ label: 'LABEL', children: 'CHILDREN' }" class="global-left" default-expand-all node-key="VALUE" @node-click="handleNodeClick" />
        </div>
      </div>
    </el-scrollbar>
    <el-scrollbar class="rightContent">
      <div class="top">
        <div class="avatarClass">
          <el-avatar shape="square" :size="80" src="http://116.63.138.118:8072/group1/M00/00/0E/wKgB12RUzdaAESFmAAAYbmSuXOs399.png" />
          <div class="titleCLass">
            <p>{{AddText}}</p>
            <p class="blueText">旗舰版</p>
            <div class="grayClass">产品研发全流程管理</div>
            <el-button class="btnClass" type="primary" size="large" round>安装</el-button>
          </div>
          <div class="list">
            <p>
              <span class="title">发布者：</span>
              <span class="name">张逸飞</span>
            </p>
            <p>
              <span class="title">所属模块：</span>
              <span class="name">订单</span>
            </p>
            <!-- <p>
              <span class="title">适用人群：</span>
              <span class="name">开发人员，产品经理</span>
            </p> -->
          </div>
        </div>
      </div>
      <div class="content">
        <p>简介</p>
        <span>使用此模版，你可以非常容易的开始执行一次敏捷迭代，在看板视图中，可以清楚的看到每一个任务卡片或用户故事的重要信息，如所属迭代、Story Points 等，在甘特图中你可以规划迭代中每个任务的起止时间和依赖关系。

          此模板主要帮助软件研发团队实践敏捷开发协作流程，不管是大家熟知的 Scrum 还是其它敏捷方案都可以通过调整本模板来实现。

          1.研发经理可以方便地记录和安排迭代任务，也可以结构化地标记出这些迭代任务的所属迭代版本、优先级、Story Points 等关键信息。

          2.研发工程师在开发过程中，也能随时更新迭代任务的完成进度，让研发经理能细粒度的了解研发迭代安排的进展情况。

          通过使用敏捷研发项目来实践敏捷开发协作流程，可有效提高研发团队的效率与质量，显著加速产品迭代过程。</span>
      </div>
      <div class="bottom">
        <p>功能描述</p>
        <!-- <img src="../../assets/img/1.png" alt=""> -->
        <!--<img src="https://gw.alicdn.com/imgextra/i4/O1CN01luau8e21cneec19fk_!!6000000007006-2-tps-512-342.png" alt="">
        <img src="https://gw.alicdn.com/imgextra/i4/O1CN018jD7jw1yTgvLbiDOZ_!!6000000006580-2-tps-512-342.png" alt="">
        <img src="https://gw.alicdn.com/imgextra/i4/O1CN0172AQEx22FGuhO6Eah_!!6000000007090-2-tps-512-342.png" alt=""> -->
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import { MoreFilled } from '@element-plus/icons-vue'
const AddText = ref('需求管理');
const Url = ref('')
const Treedata = ref([
  {
    "VALUE": "运输需求",
    "LABEL": "运输需求",
    "CODE": null,
    "PK_PARENT": "0",
    "SORTCODE": null,
    "CHILDREN": [
      {
        "VALUE": "需求管理",
        "LABEL": "需求管理",
        "CODE": null,
        "PK_PARENT": "顺顺冶金股份有限公司",
        "SORTCODE": null,
        "CHILDREN": []
      },
      {
        "VALUE": "需求处理",
        "LABEL": "需求处理",
        "CODE": null,
        "PK_PARENT": "顺顺冶金股份有限公司",
        "SORTCODE": null,
        "CHILDREN": []
      }
    ]
  },
  {
    "VALUE": "车检考试",
    "LABEL": "车检考试",
    "CODE": null,
    "PK_PARENT": "0",
    "SORTCODE": null,
    "CHILDREN": [
      {
        "VALUE": "车检管理",
        "LABEL": "车检管理",
        "CODE": null,
        "PK_PARENT": "沁新集团股份有限公司",
        "SORTCODE": null,
        "CHILDREN": []
      },
      {
        "VALUE": "车检记录",
        "LABEL": "车检记录",
        "CODE": null,
        "PK_PARENT": "沁新集团股份有限公司",
        "SORTCODE": null,
        "CHILDREN": []
      },
      {
        "VALUE": "考试题目管理",
        "LABEL": "考试题目管理",
        "CODE": null,
        "PK_PARENT": "沁新集团股份有限公司",
        "SORTCODE": null,
        "CHILDREN": []
      },
      {
        "VALUE": "司机考试答题",
        "LABEL": "司机考试答题",
        "CODE": null,
        "PK_PARENT": "沁新集团股份有限公司",
        "SORTCODE": null,
        "CHILDREN": []
      },
      {
        "VALUE": "考试完成处理",
        "LABEL": "考试完成处理",
        "CODE": null,
        "PK_PARENT": "沁新集团股份有限公司",
        "SORTCODE": null,
        "CHILDREN": []
      },
    ]
  },
  {
    "VALUE": "入厂叫号",
    "LABEL": "入厂叫号",
    "CODE": null,
    "PK_PARENT": "0",
    "SORTCODE": null,
    "CHILDREN": [
      {
        "VALUE": "短信叫号",
        "LABEL": "短信叫号",
        "CODE": null,
        "PK_PARENT": "测试4股份有限公司",
        "SORTCODE": null,
        "CHILDREN": []
      },
      {
        "VALUE": "LED播报",
        "LABEL": "LED播报",
        "CODE": null,
        "PK_PARENT": "测试4股份有限公司",
        "SORTCODE": null,
        "CHILDREN": []
      },
      {
        "VALUE": "公众号推送",
        "LABEL": "公众号推送",
        "CODE": null,
        "PK_PARENT": "测试4股份有限公司",
        "SORTCODE": null,
        "CHILDREN": []
      },
      {
        "VALUE": "站内消息推送",
        "LABEL": "站内消息推送",
        "CODE": null,
        "PK_PARENT": "测试4股份有限公司",
        "SORTCODE": null,
        "CHILDREN": []
      }
    ]
  },
  {
    "VALUE": "路线指引",
    "LABEL": "路线指引",
    "CODE": null,
    "PK_PARENT": "0",
    "SORTCODE": null,
    "CHILDREN": [
      {
        "VALUE": "厂内路线图维护",
        "LABEL": "厂内路线图维护",
        "CODE": null,
        "PK_PARENT": "太原易思软件技术有限公司",
        "SORTCODE": null,
        "CHILDREN": []
      },
      {
        "VALUE": "线路推送",
        "LABEL": "线路推送",
        "CODE": null,
        "PK_PARENT": "太原易思软件技术有限公司",
        "SORTCODE": null,
        "CHILDREN": []
      },
      {
        "VALUE": "厂内地图绘制",
        "LABEL": "厂内地图绘制",
        "CODE": null,
        "PK_PARENT": "太原易思软件技术有限公司",
        "SORTCODE": null,
        "CHILDREN": []
      },
      {
        "VALUE": "厂内路线规划",
        "LABEL": "厂内路线规划",
        "CODE": null,
        "PK_PARENT": "太原易思软件技术有限公司",
        "SORTCODE": null,
        "CHILDREN": []
      },
      {
        "VALUE": "厂内路线绘制",
        "LABEL": "厂内路线绘制",
        "CODE": null,
        "PK_PARENT": "太原易思软件技术有限公司",
        "SORTCODE": null,
        "CHILDREN": []
      }
    ]
  },
  {
    "VALUE": "罚款处理",
    "LABEL": "罚款处理",
    "CODE": null,
    "PK_PARENT": "0",
    "SORTCODE": null,
    "CHILDREN": [
      {
        "VALUE": "厂内违规行驶罚款",
        "LABEL": "厂内违规行驶罚款",
        "CODE": null,
        "PK_PARENT": "test-客商AAAA",
        "SORTCODE": null,
        "CHILDREN": []
      },
      {
        "VALUE": "厂内超速罚款",
        "LABEL": "厂内超速罚款",
        "CODE": null,
        "PK_PARENT": "test-客商AAAA",
        "SORTCODE": null,
        "CHILDREN": []
      },
      {
        "VALUE": "罚款缴费",
        "LABEL": "罚款缴费",
        "CODE": null,
        "PK_PARENT": "test-客商AAAA",
        "SORTCODE": null,
        "CHILDREN": []
      },
      {
        "VALUE": "微信支付对接",
        "LABEL": "微信支付对接",
        "CODE": null,
        "PK_PARENT": "test-客商AAAA",
        "SORTCODE": null,
        "CHILDREN": []
      }
    ]
  },
  {
    "VALUE": "支付管理",
    "LABEL": "支付管理",
    "CODE": null,
    "PK_PARENT": "0",
    "SORTCODE": null,
    "CHILDREN": [
      {
        "VALUE": "支付申请",
        "LABEL": "支付申请",
        "CODE": null,
        "PK_PARENT": "万金油造纸厂",
        "SORTCODE": null,
        "CHILDREN": []
      },
      {
        "VALUE": "支付审批",
        "LABEL": "支付审批",
        "CODE": null,
        "PK_PARENT": "万金油造纸厂",
        "SORTCODE": null,
        "CHILDREN": []
      },
      {
        "VALUE": "支付结果同步",
        "LABEL": "支付结果同步",
        "CODE": null,
        "PK_PARENT": "万金油造纸厂",
        "SORTCODE": null,
        "CHILDREN": []
      },
    ]
  }
]);
function handleNodeClick(node) {
  AddText.value = node.LABEL;
  console.log(AddText);
}
</script>

<style lang="scss">
.zt-Tracking {
  width: 100%;
  background: #dee1e6;
  margin: 0;
  padding: 0;
  .leftContent {
    padding: 10px;
    box-sizing: border-box;
    background: #fff;
    // display: inline-block;
    float: left;
    width: 20%;
    height: calc(100vh - 85px);
    .QueryClass {
      .input-with-select {
        border-radius: 10px;
        color: rgba(0, 0, 0, 0.04);
      }
    }
    .treeContent {
      margin-top: 15px;
    }
  }
  .rightContent {
    background: #fff;
    // display: inline-block;
    float: left;
    width: 79%;
    margin-left: 10px;
    height: calc(100vh - 85px);
    .top {
      margin-top: 10px;
      border-bottom: var(--XDS_line_light_color, #f0f0f0) 1px solid;
      .avatarClass {
        margin: 30px 10px 0px 20px;
        .titleCLass {
          display: inline-block;
          width: 90%;
          position: relative;
          top: -50px;
          p {
            font-size: 24px;
            display: inline-block;
            margin-left: 20px;
          }
          .blueText {
            color: blue;
            font-size: 12px;
            display: inline-block;
            margin: 0;
            margin-left: 2px;
          }
          .grayClass {
            display: inline-block;
            position: absolute;
            left: 20px;
            bottom: -10px;
            color: var(--XDS_level3_base_color, #8c8c8c);
          }
          .btnClass {
            float: right;
          }
        }

        .list {
          height: 30px;
          display: flex;
          justify-content: center;
          position: relative;
          top: -30px;
          p {
            display: inline-block;
            margin: 30px;
            .title {
              font-size: 14px;
              color: var(--XDS_level3_base_color, #8c8c8c);
            }
            .name {
              font-size: 14px;
            }
          }
        }
      }
    }
    .content {
      position: relative;
      left: 10px;
      p {
        font-weight: 500;
        font-size: 18px;
      }
      span {
        color: rgba(23, 26, 29, 0.6);
        font-weight: 400;
        font-size: 14px;
        line-height: 34px;
      }
    }
    .bottom {
      position: relative;
      left: 10px;
      p {
        font-weight: 500;
        font-size: 18px;
      }
      img {
        width: 100%;
        object-fit: cover; /* 图片填充并裁剪容器 */
      }
    }
  }
}
</style>