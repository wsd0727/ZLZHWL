import request from '@/utils/request'
// 系统设置保存接口
export function SubmintSystemData(data) {
    return request({
        url: '/sys/config/save',
        method: 'post',
        data
    })
}
// 系统查询系统配置接口
export function getSystemList(data) {
    return request({
        url: 'sys/config/getListByType',
        method: 'post',
        data
    })
}

//获取参数
export function getConfigList(data) {
    return request({
        url: '/sys/config/getConfigList',
        method: 'post',
        data
    })
}

//   保存
export function saveConfigListData(data) {
    return request({
        url: '/sys/config/saveConfigListData',
        method: 'post',
        data
    })
}

// 恢复默认
export function replyDefaultValue(data) {
    return request({
        url: '/sys/config/replyDefaultValue',
        method: 'post',
        data
    })
}

export const systemSettings = [
    {
        title: '系统信息',
        PK_CLASS: 'SYSCONFIG',
        children: [
            {
                leftLabel: '系统名称',
                id: 'systemTitle',
                type: 'text'
            },
            {
                leftLabel: '系统地址',
                id: 'systemImgBaseUrl',
                type: 'text'
            },
            {
                leftLabel: '系统编码',
                id: 'SYSTEMCODENUMBER',
                type: 'text'
            },
            {
                leftLabel: '平台logo',
                id: 'systemLogo',
                // type: 'text'
                type: 'imgToStr',
                col:24
            }
        ]
    },
    {
        title: '密码策略',
        PK_CLASS: 'SYSPARAM',
        children: [
            {
                leftLabel: '首次登录系统更改密码标识',
                id: 'FirstLoginChangePwdFlag',
                // type: 'radio',
                type: 'checkbox',
            },
            {
                leftLabel: '密码错误',
                rightLabel: '次数开始校验验证码',
                id: 'ValidateCodeLoginErrNum',
                type: 'text',
                controlWidth: '50px'
            },
            {
                leftLabel: '密码错误',
                rightLabel: '次冻结账号',
                id: 'ErrLoginDisableAccountNum',
                type: 'text',
                controlWidth: '50px'
            },
            {
                leftLabel: '冻结账号时长',
                id: 'DisableAccountLengthNum',
                type: 'text'
            }, {

                leftLabel: '密码策略',
                id: 'PwdStrategy',
                type: 'select'
            }
        ]
    },
    {
        title: '车辆',
        PK_CLASS: 'SYSPARAM',
        children: [
            {
                leftLabel: '车牌默认省份',
                id: 'CarDefaultName',
            }
        ]
    },
    {
        title: '税率',
        PK_CLASS: 'SYSPARAM',
        children: [
            {
                leftLabel: '货物税率',
                id: 'MaterialRate',
                defaultVal: '13%',
            }
        ]
    },
    {
        title: '日志',
        PK_CLASS: 'SYSPARAM',
        children: [
            {
                leftLabel: '日志定时清理（保留30天）',
                id: 'LogDelTimeLength',
                defaultVal: '30',
                controlWidth: '100px'
            },
            {
                leftLabel: '日志文件路径',
                id: 'LogFIlePuth',
            },
            {
                leftLabel: '是否开启sql日志输出',
                id: 'SQLLogOutFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '是否开启ErrorLog日志输出',
                id: 'ErrorLogOutFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '是否开启WarnLog日志输出',
                id: 'WarnLogOutFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '是否开启DebugLog日志输出',
                id: 'DebugLogOutFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '是否开启InfoLog日志输出',
                id: 'InfoLogOutFlag',
                type: 'checkbox',
            },

        ]
    },
    {
        title: '其他设置',
        PK_CLASS: 'SYSPARAM',
        children: [
            {
                leftLabel: '大数据导出超过',
                rightLabel: '天，直接导出excel',
                id: 'igDataMaxLimitDtPdfAutoExcel',
                defaultVal: '30',
                controlWidth: '50px'
            },
            {
                leftLabel: '最大导出数量',
                id: 'ExportDataMax',
            },
            {
                leftLabel: '司机身份证有效期验证',
                id: 'DriverIDcardEffectDtFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '车辆道路运输证有效期验证',
                id: 'CarTIREffectDtFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '承运商营业执照有效期验证',
                id: 'IDcardEffectDtFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '承运商道路运输证有效期验证',
                id: 'LoadIDcardEffectDtFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '下拉控件默认取值条数',
                id: 'DropDownListDataNum',
            },
            {
                // leftLabel: '在线用户获取频率（分钟）',
                leftLabel: '在线用户获取频率',
                rightLabel:'分钟',
                id: 'GetOnLineUserF',
                controlWidth: '50px'
            },
        ]
    },
    {
        title: '派车单',
        PK_CLASS: 'SYSPARAM',
        children: [
            {
                leftLabel: '车辆允许同时有多个派车单',
                id: 'CarMoreSendCarOrderFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '司机允许同时有多个派车单',
                id: 'DriverMoreSendCarOrderFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '司机派车单数量限制',
                id: 'DriverSendCarOrderMaxLimit',
            },
            {
                leftLabel: '派车占量标识',
                id: 'SendCarOrderWeightFlag',
                type: 'checkbox',
            },
        ]
    },
    {
        title: '通知服务',
        PK_CLASS: 'SYSPARAM',
        children: [
            {
                leftLabel: '短信通知',
                type: 'empty',
                col: 24
            },
            {
                leftLabel: '类型',
                id: 'ShotMsgType',
                type: 'radio',
                radioList: [
                    {
                        label: '阿里',
                        value: '1'
                    },
                    {
                        label: '腾讯',
                        value:'2'
                    },
                    {
                        label: '华为',
                        value: '3'
                    },
                ],
            },
            {
                leftLabel: '地址',
                id: 'ShotMsgAddr',
            },
            {
                leftLabel: '账户',
                id: 'ShotMsgAccount',
            },
            {
                leftLabel: '密码',
                id: 'ShotMsgPwd',
            },
            {
                leftLabel: '极光推送',
                type: 'empty',
                col: 24
            },
            {
                leftLabel: '账户',
                id: 'JPushMsgAccount',
            },
            {
                leftLabel: '密码',
                id: 'JPushMsgPwd',
            },
            {
                leftLabel: '微信公众号',
                type: 'empty',
                col: 24
            },
            {
                leftLabel: '开发者id',
                id: 'GZHdevId',
            },
            {
                leftLabel: '开发者密码',
                id: 'GZHdevPwd',
            },
            {
                leftLabel: '微信订阅',
                id: 'GZHRead',
            },
            // {
            //     leftLabel: '',
            //     type:'empty',
            //     col:24
            // },
            {
                leftLabel: '叫号推送方式',
                id: 'JhPushType',
                type: 'radio',
                col: 24,
                radioList: [
                    {
                        label: '不推送',
                        value: '0'
                    },
                    {
                        label: '短信',
                        value: '1'
                    },
                    {
                        label: '极光',
                        value: '2'
                    },
                    {
                        label: '公众号',
                        value: '3'
                    },
                    {
                        label: '微信通知',
                        value: '4'
                    },
                ],
            }
        ]
    },

    {
        title: '派车',
        PK_CLASS: 'BUY',
        children: [
            {
                leftLabel: '派车单失效时间',
                type: 'PoTranOrderUnEffectHour',
                rightLabel:'小时',
                controlWidth: '50px'

            },
            {
                leftLabel: '采购派车量最小值',
                id: 'PoTranOrderMinWeight',
                rightLabel:'吨',
                controlWidth: '50px'
            },
            {
                leftLabel: '派车单保存即审核',
                id: 'PoTranOrderSaveAndCheckFlag',
            },
            {
                leftLabel: '原发录入节点限制',
                id: 'PoSourceWeightInputNode',
                type: 'radio',
                col:16,
                radioList: [
                    {
                        label: '不限制',
                        value: '0'
                    },
                    {
                        label: '派车',
                        value: '1'
                    },
                    {
                        label: '签到',
                        value: '2'
                    },
                    {
                        label: '收货确认',
                        value: '3'
                    },
                ],
            },
            {
                leftLabel: '原发允许最大值',
                id: 'PoSourceWeightMax',
                rightLabel:'吨',
                controlWidth: '50px'

            },
            {
                leftLabel: '采购是否考试',
                id: 'PoTranOrderExamFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '是否需要司机开启运输',
                id: 'PoDiriverStartTransFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '采购派车司机是否默认',
                id: 'PoTranOrderDefaultDriverFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '采购派车车辆是否默认',
                id: 'PoTranOrderDefaultCarFlag',
                type: 'checkbox',
            },
        ]
    },
    {
        title: '排队',
        PK_CLASS: 'BUY',
        children: [
            {

                leftLabel: '厂外排队',
                id: 'PoOutFactoryQueueFlag',
                type: 'radio',
                col: 24,
                radioList: [
                    {
                        label: '不排队',
                        value: '0'
                    },
                    {
                        label: '签到',
                        value: '1'
                    },
                    {
                        label: '停车场',
                        value: '2'
                    },

                ],
            },
            {
                leftLabel: '场内排队',
                col: 24,
                id: 'PoInFactoryQueueFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '排队控制节点',
                id: 'PoInFactoryAddQueueNode',
                isShow: 'PoInFactoryQueueFlag',
                type: 'radio',
                col: 12,
                radioList: [
                    {
                        label: '入场',
                        value: '1'
                    },
                    {
                        label: '一次计量',
                        value: '2'
                    },
                    {
                        label: '手持机登记',
                        value: '3'
                    },
                ],
            },
            {
                leftLabel: '排队移除节点',
                id: 'PoInFactoryDelQueueNode',
                isShow: 'PoInFactoryQueueFlag',
                col: 12,
                type: 'radio',
                radioList: [
                    {
                        label: '一次计量移除',
                        value: '1'
                    },
                    {
                        label: '出厂移除',
                        value: '2'
                    },
                ],

            },
        ]
    },

    {
        title: '精度',
        PK_CLASS: 'BUY',
        children: [
            {

                leftLabel: '计量重量精度',
                id: 'PoWeightAccuracy',
                col: 8
            },
            {
                leftLabel: '取值方式',
                id: 'PoWeightAccuracyGetType',
                type: 'radio',
                col: 16,
                radioList: [
                    {
                        label: '四舍五入',
                        value: '0'
                    },
                    {
                        label: '去位',
                        value: '1'
                    },
                    {
                        label: '进位',
                        value: '2'
                    },
                    {
                        label: '四舍六入',
                        value: '3'
                    },
                    {
                        label: '五成双法',
                        value: '4'
                    },

                ],
            },

            {

                leftLabel: '货款金额精度',
                id: 'PoMatAmtAccuracy',
                col: 8
            },
            {
                leftLabel: '取值方式',
                id: 'PoMatAmtAccuracyGetType',
                type: 'radio',
                col: 16,
                radioList: [
                    {
                        label: '四舍五入',
                        value: '0'
                    },
                    {
                        label: '去位',
                        value: '1'
                    },
                    {
                        label: '进位',
                        value: '2'
                    },
                    {
                        label: '四舍六入',
                        value: '3'
                    },
                    {
                        label: '五成双法',
                        value: '4'
                    },

                ],
            },

            {

                leftLabel: '运费金额精度',
                id: 'PoTransAmtAccuracy',
                col: 8
            },
            {
                leftLabel: '取值方式',
                id: 'PoTransAmtAccuracyGetType',
                type: 'radio',
                col: 16,
                radioList: [
                    {
                        label: '四舍五入',
                        value: '0'
                    },
                    {
                        label: '去位',
                        value: '1'
                    },
                    {
                        label: '进位',
                        value: '2'
                    },
                    {
                        label: '四舍六入',
                        value: '3'
                    },
                    {
                        label: '五成双法',
                        value: '4'
                    },

                ],
            },

        ]
    },



    {
        title: '订单',
        PK_CLASS: 'SALE',
        children: [
            {
                leftLabel: '订单余量控制标识',
                type: 'OrderYlNumKzFlag',
                type: 'checkbox'
            },
            {
                leftLabel: '抢单是否自动生成抢单项目',
                id: 'SoQDOrderAutoAddQDProjectFlag',
                type: 'checkbox'

            },
            {
                leftLabel: '指派司机是否需要接单确认',
                id: 'SoZPDriverAndJDFlag',
                type: 'checkbox'
            },
            {
                leftLabel: '竞价订单是否自动生成竞价项目',
                id: 'SoJJOrderAutoAddJJProjectFlag',
                type: 'checkbox',
            },
        ]
    },
    {
        title: '委托',
        PK_CLASS: 'SALE',
        children: [
            {
                leftLabel: '竞价中标自动生成委托任务',
                type: 'SoDriverJJAutoAddEntrustTaskFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '抢单确认后自动生成委托任务',
                id: 'SoDriverQDAutoAddEntrustTaskFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '派车单保存即审核',
                id: 'PoTranOrderSaveAndCheckFlag',
            },
            {
                leftLabel: '司机抢单自动生成运单',
                id: 'SoDriverQDAutoAddTranOrderFlag',
                type: 'checkbox',
            },
        ]
    },
    {
        title: '派车',
        PK_CLASS: 'SALE', 
        children: [
            {
                leftLabel: '派车单失效时间(小时)',
                type: 'SoTranOrderUnEffectHour',
                rightLabel:'小时',
                controlWidth: '50px'
            },
            {
                leftLabel: '销售派车量最小吨位',
                id: 'SoTranOrderMinWeight',
            },
            {
                leftLabel: '关联发货计划',
                id: 'SoTranOrderLinkSendPlanFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '销售派车车辆是否默认(吨)',
                id: 'SoTranOrderDefaultCarFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '销售派车司机是否默认',
                id: 'SoTranOrderDefaultDriverFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '是否需要司机开启运输',
                id: 'SoDiriverStartTransFlag',
                type: 'checkbox',
            },
        ]
    },
    {
        title: '排队',
        PK_CLASS: 'SALE',
        children: [
            {

                leftLabel: '厂外排队',
                id: 'SoOutFactoryQueueFlag',
                type: 'radio',
                col: 24,
                radioList: [
                    {
                        label: '不排队',
                        value: '0'
                    },
                    {
                        label: '签到排队',
                        value: '1'
                    },

                ],
            },
            {
                leftLabel: '场内排队',
                col: 24,
                id: 'SoInFactoryQueueFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '排队控制节点',
                id: 'SoInFactoryAddQueueNode',
                isShow: 'SoInFactoryQueueFlag',
                type: 'radio',
                col: 12,
                radioList: [
                    {
                        label: '入场',
                        value: '1'
                    },
                    {
                        label: '计量',
                        value: '2'
                    },
                    {
                        label: '手持机登记',
                        value: '3'
                    },
                ],
            },
            {
                leftLabel: '排队移除节点',
                id: 'SoInFactoryDelQueueNode',
                isShow: 'SoInFactoryQueueFlag',
                col: 12,
                type: 'radio',
                radioList: [
                    {
                        label: '一次计量移除',
                        value: '1'
                    },
                    {
                        label: '出厂移除',
                        value: '2'
                    },
                ],

            },
        ]
    },

    {
        title: '精度',
        PK_CLASS: 'SALE',
        children: [
            {

                leftLabel: '计量重量精度',
                id: 'SoWeightAccuracy',
                col: 8
            },
            {
                leftLabel: '取值方式',
                id: 'SoWeightAccuracyGetType',
                type: 'radio',
                col: 16,
                radioList: [
                    {
                        label: '四舍五入',
                        value: '0'
                    },
                    {
                        label: '去位',
                        value: '1'
                    },
                    {
                        label: '进位',
                        value: '2'
                    },
                    {
                        label: '四舍六入',
                        value: '3'
                    },
                    {
                        label: '五成双法',
                        value: '4'
                    },

                ],
            },

            {

                leftLabel: '货款金额精度',
                id: 'SoMatAmtAccuracy',
                col: 8
            },
            {
                leftLabel: '取值方式',
                id: 'SoMatAmtAccuracyGetType',
                type: 'radio',
                col: 16,
                radioList: [
                    {
                        label: '四舍五入',
                        value: '0'
                    },
                    {
                        label: '去位',
                        value: '1'
                    },
                    {
                        label: '进位',
                        value: '2'
                    },
                    {
                        label: '四舍六入',
                        value: '3'
                    },
                    {
                        label: '五成双法',
                        value: '4'
                    },

                ],
            },

            {

                leftLabel: '运费金额精度',
                id: 'SoTransAmtAccuracy',
                col: 8
            },
            {
                leftLabel: '取值方式',
                id: 'SoTransAmtAccuracyGetType',
                type: 'radio',
                col: 16,
                radioList: [
                    {
                        label: '四舍五入',
                        value: '0'
                    },
                    {
                        label: '去位',
                        value: '1'
                    },
                    {
                        label: '进位',
                        value: '2'
                    },
                    {
                        label: '四舍六入',
                        value: '3'
                    },
                    {
                        label: '五成双法',
                        value: '4'
                    },

                ],
            },

        ]
    },


    {
        title: '原发与实收允差',
        PK_CLASS: 'OTHER',
        children: [
            {
                leftLabel: '上限（吨）',
                id: 'YFSHErrorMaxLimit',
            },
            {
                leftLabel: '下限（吨）',
                id: 'YFSHErrorMinLimit',
            },
        ]
    },


    {
        title: '档案',
        PK_CLASS: 'QUALIFICATION',
        children: [
            {
                leftLabel: '承运商资质',
                col: 24,
                id: 'CarrierCertificationFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '营业执照',
                id: 'CarrierBussinessFlag',
                isShow: 'CarrierCertificationFlag',
                type: 'checkbox',
                col: 8,

            },
            {
                leftLabel: '道路运输经营许可证',
                id: 'CarrierTransportCOAFalg',
                isShow: 'CarrierCertificationFlag',
                col: 8,
                type: 'checkbox',
            },

            {
                leftLabel: '车辆资质',
                col: 24,
                id: 'CarCertificationFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '行驶证',
                id: 'CarLicenseFlag',
                isShow: 'CarCertificationFlag',
                type: 'checkbox',
                col: 8,

            },
            {
                leftLabel: '道路运输证',
                id: 'CarTransportCOAFlag',
                isShow: 'CarCertificationFlag',
                col: 8,
                type: 'checkbox',
            },


            {
                leftLabel: '司机资质',
                col: 24,
                id: 'DriverCertificationFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '驾驶证',
                id: 'DriverLicenceFlag',
                isShow: 'DriverCertificationFlag',
                type: 'checkbox',
                col: 8,

            },
            {
                leftLabel: '道路运输从业资格证[驾驶员]',
                id: 'DriverCPCFlag_D',
                isShow: 'DriverCertificationFlag',
                col: 8,
                type: 'checkbox',
            },

            {
                leftLabel: '客商资质',
                col: 24,
                id: 'CustCertificationFlag',
                type: 'checkbox',
            },
            {
                leftLabel: '营业执照',
                id: 'CustBussinessFlag',
                isShow: 'CustCertificationFlag',
                type: 'checkbox',
                col: 8,

            },
            {
                leftLabel: '危化品经营许可证',
                id: 'CustHWOPFlag',
                isShow: 'CustCertificationFlag',
                col: 8,
                type: 'checkbox',
            },
            {
                leftLabel: '易制爆备案标识',
                id: 'CustSDSFlag',
                isShow: 'CustCertificationFlag',
                type: 'checkbox',
                col: 8,

            },
            {
                leftLabel: '易制毒备案标识',
                id: 'CustHydrogenFlag',
                isShow: 'CustCertificationFlag',
                col: 8,
                type: 'checkbox',
            },
        ]
    },

    {
        title: '运力审核',
        PK_CLASS: 'QUALIFICATION',
        children: [
            {
                leftLabel: '承运商审核方式',
                id: 'CarrierCheckFlag',
                type: 'radio',
                col: 24,
                radioList: [
                    {
                        label: '不审核',
                        value: '0'
                    },
                    {
                        label: '人工审核 ',
                        value: '1'
                    },
                    {
                        label: 'OCR识别',
                        value: '2'
                    },
                    {
                        label: '主平台审核',
                        value: '3'
                    },
                ],
            },
            {
                leftLabel: '车辆审核方式',
                id: 'CarCheckFlag',
                type: 'radio',
                col: 24,
                radioList: [
                    {
                        label: '不审核',
                        value: '0'
                    },
                    {
                        label: '人工审核 ',
                        value: '1'
                    },
                    {
                        label: 'OCR识别',
                        value: '2'
                    },
                    {
                        label: '主平台审核',
                        value: '3'
                    },

                ],
            },
            {
                leftLabel: '司机审核方式',
                id: 'DriverCheckFlag',
                type: 'radio',
                col: 24,
                radioList: [
                    {
                        label: '不审核',
                        value: '0'
                    },
                    {
                        label: '人工审核 ',
                        value: '1'
                    },
                    {
                        label: 'OCR识别',
                        value: '2'
                    },
                    {
                        label: '主平台审核',
                        value: '3'
                    },

                ],
            },
            {
                leftLabel: '客商审核方式',
                id: 'CustomerCheckFlag',
                type: 'radio',
                col: 24,
                radioList: [
                    {
                        label: '不审核',
                        value: '0'
                    },
                    {
                        label: '人工审核 ',
                        value: '1'
                    },
                    {
                        label: 'OCR识别',
                        value: '2'
                    },
                    {
                        label: '主平台审核',
                        value: '3'
                    },

                ],
            },
            
        ]
    },





]







