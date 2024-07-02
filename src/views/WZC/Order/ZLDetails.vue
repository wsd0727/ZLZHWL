<!-- 众联线性一览表详情 -->
<template>
  <div class="app-wrap">
    <el-scrollbar ref="scrollRef" :height="windowHeight">
      <div class="mainInfo">
        <div class="carStatus">{{}}</div>
        <el-row :gutter="10">
          <el-col :span="16">
            <div class="FormToKS">
              <div class="FormToKS-item Form">
                <span>委托单位</span>
                <TextOverflow :content="form.COMPANYNAME" class="FormToKS-name" />
              </div>
              <div class="title">派车单号：{{BILLNO}}</div>
              <div class="FormToKS-item To">
                <span>客商企业</span>
                <TextOverflow :content="form.SUPPLIERNAME" class="FormToKS-name" />
              </div>
            </div>
          </el-col>
          <el-col :span="1.5">
            <el-tag class="status-item mainInfo-tag1" size="default">任务状态：{{selectDictLabel(tmsNodeEnum, form.BILLSTATUS)}}</el-tag>
          </el-col>
          <el-col :span="1.5">
            <el-tag class="status-item mainInfo-tag2" type="success" size="default">签收状态：{{ selectDictLabel(signStatus, form.SIGNSTATUS)}}</el-tag>
          </el-col>
          <el-col :span="6" class="content-item">
            <div class="label">接单时间</div>
            <div class="value">
              <TextOverflow :content="form.CREATIONTIME" />
            </div>
          </el-col>
          <el-col :span="6" class="content-item">
            <div class="label">开始运输时间</div>
            <div class="value">
              <TextOverflow :content="form.STARTTRANSPORTTIME" />
            </div>
          </el-col>
          <el-col :span="6" class="content-item">
            <div class="label">签收时间</div>
            <div class="value">
              <TextOverflow :content="form.SIGNTIME" />
            </div>
          </el-col>
          <el-col :span="6" class="content-item Price">
            <div class="label">预估运费</div>
            <div class="value">
              <TextOverflow :content="`${form.MATEMONEY}元`" />
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="Info">
        <div class="Info-item WTInfo">
          <div class="head">
            <div class="title">
              <img src="@/assets/img/weituo.png" alt="" style="width: 27px;height: 27px;" class="mr10">
              <div>
                委托信息
              </div>
            </div>
          </div>
          <el-row class="content">
            <el-col :span="8" class="content-item">
              <div class="label">委托单号</div>
              <div class="value">
                <TextOverflow :content="form.PK_TSDEPUTE" />
              </div>
            </el-col>
            <el-col :span="8" class="content-item">
              <div class="label">订单号</div>
              <div class="value color1964F8">
                <TextOverflow :content="form.ORDERCODES" />
              </div>
            </el-col>
            <!-- <el-col :span="4" class="content-item">
              <div class="label">业务类型</div>
              <div class="value">{{selectDictLabel(businessType, form.BUSSTYPE)}}</div>
            </el-col> -->
            <!-- <el-col :span="4" class="content-item">
              <div class="label">业务标识</div>
              <div class="value">{{selectDictLabel(BUSINESSFALG, form.BUSINESSFALG)}}</div>
            </el-col> -->
            <!-- <el-col :span="4" class="content-item">
              <div class="label">委托方式</div>
              <div class="value">{{selectDictLabel(entrustType, form.ASSIGNTYPE)}}</div>
            </el-col> -->
            <el-col :span="8" class="content-item">
              <div class="label">配送方式</div>
              <div class="value">{{selectDictLabel(sendType, form.DELIVERTYPE)}}</div>
            </el-col>
            <!-- <el-col :span="4" class="content-item">
              <div class="label">业务模式</div>
              <div class="value">{{selectDictLabel(transportModel, form.TRANSMODE)}}</div>
            </el-col> -->
            <el-col :span="8" class="content-item">
              <div class="label">发货企业</div>
              <div class="value">
                <TextOverflow :content="form.SENDCOMPANY" />
              </div>
            </el-col>
            <el-col :span="8" class="content-item">
              <div class="label">收货企业</div>
              <div class="value">
                <TextOverflow :content="form.RECVCOMPANY" />
              </div>
            </el-col>
            <el-col :span="8" class="content-item">
              <div class="label">结算组织</div>
              <div class="value">
                <TextOverflow :content="form.SETTLEORGNAME" />
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="Info-item CarInfo">
          <div class="head">
            <div class="title">
              <img src="@/assets/img/paiche.png" alt="" style="width: 27px;height: 27px;" class="mr10">
              <div>
                派车信息
              </div>
            </div>
          </div>
          <el-row class="content">
            <el-col :span="12" class="content-item margin-5">
              <div class="label">车牌号</div>
              <div class="value">
                <TextOverflow :content="form.CARNO" />
              </div>
            </el-col>
            <el-col :span="12" class="content-item margin-5">
              <div class="label">运输路线</div>
              <div class="value">
                <TextOverflow :content="form.LINENAME" />
              </div>
            </el-col>
            <el-col :span="24" class="content-item margin-5">
              <div class="label">司机</div>
              <div class="value">{{form.DRIVERNAME}} {{form.DRIVERPHONE}}</div>
            </el-col>
            <el-col :span="24" class="content-item margin-5">
              <div class="label">承运商</div>
              <div class="value">
                <TextOverflow :content="form.CARRIERNAME" />
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="tabs">
        <el-tabs v-model="activeTabs" class="demo-tabs" @tab-click="tabsClick">
          <el-tab-pane label="路线监管" name="0"></el-tab-pane>
          <el-tab-pane label="货物信息" name="1"></el-tab-pane>
          <el-tab-pane label="到货签收" name="2"></el-tab-pane>
          <el-tab-pane label="预警处理" name="3"></el-tab-pane>
          <el-tab-pane label="装货卸货" name="4"></el-tab-pane>
          <el-tab-pane label="对账单信息" name="5" ></el-tab-pane>
          <el-tab-pane label="结算单信息" name="6"></el-tab-pane>
          <el-tab-pane label="发票信息" name="7"></el-tab-pane>
          <el-tab-pane label="付款信息" name="8"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="tabs-content">
        <div class="group" ref="groupRef0">
          <div class="group-title">
            <div class="title">路线监管</div>
          </div>
          <div class="group-content">
            <div class="StartEndInfo">
              <div class="StartEnd">
                <div class="StartEnd-item Start">
                  <div class="city">{{form.SENDADDRESS}}</div>
                  <div class="address">{{form.SENDADDRESSDTL}}</div>
                </div>
                <div class="line">{{form.MILEAGE}}KM</div>
                <div class="StartEnd-item End">
                  <div class="city">{{form.RECVADDRESS}}</div>
                  <div class="address">{{form.RECVADDRESSDTL}}</div>
                </div>
              </div>
              <!-- <div class="SendTime">预计送达时间：{{form.SENDDATE}}</div> -->
            </div>
            <div class="LineInfo">
              <div class="LineInfo-item HistoryInfo" style="margin-right:20px">
                <el-scrollbar height="500px">
                  <ul class="LineTime">
                    <div class="LineTime-item" v-for="(item, index) in timeLineList" :key="index">
                      <div class="line"></div>
                      <div class="no">{{index == '0'?'装':index}}</div>
                      <div class="title">{{selectDictLabel(tmsNodeEnum, item.BILLSTATUS)}}</div>
                      <div class="desc">{{item.CREATIONTIME}}</div>
                      <div class="imgList">
                        <ImagePreview v-if="item.URL" :src="item.URL" width="50px" height="50px" />
                        <ImagePreview v-if="item.imgUrl" :src="item.imgUrl" width="50px" height="50px" />
                      </div>
                    </div>
                  </ul>
                </el-scrollbar>
              </div>
              <div class="LineInfo-item LineMap">
                <div class="map">
                  <div id="container" style="height:500px"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="group" ref="groupRef1">
          <div class="group-title">
            <div class="title">货物信息</div>
          </div>
          <div class="group-content">
            <miniTable :data="goodsList" min-height="180px" show-overflow="tooltip">
              <!-- <vxe-column field="STORDOCORG" title="库存组织" min-width="150" align="left">
              </vxe-column> -->
              <!-- <vxe-column field="sex" title="厂区" min-width="150" align="left">
              </vxe-column> -->
              <vxe-column field="MATERIALNAME" title="货物" min-width="150" align="left" />
              <vxe-column field="MATSPEC" title="规格" min-width="150" align="left" />
              <vxe-column field="TRANSNUM" title="数量" min-width="150" align="left">
                <!-- <template #default="{row}">{{row.NWEIGHT}} {{row.WTUNIT}}</template> -->
                <template #default="{row}">{{row.TRANSNUM}} {{row.TRANSUNIT}}</template>
              </vxe-column>
              <vxe-column field="NQTORIGPRICE" title="单价" min-width="160" align="left">
                <template #default="{row}">{{row.NQTORIGPRICE}}元/{{row.WTUNIT}}</template>
              </vxe-column>
              <!-- <vxe-column field="age" title="发货方" min-width="200" align="center">
              </vxe-column> -->
              <!-- <vxe-column field="RECVCOMPANY" title="收货方" min-width="200" align="center">
              </vxe-column> -->
            </miniTable>
          </div>
        </div>
        <div class="group" ref="groupRef2">
          <div class="group-title">
            <div class="title">到货签收</div>
          </div>
          <div class="group-content">
            <miniTable :data="signList" min-height="180px" show-overflow="tooltip">
              <vxe-column field="MATERIALNAME" title="货物" min-width="150" align="left">
              </vxe-column>
              <!-- <vxe-column field="SIGNTYPE" title="签收方式" width="100" align="left">
                <template #default="{row}">{{selectDictLabel(qsfs,row.SIGNTYPE)}}</template>
              </vxe-column> -->
              <vxe-column field="SIGNSTATUS" title="状态" width="100" align="left">
                <template #default="{row}">{{selectDictLabel(exceptionStatus,row.SIGNSTATUS)}}</template>
              </vxe-column>
              <vxe-column field="CREATORNAME" title="签收人" width="120" align="left">
              </vxe-column>
              <vxe-column field="CREATIONTIME" title="签收时间" width="160" align="left">
              </vxe-column>
              <vxe-column field="VMEMO" title="异常原因" width="200" align="left" />
              <vxe-column field="SIGNURL" title="签收回执" width="130" align="left">
                <template #default="{row}">
                  <ImagePreview v-if="row.SIGNURL" :src="row.SIGNURL" width="30px" height="30px" />
                </template>
              </vxe-column>
              <vxe-column field="menu" title="轨迹回放" width="120" align="left">
                <template>
                  <el-link type="primary">查看轨迹</el-link>
                </template>
              </vxe-column>
            </miniTable>
          </div>
        </div>
        <div class="group" ref="groupRef3">
          <div class="group-title">
            <div class="title">预警处理</div>
          </div>
          <div class="group-content" show-overflow="tooltip">
            <miniTable :data="warnList" min-height="180px">
              <vxe-column field="VNAME" title="预警类型" width="160" align="left">
              </vxe-column>
              <vxe-column field="WARNTIME" title="预警时间" width="160" align="left">
              </vxe-column>
              <vxe-column field="LOCATION" title="预警位置" width="160" align="left" show-overflow="tooltip">
              </vxe-column>
              <vxe-column field="PICURL1" title="图片" width="100" align="left">
                <template #default="{row}">
                  <ImagePreview :src="row.PICURL1" :width="20" :height="20" />
                </template>
              </vxe-column>
              <vxe-column field="EXCEPTIONINFO" title="描述" align="left">
              </vxe-column>
            </miniTable>
          </div>
        </div>
        <div class="group" ref="groupRef4" v-if="systemConfig?.systemCode == 'ZLZHWL'">
          <div class="group-title">
            <div class="title">装货卸货</div>
          </div>
          <div class="group-content">
            <miniTable :data="insObj" min-height="180px">
              <vxe-column field="MATERIALNAME" title="物料" width="220" align="left">
              </vxe-column>
              <vxe-column field="GROSS" title="装货毛重" width="70" align="left">
              </vxe-column>
              <vxe-column field="TARE" title="装货皮重" width="70" align="left">
              </vxe-column>
              <vxe-column field="SUTTLE" title="装货净重" width="70" align="left">
              </vxe-column>
              <vxe-column field="ORIGINALENTRYTIME" title="装货过磅时间" width="160" align="left">
              </vxe-column>
              <vxe-column field="SIGNURL" title="装货磅单" width="100" align="left">
                <template #default="{row}">
                  <ImagePreview :src="row.SIGNURL" :width="20" :height="20" />
                </template>
              </vxe-column>
              <vxe-column field="UNLOADGROSS" title="卸货毛重" width="70" align="left">
              </vxe-column>
              <vxe-column field="UNLOADTARE" title="卸货皮重" width="70" align="left">
              </vxe-column>
              <vxe-column field="UNLOADSUTTLE" title="卸货净重" width="70" align="left">
              </vxe-column>
              <vxe-column field="UNLOADENTRYTIME" title="卸货过磅时间" width="160" align="left">
              </vxe-column>
              <vxe-column field="UNLOADURL" title="卸货磅单" width="100" align="left">
                <template #default="{row}">
                  <ImagePreview :src="row.UNLOADURL" :width="20" :height="20" />
                </template>
              </vxe-column>
            </miniTable>
          </div>
        </div>
        <div class="group" ref="groupRef5">
          <div class="group-title">
            <div class="title">对账单信息</div>
          </div>
          <div class="group-content">
            <miniTable :data="statementAccountData" min-height="180px" >
              <vxe-column field="BILLNO" title="对账明细单号" align="left" width="100">
              </vxe-column>
              <vxe-column field="PK_SENDCAR" title="派车单号" align="left" width="100">
              </vxe-column>
              <vxe-column field="BUSSTYPE" title="业务" align="left" width="100">
                <template #default="{row}">{{selectDictLabel(businessType,row.BUSSTYPE)}}</template>
              </vxe-column>
              <vxe-column field="CARNO" title="车辆" align="left" width="100">
              </vxe-column>
              <vxe-column field="COMPANYSIGNNUM" title="货主签收量" align="left" width="100">
              </vxe-column>
              <vxe-column field="ORIGINALNUM" title="装货净重(A)" align="left" width="100">
              </vxe-column>
              <vxe-column field="SIGNURL" title="装货小票" align="left" width="100">
                <template #default="{row}">
                  <ImagePreview :src="row.SIGNURL" :width="20" :height="20" />
                </template>
              </vxe-column>
              <vxe-column field="SUTTLE" title="卸货净重(B)" align="left" width="100">
              </vxe-column>
              <vxe-column field="UNLOADURL" title="卸货小票" align="left" width="100">
                <template #default="{row}">
                  <ImagePreview :src="row.UNLOADURL" :width="20" :height="20" />
                </template>
              </vxe-column>
              <vxe-column field="GOODZXDIFFE" title="亏吨重量(C)=A-B" align="left" width="100">
              </vxe-column>
              <vxe-column field="CONFIRMWEIGHT" title="对账量(D)" align="left" width="100">
              </vxe-column>
              <vxe-column field="PRICE" title="运输单价(P)" align="left" width="100">
              </vxe-column>
              <vxe-column field="PAYABLEAMOUNT" title="应结运费(T)=D*P" align="left" width="100">
              </vxe-column>
              <vxe-column field="TOTALAMOUNT" title="实结运费(F)=T-K-M-S" align="left" width="100">
              </vxe-column>
              <vxe-column field="DEDUCTIONCOST" title="扣除费用(K)" align="left" width="100">
              </vxe-column>
              <vxe-column field="DEDUCTIONCOSTVMEMO" title="扣除费用说明" align="left" width="100">
              </vxe-column>
              <vxe-column field="CLEARZEROCOST" title="抹零费用(M)" align="left" width="100">
              </vxe-column>
              <vxe-column field="CLEARZEROCOSTVMEMO" title="抹零费用说明" align="left" width="100">
              </vxe-column>
              <vxe-column field="GOODDIFFERENCE" title="亏吨扣罚量(C)=A-B-R" align="left" width="100">
              </vxe-column>
              <vxe-column field="GOODLOSTPRICE" title="亏吨单价(H)" align="left" width="100">
              </vxe-column>
              <vxe-column field="DEDUCTIONAMT" title="亏吨扣款(S)=C*H" align="left" width="100">
              </vxe-column>
              <vxe-column field="GOODSDIFFERENCERATIO" title="亏吨扣罚类型" align="left" width="100">
                <template #default="{row}">{{selectDictLabel(goodsDifferenceRatio,row.GOODSDIFFERENCERATIO)}}</template>
              </vxe-column>
              <vxe-column field="RATIOUNIT" title="亏吨设定值" align="left" width="100">
              </vxe-column>
              <vxe-column field="ROADCONSUMPTIONVALUE" title="亏吨容忍值(R)" align="left" width="100">
              </vxe-column>
              <vxe-column field="DEDUCTIONAMTVMEMO" title="亏吨说明" align="left" width="100">
              </vxe-column>
              <vxe-column field="SETTLEORGNAME" title="结算组织" align="left" width="100">
              </vxe-column>
            </miniTable>
          </div>
        </div>
        <div class="group" ref="groupRef6">
          <div class="group-title">
            <div class="title"> 结算单信息</div>
          </div>
          <div class="group-content">
            <miniTable :data="finalStatementData" min-height="180px">
              <vxe-column field="PK_ACCOUNT" title="对账单" align="left" width="100">
              </vxe-column>
              <vxe-column field="BUSSTYPE" title="业务" align="left" width="100">
                <template #default="{row}">{{selectDictLabel(businessType,row.BUSSTYPE)}}</template>
              </vxe-column>
              <vxe-column field="BILLSTATUS" title="对账状态" align="left" width="100">
                <template #default="{row}">{{selectDictLabel(accountStatus,row.BILLSTATUS)}}</template>
              </vxe-column>
              <vxe-column field="CERTIFICATIONSTATUS" title="审批状态" align="left" width="100">
                <template #default="{row}">{{selectDictLabel(approveStatus,row.CERTIFICATIONSTATUS)}}</template>
              </vxe-column>
              <vxe-column field="BUSINESSFALG" title="网货标识" align="left" width="100">
                <template #default="{row}">{{selectDictLabel(orderBusinessFalg,row.BUSINESSFALG)}}</template>
              </vxe-column>
              <vxe-column field="ISDOUBT" title="存疑" align="left" width="100">
                <template #default="{row}">{{selectDictLabel(isTrue,row.ISDOUBT)}}</template>
              </vxe-column>
              <vxe-column field="COMPANYNAME" title="企业" align="left" width="100">
              </vxe-column>
              <vxe-column field="CARRIERNAME" title="承运商" align="left" width="100">
              </vxe-column>
              <vxe-column field="CONFIRMWEIGHT" title="对账量" align="left" width="100">
              </vxe-column>
              <vxe-column field="PRICE" title="运输单价" align="left" width="100">
              </vxe-column>
              <vxe-column field="TOTALAMOUNT" title="对账总运费" align="left" width="100">
              </vxe-column>
              <vxe-column field="ORIGINALNUM" title="装货净重" align="left" width="100">
              </vxe-column>
              <vxe-column field="SUTTLE" title="卸货净重" align="left" width="100">
              </vxe-column>
              <vxe-column field="SIGNWEIGHT" title="货主签收总量" align="left" width="100">
              </vxe-column>
              <vxe-column field="DRIVERSIGNNUM" title="司机签收总量" align="left" width="100">
              </vxe-column>
              <vxe-column field="SUTTLEUNIT" title="结算单位" align="left" width="100">
                <template #default="{row}">{{selectDictLabel(orderTransportUnot,row.SUTTLEUNIT)}}</template>
              </vxe-column>
              <vxe-column field="ASSIGNMENTUNIT" title="拉运单位" align="left" width="100">
                <template #default="{row}">{{selectDictLabel(orderTransportUnot,row.ASSIGNMENTUNIT)}}</template>
              </vxe-column>
              <vxe-column field="CARRIER_CONFIRMSTATUS" title="承运商确认" align="left" width="100">
                <template #default="{row}">{{selectDictLabel(sureStatus,row.CARRIER_CONFIRMSTATUS)}}</template>
              </vxe-column>
              <vxe-column field="COMPANY_CONFIRMSTATUS" title="企业确认" align="left" width="100">
                <template #default="{row}">{{selectDictLabel(sureStatus,row.COMPANY_CONFIRMSTATUS)}}</template>
              </vxe-column>
              <!-- <vxe-column field="DRIVERNAME" title="司机" align="left" width="100">
              </vxe-column> -->
            </miniTable>
          </div>
        </div>
        <div class="group" ref="groupRef7">
          <div class="group-title">
            <div class="title">发票信息</div>
          </div>
          <div class="group-content">
            <miniTable :data="dealWithData" min-height="180px">
              <vxe-column field="PK_SETTLE" title="结算单" align="left" width="180">
              </vxe-column>
              <vxe-column field="CERTIFICATIONSTATUS" title="状态" align="left" width="100">
                <template #default="{row}">{{selectDictLabel(approveStatus,row.CERTIFICATIONSTATUS)}}</template>
              </vxe-column>
              <vxe-column field="COMPANYNAME" title="委托企业" align="left" width="200">
              </vxe-column>
              <vxe-column field="SIDENAME" title="承运商" align="left" width="200">
              </vxe-column>
              <vxe-column field="YJWEIGHT" title="应结量" align="left" width="100">
              </vxe-column>
              <vxe-column field="YJAMT" title="应结运费" align="left" width="100">
              </vxe-column>
              <vxe-column field="DEDUCTIONWEIGHT" title="扣量" align="left" width="100">
              </vxe-column>
              <vxe-column field="PRICE" title="单价" align="left" width="100">
              </vxe-column>
              <vxe-column field="DEDUCTIONMONEY" title="扣款" align="left" width="100">
              </vxe-column>
              <vxe-column field="EXPENSESATM" title="杂费" align="left" width="100">
              </vxe-column>
              <vxe-column field="SHAREATM" title="分摊费" align="left" width="100">
              </vxe-column>
              <vxe-column field="SJAMT" title="实结运费" align="left" width="100">
              </vxe-column>
              <vxe-column field="INVOICEAMT" title="本次开票金额" align="left" width="100">
              </vxe-column>
            </miniTable>
          </div>
        </div>
        <div class="group" ref="groupRef8">
          <div class="group-title">
            <div class="title"> 付款信息</div>
          </div>
          <div class="group-content">
            <miniTable :data="billData" min-height="180px">
              <vxe-column field="PK_PAYABLE" title="应付单号" align="left" width="180">
              </vxe-column>
              <vxe-column field="PK_SETTLE" title="结算单号" align="left" width="180">
              </vxe-column>
              <vxe-column field="YFAMOUNT" title="应付金额" align="left" width="100">
              </vxe-column>
              <vxe-column field="PAYAMOUNT" title="付款金额" align="left" width="100">
              </vxe-column>
              <vxe-column field="SERVEAMOUNT" title="服务费金额" align="left" width="100">
              </vxe-column>
              <vxe-column field="SERVEDEDUCTNAME" title="服务费扣除方" align="left" width="100">
              </vxe-column>
            </miniTable>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { shallowRef } from '@vue/reactivity'
