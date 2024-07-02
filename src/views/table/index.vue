<template>
  <div class="app-wrap">
    <!-- 主子表界面 -->
    <div class="app-table-box" v-if="!visibleFormPage" v-loading="bigLoading">
      <!-- 左侧树形结构模板 -->
      <div v-if="hasTree && pageConfig.treeExpand" class="app-table-box-left bg-white position-r">
        <div class="head-container">
          <el-input v-model="treeKeyword" placeholder="请输入关键字" clearable style="margin-bottom: 5px; margin-top: 2px">
          </el-input>
          <div class="menu-btn mb5">
            <el-button plain :icon="Plus" @click="treeBtnEvent(1)" v-if="treeButtonAuth.includes('ADD')"></el-button>
            <el-button plain :disabled="!treeNode" :icon="Edit" v-if="treeButtonAuth.includes('EDIT')" @click="treeBtnEvent(2)"></el-button>
            <el-button plain :icon="Delete" :disabled="!treeNode" v-if="treeButtonAuth.includes('DELETE')" @click="treeBtnEvent(3)"></el-button>
          </div>
        </div>
        <div class="head-container">
          <el-scrollbar :height="pageConfig.treeHeight" class="tree-border">
            <el-tree :data="treeOptions" :props="{
                label: 'LABEL',
                children: 'CHILDREN',
                disabled: 'disabled',
              }" node-key="VALUE" :filter-node-method="filterNode" :current-node-key="
                pageConfig.defaultExpandedKeys.length
                  ? pageConfig.defaultExpandedKeys[0]
                  : null
              " :default-expanded-keys="pageConfig.defaultExpandedKeys" ref="treeRef" highlight-current @node-click="handleNodeClick">
              <template #default="{ data }">
                <TextOverflow :content="`${data.LABEL}`" />
              </template>
            </el-tree>
          </el-scrollbar>
        </div>
      </div>

      <!-- 右侧表格主体模板 -->
      <div class="app-table-box-right" style="width: 100px">

        <div class="query-wrap" v-if="queryConfig.length" :class="showMoreQuery ? 'show-more-query' : ''">
          <!-- <Form class="query-form" ref="formRefTop" v-model:formData="queryJson" :formConfig="set24col(queryConfig, 4)" :inline="true" @select="formSelect" @enter="enterEvent" /> -->
          <!-- v-if="!tableCFG.isHeaderFilter"  暂时移除控制 -->
          <!-- <template v-if="!tableCFG.isHeaderFilter"> -->
          <Form class="query-form" ref="formRefTop" v-if="!pageConfig.hasCustomQuery" v-model:formData="queryJson" :formConfig="showMoreQuery ? queryConfig : set24col(queryConfig, 4)" :inline="true" @select="formSelect" @enter="enterEvent" />
          <!-- 金蝶高级查询 -->
          <CustomQuery v-model="customForm" v-else v-model:customFormOne="customFormOne" :queryConfig="queryConfig" />
          <!-- <Form v-else class="query-form" ref="formRefTop" v-model:formData="queryJson" :formConfig="set24col(queryConfig, 4)" :inline="true" @select="formSelect" @enter="enterEvent" /> -->
          <div class="flex-row-end">
            <el-button @click="queryEvent" type="primary" size="Default">
              查找
            </el-button>
            <el-button @click="showMoreQuery = !showMoreQuery" size="Default" v-if="!pageConfig.hasCustomQuery">
              {{ showMoreQuery ? "收起" : "高级" }}
            </el-button>
            <el-button @click="resetQuery" size="Default" v-if="systemConfig?.systemCode == 'ZLZHWL'">
              清空
            </el-button>
          </div>
          <!-- </template> -->

        </div>

        <div class="bg-white position-r">
          <div class="tool-wrap">
            <div class="tool-wrap-left">
              <Button :topButton="topButton" :treeNode="treeNode" :currentData="currentData" @handelEvent="handelEvent" />
            </div>

            <div class="tool-wrap-right">
              <el-tooltip :content="treeNode?.LABEL">
                <span class="tree-name" v-if="hasTree && treeNode">
                  已选：{{ treeNode?.LABEL }}
                </span>
              </el-tooltip>

              <div class="tool-wrap-right" v-if="hasTableStyle">
                <el-button-group class="btn-group">
                  <el-button :type="defaultStyle == 0 ? 'primary' : ''" @click="TargetMod(0)">
                    <i class="fa fa-align-justify"></i>
                  </el-button>
                  <el-button :type="defaultStyle == 1 ? 'primary' : ''" @click="TargetMod(1)" v-if="tableStyle == 1">
                    <i class="fa fa-align-left"></i>
                  </el-button>
                  <el-button :type="defaultStyle == 2 ? 'primary' : ''" @click="TargetMod(2)" v-if="tableStyle == 2">
                    <el-icon>
                      <Menu />
                    </el-icon>
                  </el-button>
                </el-button-group>
              </div>

              <slot name="toolbar"></slot>
              <el-icon :size="20" style="margin-left: 10px" @click="openDrawer" class="mr10">
                <Setting />
              </el-icon>
            </div>
          </div>

          <!-- 主子表模板 -->
          <slot name="default" :data="pageConfig.tableData" :config="pageConfig">
            <div :class="['eos-ms-table', subLayout==1?'flex-box':'' ]">
              <!-- 多主表 -->
              <template v-if="pageConfig.mainTable.length">
                <div class="main-tabs-wrap">
                  <el-tabs :tab-position="tabPosition" class="demo-tabs" v-model="pageConfig.mainActive" @tab-click="handleMainTabsClick">
                    <el-tab-pane :label="item.VNAME" v-for="(item, index) in pageConfig.mainTable" :key="index" :name="index">
                    </el-tab-pane>
                  </el-tabs>
                  <div class="tabs-content">
                    <template v-if="!pageConfig.batchTable">
                      <Vtable ref="VTableRef" :showMoreQuery="showMoreQuery" :tableCFG="pageConfig.mainTableCFG[pageConfig.mainActive]" :tableData="pageConfig.tableData" :totalData="pageConfig.totalData" @change="tableChange" @queryEvent="queryEvent">
                        <template #expand>
                          <div v-if="expandCFG?.SLOT == 'expandTB'" class="expand-wrapper">
                            <Vtable :tableCFG="subTableList.subTableCol[0]" :tableData="subTableList.subTableData" :totalData="subTableList.totalData" :actionBar="
                            subTableList.subTableCol[0].buttons.length > 0
                          " @change="tableChangeExpand">
                              <template #actionBar="{ row }">
                                <el-row :gutter="5" justify="center">
                                  <el-col :span="2.5" v-for="(itemB, indexB) in subTableList
                                  .subTableCol[0].buttons" :key="indexB">
                                    <el-link :underline="false" :disabled="getButtonStatus(itemB, row)" @click.stop="
                                    handelEvent({ data: itemB, row: row })
                                  ">{{ itemB.VNAME }}</el-link>
                                  </el-col>
                                </el-row>
                              </template>
                            </Vtable>
                          </div>
                          <div v-else>
                            <Form ref="formRefDetail" class="mt10" :formData="formConfig.formValue" :formConfig="formConfig.formColumns" :rules="formConfig.formRules" :detail="false" @select="formSelect" />
                            <div class="table-form-btn flex-row-cen">
                              <el-button type="primary" size="default" @click="formBtnEventByTable(itemB)" v-for="itemB in formConfig.buttonList" :key="itemB.BILLNO">
                                {{ itemB.VNAME }}
                              </el-button>
                            </div>
                          </div>
                        </template>
                      </Vtable>
                    </template>

                    <Etable ref="ETableRef" v-model:tableData="tableData" v-else :tableCFG="tableCFG" :validRules="tableCFG.EtableRules" :totalData="pageConfig.totalData" :actionBarWidth="90" @change="eTableChange" @headerClick="headerClick" @editClose="editTableClose">
                      <template #actionBar="{ row }">
                        <el-row :gutter="10" justify="center">
                          <el-col :span="1.5">
                            <el-link :icon="Plus" @click="plusRowData" />
                          </el-col>
                          <el-col :span="1.5">
                            <el-link :icon="Delete" @click="delConfig(row)" />
                          </el-col>
                          <!-- <el-col :span="1.5">
                    <el-link :icon="Notification" @click="editConfig(row)" />
                  </el-col> -->
                        </el-row>
                      </template>
                    </Etable>
                  </div>
                </div>
              </template>

              <!-- 单主表 -->
              <template v-else>
                <template v-if="!pageConfig.batchTable">
                  <!-- 卡片表格 -->
                  <Card-table v-if="defaultStyle==2" :cardConfig="cardConfig" :tableToolsBTN="tableToolsBTN" :maxCol="maxCol" :tableCFG="tableCFG" :height="tableCFG.height" :tableData="pageConfig.tableData" @change="tableChange" @nextPage="nextPage">
                  </Card-table>
                  <!-- vxe表格 -->
                  <div class="eos-table" :class="subLayout==1? 'mr-10':'' " :style="{ width: subLayoutLeft }" v-else>
                    <Vtable ref="VTableRef" :tableToolsBTN="tableToolsBTN" :showMoreQuery="showMoreQuery" :tableCFG="tableCFG" :tableStyle="defaultStyle" :tableData="pageConfig.tableData" :totalData="pageConfig.totalData" @change="tableChange" @dragRow="dragTableRow" @queryEvent="queryEvent">
                      <template #expand>
                        <div v-if="expandCFG?.SLOT == 'expandTB'" class="expand-wrapper">
                          <Vtable :tableCFG="subTableList.subTableCol[0]" :tableData="subTableList.subTableData" :totalData="subTableList.totalData" :actionBar="
                        subTableList.subTableCol[0].buttons.length > 0
                      " @change="tableChangeExpand">
                            <template #actionBar="{ row }">
                              <el-row :gutter="5" justify="center">
                                <el-col :span="2.5" v-for="(itemB, indexB) in subTableList
                              .subTableCol[0].buttons" :key="indexB">
                                  <el-link :underline="false" :disabled="getButtonStatus(itemB, row)" @click.stop="
                                handelEvent({ data: itemB, row: row })
                              ">{{ itemB.VNAME }}</el-link>
                                </el-col>
                              </el-row>
                            </template>
                          </Vtable>
                        </div>
                        <div v-else>
                          <Form ref="formRefDetail" class="mt10" :formData="formConfig.formValue" :formConfig="formConfig.formColumns" :rules="formConfig.formRules" :detail="false" @select="formSelect" />
                          <div class="table-form-btn flex-row-cen">
                            <el-button type="primary" size="default" @click="formBtnEventByTable(itemB)" v-for="itemB in formConfig.buttonList" :key="itemB.BILLNO">
                              {{ itemB.VNAME }}
                            </el-button>
                          </div>
                        </div>
                      </template>
                    </Vtable>
                  </div>
                </template>
                <Etable ref="ETableRef" v-model:tableData="tableData" v-else :tableCFG="tableCFG" :validRules="tableCFG.EtableRules" :totalData="pageConfig.totalData" :actionBarWidth="90" @change="eTableChange" @headerClick="headerClick" @editClose="editTableClose">
                  <template #actionBar="{ row }">
                    <el-row :gutter="10" justify="center">
                      <el-col :span="1.5">
                        <el-link :icon="Plus" @click="plusRowData" />
                      </el-col>
                      <el-col :span="1.5">
                        <el-link :icon="Delete" @click="delConfig(row)" />
                      </el-col>
                      <!-- <el-col :span="1.5">
                    <el-link :icon="Notification" @click="editConfig(row)" />
                  </el-col> -->
                    </el-row>
                  </template>
                </Etable>
              </template>

              <template v-if="subLayout!=1">
                <vxe-pager size="mini" class-name="vxe-page-wrap" :page-size="pageInfo.pageSize" :page-sizes="ListPageSize" :current-page="pageInfo.currentPage" :total="pageInfo.totalResult" :layouts="[
                'Total',
                'PrevPage',
                'JumpNumber',
                'NextPage',
                'Sizes',
              ]" v-if="subTableList.subTableCol.length > 1" @page-change="handlePageChange">
                  <template #left>
                    <div class="check-acount">
                      已选 <span class="color-orange"> {{ currentData.length }} </span> 行
                    </div>
                  </template>
                </vxe-pager>

                <div class="subtable-title" v-else>
                  <vxe-pager ref="vxePageRef" size="mini" class-name="vxe-page-wrap" :page-size="pageInfo.pageSize" :page-sizes="ListPageSize" :current-page="pageInfo.currentPage" :total="pageInfo.totalResult" :layouts="[
                  'PrevPage',
                  'JumpNumber',
                  'NextPage',
                  'Sizes',
                  'Total',
                ]" @page-change="handlePageChange">
                    <template #left>
                      <div class="check-acount">
                        已选 <span class="color-orange"> {{ currentData.length }} </span> 行
                      </div>
                    </template>
                  </vxe-pager>

                </div>
              </template>
              <!-- 子表模板 -->
              <div class="sub-table-wrap" :style="{ width: subLayoutLeft }" v-if="pageConfig.hasSubTable">
                <!-- 运输进度总览 -->
                <template v-if="
                  subTableList.subTableCol[subTableList.active].VCODE ==
                  'transporSchedule'
                ">
                  <TransporSchedule :height="pageConfig.footerHeight" :data="subTableList.subTableData" :buttonList="pageConfig.initButton" />
                </template>

                <template v-else-if="subTableList.subTableCol.length == 1">
                  <template v-if="subTableList.subTableCol[subTableList.active].VCODE =='timeline'">
                    <InfoTimeLine :height="pageConfig.footerHeight" :data="subTableList.subTableData" :config="subTableList.subTableCol[subTableList.active]" />
                  </template>
                  <template v-else>
                    <Vtable :tableCFG="subTableList.subTableCol[0]" :tableData="subTableList.subTableData" :totalData="subTableList.totalData" />
                  </template>
                </template>

                <div class="tabs-wrap" v-else>

                  <el-scrollbar view-class="sub-tags" style="width:50%">
                    <el-tabs :tab-position="tabPosition" class="demo-tabs" v-model="subTableList.active" @tab-click="handleTabsClick">
                      <el-tab-pane :label="item.VNAME" v-for="(item, index) in subTableList.subTableCol" :key="index" :name="index" />
                    </el-tabs>
                  </el-scrollbar>

                  <div class="tabs-content" v-loading="loading">
                    <template v-if="subTableList.subTableCol[subTableList.active].VCODE =='timeline'">
                      <InfoTimeLine :height="pageConfig.footerHeight" :data="subTableList.subTableData" :config="subTableList.subTableCol[subTableList.active]" />
                    </template>

                    <template v-else>
                      <Vtable :tableCFG="subTableList.subTableCol[subTableList.active]" :tableData="subTableList.subTableData" :totalData="subTableList.totalData">
                      </Vtable>
                    </template>
                  </div>
                </div>
                <!-- 子表分页 -->
                <vxe-pager size="mini" class-name="vxe-page-wrap" v-if="subPageInfo.isShow" :page-size="subPageInfo.pageSize" :page-sizes="ListPageSize" :current-page="subPageInfo.currentPage" :total="subPageInfo.totalResult" :layouts="[
                  'Total',
                  'PrevPage',
                  'JumpNumber',
                  'NextPage',
                  'Sizes',
                ]" @page-change="handleSubPageChange">
                </vxe-pager>
              </div>

            </div>

            <!-- 左右布局时的分页 -->
            <div class="subtable-title" v-if="subLayout==1">
              <vxe-pager size="mini" class-name="vxe-page-wrap" :page-size="pageInfo.pageSize" :page-sizes="ListPageSize" :current-page="pageInfo.currentPage" :total="pageInfo.totalResult" :layouts="[
                  'PrevPage',
                  'JumpNumber',
                  'NextPage',
                  'Sizes',
                  'Total',
                ]" @page-change="handlePageChange">
                <template #left>
                  <div class="check-acount">
                    已选 <span class="color-orange"> {{ currentData.length }} </span> 行
                  </div>
                </template>
              </vxe-pager>
            </div>
          </slot>

        </div>
      </div>

    </div>

    <!-- 在当前页面中打开表单 -->
    <div :class="[
        'form-page-wrap',
        'position-r',
        formModalTableCFG.PAGE == 'slot' ? '' : 'formPage',
      ]" v-else>
      <el-scrollbar class="" v-loading="pageLoading">
        <div class="form-title">
          <div class="form-title-left">
            <span class="text-muted" @click="backEvent">
              <img :src="backIcon" alt="" srcset="" class="back-icon">
              返回
            </span>
            {{ pageTitle }} /
            <span class="color-999">
              {{
              pageConfig.pageTitle
                ? pageConfig.pageTitle
                : pageConfig.modelTitle
            }}
            </span>

          </div>
          <div class="form-title-btn">
            <div id="custemPageBtn" v-if="
                formModalTableCFG.PAGE == 'slot' ||
                formModalTableCFG.TYPE == 'STEP'
              "></div>
            <template v-else>
              <template v-if="isDetailBtnTwice">
                <el-popover placement="left" :width="400" trigger="click">
                  <template #reference>
                    <template v-for="itemB in formConfig.buttonList" :key="itemB.BILLNO">
                      <el-button type="primary" size="default">
                        {{ itemB.VNAME }}
                      </el-button>
                    </template>
                  </template>

                  <template #default>
                    <div v-for="(tableItem, tableIndex) in formConfig.formValue
                        .SIGNLIST" class="mb5" :key="tableIndex">
                      <span>物料{{ tableItem.MATERIALNAME }} ,</span>
                      <span>
                        原发录入{{ originalEntry[tableIndex].SUTTLE }} ,</span>
                      <span> 签收量{{ tableItem.CURRENCY || 0 }} ,</span>
                      <span>
                        差值{{
                          originalEntry[tableIndex].SUTTLE -
                          (tableItem.CURRENCY || 0)
                        }}</span>
                      <span>。确认保存吗？</span>
                    </div>
                    <div class="text-r mt10">
                      <template v-for="itemB in formConfig.buttonList" :key="itemB.BILLNO">
                        <el-button type="primary" size="default" @click="formBtnEvent(itemB,1)">
                          {{ itemB.VNAME }}
                        </el-button>
                      </template>
                    </div>
                  </template>
                </el-popover>
              </template>
              <template v-else>
                <template v-for="(itemB,indexB) in formConfig.buttonList" :key="itemB.BILLNO">
                  <el-button type="primary" :loading="itemB.btnLoading" size="default" @click="formBtnEvent(itemB,1,indexB)" v-if="setShowBtn(itemB)">
                    {{ itemB.VNAME }}
                  </el-button>
                </template>
              </template>
            </template>
          </div>
        </div>
        <!-- v-if="formConfig.showDetail" -->
        <div class="form-page-content mt20">
          <template v-if="formModalTableCFG.PAGE == 'slot'">
            <slotCustemPage :config="pageConfig.activeBtn" :currentData="currentData" @close="closeCustemPage" />
          </template>
          <template v-else-if="formModalTableCFG.TYPE == 'STEP'">
            <StepForm :config="pageConfig.activeBtn" :currentData="currentData" @close="closeCustemPage" />
          </template>
          <template v-else>
            <MasterForm ref="MasterFormRef" :loading="!formConfig.showDetail" v-model:formData="formConfig.formValue" :formConfig="formConfig.formColumns" :tableConfig="SubTableConfig" :formRules="formConfig.formRules" :tableRules="SubTableRules" :detail="formConfig.formType == 'DTL'"
              @select="formSelect" :MODULE="formModalTableCFG.MODULE" :PAGE="formModalTableCFG.PAGE" :othTabCFG="ETableCFG" :othConfig="otherCFG" :infoConfig="infoConfig" :tableBillNo="formModalTableCFG.tableBillNo" :allButton="pageConfig.initButton" />
          </template>
        </div>
      </el-scrollbar>
    </div>

    <!-- 公共弹窗表单模块 -->
    <vxe-modal destroy-on-close v-model="pageConfig.modalVisible" :width="pageConfig.modalW" :height="pageConfig.modalH" id="formModal" resize storage transfer show-zoom show-footer @close="closeModal">
      <template #title>
        <span class="modal-title"> {{ pageConfig.pageTitle || pageConfig.modelTitle }}
        </span>
      </template>
      <template #default>
        <template v-if="formModalTableCFG.PAGE == 'slot'">
          <slotCustemPage :currentData="currentData" @close="closeCustemPage" />
        </template>
        <template v-else>
          <MasterForm v-if="formConfig.showDetail" ref="MasterFormRef" v-model:formData="formConfig.formValue" :formConfig="formConfig.formColumns" :tableConfig="SubTableConfig" :formRules="formConfig.formRules" :tableRules="SubTableRules" :detail="formConfig.formType == 'DTL'" @select="formSelect"
            @EtbaleChange="EtbaleChange" @EtbaleLinkChange="EtbaleLinkChange" :MODULE="formModalTableCFG.MODULE" :PAGE="formModalTableCFG.PAGE" :othConfig="otherCFG" :infoConfig="infoConfig" :tableBillNo="formModalTableCFG.tableBillNo" :allButton="pageConfig.initButton"
            @updateTableData="updateTableData" />
        </template>
      </template>
      <template #footer>
        <div id="custemPageBtn" v-if="
            formModalTableCFG.PAGE == 'slot' || formModalTableCFG.TYPE == 'STEP'
          "></div>
        <template v-else>
          <el-space>
            <el-button size="default" @click="closeModal"> 关闭 </el-button>
            <template v-if="
                formConfig.buttonList.length && formConfig.formType != 'DTL'
              ">
              <el-button type="primary" :loading="itemB.btnLoading" size="default" @click="formBtnEvent(itemB, 1 , indexB)" v-for="(itemB,indexB) in formConfig.buttonList" :key="itemB.BILLNO">
                {{ itemB.VNAME }}
              </el-button>
            </template>
          </el-space>
        </template>
      </template>
    </vxe-modal>

    <!-- 打开抽屉 -->
    <el-drawer modal-class="custom-drawer" size="100%" v-model="queryDrawer" :modal="false">
      <template #header="{ titleId, titleClass }">
        <h4 :id="titleId" :class="titleClass"> {{ formConfig.formValue.BILLNO || '' }} {{   pageConfig.pageTitle || pageConfig.modelTitle }} </h4>
      </template>
      <MasterForm v-if="formConfig.showDetail" ref="MasterFormRef" v-model:formData="formConfig.formValue" :formConfig="formConfig.formColumns" :tableConfig="SubTableConfig" :formRules="formConfig.formRules" :tableRules="SubTableRules" :detail="formConfig.formType == 'DTL'" @select="formSelect"
        @EtbaleChange="EtbaleChange" @EtbaleLinkChange="EtbaleLinkChange" :MODULE="formModalTableCFG.MODULE" :PAGE="formModalTableCFG.PAGE" :othConfig="otherCFG" :infoConfig="infoConfig" :tableBillNo="formModalTableCFG.tableBillNo" :allButton="pageConfig.initButton" />
      <template #footer>
        <el-space>
          <el-button size="default" @click="queryDrawer = false "> 关闭 </el-button>
          <template v-if="formConfig.buttonList.length && formConfig.formType != 'DTL'">
            <el-button type="primary" size="default" @click="formBtnEvent(itemB, 1,indexB)" v-for="(itemB,indexB) in formConfig.buttonList" :key="itemB.BILLNO">
              {{ itemB.VNAME }}
            </el-button>
          </template>
        </el-space>
      </template>
    </el-drawer>

    <!-- 列配置 -->
    <SetColumns ref="SetColumnsRef" :tableColumns="tableCFG.tableColumns" @reloadPage="reloadPage"></SetColumns>
    <!-- 报表模板 -->
    <vxe-modal destroy-on-close v-model="reportCGF" :width="pageConfig.modalW" :height="pageConfig.modalH" id="reportModal" resize storage transfer show-zoom show-footer @close="closeModal">
      <template #title>
        <span class="modal-title">{{ pageConfig.pageTitle }}</span>
      </template>
      <template #default>
        <ReportFrom ref="RTableRef" :detail="formConfig.formType == 'DTL'" :reportFromData="reportFromData" />
      </template>
      <template #footer>
        <el-button size="default" @click="closeModal"> 关闭</el-button>
        <el-button type="primary" v-if="(ReportType == 1 || reportFromData.examine == true) && !reportFromData.isDetail" size="default" @click="reportSubmit">
          保存
        </el-button>
      </template>
    </vxe-modal>

    <!-- 表格弹窗 -->
    <vxe-modal destroy-on-close v-model="tableShowCGF" show-footer :width="pageConfig.modalW" :height="pageConfig.modalH" id="tableModal" resize storage transfer show-zoom @close="closeModal">
      <template #title>
        <span class="modal-title">
          <CustomTitle :customTitle="customTitle" :tableCFG="tableCFG" :ListTableData="formModalTableCFG.ListtableData" v-if="customTitle" />
          <text v-else>
            {{ pageConfig.pageTitle || pageConfig.modelTitle }}
          </text>
        </span>
      </template>
      <template #default>
        <ModalTable ref="modalRef" :customTitle="customTitle" :MODULE="formModalTableCFG.MODULE" :ListTableData="formModalTableCFG.ListtableData" :selectData="currentData" :PAGE="formModalTableCFG.PAGE" :tableBillNo="formModalTableCFG.tableBillNo" @TbaBtnData="TbaBtnData"
          @btnModelSelectData="btnModelSelectData" @getTBData="getTBData" @closeModal="closeModal" @setCustomTitle="setCustomTitle" @setParentData="setParentData">
        </ModalTable>
      </template>
      <template #footer>
        <div class="modal-footer">
          <vxe-pager size="mini" :page-size="modalPageInfo.pageSize" :page-sizes="ListPageSize" :current-page="modalPageInfo.currentPage" :total="modalPageInfo.totalResult" :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']" @page-change="handleModalPageChange">
          </vxe-pager>
          <div class="modal-btn">
            <el-button type="primary" size="defalut" @click="modalBtnEvent(itemB)" v-for="itemB in modalBtnConfig" :key="itemB.BILLNO">
              {{ itemB.VNAME }}
            </el-button>
            <!-- <vxe-button @click="modalBtnEvent">关闭</vxe-button>
            <vxe-button @click="modalBtnEvent">取消</vxe-button> -->
          </div>
        </div>

      </template>
    </vxe-modal>

    <!-- 审批节点 -->
    <vxe-modal destroy-on-close v-model="workModal" :width="pageConfig.modalW" :height="pageConfig.modalH" id="workModal" resize storage transfer show-zoom show-footer @close="closeModal">
      <template #title>
        <span class="modal-title">{{ pageConfig.pageTitle + "审批节点" }}</span>
      </template>
      <template #default>
        <WorkflowTimeLine :data="workDoData" />
      </template>
    </vxe-modal>

    <!-- 溯源 -->
    <vxe-modal destroy-on-close v-model="tracingModal" :width="pageConfig.modalW" :height="pageConfig.modalH" id="workModal" resize storage transfer show-zoom show-footer @close="closeModal">
      <template #title>
        <span class="modal-title"> 单据溯源 </span>
      </template>
      <template #default>
        <TreeOrg :SourceData="SourceData" />
      </template>
    </vxe-modal>

  </div>