import TextOverflow from "@/components/TextOverflow"
import miniTable from "@/components/Tables/mini"
import { getOrderDetail, getLine, getOrderMapLine, getGoods, getSign, getWarn, getTransportOriginal,getStatementAccount,getFinalStatement,getSubListByZL ,getPaymentDtl} from "#/WZC/Order"

import useSettingsStore from "@/store/modules/settings";
const settingsStore = useSettingsStore();
const systemConfig = computed(() => settingsStore.systemConfig);
import InitAMap from "@/utils/map"

const { proxy } = getCurrentInstance();

const props = defineProps({
  currentData: Object
})

/**
 * 签收状态	signstatus	signStatus
 * 业务类型	BUSSTYPE	businessType
 * 业务标识	BUSINESSFALG	BUSINESSFALG
 * 委托方式	ASSIGNTYPE	entrustType
 * 配送方式	DELIVERTYPE	sendType
 * 业务模式	TRANSMODE	transportModel
 * 签收状态	SIGNSTATUS	exceptionStatus
 * 单据状态	BILLSTATUS	tmsNodeEnum
 */
const { signStatus, businessType, BUSINESSFALG, entrustType, sendType, transportModel, exceptionStatus, tmsNodeEnum, qsfs,accountStatus,approveStatus,orderBusinessFalg ,isTrue,orderTransportUnot,sureStatus} = proxy.useDict("signStatus", "businessType", "BUSINESSFALG", "entrustType", "sendType", "transportModel", "exceptionStatus", "tmsNodeEnum", "qsfs","accountStatus","approveStatus","orderBusinessFalg","isTrue","orderTransportUnot","sureStatus")
const emits = defineEmits(['close'])

const BILLNO = computed(() => props.currentData.BILLNO || "")

const windowHeight = computed(() => (window.innerHeight - 193) + 'px')
const form = ref({})
const activeTabs = ref('0')
const scrollRef = ref(null)

const groupRef0 = ref(null)
const groupRef1 = ref(null)
const groupRef2 = ref(null)
const groupRef3 = ref(null)
const groupRef4 = ref(null)
const groupRef5 = ref(null)
const groupRef6 = ref(null)
const groupRef7 = ref(null)
const groupRef8 = ref(null)
const groupRef = ref([
  groupRef0,
  groupRef1,
  groupRef2,
  groupRef3,
  groupRef4,
  groupRef5,
  groupRef6,
  groupRef7,
  groupRef8
])
const mapRef = ref(null)

const tabsClick = val => {
  let index = val.paneName
  let top = groupRef.value[index].value.getBoundingClientRect().top
  scrollRef.value.scrollTo({
    top: top - 200
  })
}

const mapPath = ref([]) // 地图轨迹
const timeLineList = ref([])
const goodsList = ref([]) // 货物信息
const signList = ref([]) // 到货签收信息
const warnList = ref([]) // 预警信息

const dealWithData=ref([])

const getDealWithData = () => {
  getSubListByZL({
    PK_BILLNO: BILLNO.value,
    MODULEID: "MU230828973251",
    PAGEID: "PG231021343840",
  }).then(res => {
    dealWithData.value = res.RESULT
  })
}
getDealWithData()