</template>

<script setup name="">
import Vtable from "@/components/Tables";
import CardTable from "@/components/Tables/cardTable";
import Button from "@/components/Tables/button.vue";
import Form from "@/components/Form";
import MasterForm from "@/components/MasterForm";
import StepForm from "@/components/StepForm";
import ReportFrom from "@/views/reportForm/index.vue";
import ModalTable from "./modal";
import Etable from "@/components/Tables/edit";
import WorkflowTimeLine from "@/components/Workflow/timeLine.vue";
import pageAutoComponent from "@/pageToComponents";
import InfoTimeLine from "@/components/TimeLine"; // 单据进度条
import TransporSchedule from "@/components/transporSchedule"; // 单据进度条
import SetColumns from "./set-column"; // 设置列
import { getPageConfig, getTableData, axiosSave } from "@/api/system/page";
import useSettingsStore from "@/store/modules/settings";
import useUserStore from "@/store/modules/user";
import SonTable from "@/components/Sontable";
import CustomQuery from "./custom-query.vue";

import CustomTitle from "./custom-title.vue";
import TextOverflow from "@/components/TextOverflow";

import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
  Plus,
  Filter,
  ArrowLeft,
  ArrowRight,
} from "@element-plus/icons-vue";

import { detailDo } from "#/workflow/do";

import {
  getFormValue,
  deepClone,
  getShowCFG,
  getFormRule,
  getUrlParams,
  evilFn,
  uuid,
  percentageToNumber,
  resetArr2orgTree,
} from "@/utils/index";
import { ElMessage, ElMessageBox } from "element-plus";
// import localforage from "localforage";
import {
  updetaReportPost,
  updetaReportexamine,
  getOrinfo,
} from "@/api/system/reportForm";

import PinyinMatch from "pinyin-match";

const settingsStore = useSettingsStore();
const storeSettings = computed(() => settingsStore);
const systemConfig = computed(() => settingsStore.systemConfig);

const userStore = useUserStore();
const { proxy } = getCurrentInstance();
const emit = defineEmits(["treeClick"]);
const router = useRouter();
const route = useRoute();
let tableBillNo = route.query.billno;
const formRef = ref(null);
const MasterFormRef = ref(null);
const formRefDetail = ref(null);
const mbType = ref(false);
const VTableRef = ref(null);
const RTableRef = ref(null);
const ReportType = ref(null);
const modalRef = ref(null);
const visibleFormPage = ref(false);
const tableShowCGF = ref(false);
const workModal = ref(false);
const workDoData = ref(null); // 审批流节点数据
const MBTableData = ref({});
const pageLoading = ref(false);
const pageConfig = reactive({
  hasTree: false, // 是否存在左侧树型结构
  treeExpand: true, // 是否展开树
  defaultExpandedKeys: [], // 默认展开的树节点
  tableData: [],
  totalData: null,
  topButton: [],
  initButton: [],
  queryUrl: null,
  hasSubTable: false,
  activeBtn: {},
  pageShow: true,
  modalVisible: false,
  modalBtn: [],
  modalW: "60%",
  modalH: "40%",
  pageTitle: "",
  treeHeight: window.innerHeight - 200,
  mainTable: [], // 多主表原始配置数据
  mainActive: 0,
  mainTableCFG: [], // 多主表处理后的配置
  batchTable: false, // 是否批量操作表格
  EtableCFG: {}, // 批量操作时主表的验证规则
  footerHeight: 150, // 底部子表高度
  isSonTable: false, // 是否启用表格的批量编辑
  hasCustomQuery: false, // 是否启用高级查询
});
const treeConfig = reactive({
  treeOptions: [],
  treeButton: [],
  treeButtonAuth: [],
  treeKeyword: "",
  treeQueryUrl: "",
  treeNode: null, // 当前激活的节点
});
const MBConfig = reactive({
  MODULEID: "",
  PAGEID: "",
});
const {
  treeOptions,
  treeButton,
  treeButtonAuth,
  treeKeyword,
  treeQueryUrl,
  treeNode,
} = toRefs(treeConfig);