const billData=ref([])
const getBillData = () => {
  getPaymentDtl({
    PK_BILLNO: BILLNO.value,
    MODULEID: "MU230828973251",
    PAGEID: "PG231021343840",
  }).then(res => {
    billData.value = res.RESULT
  })
}
getBillData()



const getData = () => {
  getOrderDetail({
    MODULEID: "MU230811295013",
    PAGEID: "PG230811349641",
    BILLNO: BILLNO.value
  }).then(res => {
    form.value = res.RESULT
  })
}
getData()
const getLineData = () => {
  getLine({
    PK_SENDCAR: BILLNO.value
  }).then(res => {
    timeLineList.value = res.RESULT.reverse()
  })
}
getLineData()


const insObj = ref([])
const remObj = ref([])
const getZlMaterialInfo = () => {
  // /tms/tmsTransportNode/getListByBillstatus    参数：PK_BILLNO  派车单号   BILLSTATUS  状态  （装货榜单 18   卸货榜单 63）
  getTransportOriginal({
    PKBILLNO: BILLNO.value,
    PK_BILLNO: BILLNO.value,
    MODULEID: "MU230828973251",
    PAGEID: "PG231212778818",
  }).then(res => {
    insObj.value = res.RESULT
  })
  // getTransportOriginal({
  //   PKBILLNO: BILLNO.value,
  //   MODULEID: "MU230828973251",
  //   PAGEID: "PG231021343840",
  // }).then(res => {
  //   remObj.value = res.RESULT.RECORDS
  // })
}