const infoConfig = ref([]);
const hasTableStyle = ref(false); // 是否存在多风格的表格
const tableStyle = ref(0); // 表格的风格 0 是普通列表，1是线性表 购物车， 2是卡片风格
const defaultStyle = ref(0); // 默认风格
const showMoreQuery = ref(false); // 展开更多查询
const cardConfig = ref(null); // 卡片风格配置
const maxCol = ref("25%"); // 卡片 ，每行列数

const bigLoading=ref(false)
const subTableHeight = ref(120); // 读取配置的子表高度

const subLayout = ref(0); // 子表布局方式  1为左右，  默认上下
const subLayoutLeft = ref("100%"); // 子表布局方式为左右时，左侧宽度
const subLayoutRight = ref("100%"); // 子表布局方式为左右时，右侧宽度

const tracingModal = ref(false);

const customForm = ref([
  {
    QUERYFIELD: "",
    QUERYTYPE: "",
    QUERYVALUE: "",
    QUERYPREFIX: "", // 前缀
    QUERYSUFFIX: "", // 后缀
    QUERYAND: "", // 括号
  },
]);

const customFormOne = ref({
  QUERYFIELD: "",
  QUERYTYPE: "",
  QUERYVALUE: "",
  QUERYPREFIX: "", // 前缀
  QUERYSUFFIX: "", // 后缀
  QUERYAND: "", // 括号
});

// 单主表使用该配置
const tableCFG = reactive({
  tableColumns: [],
  allColumns: [],
  hasTableTools: false, // 是否有操作栏
  hasSeq: false, // 是否显示序号
  hasCheck: false, // 是否需要多选图标
  hasDragRow: false, // 是否支持 拖拽
  toolsConfig: [],
  expandID: "",
  loading: false,
  hasFill: false, // 表格补位
  hasEmpty: false,
  height: 500,
  rowClassEval: "", // 行加背景色的条件
  mergeCFG: null, // 表尾合计的配置  字段
  mergeRowField: [], // 需要合并的字段
  treeID: null, // 树形表格 的可展开的节点id
  SelectType: null,
  tableButtons: ["ADD", "EDIT", "DELETE"],
  EtableRules: {},
  cellHeight: storeSettings.value.rowHeight, // 单元格的行高
  isHeaderFilter: false, // 是否启用头部过滤
  headerConfig: [], // 配置的查询条件
  queryJson: {}, // 查询条件
});
const formModalTableCFG = ref({
  MODULE: "",
  PAGE: "",
  TYPE: "",
  tableBillNo: "",
  ListtableData: {},
});
const { allColumns } = toRefs(tableCFG);

const queryDetailParams = ref({});

const pageInfo = reactive({
  currentPage: 1,
  pageSize: 10,
  totalResult: 0,
  sortName: "",
  sortOrder: "",
});

const isDetailBtnTwice = ref(false); //判断是否是运输任务的保存
const originalEntry = ref([]); // 存储原发录入

const subPageInfo = reactive({
  currentPage: 1,
  pageSize: 5,
  totalResult: 0,
  sortName: "",
  sortOrder: "",
  isShow: false,
});

const subTableList = reactive({
  subTableCol: [],
  subTableData: [],
  totalData: null,
  height: 100,
  active: 0,
  isShowPage: false,
});

const subTableCFGByMain = ref([]); // 来源于多个主表对应的子表配置
const ETableRef = ref(null);
const subTableActive = reactive({});

const expandCFG = ref(null);

const formConfig = reactive({
  formBase: {}, // 表单源数据
  formValue: {}, // form数据
  formColumns: [], // form配置(已过滤显示)
  formRules: {}, // form验证
  formType: "", // DTL ADD
  buttonList: [], // 表单中的按钮
  showDetail: false, // 是否显示表单 ， 初始时不显示，详情数据查询后显示
});
const TabModelConfig = reactive({
  tabBase: {}, // 表单源数据
  tabValue: {}, // 表格数据
  tabColumns: [], // form配置(已过滤显示)
  tabRules: {}, // form验证
  tabType: "", // DTL ADD
  // buttonList: [], // 表单中的按钮
});
const SubTableConfig = ref([]);
const SubTableRules = ref([]);

const detailBtnCFG = ref(null);
const detailTreeBtn = ref(null);
const reportCGF = ref(false);
const queryJson = ref({});
const queryConfig = ref([]);
const queryConfig24Col = ref([]);
const currentData = ref([]);
const queryDrawer = ref(false);
const colDrawer = ref(false);
const reportFromData = ref({});
const hasTemplate = ref(false); // 页面是否关联多模板
const templateList = ref([]); // 模板列表
const selectTemp = ref(""); // 选中的模板
const setShowCol = ref(""); // 选中的模板中的列配置
const ListPageSize = ref([10, 20, 30, 50, 100, 500, 1000]);

const customTitle = ref(""); // 表格弹窗的自定义标题

const { hasTree, tableData, topButton, queryUrl, totalData, mainTable } =
  toRefs(pageConfig);
let initQueryJson = null;
const routerParams = router.currentRoute.value.meta;
hasTemplate.value = routerParams.ISTEMPLATE == "1";
hasTree.value = routerParams.COMP == "VTableZtree";

pageConfig.pageTitle = routerParams.title;
const pageTitle = ref(routerParams.title);
getPageCFG();

const backIcon = ref(proxy.getAssetsFile("icons/back.png"));

const updateTableData = (data) => {
  formConfig.formValue = data;
};

// 当前表单其它配置 全局的label 宽
const otherCFG = ref({
  labelWidth: "60px",
  GRID: "",
});

/** 根据名称筛选菜单树 */
watch(treeKeyword, (val) => {
  proxy.$refs["treeRef"]?.filter(val);
});
/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return (
    PinyinMatch.match(data.LABEL, treeKeyword.value) ||
    PinyinMatch.match(data.VALUE, treeKeyword.value) ||
    PinyinMatch.match(data.CODE, treeKeyword.value)
  );
};

function handleNodeClick(data) {
  MBConfig.MODULEID = data.MODULEID;
  MBConfig.PAGEID = data.PAGEID;
  queryJson.value.PK_CLASS = data.VALUE;
  treeNode.value = data; //
  currentData.value = [];

  pageConfig.defaultExpandedKeys = [data.VALUE];
  if (!data.ISDISABLED) {
    pageInfo.currentPage = 1;
    getTBData();
    emit("treeClick");
  }
}

// 展开表格中的操作按钮
const getButtonStatus = (item, row) => {
  //计算属性传递参数
  try {
    let { SCRNCONDITION } = item;
    const DATA = row;
    if (SCRNCONDITION && eval(SCRNCONDITION)) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("getButtonStatus异常", error);
    return true;
  }
};

onActivated(() => {
  tableBillNo = route.query.billno;
});

let filterFileid = [];

function getPageCFG() {
  let pageID = {
    APPID: "",
    DATA: {},
    KEY: "",
    MODULEID: routerParams.BILLNO,
    PAGEID: routerParams.ACTION,
    VERSION: "",
  };

  getPageConfig(pageID).then((res) => {
    const {
      QUERY,
      SUBTABLE,
      BUTTON,
      SLOTCFG,
      MAINTABLE,
      TABLESTYLE,
      ISTREE,
      PAGESIZE,
      ISADAPTION,
      MODALTYPE,
      ISSONTABLE,
      ISTBSELECT,
      VDEF3,
      VDEF4,
      VMEMO,
      ISSUB,
      TABLEHEIGHT,
    } = res.RESULT;

    if (VMEMO && VMEMO.includes("PAGESIZE"))
      ListPageSize.value =
        JSON.parse(
          VMEMO
        ).PAGESIZE; /** 修改当前主表的每页数据Arr  {'PAGESIZE':[100,200,300,500]} */
    pageConfig.initButton = BUTTON;
    pageConfig.isSonTable = ISSONTABLE == 1;
    pageConfig.pageShow = res.RESULT.VDEF1 == "1"; // 控制列表是否展示分页功能
    pageConfig.hasCustomQuery = VDEF3 == 1;
    showMoreQuery.value = VDEF4 == 1;

    subLayout.value = ISSUB;
    subLayoutLeft.value = ISSUB == 1 ? TABLEHEIGHT || "50%" : "100%";
    subLayoutRight.value =
      ISSUB == 1
        ? (1 - percentageToNumber(subLayoutLeft.value)) * 100 + "%"
        : "100%";
    pageConfig.batchTable = ISSONTABLE == 1; // 默认批量编辑

    resetTableBtn(BUTTON); // 设置表格中的按钮
    tableCFG.autoWidth = ISADAPTION;
    tableCFG.isHeaderFilter = ISTBSELECT == 1;
    // 判断多主表是否需自定义模板进行配置了独立的查询条件
    if (MAINTABLE.length > 1 && MAINTABLE[0].QUERY.length) {
      let firstMtableQuery = MAINTABLE[0].QUERY;
      let allQuery = [];
      MAINTABLE.forEach((item) => {
        allQuery = allQuery.concat(allQuery, item.QUERY);
      });
      tableCFG.headerConfig = firstMtableQuery;
      initQueryJson = getFormValue(firstMtableQuery);
      queryJson.value = deepClone(initQueryJson);
      tableCFG.queryJson = queryJson.value;
      queryConfig.value = getShowCFG(firstMtableQuery);
    } else {
      tableCFG.headerConfig = QUERY;
      initQueryJson = getFormValue(QUERY);
      queryJson.value = deepClone(initQueryJson);
      tableCFG.queryJson = queryJson.value;
      queryConfig.value = getShowCFG(QUERY);
    }

    if (pageConfig.hasCustomQuery) pageConfig.hasCustomQuery = true;

    queryUrl.value = SLOTCFG ? SLOTCFG : getQueryUrl(BUTTON);

    // queryConfig24Col.value = set24col(QUERY, 24);
    treeQueryUrl.value = getQueryUrl(treeButton.value, "tree");

    hasTableStyle.value = TABLESTYLE * 1 > 0;
    tableStyle.value = TABLESTYLE || 0;
    defaultStyle.value = MODALTYPE || 0;
    let COLUMNS = res.RESULT.COLUMNS;

    let getDetailBtn = BUTTON.filter((i) => {
      return i.ACTION == "DTL" && i.VTYPE != 20;
    });
    detailBtnCFG.value = getDetailBtn.length ? getDetailBtn[0] : null;

    allColumns.value = JSON.parse(JSON.stringify(COLUMNS));

    if (TABLESTYLE == 2) {
      let copyCardConfig = COLUMNS.filter((i) => i.LINESTYLE);
      try {
        let cc = JSON.parse(copyCardConfig[0].LINESTYLE);
        cardConfig.value = cc;
        maxCol.value = 100 / cc.maxCol + "%";
      } catch (error) {}
    }

    //  是否存在树形表格
    if (ISTREE) {
      try {
        let treeConfig = JSON.parse(ISTREE);
        tableCFG.treeID = treeConfig;
      } catch (error) {
        console.error("ISTREE配置异常无法解析", error);
      }
    }

    // 支持列头筛选的查询条件 ID
    filterFileid = QUERY.map((i) => {
      return i.SLOTCFG || i.FIELD;
    });

    // 判断是否存在多主表配置，合并主表
    if (MAINTABLE?.length) {
      // MAINTABLE.unshift(res.RESULT);
      // delete MAINTABLE[0].MAINTABLE;
      COLUMNS = MAINTABLE[0].COLUMNS;
      let newButtons = MAINTABLE[0].BUTTON;
      pageConfig.initButton = newButtons;
      resetTableBtn(newButtons);
      let MAINISSONTABLE = MAINTABLE[0].ISSONTABLE;
      pageConfig.isSonTable = MAINISSONTABLE == 1;
      pageConfig.batchTable = MAINISSONTABLE == 1; // 默认批量编辑
      queryUrl.value = MAINTABLE[0].SLOTCFG
        ? MAINTABLE[0].SLOTCFG
        : getQueryUrl(newButtons);
      let getDetailBtn = newButtons.filter((i) => {
        return i.ACTION == "DTL";
      });
      detailBtnCFG.value = getDetailBtn.length ? getDetailBtn[0] : null;
      mainTable.value = MAINTABLE;
      resetMainTableCFG(MAINTABLE);
      pageConfig.mainActive = 0;
    }

    // 重新整理列表配置
    let showColumns = [],
      mergeCFG = [],
      mergeRowField = [],
      rowBgEval = "",
      columnWidth = 0;
    COLUMNS.forEach((el) => {
      el.title = el.LABEL;
      if (el.VTYPE == 0) {
        el.VTYPE = "";
      }
      // 是否需要显示序号，默认显示
      if (el.VTYPE == "seq") {
        tableCFG.hasSeq = el.ISSHOW == 1 ? true : false;
      }
      // 是否需要展开详情
      if (el.VTYPE == "expand") {
        tableCFG.expandID = el.FIELD;
        expandCFG.value = el;
      }

      if (el.VTYPE == "ExJoint" && el.OTHER) {
        try {
          let obgArr = JSON.parse(el.OTHER);
          let brNum = obgArr.filter((i) => {
            return i.row == 1;
          });
          let rowNum = brNum.length;
          if (obgArr.length > rowNum) {
            rowNum += 1;
          }
          let h = rowNum * 22 + 2;
          tableCFG.cellHeight =
            h > tableCFG.cellHeight ? h : tableCFG.cellHeight;
        } catch (error) {
          console.error("拼接配置错误", error, el);
        }
      }

      // 处理多选框和单选框的列头 为空
      if (el.VTYPE == "checkbox" || el.VTYPE == "radio") {
        el.title = "";
        tableCFG.SelectType = el.VTYPE;
        tableCFG.hasCheck = el.VTYPE == "checkbox";
      }
      // 是否存在拖拽
      if (el.VTYPE == "drag") {
        tableCFG.hasDragRow = true;
        dragRowConfig.value = el;
      }
      // 是否存在操作栏
      if (el.CONTROLS == "ExTableTools") {
        tableCFG.hasTableTools = true;
      }

      if (el.SLOT == "rowBg" && el.SLOTCFG) {
        rowBgEval = rowBgEval ? rowBgEval + " && " + el.SLOTCFG : el.SLOTCFG;
      }

      if (el.ISSHOW == 1 && el.SELECTEDFLAG == 1) {
        columnWidth += el.WIDTH * 1;
        if (el.TOTALTYPE && el.TOTALTYPE != "-") {
          mergeCFG.push(el.FIELD);
        }
      }

      if (el.ISMERGE == 1) {
        mergeRowField.push(el.FIELD);
      }
      //  开启表头筛选功能，把查询条件添加到表头筛选配置中
      if (tableCFG.isHeaderFilter && filterFileid.includes(el.FIELD)) {
        let TabColFilterCfg = QUERY.filter(
          (iQ) => iQ.FIELD == el.FIELD || (iQ.SLOTCFG && iQ.SLOTCFG == el.FIELD)
        );
        TabColFilterCfg.length ? (el.filterCfg = TabColFilterCfg[0]) : "";
      }

      if (
        el.ISSHOW == 1 &&
        el.VTYPE != "seq" &&
        el.VTYPE != "checkbox" &&
        el.CONTROLS != "ExTableTools" &&
        el.SELECTEDFLAG == 1
      ) {
        showColumns.push(el);
      }

      // 如果配置了唯一，说明是要进行合并的 字段
      tableCFG.mergeRowField = mergeRowField;

      tableCFG.mergeCFG = mergeCFG;
    });

    tableCFG.rowClassEval = rowBgEval;
    tableCFG.tableColumns = showColumns;

    // tableCFG.SelectType = tableCFG.SelectType
    //   ? tableCFG.SelectType
    //   : "checkbox";

    tableCFG.EtableRules = getFormRule(showColumns);
    // 判断表格宽度是否  需要补位
    setTbaleFill(columnWidth);

    if (tableBillNo) {
      Object.assign(queryJson.value, { PK_CLASS: tableBillNo });
    }

    if (SUBTABLE.length) {
      pageConfig.hasSubTable = true;
      let newSUBTABLE = SUBTABLE.map((item) => {
        let i = {};
        i.hasTableTools = false;
        i.hasSeq = false;
        i.toolsConfig = [];
        i.expandID = "";
        i.BILLNO = item.BILLNO;
        i.VCODE = item.VCODE;
        i.loading = false;
        i.VNAME = item.VNAME;
        i.height = item.TABLEHEIGHT || 150;
        i.queryUrl = item.SLOTCFG ? item.SLOTCFG : getQueryUrl(item.BUTTON);
        i.tableColumns = getShowCFG(item.COLUMNS);
        i.allColumns = item.COLUMNS;
        i.buttons = item.BUTTON;
        i.hasFill = true;
        i.tableData = [];
        i.mergeCFG = getmergeCFGID(i.tableColumns);
        let hasCheckRadio = item.COLUMNS.filter((itc) => {
          return itc.VTYPE == "checkbox" || itc.VTYPE == "radio";
        });
        if (hasCheckRadio.length) {
          i.SelectType = hasCheckRadio[0].VTYPE; // 'checkbox' : '';
        }
        return i;
      });

      if (SUBTABLE.length == 1 && expandCFG.value) {
        pageConfig.hasSubTable =
          expandCFG.value?.SLOTCFG == SUBTABLE[0].BILLNO ? false : true;
        newSUBTABLE.height = null;
      }

      let isShowSubPage = SUBTABLE.filter((i) => {
        return i.VDEF1 == 1;
      });
      subPageInfo.isShow = isShowSubPage.length ? true : false;
      subTableList.subTableCol = newSUBTABLE;
      setTableHeight();
    }
    setTableHeight(PAGESIZE);
    if (hasTree.value && treeQueryUrl.value != "") {
      getTreeData();
    } else if (queryUrl.value) {
      getTBData();
    }
  });
}