const statementAccountData = ref([])
const finalStatementData = ref([])
const queryStatementAccount=()=>{
   getStatementAccount({
    PK_BILLNO: BILLNO.value,
    MODULEID: "MU230828973251",
    PAGEID: "PG231021343840",
  }).then(res => {
    statementAccountData.value = res.RESULT
  })
}
const queryFinalStatement=()=>{
  getFinalStatement({
    PK_BILLNO: BILLNO.value,
    MODULEID: "MU230828973251",
    PAGEID: "PG231021343840",
  }).then(res => {
    finalStatementData.value = res.RESULT
  })
}

getZlMaterialInfo()
queryStatementAccount()
queryFinalStatement()


/** 地图 */
// map实例
const AMap = shallowRef(null)
const MapRef = ref()
const initMap = () => {
  InitAMap().then(AMapRes => {
    AMap.value = AMapRes
    const map = new AMap.value.Map("container", {
      viewMode: "2D",
      zoom: 10,
      center: [116.397527, 39.90798]
    });
    MapRef.value = map
    getMapData()
  })
}
initMap()
const addPolyLine = () => {
  let path = mapPath.value
  let { TRANSPORTSTATUS = '0' } = form.value
  const polyline = new AMap.value.Polyline({
    path: path,
    isOutline: true,
    outlineColor: "#ffeeff",
    borderWeight: 1,
    strokeColor: "#f93a4a",
    strokeOpacity: 1,
    strokeWeight: 7,
    // 折线样式还支持 'dashed'
    strokeStyle: "solid",
    // strokeStyle是dashed时有效
    // strokeDasharray: [10, 5],
    lineJoin: "round",
    lineCap: "round",
    showDir: true
  });
  let startPath = path[0], endPath = path.slice(-1)[0];
  const startIcon = new AMap.value.Icon({
    size: new AMap.value.Size(40, 55),    // 图标尺寸
    image: new URL('../../../assets/images/map/qd.png', import.meta.url).href,
    imageSize: new AMap.value.Size(40, 55)
  })
  const startMarker = new AMap.value.Marker({
    icon: startIcon,
    position: startPath,
    anchor: 'bottom-center'
  })
  const endIcon = TRANSPORTSTATUS == '1' ? new AMap.value.Icon({
    size: new AMap.value.Size(60, 45),    // 图标尺寸
    image: new URL('../../../assets/images/map/car.png', import.meta.url).href,
    imageSize: new AMap.value.Size(60, 45)
  }) : new AMap.value.Icon({
    size: new AMap.value.Size(40, 55),    // 图标尺寸
    image: new URL('../../../assets/images/map/zd.png', import.meta.url).href,
    imageSize: new AMap.value.Size(40, 55)
  })
  const endMarker = new AMap.value.Marker({
    icon: endIcon,
    position: endPath,
    anchor: 'bottom-center',
    imageSize: new AMap.value.Size(10, 10)
  })
  MapRef.value.add([polyline, startMarker, endMarker]);
  MapRef.value.setFitView()
}
const pointData = ref([])
const addPoint = () => {
  return
  if (pointData.value.length == 0) return
  let markerArr = []
  for (let i = 0; i < pointData.value.length; i++) {
    const el = pointData.value[i];
    markerArr.push(new AMap.value.Marker({
      position: el,
      zIndex: 101,
      icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
      anchor: 'bottom-center',
    }))
  }
  MapRef.value.add(markerArr)
  MapRef.value.setFitView()
}