// 多主表时重置多主表配置
function resetMainTableCFG(data) {
  let mainCFG = {
    tableColumns: [],
    allColumns: [],
    hasTableTools: false, // 是否有操作栏
    hasSeq: false, // 是否显示序号
    toolsConfig: [],
    expandID: "",
    loading: false,
    hasFill: false, // 表格补位
    hasEmpty: false,
    height: 500,
    rowClassEval: "", // 行加背景色的条件
    mergeCFG: null, // 表尾合计的配置  字段
    mergeRowField: [], // 需要合并的字段
    SelectType: null,
    cellHeight: 26,
  };
  let mainCFGArr = [],
    subCFGArr = [];

  data.forEach((i) => {
    let copyMainCFG = JSON.parse(JSON.stringify(mainCFG));
    copyMainCFG.allColumns = i.COLUMNS;
    // 重新整理列表配置
    let showColumns = [],
      mergeCFG = [],
      mergeRowField = [],
      rowBgEval = "",
      columnWidth = 0;
    i.COLUMNS.forEach((el) => {
      el.title = el.LABEL;
      if (el.VTYPE == 0) {
        el.VTYPE = "";
      }
      // 是否需要显示序号，默认显示
      if (el.VTYPE == "seq") {
        copyMainCFG.hasSeq = el.ISSHOW == 1 ? true : false;
      }
      // 是否需要展开详情
      if (el.VTYPE == "expand") {
        copyMainCFG.expandID = el.FIELD;
      }

      if (el.VTYPE == "ExJoint" && el.OTHER) {
        try {
          let obgArr = JSON.parse(el.OTHER);
          let brNum = obgArr.filter((i) => {
            return i.row == 1;
          });
          let rowNum = brNum.length;
          if (obgArr.length > rowNum) {
            rowNum += 1;
          }
          let h = rowNum * 22 + 2;
          copyMainCFG.cellHeight =
            h > copyMainCFG.cellHeight ? h : copyMainCFG.cellHeight;
        } catch (error) {
          console.error("拼接配置错误", error, el);
        }
      }
      // 处理多选框和单选框的列头 为空
      if (el.VTYPE == "checkbox" || el.VTYPE == "radio") {
        el.title = "";
        copyMainCFG.SelectType = el.VTYPE;
      }
      // 是否存在操作栏
      if (el.CONTROLS == "ExTableTools") {
        copyMainCFG.hasTableTools = true;
      }
      if (
        el.ISSHOW == 1 &&
        el.VTYPE != "seq" &&
        el.VTYPE != "checkbox" &&
        el.CONTROLS != "ExTableTools"
      ) {
        showColumns.push(el);
      }

      if (el.SLOT == "rowBg" && el.SLOTCFG) {
        rowBgEval = rowBgEval ? rowBgEval + " && " + el.SLOTCFG : el.SLOTCFG;
      }

      if (el.ISSHOW == 1 && el.SELECTEDFLAG == 1) {
        columnWidth += el.WIDTH * 1;
        if (el.TOTALTYPE && el.TOTALTYPE != "-") {
          mergeCFG.push(el.FIELD);
        }
      }

      if (el.ISMERGE == 1) {
        mergeRowField.push(el.FIELD);
      }

      if (
        tableCFG.isHeaderFilter &&
        filterFileid.length &&
        filterFileid.includes(el.FIELD)
      ) {
        let TabColFilterCfg = tableCFG.headerConfig.filter(
          (iQ) => iQ.FIELD == el.FIELD || (iQ.SLOTCFG && iQ.SLOTCFG == el.FIELD)
        );
        TabColFilterCfg.length ? (el.filterCfg = TabColFilterCfg[0]) : "";
      }

      // 如果配置了唯一，说明是要进行合并的 字段
      copyMainCFG.mergeRowField = mergeRowField;

      copyMainCFG.mergeCFG = mergeCFG;
    });

    copyMainCFG.tableColumns = showColumns;
    copyMainCFG.mergeCFG = mergeCFG;
    copyMainCFG.mergeRowField = mergeRowField;
    copyMainCFG.rowClassEval = rowBgEval;
    copyMainCFG.queryJson = tableCFG.queryJson;
    copyMainCFG.isHeaderFilter = tableCFG.isHeaderFilter;
    mainCFGArr.push(copyMainCFG);

    // 判断是否存在子表
    let { SUBTABLE } = i;
    if (SUBTABLE?.length) {
      let newSUBTABLE = SUBTABLE.map((item) => {
        let i = {};
        i.hasTableTools = false;
        i.hasSeq = false;
        i.toolsConfig = [];
        i.expandID = "";
        i.BILLNO = item.BILLNO;
        i.loading = false;
        i.VNAME = item.VNAME;
        i.height = item.TABLEHEIGHT * 1 || 150;
        i.queryUrl = item.SLOTCFG ? item.SLOTCFG : getQueryUrl(item.BUTTON);
        i.tableColumns = getShowCFG(item.COLUMNS);
        i.allColumns = item.COLUMNS;
        i.hasFill = true;
        i.tableData = [];
        i.buttons = item.BUTTON;
        i.mergeCFG = getmergeCFGID(i.tableColumns);
        return i;
      });
      subCFGArr.push({ subtable: newSUBTABLE });
    }
  });
  pageConfig.mainTableCFG = mainCFGArr;
  subTableCFGByMain.value = subCFGArr;
  // console.log( mainCFGArr , 1112 , filterFileid );
}

function getmergeCFGID(data) {
  let a = [];
  data.forEach((el) => {
    if (el.TOTALTYPE && el.TOTALTYPE != "-") {
      a.push(el.FIELD);
    }
  });
  return a;
}

function getQueryUrl(data, t) {
  if (Array.isArray(data)) {
    let a = [];
    if (t == "tree") {
      a = data.filter((i) => {
        return i.ACTION == "QRY" && i.VTYPE == 20;
      });
    } else {
      a = data.filter((i) => {
        return i.ACTION == "QRY" && i.VTYPE != 20;
      });
    }
    return a.length ? a[0].ACTIONADDRESS : "";
  }
}

function getTreeData() {
  let params = getUrlParams(treeQueryUrl.value);
  let data = {
    KEYWORD: "",
    ...params,
    PAGENUM: 1,
    TYPE: "1",
    PAGESIZE: 10000,
    SORTNAME: "",
    SORTORDER: "",
    MODULEID: routerParams.BILLNO,
    PAGEID: routerParams.ACTION,
  };
  getTableData(treeQueryUrl.value, data).then((res) => {
    let { TOTAL, RECORDS } = res.RESULT;
    treeOptions.value = res.RESULT;
    if (!res.RESULT[0].ISDISABLED) {
      pageConfig.defaultExpandedKeys = [res.RESULT[0].VALUE];
      treeNode.value = res.RESULT[0];
      getTBData();
    }

    // 暂时移除默认选中第一条的功能
    // if (res.RESULT.length) {
    //   let data = {};
    //   if (!res.RESULT[0].CHILDREN.length) {
    //     data = res.RESULT[0];
    //   } else if (!res.RESULT[0].CHILDREN[0].length) {
    //     data = res.RESULT[0].CHILDREN[0];
    //   } else if (!res.RESULT[0].CHILDREN[0].CHILDREN[0].length) {
    //     data = res.RESULT[0].CHILDREN[0].CHILDREN[0].CHILDREN[0];
    //   }
    //   queryJson.value.PK_CLASS = data.VALUE;
    //   treeNode.value = data; // ||  !data.ISDISABLED
    //   getTBData();
    // }
  });
}

// 加载表格数据
function getTBData() {
  tableCFG.loading = true;
  queryDrawer.value = false;
  subTableList.subTableData = [];

  let newPageID = pageConfig.mainTable.length
      ? pageConfig.mainTable[pageConfig.mainActive].BILLNO
      : routerParams.ACTION,
    PARENTPAGE = pageConfig.mainTable.length ? routerParams.ACTION : "";
  // 是否多主表，多主表时切换主表的菜单id
  let newMenuID = routerParams.BILLNO;
  if (pageConfig.mainTable.length) {
    let newMainActive = pageConfig.mainTable[pageConfig.mainActive];
    newMenuID = newMainActive.MODELID || newMainActive.PK_MODULE;
  }

  let urlParams = getUrlParams(pageConfig.queryUrl);
  let data = {
    ...queryJson.value,
    ...urlParams,
    PAGENUM: pageInfo.currentPage,
    PAGESIZE: pageInfo.pageSize,
    SORTNAME: pageInfo.sortName,
    REVERSE: pageInfo.sortOrder,
    MODULEID: newMenuID,
    PAGEID: newPageID,
    PARENTPAGE: PARENTPAGE,
  };
  delete data.createTime;

  if (myCustomForm.value.length) {
    data.CUSTOMQUERY = myCustomForm.value;
  }

  getTableData(pageConfig.queryUrl, data)
    .then((res) => {
      let { TOTAL, RECORDS, TOTALDATA } = res.RESULT;
      tableData.value = RECORDS;
      totalData.value = TOTALDATA ? JSON.parse(TOTALDATA) : null;
      pageInfo.totalResult = TOTAL;
      tableCFG.loading = false;
      tableCFG.hasEmpty = RECORDS.length ? false : true;
      // 是否需要设置默认选中
      if (pageConfig.queryUrl.includes("isCheck")) {
        let checkID = getUrlParams(queryUrl.value).isCheck;
        let dataChoose = tableData.value.filter((item) => item[checkID] == 1);
        VTableRef.value.setDefaultChecked(dataChoose);
      }
      if (
        (routerParams.COMP == "VTableSub" &&
          RECORDS.length &&
          pageConfig.mainTableCFG.length == 0) ||
        subTableList.subTableCol[subTableList.active].VCODE ==
          "transporSchedule" ||
        subTableList.subTableCol[subTableList.active].VCODE == "timeline"
      ) {
        let ff = subTableList.subTableCol[0];
        getSUBTBData(tableData.value[0].BILLNO || tableData.value[0].PK_CLASS);
      }
    })
    .catch((errr) => {
      tableCFG.loading = false;
      tableCFG.hasEmpty = true;
    });
}

/*
 * 只刷新某条数据
 */
function getTBDataOne(BILLNO) {
  queryDrawer.value = false;
  let newPageID = pageConfig.mainTable.length
      ? pageConfig.mainTable[pageConfig.mainActive].BILLNO
      : routerParams.ACTION,
    PARENTPAGE = pageConfig.mainTable.length ? routerParams.ACTION : "";
  let urlParams = getUrlParams(pageConfig.queryUrl);
  let data = {
    BILLNO,
    ...urlParams,
    PAGENUM: pageInfo.currentPage,
    PAGESIZE: pageInfo.pageSize,
    SORTNAME: pageInfo.sortName,
    REVERSE: pageInfo.sortOrder,
    MODULEID: routerParams.BILLNO,
    PAGEID: newPageID,
    PARENTPAGE: PARENTPAGE,
  };
  getTableData(pageConfig.queryUrl, data)
    .then((res) => {
      let { RECORDS } = res.RESULT;
      if (RECORDS && RECORDS.length == 1) {
        let findIndex = tableData.value.findIndex((i) => i.BILLNO == BILLNO);
        tableData.value[findIndex] = RECORDS[0];
        VTableRef.value.reloadTableData(tableData.value);
      }
      // 是否需要设置默认选中
      if (pageConfig.queryUrl.includes("isCheck")) {
        let checkID = getUrlParams(queryUrl.value).isCheck;
        let dataChoose = tableData.value.filter((item) => item[checkID] == 1);
        VTableRef.value.setDefaultChecked(dataChoose);
      }
    })
    .catch((errr) => {
      console.error("刷新单条数据失败", errr);
    });
}

// 设置表格是否需要占位列
function setTbaleFill(columnWidth) {
  columnWidth += 40;
  if (columnWidth < window.innerWidth - 100) {
    tableCFG.hasFill = true;
  }
}

// 加载子表格数据
function getSUBTBData(BILLNO) {
  let URL = subTableList.subTableCol[subTableList.active]?.queryUrl;
  let pageID = subTableList.subTableCol[subTableList.active].BILLNO;
  if (URL.includes("batch")) {
    URL = URL.replace("batch=", "");
    if (currentData.value.length && Array.isArray(currentData.value)) {
      BILLNO = currentData.value
        .map((i) => {
          return i.BILLNO;
        })
        .join(",");
    }
  }
  if (!URL) return;
  let urlParams = getUrlParams(URL);
  let data = {
    ...urlParams,
    ...queryJson.value,
    PK_CLASS: BILLNO,
    PK_ORG: BILLNO,
    PK_BILLNO: BILLNO,
    MODULEID: routerParams.BILLNO,
    PAGEID: pageID,
  };

  // 合并选中的整条数据到查询条件里面
  if (currentData.value.length) {
    let lastindex = currentData.value.length - 1;
    data = { ...data, ...currentData.value[lastindex] };
  }

  if (subPageInfo.isShow) {
    let PAGEDATA = {
      PAGENUM: subPageInfo.currentPage,
      PAGESIZE: subPageInfo.pageSize,
      SORTNAME: subPageInfo.sortName,
      REVERSE: subPageInfo.sortOrder,
    };
    data = { ...data, ...PAGEDATA, ...urlParams };
  }

  getTableData(URL, data)
    .then((res) => {
      if (!res.RESULT) {
        subTableList.subTableData = [];
      }
      let { RECORDS, TOTAL, TOTALDATA } = res.RESULT;
      if (Array.isArray(res.RESULT)) {
        subTableList.subTableData = res.RESULT;
      } else {
        subTableList.subTableData = RECORDS;
        subPageInfo.totalResult = TOTAL;
        subTableList.totalData = TOTALDATA ? JSON.parse(TOTALDATA) : null;
      }
    })
    .catch((errr) => {
      tableCFG.loading = false;
    });
}

// 多主表页签点击切换
function handleMainTabsClick(e) {
  pageConfig.mainActive = e.index * 1;
  let activeMain = pageConfig.mainTable[pageConfig.mainActive];
  const { BUTTON, ISSONTABLE, SLOTCFG, QUERY } = activeMain;
  pageConfig.initButton = BUTTON;
  pageConfig.isSonTable = ISSONTABLE == 1;
  pageConfig.batchTable = ISSONTABLE == 1; // 默认批量编辑
  if (QUERY.length) {
    let firstMtableQuery = QUERY;
    initQueryJson = getFormValue(firstMtableQuery);
    queryJson.value = deepClone(initQueryJson);
    tableCFG.queryJson = queryJson.value;
    queryConfig.value = getShowCFG(firstMtableQuery);
  }

  resetTableBtn(BUTTON); // 设置表格中的按钮
  queryUrl.value = SLOTCFG ? SLOTCFG : getQueryUrl(BUTTON);
  let getDetailBtn = BUTTON.filter((i) => {
    return i.ACTION == "DTL";
  });
  detailBtnCFG.value = getDetailBtn.length ? getDetailBtn[0] : null;
  getTBData();
  // 同时切换子表
  if (subTableList.subTableCol.length) {
    subTableList.subTableCol =
      subTableCFGByMain.value[pageConfig.mainActive].subtable;
  }
}

// 子表页签点击时切换
function handleTabsClick(e) {
  subTableList.active = e.index * 1;
  subTableActive.value = subTableList.subTableCol[subTableList.active];
  if (currentData.value.length) {
    getSUBTBData(currentData.value[0].BILLNO) || currentData.value[0].PK_CLASS;
  } else {
    getSUBTBData(tableData.value[0].BILLNO || tableData.value[0].PK_CLASS);
  }
}

const getEvalValue = (DATA, linkCFG) => {
  return eval(linkCFG);
};

// 表格内部的多选事件，顶部筛选排序事件, 超链接事件

function tableChange(data) {
  MBTableData.value = data.data[0];
  if (data.clicktype == "sort") {
    pageInfo.sortName = data.data.sortBy;
    pageInfo.sortOrder = data.data.sort;
    getTBData();
  } else if (data.clicktype == "detail") {
    formModalTableCFG.value.tableBillNo = data.data.BILLNO;
    currentData.value = data.data;
    //承运商评价模板详情
    if (
      detailBtnCFG.value.VTYPE == 21 &&
      detailBtnCFG.value.PAGEPATH == "type:cyspjmb"
    ) {
      reportFromData.value.moduleid = detailBtnCFG.value.PK_MODULE;
      reportFromData.value.pageid = detailBtnCFG.value.PK_PAGE;
      reportFromData.value.type = 2;
      reportFromData.value.billno = data.data.BILLNO;
    }
    handelEvent({ data: detailBtnCFG.value, row: data.data });
  } else if (data.clicktype == "checkbox") {
    currentData.value = data.data;
    // let expandRow = getRowExpandRecords()
  }
  if (data.clicktype == "openLink") {
    // 超链接点击事件
    formModalTableCFG.value.tableBillNo = data.data.BILLNO;

    currentData.value = data.data;

    if (data.linkCFG.includes("?") && data.linkCFG.includes(":")) {
      // 如果配置了三元运算
      let currentLinkCFG = getEvalValue(data.data, data.linkCFG);
      let getLinkBtn = pageConfig.initButton.filter((i) => {
        return i.BILLNO == currentLinkCFG;
      });
      // currentData.value = data.data;
      getLinkBtn.length
        ? handelEvent({ data: getLinkBtn[0], row: data.data })
        : null;
    } else {
      let getLinkBtn = pageConfig.initButton.filter((i) => {
        return i.BILLNO == data.linkCFG;
      });
      // currentData.value = data.data;
      getLinkBtn.length
        ? handelEvent({ data: getLinkBtn[0], row: data.data })
        : null;
    }
    // let getLinkBtn = pageConfig.initButton.filter((i) => {
    //   return i.BILLNO == data.linkCFG;
    // });
    // currentData.value = data.data;
    // getLinkBtn.length ? handelEvent({ data: getLinkBtn[0], row: data.data }) : null;
  }
  if (data.clicktype == "openDrawer") {
    colDrawer.value = true;
  } else {
    currentData.value = data.data;
  }

  // 表格点击事件
  if (data.clicktype == "clinkBTN") {
    handelEvent({ data: data.linkCFG, row: data.data });
  }
  if (
    routerParams.COMP == "VTableSub" ||
    pageConfig.hasSubTable ||
    tableCFG.expandID
  ) {
    if (data.checked && pageConfig.hasSubTable) {
      getSUBTBData(
        tableData.value[data.rowIndex].BILLNO ||
          tableData.value[data.rowIndex].PK_CLASS
      );
    }
  }
}
// });

// 展开子表后，子表的单选按钮事件
function tableChangeExpand(data) {
  currentData.value = data.data;
  if (data.clicktype == "openLink") {
    // 超链接点击事件
    formModalTableCFG.value.tableBillNo = data.data.BILLNO;
    // let getLinkBtn = pageConfig.initButton.filter((i) => {
    //   return i.BILLNO == data.linkCFG;
    // });
    // currentData.value = data.data;
    // getLinkBtn.length ? handelEvent({ data: getLinkBtn[0], row: null }) : null;
    if (data.linkCFG.includes("?") && data.linkCFG.includes(":")) {
      // 如果配置了三元运算
      let currentLinkCFG = getEvalValue(data.data, data.linkCFG);
      let getLinkBtn = pageConfig.initButton.filter((i) => {
        return i.BILLNO == currentLinkCFG;
      });
      // currentData.value = data.data;
      getLinkBtn.length
        ? handelEvent({ data: getLinkBtn[0], row: data.data })
        : null;
    } else {
      let getLinkBtn = pageConfig.initButton.filter((i) => {
        return i.BILLNO == data.linkCFG;
      });
      currentData.value = data.data;
      getLinkBtn.length
        ? handelEvent({ data: getLinkBtn[0], row: data.data })
        : null;
    }
  }

  if (data.clicktype == "detail") {
    formModalTableCFG.value.tableBillNo = data.data.BILLNO;
    currentData.value = data.data;
    let EDetailBtn = subTableList.subTableCol[0].buttons.find((i) => {
      return i.ACTION == "DTL";
    });
    if (!EDetailBtn) {
      ElMessage({
        message: "详情按钮未配置，无法进行查看",
        type: "error",
      });
      return;
    }
    handelEvent({ data: EDetailBtn, row: data.data });
  }
}

// 卡片风格自动下一页
function nextPage() {
  console.log("nextPage", pageInfo);
}

// 分页点击
function handlePageChange({ currentPage, pageSize }) {
  pageInfo.currentPage = currentPage;
  pageInfo.pageSize = pageSize;
  getTBData();
}

// 子表分页
function handleSubPageChange({ currentPage, pageSize }) {
  subPageInfo.currentPage = currentPage;
  subPageInfo.pageSize = pageSize;
  getSUBTBData(currentData.value[0].BILLNO || currentData.value[0].PK_CLASS);
}

// 根据表格高度设置默认的分页大小
function setTableHeight(PAGESIZE) {
  // 顶部导航 60 + 边距 10 + 页签38 + 查询条件 60 + 按钮42 + 分页 36 = 246
  let otherHeight = 250;
  let mainHeight = null,
    hasQuery = queryConfig.value.length ? true : false;
  mainHeight = window.innerHeight - otherHeight;
  if (!pageConfig.hasSubTable) {
    if (mainHeight > 750) {
      pageInfo.pageSize = 30;
    } else if (mainHeight > 400) {
      pageInfo.pageSize = 20;
    } else {
      pageInfo.pageSize = 10;
    }
  } else {
    // 存在子表222
    let subTAHeight = subTableList.subTableCol[0].height + "";
    if (subTAHeight.includes("%")) {
      subTAHeight = (subTAHeight.replace("%", "") * 1) / 100;
      subTAHeight = mainHeight * subTAHeight;
      subTableList.subTableCol[0].height = subTAHeight; // 设置子表配置的高度
    }
    pageConfig.footerHeight = subTAHeight || 150;
    mainHeight -= pageConfig.footerHeight;

    if (subTableList.subTableCol.length > 1) {
      mainHeight -= 40;
    }

    if (tableCFG.height > 400) {
      pageInfo.pageSize = 20;
    }
  }
  PAGESIZE ? (pageInfo.pageSize = PAGESIZE) : null;
  tableCFG.height = mainHeight;
  // 左右主子表时
  if (subLayout.value == 1) {
    tableCFG.height = window.innerHeight - otherHeight;
    subTableList.subTableCol[0].height = tableCFG.height;
  }
  // if(tableCFG.isHeaderFilter) tableCFG.height += 30
  pageConfig.mainTableCFG.forEach((i) => {
    i.height = mainHeight - 40;
  });
}

// 设置表格内的按钮状态
function setTableBtnStatus(condition, row) {
  let DATA = row;
  if (DATA && evilFn2(DATA, condition)) {
    return true;
  }
  return false;
}

function evilFn2(row, fn) {
  const DATA = JSON.parse(JSON.stringify(row)) || Object.create(null);
  let Fn = new Function("DATA", `return ${fn}`);
  const proxy = new Proxy(DATA, {
    has(target, key) {
      return true;
    },
  });
  return Fn(proxy);
}