const getMapData = () => {
  getOrderMapLine({
    BILLNO: BILLNO.value,
    MODULEID: "MU230811295013",
    PAGEID: "PG230823695527"
  }).then(res => {
    if (!res.RESULT) {
      mapPath.value = []
      return false
    }
    let { LINEPOINTS } = res.RESULT
    mapPath.value = JSON.parse(LINEPOINTS)
    addPolyLine()
  })
}

const getGoodsData = () => {
  getGoods({
    PK_BILLNO: BILLNO.value,
    TREE_BILLNO: "",
    MODULEID: "MU230811295013",
    PAGEID: "PG230811568067"
  }).then(res => {
    goodsList.value = res.RESULT
  })
}
getGoodsData()
const getSignData = () => {
  getSign({
    PK_BILLNO: BILLNO.value,
    TREE_BILLNO: "",
    MODULEID: "MU230811295013",
    PAGEID: "PG230811476569"
  }).then(res => {
    signList.value = res.RESULT
  })
}
getSignData()
const getWarnData = () => {
  getWarn({
    PK_BILLNO: BILLNO.value,
    MODULEID: "MU230811295013",
    PAGEID: "PG230814627373"
  }).then(res => {
    warnList.value = res.RESULT
  })
}
getWarnData()

</script>
<style lang="scss" scoped>
.color1964F8 {
  color: #1964f8 !important;
}
.app-wrap {
  padding: 10px;
  box-sizing: border-box;
  background: #fff;
}
.mainInfo {
  padding: 5px 5px 10px;
  &-tag1 {
    background: rgba(25, 100, 248, 0.2);
    border-radius: 6px;
    // font-size: 16px;
    font-weight: 500;
    color: #1964f8;
  }
  &-tag2 {
    background: rgba(66, 196, 84, 0.2);
    border-radius: 6px;
    // font-size: 16px;
    font-weight: 500;
    color: #3fa35d;
  }
}
.Info {
  display: flex;
  align-items: stretch;
  margin-bottom: 20px;
  &-item {
    &.WTInfo {
      flex: 0.65;
      margin-right: 10px;
    }
    &.CarInfo {
      flex: 0.35;
    }
    &:first {
      flex: 1 auto;
      height: auto;
    }
    flex: 1;
    padding: 10px 20px !important;
    background: #f3f7ff;
    border-radius: 10px;
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 0;
      margin-bottom: 5px;
      .title {
        font-size: 16px;
        color: #1a1a1a;
        font-weight: bold;
        display: flex;
        align-items: center;
      }
    }
  }
}
.FormToKS {
  display: flex;
  align-items: center;
  font-size: 18px;
  margin-bottom: 5px;
  &-item {
    // color: #1a1a1a;
    // font-weight: bold;
    position: relative;
    white-space: nowrap;

    font-weight: 500;
    color: rgba(26, 26, 26, 0.8);
    span {
      font-size: 14px;
      display: block;
      margin-bottom: 5px;
      color: #4a4a4a;
    }
    &-name {
      font-size: 24px;
      font-weight: bold;
      color: #1a1a1a;
    }
  }
  .title {
    width: 50%;
    margin: 0 15px;
    text-align: center;
    font-size: 16px;
    padding-bottom: 5px;
    border-bottom: 1px dashed var(--el-border-color);
  }
}