const tableToolsBTN = ref([]);
// 处理表格常用按钮
function resetTableBtn(data) {
  if (!Array.isArray(data)) return [];
  let showData = [],
    ztreeBtn = [],
    CYBTN = [], // 常用按钮
    toolsBtn = [], // 表格操作按钮
    groupBtn = []; // 分组按钮
  data.forEach((i) => {
    if (i.CHILDREN.length) {
      i.ISSHOW == 1 && groupBtn.push(i);
    } else {
      if (i.ISSHOW > 0 && i.VTYPE != "20" && i.POSITION != 2) {
        if (i.ISOFTEN == 1) {
          CYBTN.push(i);
        } else {
          showData.push(i);
        }
      }
      if (i.ISSHOW > 0 && i.POSITION == 2) {
        toolsBtn.push(i);
      }
      if (i.VTYPE == "20") {
        hasTree.value = true;
        ztreeBtn.push(i);
      }
    }
  });
  treeButton.value = ztreeBtn;
  topButton.value = [...CYBTN, ...showData, ...groupBtn];
  tableToolsBTN.value = toolsBtn;
  treeButtonAuth.value = ztreeBtn.map((i) => {
    return i.ACTION;
  });
}
function resetQuery() {
  queryJson.value = deepClone(initQueryJson);
  queryJson.value.PK_CLASS = tableBillNo;
  if (hasTree.value) {
    queryJson.value.PK_CLASS = treeNode.value?.VALUE;
  }
}
const myCustomForm = ref([]);
// 查询按钮执行事件
function queryEvent() {
  let copyForm = [];
  copyForm.push(customFormOne.value);
  copyForm = [...copyForm, ...customForm.value];
  copyForm = copyForm.filter((i) => i.QUERYFIELD);
  myCustomForm.value = copyForm;
  queryDrawer.value = false;
  pageInfo.currentPage = 1;
  getTBData();
}
const drawerWidth = ref("50%");
const drawerLeft = ref("");
const btnIndex = ref("");
// 表格的功能按钮点击事件 表格内的按钮点击和顶部菜单栏点击
function handelEvent({ data, row }) {
  console.log("🚀 ~ handelEvent ~ data, row :", data, row);
  btnIndex.value = topButton.value.findIndex(
    (ele) => ele.BILLNO == data.BILLNO
  );
  let selectRecords = [];
  pageConfig.activeBtn = data;
  if (row) {
    selectRecords = [row];
    currentData.value = [row];
  } else {
    selectRecords = currentData.value;
  }
  // 如果弹窗大小的值存在就进行设置弹窗大小  VTYPE =2  7  是开弹窗
  if (data.RATIO) {
    let WWHH =
      data.RATIO != 1 ? data.RATIO.split("*") : data.PAGEPATH.split("*");
    pageConfig.modalW = WWHH[0];
    pageConfig.modalH = WWHH[1];
  } else {
    pageConfig.modalW = "70%";
    pageConfig.modalH = "60%";
  }

  // 打开弹窗
  if (
    data.VTYPE == 2 ||
    data.VTYPE == 20 ||
    data.VTYPE == 1 ||
    data.VTYPE == 27
  ) {
    pageConfig.modelTitle = data.VNAME || "提示";
    formConfig.formType = data.ACTION || "";
    formModalTableCFG.value.TYPE = data.ACTION;
    formModalTableCFG.value.MODULE = data?.PK_MODULE;
    formModalTableCFG.value.PAGE = data?.PK_PAGE;
    formModalTableCFG.value.tableBillNo = row?.BILLNO;
    if (data.PK_PAGE && data?.PK_PAGE == "slot") {
      openCustemPage(data.VTYPE, data.PAGEPATH); // 打开自定义页面
    } else if (data.ACTION == "STEP") {
      // 打开 步骤 表单页面
      if (data.VTYPE == 1) {
        visibleFormPage.value = true;
      } else {
        pageConfig.modalVisible = true;
      }
    } else {
      // 抽屉打开后，点击同一个值时进行关闭

      if (data.VTYPE == 27 && queryDrawer.value) {
        if (formConfig.formValue.BILLNO == row?.BILLNO) {
          queryDrawer.value = !queryDrawer.value;
          return;
        }
      }

      getOnlyPageConfig(data.CHOOSE2SUB).then(() => {
        if (data.VTYPE == 1) {
          visibleFormPage.value = true;
        } else if (data.VTYPE == 2 || data.VTYPE == 20) {
          pageConfig.modalVisible = true;
        } else if (data.VTYPE == 27) {
          try {
            data.PAGEPATH = data.PAGEPATH || "25%";
            drawerWidth.value = data.PAGEPATH;
            drawerLeft.value = 100 - data.PAGEPATH.replace("%", "") + "%";
            queryDrawer.value = true;
          } catch (error) {}
        }
        if (MasterFormRef.value) MasterFormRef.value.resetForm();
      }); // 获取独立的配置
    }
  } else if (data.VTYPE == 3) {
    let dataChoose = null;
    //  选中数据并提交
    dataChoose = currentData.value;
    if (data.ISCHOOSE == 1) {
      dataChoose = currentData.value[0];
    } else if (data.ISCHOOSE == 2) {
      dataChoose = currentData.value;
    }
    if (data.ISTWOSURE == 1) {
      needConfirm(data, dataChoose);
    } else {
      submitByBtn(data, dataChoose);
    }
  } else if (data.VTYPE == "5") {
    /** 查询方式 提交查询条件参数  */
    let dataChoose = currentData.value;
    if (data.ISCHOOSE == 1) {
      dataChoose = currentData.value[0];
    } else if (data.ISCHOOSE == 2) {
      dataChoose = currentData.value;
    }
    if (data.ISTWOSURE == 1) {
      needConfirm(data, { ...queryJson.value, CHOOSE: dataChoose });
    } else {
      submitByBtn(data, { ...queryJson.value, CHOOSE: dataChoose });
    }
  } else if (data.VTYPE == 7 && data.ACTION == "QRY") {
    //表格弹窗
    if (data.CHOOSE2SUB == "no") {
      // 如果选中数组给子表的配置，是 del，则表示要删掉数据
      selectRecords = [];
      currentData.value = [];
    }

    const [val1, val2] = data.ACTIONADDRESS.split(",");
    formModalTableCFG.value.PAGE = val2;
    formModalTableCFG.value.MODULE = val1;
    // formModalTableCFG.value.tableBillNo = currentData.value[currentData.value.length - 1].billno;
    formModalTableCFG.value.ListtableData =
      selectRecords[selectRecords.length - 1];
    // currentData.value[currentData.value.length - 1];
    pageConfig.modelTitle = data.VNAME || "提示";
    modalPageInfo.pageSize = 10;
    modalPageInfo.currentPage = 1;
    tableShowCGF.value = true;
  }
  //  文件流下载 导出
  if (data.VTYPE == 13) {
    let chooseData = [];
    // let chooseData = currentData.value
    //   ? currentData.value.map((i) => i.BILLNO).join(",")
    //   : "";
    if (currentData.value.length) {
      chooseData = currentData.value.map((i) => i.BILLNO).join(",");
    }

    let PARENTPAGE = pageConfig.mainTable.length ? routerParams.ACTION : "";
    let UrlData = getUrlParams(data.ACTIONADDRESS);
    let aaDown = {
      APPID: "",
      // DATA: data.ISTWOSURE == 1 ? { BILLNO: currentData.value[0].BILLNO , ...queryJson.value } : {},
      DATA: { CHOOSEBILLNO: chooseData, ...queryJson.value, ...UrlData },
      KEY: "",
      MODULEID: routerParams.BILLNO,
      PAGEID: pageConfig.activeBtn.PK_PAGE,
      PARENTPAGE: PARENTPAGE,
      VERSION: "",
    };

    topButton.value[btnIndex.value].btnLoading = true;
    bigLoading.value = true
    handleExport(data.ACTIONADDRESS, aaDown);
  }
  // 文件路径下载
  if (data.VTYPE == 15) {
    downFilesByUrl(data);
  }
  //模板新增
  if (data.VTYPE == 17) {
    pageConfig.modelTitle = data.VNAME || "提示";
    formConfig.formType = data.ACTION || "";
    mbType.value = true;
    if (MBConfig.MODULEID == "" && MBConfig.PAGEID == "") {
      MBConfig.MODULEID = MBTableData.value.PK_MODULE;
      MBConfig.PAGEID = MBTableData.value.PK_PAGE;
    } else {
      formModalTableCFG.MODULE = MBConfig.MODULEID;
      formModalTableCFG.PAGEID = MBConfig.PAGEID;
    }
    pageConfig.modalVisible = true;
    getOnlyPageConfig(data.CHOOSE2SUB, 17); // 获取独立的配置
  }
  //打开菜单
  if (data.VTYPE == 16) {
    // if (formModalTableCFG.value.tableBillNo != "") {
    //   router.push({
    //     path: data.ACTIONADDRESS,
    //     query: { billno: formModalTableCFG.value.tableBillNo },
    //   });
    // }

    if (data.OTHER == "fenceMap") {
      router.push({
        path: data.ACTIONADDRESS,
        query: { billno: currentData.value[0].BILLNO },
      });
    } else if (data.OTHER == "formBillNo") {
      const orderNos = currentData.value.map((order) => order.BILLNO).join(",");
      router.push({
        path: data.ACTIONADDRESS,
        query: { billno: orderNos },
      });
    } else {
      router.push({
        path: data.ACTIONADDRESS,
        query: { billno: formModalTableCFG.value.tableBillNo },
      });
    }
  }
  if (data.VTYPE == 21 && data.PAGEPATH == "type:cyspjmb") {
    reportCGF.value = true;
    let arr = currentData.value[currentData.value.length - 1].BILLNO;
    // 打开弹窗
    ReportType.value = "";
    ReportType.value = 1;
    pageConfig.modelTitle = data.VNAME || "提示";
    reportFromData.value.moduleid = data.PK_MODULE;
    reportFromData.value.pageid = data.PK_PAGE;
    reportFromData.value.type = ReportType.value;
    reportFromData.value.billno = arr;
    reportFromData.value.queryURL = data.ACTIONADDRESS;
    reportFromData.value.saveURL = data.APPLETOTHER;
    pageConfig.modalVisible = true;
    reportFromData.value.isDetail = false;

    if (data.ACTION == "DTL") {
      reportFromData.value.isDetail = true;
    }
  }
  //承运商评价模板审核按钮
  if (
    data.VTYPE == 21 &&
    data.ACTION == "EDIT" &&
    data.PAGEPATH == "type:cyspjmb"
  ) {
    ReportType.value = "";
    ReportType.value = 2;
    let arr = currentData.value[currentData.value.length - 1].BILLNO;
    // 打开弹窗
    reportFromData.value.moduleid = data.PK_MODULE;
    reportFromData.value.pageid = data.PK_PAGE;
    reportFromData.value.type = ReportType.value;
    reportFromData.value.billno = arr;
    reportFromData.value.examine = true;
    reportFromData.value.isDetail = false;
    pageConfig.modelTitle = data.VNAME || "提示";
    pageConfig.modalVisible = true;
  }
  // 启用批量操作  ACTION: "BATCHEDIT"  isSonTable
  // if (data.VTYPE == 22 && data.ACTION == "BATCHEDIT") {
  //   pageConfig.batchTable = !pageConfig.batchTable;
  //   data.VNAME = pageConfig.batchTable ? "取消编辑" : "批量编辑";
  // }

  // 启用了批量编辑时的数据提交功能   { LABEL: "保存并重置", VALUE: "14" },
  if (pageConfig.batchTable && data.VTYPE == 14) {
    batchTableSubmit(data);
  }

  // 查看审批流节点
  if (data.VTYPE == 23) {
    let workBillNo = Array.isArray(currentData.value)
      ? currentData.value[0].PROCESSINSTANCEID
      : currentData.value.PROCESSINSTANCEID;
    // ElMessage({
    //   message: "未获取到单据的审批流主键PROCESSINSTANCEID无法查看审批节点！",
    //   type: "error",
    // });
    if (!workBillNo) return;
    detailDo(workBillNo).then((res) => {
      workDoData.value = res.RESULT;
      pageConfig.modalW = "40vw";
      pageConfig.modalH = "60%";
      workModal.value = true;
    });
  }

  // 分享 ，复制到粘贴板
  if (data.VTYPE == 24) {
    let arr = [];
    //获取客户端
    let newArr = tableCFG.tableColumns.filter((ele) => ele.FIELD == "CTYPENO");
    let newArr1 = JSON.parse(newArr[0].OTHER);
    currentData.value.forEach((item, index) => {
      let terminalTypArr = newArr1.filter((ele) => ele.VALUE == item.CTYPENO);
      arr.push(
        // `客户：${item.CUSTOMERNAME}\n客户端：${item.CTYPENO}\n机器码：${item.MACCODE}\n注册码：${item.REGCODE} \n有效期：${item.EXPIREDATE} \n************************`
        `客户：${item.CUSTOMERNAME}\n客户端：${terminalTypArr[0].LABEL}\n机器码：${item.MACCODE}\n注册码：${item.REGCODE} \n有效期：${item.EXPIREDATE} \n************************`
      );
    });
    let str = arr.join("\n");
    copyTextSuccess(str);
  }

  // 文件预览
  if (data.VTYPE == 25) {
    previewFilesByUrl(data);
  }
  // 单据溯源
  if (data.VTYPE == 29) {
    getSource(data);
  }
}
// 复制
function copyTextSuccess(innerText) {
  const textarea = document.createElement("textarea");
  textarea.textContent = innerText;
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  proxy.$modal.msgSuccess("复制成功，请打开QQ/微信分享至好友~");
}

function getDetail(formurl) {
  if (!detailBtnCFG && !URL) {
    proxy.$modal.msgError("详情按钮未配置，无法进行查看详情和编辑");
    return;
  }

  let URL = null,
    Bid = null,
    PK_PAGE = null;
  // 如果是点击的左侧树进行编辑分类
  if (
    pageConfig.activeBtn.VTYPE == 20 &&
    pageConfig.activeBtn.ACTION == "EDIT"
  ) {
    URL = detailTreeBtn.value.ACTIONADDRESS;
    Bid = treeNode.value.VALUE;
    PK_PAGE = pageConfig.activeBtn.PK_PAGE;
  } else {
    try {
      URL = formurl || detailBtnCFG.value.ACTIONADDRESS;
      Bid = Array.isArray(currentData.value)
        ? currentData.value[0].BILLNO
        : currentData.value.BILLNO;
      // 如果选择的是多条数据，而且按钮是多选类型时
      if (Array.isArray(currentData.value)) {
        Bid =
          pageConfig.activeBtn.ISCHOOSE == 2
            ? currentData.value
                .map((i) => {
                  return i.BILLNO;
                })
                .join(",")
            : currentData.value[0].BILLNO;
      } else {
        Bid = currentData.value.BILLNO;
      }
    } catch (error) {
      Bid = treeNode.value ? treeNode.value?.VALUE : "";
    }
  }
  if (URL == "BYCOLUMN") {
    let newFormValue = Array.isArray(currentData.value)
      ? currentData.value[0]
      : currentData.value;
    formConfig.formValue = Object.assign(formConfig.formValue, newFormValue);
    formConfig.showDetail = true;
    return;
  }

  PK_PAGE = pageConfig.activeBtn.PK_PAGE;

  let data = {
    BILLNO: Bid,
    PK_CLASS: Bid,
    TREE_BILLNO: treeNode.value?.VALUE || "",
    MODULEID: routerParams.BILLNO,
    PAGEID: PK_PAGE,
  };

  if (URL.includes("?")) {
    let queryParams = getUrlParams(URL);
    data = Object.assign(queryParams, data);
  }

  queryDetailParams.value = data;
  axiosSave(URL, data).then((newRes) => {
    let res = newRes.RESULT;
    let hasDefaultValue = JSON.stringify(formConfig.formValue).includes("$");
    hasDefaultValue
      ? resetFormByUrl(formConfig.formValue, res)
      : (formConfig.formValue = Object.assign(formConfig.formValue, res));
    formConfig.showDetail = true;
  });
}

// 溯源数据
const SourceData = ref();
const SourceDataStyle = ref({
  color: "#fff",
  background: "#108ffe",
});
// 查询单据溯源数据
function getSource(data) {
  let URL = data.ACTIONADDRESS,
    params = getUrlParams(URL);
  let newData = {
    ...params,
    MODULEID: data.PK_MODULE,
    PAGEID: data.PK_PAGE,
    BILLNO: currentData.value[0].BILLNO,
  };
  axiosSave(URL, newData).then((res) => {
    // SourceData.value = { ...res.RESULT, style: SourceDataStyle.value };
    SourceData.value = resetArr2orgTree(res.RESULT);
    tracingModal.value = true;
  });
}

// 设置默认值配置的变量时，进行变量转换 默认值  $Var 代表变量
function resetFormByUrl(initVal, resVal) {
  for (let key in initVal) {
    if (key != "EnumData" && key != "_getDICT" && initVal[key]?.includes("$")) {
      let newKey = initVal[key].replace("$", "");
      initVal[key] = resVal[newKey];
    }
  }
  formConfig.formValue = Object.assign(initVal, resVal);
}

// 获取独立的配置  比如弹窗中的表单
function getOnlyPageConfig(CHOOSE2SUB = "", btnType) {
  return new Promise((resolve) => {
    let pageID = {};
    if (btnType == 17) {
      pageID = {
        MODULEID: MBConfig.MODULEID,
        PAGEID: MBConfig.PAGEID,
      };
    } else {
      pageID = {
        MODULEID: routerParams.BILLNO,
        PAGEID: pageConfig.activeBtn.PK_PAGE,
      };
    }
    formModalTableCFG.value.MODULE = routerParams.BILLNO;
    formModalTableCFG.value.PAGE = pageConfig.activeBtn.PK_PAGE;
    formConfig.showDetail = false;
    getPageConfig(pageID).then((res) => {
      const {
        QUERY,
        COLUMNS,
        SUBTABLE,
        FLOATCOM,
        BUTTON,
        SLOTCFG,
        VDEF2,
        PAGETITLE,
        TABLEHEIGHT,
      } = res.RESULT;

      if (btnType == 17) {
        COLUMNS.unshift({
          SORTCODE: 1,
          FIELD: "TEMPVNAME",
          LABEL: "模板名称",
          COL: 6,
          CONTROLS: "ExTextBox",
          ISREQUIRE: 1,
          ISSHOW: 1,
        });
      }
      try {
        pageConfig.pageTitle = PAGETITLE;
        formConfig.formColumns = COLUMNS;
        subTableHeight.value = TABLEHEIGHT ? TABLEHEIGHT * 40 : 150;
        let newBUTTON = BUTTON.map((i) => {
          i.btnLoading = false;
          return i;
        });
        formConfig.buttonList = resetFormBtn(newBUTTON);
        formConfig.formBase = getFormValue(COLUMNS, false, queryJson.value);
        otherCFG.value.labelWidth = VDEF2 ? VDEF2 + "px" : null;
        otherCFG.value.GRID = res.RESULT.GRID;
        if (CHOOSE2SUB) {
          formConfig.formBase[CHOOSE2SUB] = currentData.value;
        }
        formConfig.formValue = JSON.parse(JSON.stringify(formConfig.formBase));
        formConfig.formRules = getFormRule(COLUMNS);

        SubTableConfig.value = SUBTABLE.map((el) => {
          el._rowConfig = COLUMNS.find((al) => al.FIELD == el.FIELD);
          return el;
        });
        infoConfig.value = !FLOATCOM
          ? []
          : FLOATCOM.map((el) => {
              el._rowConfig = COLUMNS.find((al) => al.FIELD == el.FIELD);
              return el;
            });

        // 特殊处理地区赋值问题，
        let areaCFG = COLUMNS.filter((i) => {
          return i.CONTROLS == "ExArea";
        });

        let setValByZtree = COLUMNS.filter((i) =>
          i.DEFAULTVAL?.includes("TREE|")
        );
        if (setValByZtree.length && treeNode.value) {
          setValByZtree.forEach((i) => {
            let setParams = getUrlParams(i.DEFAULTVAL.replace("TREE|", "?"));
            for (let i in setParams) {
              formConfig.formValue[i] = treeNode.value[setParams[i]];
            }
          });
        }
        // 把选中的左侧树如果是区域，且不符合格式时删除
        if (areaCFG.length) {
          let areaID = areaCFG[0].FIELD;
          if (formConfig.formValue[areaID].split(",").length < 3) {
            formConfig.formValue[areaID] = "";
          }
        }
        if (SUBTABLE.length > 0 && !CHOOSE2SUB) setSubTableData();
        if (formConfig.formType == "DTL" || formConfig.formType == "EDIT") {
          formConfig.showDetail = false;
          getDetail(SLOTCFG);
        } else {
          formConfig.showDetail = true;
        }

        if (pageConfig.activeBtn.BTNTITLE == "secondaryCon") {
          // 如果成立代表是货主签收保存的按钮 需要进行二次确认
          let portData = {
            PKBILLNO: currentData.value[0].BILLNO,
          };
          getOrinfo(portData).then((res) => {
            if (res.RESULT.length) {
              isDetailBtnTwice.value = true;
              originalEntry.value = res.RESULT;
            } else {
              isDetailBtnTwice.value = false;
            }
          });
        }
      } catch (error) {
        console.error(55, error);
      }
    });

    resolve();
  });
}
// 处理表单里面的按钮
function resetFormBtn(BUTTON) {
  const PAGEACTION = pageConfig.activeBtn.ACTION;
  if (BUTTON.length) {
    return BUTTON;
  }
  if (!pageConfig.activeBtn.ACTIONADDRESS) {
    return [];
  }
  return [
    {
      ...pageConfig.activeBtn,
      ACTIONADDRESS: pageConfig.activeBtn.ACTIONADDRESS,
      VNAME: "保存",
      BILLNO: "999",
      ACTION: "ADD",
    },
  ];
}