.content {
  &-item {
    margin: 5px 0;
    display: flex;
    align-items: center;
    font-size: 16px;
    &:last-child {
      margin-bottom: 0;
    }
    &.margin-5 {
      margin: 5px 0;
    }
    .label {
      white-space: nowrap;
      color: #1a1a1a;
      &::after {
        content: "：";
      }
    }
    .value {
      // color: #1a1a1a;
      color: #686868;
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
.Price {
  .value {
    text-align: right;
    font-size: 20px;
    color: #eb401e;
    font-weight: bold;
  }
}
.group {
  margin-bottom: 10px;
  padding: 10px;
  &-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10px;
    .title {
      font-size: 16px;
      // color: #1a1a1a;
      // font-weight: bold;

      font-weight: 500;
      color: rgba(42, 43, 45, 0.82);
    }
  }
}
.StartEndInfo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #eff2f7;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  .StartEnd {
    display: flex;
    align-items: center;
    &-item {
      padding-left: 40px;
      position: relative;
      .city {
        font-size: 16px;
      }
      .address {
        font-size: 14px;
        color: #969696;
      }
      &.Start::before {
        content: "装";
        width: 30px;
        height: 30px;
        background: #1964f8;
        color: #fff;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        position: absolute;
        left: 5px;
        top: 50%;
        transform: translateY(-50%);
      }
      &.End::before {
        content: "卸";
        width: 30px;
        height: 30px;
        background: #e33644;
        color: #fff;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        position: absolute;
        left: 5px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .line {
      font-size: 16px;
      color: #6d6d6d;
      padding: 5px 60px;
      border-bottom: 2px dotted #dbdbdb;
      margin: 0 10px;
    }
  }
}
.SendTime {
  color: #1964f8;
}
.LineInfo {
  box-sizing: border-box;
  height: 500px;
  display: flex;
  align-items: stretch;
  &-item {
    flex: 1;
  }
  .HistoryInfo {
    flex: 0.4;
  }
  .LineMap {
    flex: 0.6;
  }
}
.LineTime {
  display: flex;
  align-items: flex-start;
  flex-direction: column-reverse;
  margin: 0;
  padding-left: 40px;
  &-item {
    font-size: 14px;
    margin-bottom: 10px;
    position: relative;
    &:first-child {
      .line {
        display: none;
        opacity: 0;
      }
    }
    .line {
      position: absolute;
      left: -23px;
      top: 26px;
      height: 100%;
      border-left: 2px dotted #969696;
    }
    .no {
      width: 24px;
      height: 24px;
      position: absolute;
      left: -34px;
      top: 2px;
      font-size: 14px;
      border: 1px solid #1964f8;
      color: #1964f8;
      font-weight: bold;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      z-index: 1;
    }
    .title {
      color: #1964f8;
      font-weight: bold;
      margin: 2px 0;
    }
    .desc {
      color: #868686;
      margin: 2px 0;
    }
  }
}
</style>