const setShowBtn = (b) => {
  const PAGEACTION = pageConfig.activeBtn.ACTION;
  if (b.ISSHOW == 1 && !b.OTHER) return true;
  if (b.ISSHOW == 2 && b.OTHER) {
    try {
      if (
        b.OTHER.includes("PAGEACTION") &&
        evilFn({ PAGEACTION: PAGEACTION }, b.OTHER)
      ) {
        return true;
      }
    } catch (error) {
      console.error(error);
    }
  }
};

const setSubTableData = () => {
  let rules = [];
  for (let i = 0; i < SubTableConfig.value.length; i++) {
    const el = SubTableConfig.value[i];
    let { COLUMNS, FIELD, GROUPNO } = el;
    let baseData = getFormValue(COLUMNS),
      baseTSData = getFormValue(COLUMNS, "TS"); // 含 同上 数据
    delete baseData.EnumData;
    formConfig.formValue[FIELD] =
      GROUPNO === "TAB"
        ? [
            // { ...baseData },
            // { ...baseData },
            // { ...baseData },
            // { ...baseData },
            // { ...baseData },
          ]
        : { ...baseData };
    let rule = getFormRule(COLUMNS);
    rules.push(rule);
  }
  SubTableRules.value = rules;
};

function needConfirm(data, selectRecords) {
  ElMessageBox.confirm(`您确定要将该单据${data.VNAME}吗?`, "确认提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    submitByBtn(data, selectRecords);
  });
}

const checkedVal = ref(null);
// 列表选中的数据
const EtbaleChange = (e) => {
  checkedVal.value = e;
};

const EtbaleLinkChange = (data) => {
  // 表单弹框中的超链接事件
  tableChange(data);
};
function submitEvent(URL, sdata) {
  let saveData;
  if (mbType.value) {
    delete sdata.EnumData;
    saveData = {
      ...sdata,
      // DEFAULTVALUE: sdata,
      PKBILLNO: queryJson.value.PK_CLASS,
      MODULEID: formModalTableCFG.MODULE,
      PAGEID: formModalTableCFG.PAGEID,
    };
  } else {
    if (
      pageConfig.activeBtn.ISCHOOSE == 2 &&
      checkedVal.value &&
      pageConfig.activeBtn.BILLNO != 999
    ) {
      // 如果依赖是2并且不是保存按钮  代表是列表的多选，传列表的数组,
      let arr = checkedVal.value.map((ele) => {
        return ele.BILLNO;
      });
      saveData = arr;
    } else {
      // 是否多主表，多主表时切换主表的菜单id
      let newMenuID = routerParams.BILLNO;
      if (pageConfig.mainTable.length) {
        let newMainActive = pageConfig.mainTable[pageConfig.mainActive];
        newMenuID = newMainActive.MODELID || newMainActive.PK_MODULE;
      }
      saveData = {
        ...sdata,
        MODULEID: newMenuID,
        PAGEID: pageConfig.activeBtn.PK_PAGE || routerParams.ACTION,
      };
    }
  }
  let urlParams = getUrlParams(pageConfig.activeBtn.ACTIONADDRESS);
  saveData = Object.assign(saveData, urlParams);
  axiosSave(URL, saveData)
    .then((res) => {
      if (pageConfig.activeBtn.ACTION == "CALCAPI") {
        formConfig.formValue = Object.assign(saveData, res.RESULT);
        formConfig.buttonList[activeBtnIndex.value].btnLoading = false;
        return "";
      }
      pageLoading.value = false;
      ElMessage({
        message: res.MESSAGE,
        type: "success",
      });
      setTimeout(() => {
        if (pageConfig.modalVisible) {
          closeModal();
        }
        if (visibleFormPage.value) {
          visibleFormPage.value = false;
        }
        if (hasTree.value && treeQueryUrl) {
          if (pageConfig.activeBtn.VTYPE == "20") {
            getTreeData();
          }
        }
        if (res.STATUS == 200 && pageConfig.activeBtn.PAGEPATH?.includes("$")) {
          let Url = pageConfig.activeBtn.PAGEPATH.replace("$", "");
          router.push({
            path: Url,
          });
        }

        // 提交数据后是否刷新页面 ， ISREFRESH 0-刷新列表 1-刷新当前数据 2-不刷新
        if (pageConfig.activeBtn?.ISREFRESH == 2) return;
        if (
          !pageConfig.activeBtn.ISREFRESH ||
          pageConfig.activeBtn.ISREFRESH == "0"
        ) {
          currentData.value = [];
          colDrawer.value = false;
          tableData.value = [];
          subTableList.subTableData = [];
          getTBData();
        } else if (pageConfig.activeBtn.ISREFRESH == "1") {
          getTBDataOne(saveData.BILLNO);
        }
        formConfig.buttonList[activeBtnIndex.value].btnLoading = false;
      }, 10);
    })
    .finally(() => {
      pageLoading.value = false;
      modalRef.value != null && modalRef.value.getTBData();
      setTimeout(() => {
        formConfig.buttonList[activeBtnIndex.value].btnLoading = false;
      }, 3000);
    });
}

function submitByBtn(btn, data) {
  let params = btn.ACTIONADDRESS.includes("?")
      ? getUrlParams(btn.ACTIONADDRESS)
      : {},
    sdata = null;
  if (btn.ACTION == "DELETE" || btn.ISCHOOSE == 2) {
    let arr = [];
    if (btn.VTYPE == 20) {
      arr.push(treeNode.value.VALUE);
    } else {
      arr = currentData.value.map((i) => {
        return i.BILLNO;
      });
    }
    sdata = { data: arr };
  } else {
    sdata = { ...data, ...params };
  }
  submitEvent(btn.ACTIONADDRESS, sdata);
}

// 批量操作编辑时的保存提交
function batchTableSubmit(btn, row) {
  let URL = btn.ACTIONADDRESS;
  // 单行验证
  ETableRef.value.xEditTable.validate(row).then((valid) => {
    if (valid != undefined) return;
    // let { insertRecords, updateRecords } = ETableRef.value.xEditTable.getRecordset();
    let saveData = deepClone(row);
    delete saveData.EnumData;
    let newData = {
      MODULEID: routerParams.BILLNO,
      PAGEID: btn.PK_PAGE || routerParams.ACTION,
      ...saveData,
    };
    axiosSave(URL, newData).then((res) => {
      proxy.$modal.msgSuccess("提交成功");
      // pageConfig.batchTable = false;
      queryEvent();
    });
  });
}

// 批量操作表格的多选事件
const eTableChange = (data) => {
  currentData.value = data;
};

// 批量表格操作 内部的按钮
const plusRowData = () => {
  let BaseRowData = getFormValue(tableCFG.tableColumns);
  ETableRef.value.xEditTable.insertAt({ ...BaseRowData }, -1);
};

const delConfig = (row) => {
  if (currentData.value.length > 0) {
    proxy.$modal.confirm("是否删除选中的配置？").then((res) => {
      let newRows = currentData.value.filter((el) => el.BILLNO == undefined);
      if (newRows.length > 0) {
        for (let i = 0; i < newRows.length; i++) {
          const el = newRows[i];
          ETableRef.value.xEditTable.remove(el);
        }
      }
      let ids = tableCheck.value.filter((el) => el.BILLNO != undefined);
      if (ids.length > 0) console.warn("批量操作中的删除");
    });
  } else {
    let { BILLNO } = row;
    proxy.$modal.confirm("是否删除？").then((res) => {
      if (BILLNO == undefined) {
        ETableRef.value.xEditTable.remove(row);
      } else {
        proxy.$modal.msgSuccess("模拟删除成功");
        ETableRef.value.xEditTable.remove(row);
      }
    });
  }
};

// 查询条件中的下拉触发查询
const formSelect = (res) => {
  if (res.query) {
    queryEvent();
  }
};
// 回车时触发查询功能
const enterEvent = () => {
  queryEvent();
};

//  弹窗表单提交事件
const formSubmit = () => {
  MasterFormRef.value.submitForm().then((valid) => {
    if (!valid)
      return (formConfig.buttonList[activeBtnIndex.value].btnLoading = false);
    pageLoading.value = true;
    let newData = null;
    if (treeNode.value && treeNode.value.VALUE) {
      formConfig.formValue.PK_CLASS = treeNode.value.VALUE;
    }
    submitEvent(pageConfig.activeBtn.ACTIONADDRESS, formConfig.formValue);
  });
};

// 页面中表单的顶部按钮事件
const activeBtnIndex = ref(null);
const btnLoading = ref(false);
const formBtnEvent = (e, type, indexB) => {
  activeBtnIndex.value = indexB;
  formConfig.buttonList[indexB].btnLoading = true;
  // console.log(333, e);

  if (e.ACTION == "PRINT" || e.VTYPE == 13 || e.VTYPE == 15) {
    let aa = {
      APPID: "",
      DATA: { BILLNO: formConfig.formValue.BILLNO },
      KEY: "",
      MODULEID: queryDetailParams.value.MODULEID,
      PAGEID: queryDetailParams.value.PAGEID,
      VERSION: "",
    };
    //  文件流下载
    if (e.VTYPE == 13) {
      handleExport(e.ACTIONADDRESS, aa);
    }
    if (e.VTYPE == 15) {
      downFilesByUrl(e, type);
    }
  } else if (e.ACTION == "ADD" || e.ACTION == "EDIT" || e.ACTION == "CALCAPI") {
    pageConfig.activeBtn = e;
    formSubmit();
  }
};

// 表格中的展开表单的提交事件

const formBtnEventByTable = (e) => {
  formRefDetail.value.submitForm().then((valid) => {
    if (!valid) return;
    submitEvent(e.ACTIONADDRESS, formConfig.formValue);
  });
};

function handleExport(url, data) {
  topButton.value[btnIndex.value].btnLoading = false;
  bigLoading.value = false
  proxy.download(
    url,
    {
      ...data,
    },
    ""
  );
}

//报表模板按钮
function reportSubmit() {
  RTableRef.value.submit().then((res) => {
    if (!res) return;
    if (reportFromData.value.examine == true && ReportType.value == 2) {
      updetaReportexamine({
        BILLST: RTableRef.value.FormModel.radio,
        CERTIFICATIONDESC: RTableRef.value.FormModel.desc,
        PKBILLNO: reportFromData.value.billno,
        MODULEID: reportFromData.value.moduleid,
        PAGEID: reportFromData.value.pageid,
      }).then(() => {
        ElMessage({
          message: "保存成功",
          type: "success",
        });
        pageConfig.modalVisible = false;
        reportCGF.value = false;
        getTBData();
      });
    } else {
      let URL =
        reportFromData.value.saveURL || "base/bdcarrevaluationdtl/batchSave";
      let saveData = RTableRef.value.reportForm;
      if (URL.includes("?")) {
        let params = getUrlParams(URL);
        saveData = Object.assign(saveData, params);
      }
      updetaReportPost(URL, saveData).then(() => {
        ElMessage({
          message: "保存成功",
          type: "success",
        });
        pageConfig.modalVisible = false;
        reportCGF.value = false;
        getTBData();
      });
    }
  });
}

// 关闭弹窗
function closeModal() {
  if (formRef.value) formRef.value.resetForm();
  if (MasterFormRef.value) MasterFormRef.value.resetForm();
  pageConfig.modalVisible = false;
  reportCGF.value = false;
  tableShowCGF.value = false;
  currentData.value = [];
  VTableRef.value.clearCheckRow();
}

function openQuery() {
  queryDrawer.value = true;
}

function treeBtnEvent(t) {
  let detailBtn = null,
    delBtn = null,
    addBtn = null,
    updata = null;
  treeButton.value.forEach((i) => {
    switch (i.ACTION) {
      case "DTL":
        detailTreeBtn.value = i;
        detailBtn = i;
        break;
      case "ADD":
        addBtn = i;
        break;
      case "EDIT":
        updata = i;
        break;
      case "DELETE":
        delBtn = i;
        break;
    }
  });

  if (t == 3) {
    if (!delBtn) {
      return ElMessage({
        message: "未配置删除按钮，请检查配置！",
        type: "warning",
      });
    }
    ElMessageBox.confirm(`您确定要执行该操作吗?`, "确认提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      pageConfig.activeBtn = delBtn;
      submitByBtn(delBtn, treeNode.value);
    });
  }

  if (t == 1) {
    if (!addBtn) {
      return ElMessage({
        message: "未配置新增按钮，请检查配置！",
        type: "warning",
      });
    }
    handelEvent({ data: addBtn, row: null });
  }

  if (t == 2) {
    if (!updata || !detailBtn) {
      return ElMessage({
        message: "未配置编辑和详情按钮，请检查配置！",
        type: "warning",
      });
    }

    handelEvent({ data: updata, row: null });
  }
}

function set24col(data, n) {
  let newdata = deepClone(data);
  let data2 = newdata.filter((i) => {
    // i.COL = n == 24 ? n : i.COL || 4;
    return i.GROUPID == 1;
  });

  if (n != 24) {
    data2 = data2.slice(0, 6);
    let sumCol = 0,
      data3 = [];
    data2 = data2.forEach((i) => {
      sumCol += i.COL * 1;
      if (sumCol < 25) {
        data3.push(i);
      }
    });
    data2 = data3;
  } else {
    data2 = newdata.slice(4);
  }
  return data2;
}

//表格弹窗的常用按钮
function TbaBtnData(data) {
  TabModelConfig.buttonList = data;
}
//表格弹窗中底部按钮
function TabtnEvent(data) {
  if (data.VTYPE == 3) {
    let dataChoose = null;
    //  选中数据并提交
    if (data.ISCHOOSE == 1) {
      // 需要选中数据，如果需要选中数据
      dataChoose = TabModelConfig.tabValue;
    } else if (data.ISCHOOSE == 2) {
      dataChoose = TabModelConfig.tabValue;
    }
    if (data.ISTWOSURE == 1) {
      needConfirm(data, dataChoose);
    } else {
      submitByBtn(data, dataChoose);
    }
  }
}
function btnModelSelectData(data) {
  if (!data) return;
  if (data.clicktype == "openLink") {
    tableChangeExpand(data);
  } else {
    TabModelConfig.tabValue = Array.isArray(data) ? data : [data];
  }
}

function setCustomTitle(data) {
  try {
    if (data.includes("title")) {
      let titleJson = JSON.parse(data);
      customTitle.value = titleJson;
    }
  } catch (error) {}
}

// 通过地址下载文件  type == 1 是表单提交
function downFilesByUrl(data, type) {
  let BILLNO = "",
    PK_PARENT_MENU_ID = "",
    PROJECTID = "",
    FILEID = "";
  if (currentData.value.length && Array.isArray(currentData.value)) {
    BILLNO = currentData.value
      .map((i) => {
        return i.BILLNO;
      })
      .join(",");

    if (data.OTHER && data.OTHER.includes("FILEID")) {
      try {
        let pp = JSON.parse(data.OTHER);
        FILEID = currentData.value
          .map((i) => {
            return i[pp.FILEID];
          })
          .join(",");
        PK_PARENT_MENU_ID = pp.PK_PARENT_MENU_ID || "";
        PROJECTID = currentData.value[0][pp.PROJECTID] || "";
      } catch (error) {
        console.error("获取文件id失败");
      }
    }
  } else {
    BILLNO = currentData.value.BILLNO;
    if (data.OTHER && data.OTHER.includes("FILEID")) {
      try {
        let pp = JSON.parse(data.OTHER);
        FILEID = currentData.value[pp.FILEID];
        PROJECTID = currentData.value[pp.PROJECTID] || "";
        PK_PARENT_MENU_ID = pp.PK_PARENT_MENU_ID || "";
      } catch (error) {
        console.error("获取文件id失败");
      }
    }
  }

  let newdata = {
    FILEID,
    PROJECTID,
    PK_PARENT_MENU_ID,
    PK_CLASS: BILLNO,
    PK_ORG: BILLNO,
    PK_BILLNO: BILLNO,
    BILLNO: BILLNO,
    MODULEID: routerParams.BILLNO,
    PAGEID: pageConfig.activeBtn.PK_PAGE,
  };

  if (type == 1) {
    //  如果是弹窗表单执行时，传整个表单数据
    newdata = { ...newdata, ...formConfig.formValue };
  }

  let getFileParmas = {
    APPID: "",
    DATA: newdata,
    KEY: "",
    MODULEID: routerParams.BILLNO,
    PAGEID: pageConfig.activeBtn.PK_PAGE,
    VERSION: "",
  };

  if (data.OTHER && data.OTHER.includes("FILEID")) {
    handleExport(data.ACTIONADDRESS, getFileParmas);
    return;
  }

  axiosSave(data.ACTIONADDRESS, newdata)
    .then((res) => {
      let url = res.RESULT.URL,
        filename = res.RESULT.VNAME,
        regex = /\.(jpg|jpeg|png|gif)$/i;
      if (url.includes(".pdf") || regex.test(url)) {
        const x = new XMLHttpRequest();
        x.open("GET", url, true);
        x.responseType = "blob";
        x.onload = (e) => {
          // 会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。
          const url = window.URL.createObjectURL(x.response);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          a.click();
        };
        x.send();
      } else {
        let a = document.createElement("a");
        a.setAttribute("href", url);
        a.setAttribute("download", "");
        a.setAttribute("target", "_blank");
        let clickEvent = document.createEvent("MouseEvents");
        clickEvent.initEvent("click", true, true);
        a.dispatchEvent(clickEvent);
      }

      formConfig.buttonList[activeBtnIndex.value].btnLoading = false;
    })
    .catch((err) => {
      console.error(444, err);
    });
}

function previewFilesByUrl(data) {
  let FILEID,
    PK_PARENT_MENU_ID,
    PROJECTID,
    NAMEID = userStore.userInfo.BILLNO;
  if (data.OTHER && data.OTHER.includes("FILEID")) {
    try {
      let pp = JSON.parse(data.OTHER);
      if (currentData.value.length && Array.isArray(currentData.value)) {
        FILEID = currentData.value[0][pp.FILEID];
        PROJECTID = currentData.value[0][pp.PROJECTID] || "";
      } else {
        FILEID = currentData.value[pp.FILEID];
        PROJECTID = currentData.value[pp.PROJECTID] || "";
      }
      PK_PARENT_MENU_ID = pp.PK_PARENT_MENU_ID || "";
    } catch (error) {
      console.error("获取文件id失败");
    }
  }
  let ffid = `FILEID=FD${uuid()}${FILEID}&PK_PARENT_MENU_ID=${PK_PARENT_MENU_ID}&PROJECTID=${PROJECTID}&NAMEID=${NAMEID}&NAME=${
    userStore.userInfo.VNAME
  }`;
  let filePath = data.ACTIONADDRESS + "?" + ffid;
  window.open(filePath, "_blank");
}

function backEvent() {
  treeKeyword.value = "";
  visibleFormPage.value = false;
  formConfig.showDetail = false;
  formConfig.formValue = {};
  currentData.value = [];
}

function closeCustemPage() {
  backEvent();
  queryEvent();
}

const pickerOptions = {
  selectableRange: "9:00-18:00",
  disabledDate(time) {
    return time.getTime() < Date.now() - 8.64e7;
  },
  shortcuts: [
    {
      text: "上午",
      onClick(picker) {
        const now = new Date();
        picker.$emit(
          "pick",
          new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0)
        );
      },
    },
    {
      text: "下午",
      onClick(picker) {
        const now = new Date();
        picker.$emit(
          "pick",
          new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 0, 0)
        );
      },
    },
  ],
};

// 左侧树折叠事件
const treeExpand = () => {
  pageConfig.treeExpand = !pageConfig.treeExpand;
};
/** 动态自定义组件 */
const slotCustemPage = ref();
const openCustemPage = (type, path) => {
  try {
    // visibleFormPage.value = true;
    type == 1
      ? (visibleFormPage.value = true)
      : (pageConfig.modalVisible = true);
    slotCustemPage.value = pageAutoComponent(path);
    // slotCustemPage.value = defineAsyncComponent(() => import(`./page.js`))
  } catch (err) {
    console.error("打开自定义页面", err);
  }
};

// 打开列配置 查询 多模板
const SetColumnsRef = ref(null);
const openDrawer = () => {
  let data = {
    MODULEID: routerParams.BILLNO,
    PAGEID: routerParams.ACTION,
  };
  if (pageConfig.mainTable.length) {
    data.PAGEID = pageConfig.mainTable[pageConfig.mainActive].BILLNO;
  }
  SetColumnsRef.value.openDrawer(hasTemplate.value, data, tableCFG.tabColumns);
};
// 模板选中后
const selectTemplate = (temp) => {
  selectTemp.value = temp.VALUE;
  let data = {
    MODULEID: routerParams.BILLNO,
    PAGEID: routerParams.ACTION,
    BILLNO: temp.VALUE,
  };
  axiosSave("/sys/selectConfig/getColumnById", data).then((res) => {
    let { TEMPLIST, ENGNAMESINFO } = res.RESULT;
    setShowCol.value = ENGNAMESINFO;
  });
};

/** 拖拽表格 */
const dragRowConfig = ref({});
const dragTableRow = (data) => {
  let { OTHER: Url } = dragRowConfig.value;
  let { row, newIndex } = data;
  let newData = {
    LIST: [{ BILLNO: row.BILLNO, SORT: newIndex + 1 }],
  };
  axiosSave(Url, newData).then((res) => {
    getTBData();
  });
};

function TargetMod(t) {
  defaultStyle.value = t;
  if (t == "2") return;
  setTimeout(() => {
    VTableRef.value.refreshColumn();
  }, 10);
}

// // 页面离开后
// onDeactivated(() => {
//   backEvent();
// });

// // 页面进入后
// onActivated(()=>{
//   console.log(456, '页面进入' , currentData.value);

// })

// onMounted(() => {
//   window.addEventListener("resize", setTableHeight);
// });

// onBeforeUnmount(() => {
//   window.removeEventListener("resize", setTableHeight);
// });

// onMounted(() => {
//   setTableHeight();
// });
// 主动暴露方法

// 修改列配置和模板以后重加载页面
function reloadPage() {
  getPageCFG();
}

/** 行编辑结束 */
const editTableClose = (res) => {
  let { row } = res;
  let editBtnConfig = pageConfig.initButton;
  let btnConfig = editBtnConfig.filter((el) => el.VTYPE == 14)[0];
  batchTableSubmit(btnConfig, row);
};

/*
 表格弹窗相关 
*/

const modalPageInfo = reactive({
  currentPage: 1,
  pageSize: 10,
  totalResult: 0,
  sortName: "",
  sortOrder: "",
});

const modalBtnConfig = ref([]);

function handleModalPageChange({ currentPage, pageSize }) {
  modalPageInfo.currentPage = currentPage;
  modalPageInfo.pageSize = pageSize;
  modalRef.value.handlePageChange({ currentPage, pageSize });
}

function modalBtnEvent(data) {
  modalRef.value.TabtnEvent(data);
}

function setParentData(data) {
  if (data.type == "btn") {
    modalBtnConfig.value = data.data;
  } else if (data.type == "totalResult") {
    modalPageInfo.totalResult = data.data;
  }
}

defineExpose({
  pageData: pageInfo, // 页码数据
  pageChange: handlePageChange, // 页面Change方法
});
</script>
<style lang="scss" scoped>
.app-wrap {
  .app-table-box {
    display: flex;
    width: 100%;
    background-color: #fff;
    &-left {
      width: 210px;
      padding: 10px;
      border-right: 10px solid #e7e9f1;
    }
    &-right {
      flex: 1;
      padding: 0 10px;
    }
  }

  .padding-8 {
    padding: 8px;
  }
  .query-wrap {
    // padding: 8px;
    background-color: #fff;
    margin: 10px 0 !important;
    border-radius: 4px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    .query-form {
      width: 100%;
    }
    .flex-row-end {
      padding-left: 6px;
    }
  }
  .tool-wrap {
    // padding-bottom: 8px;
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    align-items: center;
    height: 32px;
    .tree-name {
      font-size: 14px;
      color: var(--el-color-primary);
      float: right;
      max-width: 260px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-right: 20px;
    }
    &-right {
      display: flex;
      padding-top: 10px;
    }
  }
  .page-fixe-bottom {
    position: fixed !important;
    z-index: 10;
    bottom: 10px;
    right: 30px !important;
    height: 34px !important;
  }
}

.tabs-wrap {
  .el-tabs__nav-next {
    line-height: 35px !important;
  }
}
:deep(.el-tabs__nav-next, .el-tabs__nav-prev) {
  line-height: 38px !important;
}
:deep(.el-tabs__nav-prev) {
  line-height: 38px !important;
}
:deep(.el-tabs__header) {
  .el-icon {
    font-size: 16px !important;
  }
}

.modal-title {
  font-weight: 500 !important;
  font-size: 18px;
  color: #000;
}

.vxe-page-wrap {
  // width: 50%;
  position: absolute;
  right: 0;
  z-index: 99;
}

:deep(.show-more-query .el-form--inline .el-form-item) {
  margin-bottom: 10px !important;
}

:deep(.query-wrap .el-form--inline .el-form-item) {
  width: 100% !important;
}

// 拖拽事件样式

.col-tab {
  width: 100px;
  margin: 10px 5px;
}

.itxst {
  width: 600px;
  display: flex;
}

.itxst > div:nth-of-type(1) {
  flex: 1;
}

.itxst > div:nth-of-type(2) {
  width: 270px;
  padding-left: 20px;
}

.item {
  border: solid 1px #eee;
  padding: 6px 10px;
  text-align: left;
}

.item:hover {
  cursor: move;
}

.item + .item {
  margin-top: 10px;
}

.ghost {
  border: solid 1px rgb(19, 41, 239) !important;
}

.chosenClass {
  background-color: #eee;
  opacity: 1;
  border: solid 1px red;
}

.fallbackClass {
  background-color: aquamarine;
}
.menu-btn {
  display: flex;
  justify-content: end;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 10px !important;
}
.query-form {
  :deep(.el-range__icon) {
    width: 0;
    display: none;
  }
  :deep(.el-date-editor) {
    width: 180px !important;
  }
}
.form-page-wrap {
  width: 100%;
  height: calc(100vh - 110px);
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  &.formPage {
    background: #fff;
    padding: 0 4px;
    .form-page-content {
      width: calc(100% - 40px);
      margin-top: 50px;
      margin-left: 20px;
      .MasterForm {
        padding: 10px !important;
      }
    }
  }
  .form-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px;
    position: absolute;
    height: 40px;
    width: 100%;
    top: 0;
    background: #fff;
    z-index: 2;
    border-bottom: 1px solid #ddd;
    &-left {
      line-height: 36px;

      .text-muted {
        color: var(--el-color-primary);
        margin-right: 20px;
        cursor: pointer;
      }

      .back-icon {
        position: relative;
        top: 2px;
        width: 20px;
      }

      .back-btn {
        display: inline-block;
        width: 24px;
        height: 24px;
        line-height: 24px;
        background-color: var(--el-color-primary);
        color: #fff;
        border-radius: 2px;
        text-align: center;
      }

      .el-icon {
        position: relative;
        top: 3px;
      }
      .color-999 {
        color: #999;
      }
    }
  }
  .el-divider--horizontal {
    margin: 6px 0;
  }

  .form-page-content {
    width: 100%;
    box-sizing: border-box;
    margin-top: 40px;
  }
}

.table-form-btn {
  margin: 15px;
}

.color-orange {
  color: var(--el-color-primary);
  font-weight: bold;
}

.expand-wrapper {
  padding: 10px 0;
  padding-left: 40px;
}

.tree-expand-btn {
  position: absolute;
  top: calc(50% - 30px);
  left: 0;
  z-index: 100;
  background-color: #8c95a8;
  width: 9px;
  height: 60px;
  line-height: 60px;
  text-align: left;
  border-radius: 0 10px 10px 0;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: var(--el-color-primary);
  }
  .el-icon {
    position: relative;
    left: -3px;
  }
}

// 新版新增的 含有子表时，子表的顶部标题
.subtable-title {
  font-size: 16px;
  color: #333;
  font-weight: 600;
  height: 40px;
  line-height: 40px;
  display: flex;
  justify-content: flex-end;
}

.el-drawer__title {
  color: #333;
  font-weight: bold;
}

:deep(.custom-drawer) {
  bottom: 0 !important;
  right: 0 !important;
  left: v-bind(drawerLeft) !important;
  width: v-bind(drawerWidth);
}

.modal-footer {
  display: flex;
  justify-content: space-between;
}
.mr-10 {
  margin-right: 10px;
}
</style>
<style scoped lang="scss">
:v-deep
  .vxe-table--render-default.size--miniF
  .vxe-body--column:not(.col--ellipsis) {
  padding: 4px 0 !important;
}

.tool-wrap-right {
  padding-top: 0 !important;
}
:deep(.el-drawer__header) {
  margin-bottom: 0px !important;
  position: relative;
  &::before {
    content: "";
    width: 100%;
    height: 1px;
    background-color: #dcdfe6;
    position: absolute;
    bottom: -15px;
    left: 20px;
  }
}

:deep(.el-tree-node__label) {
  max-width: 130px;
}
.custom-drawer {
  .Form {
    :deep(.el-form-item__content) {
      padding-left: 0 !important;
    }
  }
}
</style>
