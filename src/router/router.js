import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => {
        require(['@/views/login.vue'], resolve);
    }
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => {
        require(['@/views/error-page/404.vue'], resolve);
    }
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => {
        require(['@//views/error-page/403.vue'], resolve);
    }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => {
        require(['@/views/error-page/500.vue'], resolve);
    }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    component: Main,
    children: [
        {
            path: 'home', title: {i18n: 'home'}, name: 'home_index', component: resolve => {
                require(['@/views/home/home.vue'], resolve);
            }
        }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/page',
        icon: 'ios-paper',
        title: '首页',
        name: 'indexManage',
        component: Main,
        children: [
            {
                path: 'index', title: 'Page', name: 'page_index', component: resolve => {
                    require(['@/views/index/index.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/group',
        icon: 'ios-cog-outline',
        name: 'baseConfig',
        title: '系统配置',
        parentCode: 'top_config',
        parentName: '基础配置',
        parentIcon: 'ios-settings-outline',
        component: Main,
        children: [
            {
                path: 'systemBaseConfig',
                icon: 'ios-list-box-outline',
                name: 'systemBaseConfig',
                title: '系统标准配置',
                component: resolve => {
                    require(['@/views/organManage/systemBaseConfig.vue'], resolve);
                }
            },
            {
                path: 'semesterStandard',
                icon: 'ios-list-box-outline',
                name: 'semesterStandard',
                title: '学期标准配置',
                component: resolve => {
                    require(['@/views/organManage/semesterStandard.vue'], resolve);
                }
            },
            {
                path: 'schoolSportsStandard',
                icon: 'ios-list-box-outline',
                name: 'schoolSportsStandard',
                title: '体育素质综合评价考核配置',
                component: resolve => {
                    require(['@/views/sportconfig/schoolSportsStandard.vue'], resolve);
                }
            },
            {
                path: 'schoolSportsStandardCD',
                icon: 'ios-list-box-outline',
                name: 'schoolSportsStandardCD',
                title: '体育素质综合评价考核配置',
                component: resolve => {
                    require(['@/views/sportconfig/schoolSportsStandardCD.vue'], resolve);
                }
            },
            {
                path: 'schoolDataManageAdmin',
                icon: 'ios-list-box-outline',
                name: 'schoolDataManageAdmin',
                title: '数据清除管理',
                component: resolve => {
                    require(['@/views/sportconfig/schoolDataManageAdmin.vue'], resolve);
                }
            },
            {
                path: 'appraisalDescription',
                icon: 'ios-list-box-outline',
                name: 'appraisalDescription',
                title: '体育素质综合评价考核说明',
                component: resolve => {
                    require(['@/views/sportconfig/appraisalDescription.vue'], resolve);
                }
            },
            {
                path: 'uploadAndDownload',
                icon: 'ios-list-box-outline',
                name: 'uploadAndDownload',
                title: '资料上传下载',
                component: resolve => {
                    require(['@/views/sportconfig/uploadAndDownload.vue'], resolve);
                }
            }
        ]
    },

    {
        path: '/schoolManage',
        icon: 'ios-home',
        name: 'schoolManage',
        title: '学校管理',
        parentCode: 'top_config',
        parentName: '基础配置',
        parentIcon: 'ios-settings-outline',
        component: Main,
        children: [
            {
                path: 'organManage',
                icon: 'ios-list-box-outline',
                name: 'organManage',
                title: '学校信息',
                component: resolve => {
                    require(['@/views/organManage/organInfo.vue'], resolve);
                }
            },
            {
                path: 'organInfoOrgan',
                icon: 'ios-list-box-outline',
                name: 'organInfoOrgan',
                title: '机构首页',
                component: resolve => {
                    require(['@/views/organManage/organInfoOrgan.vue'], resolve);
                }
            },
            // {
            //     path: 'primarySportsClass',
            //     icon: 'ios-list-box-outline',
            //     name: 'primarySportsClass',
            //     title: '班级及课程管理',
            //     component: resolve => { require(['@/views/sportsClass/v2/sportsClass.vue'], resolve); }
            // },
            // {
            //     path: 'sportsStudentManage',
            //     icon: 'ios-list-box-outline',
            //     name: 'sportsStudentManage',
            //     title: '新体育课分班',
            //     component: resolve => { require(['@/views/sportsClass/v2/sportsStudentManage.vue'], resolve); }
            // },
            // {
            //     path: 'sportsStudentClassManage',
            //     icon: 'ios-list-box-outline',
            //     name: 'sportsStudentClassManage',
            //     title: '新体育课分班',
            //     component: resolve => { require(['@/views/sportsClass/v2/sportsStudentClassManage.vue'], resolve); }
            // },
            // {
            //     path: 'sportsClassInfo',
            //     icon: 'ios-list-box-outline',
            //     name: 'sportsClassInfo',
            //     title: '新体育课信息',
            //     component: resolve => { require(['@/views/sportsClass/v2/sportsClassInfo.vue'], resolve); }
            // } ,
            // {
            //     path: 'classPlan',
            //     icon: 'ios-list-box-outline',
            //     name: 'classPlan',
            //     title: '体育课排课',
            //     component: resolve => { require(['@/views/sportsClass/v2/classPlan.vue'], resolve); }
            // } ,
            // {
            //     path: 'examChoose',
            //     icon: 'ios-list-box-outline',
            //     name: 'examChoose',
            //     title: '考试项目选择',
            //     component: resolve => { require(['@/views/sportsClass/v2/examChoose.vue'], resolve); }
            // }  ,
            // {
            //     path: 'sportsClassTypeManage',
            //     icon: 'ios-list-box-outline',
            //     name: 'sportsClassTypeManage',
            //     title: '体育课类型管理',
            //     component: resolve => { require(['@/views/sportsClass/v2/sportsClassTypeManage.vue'], resolve); }
            // }  ,
            {
                path: 'primarySportsClass',
                icon: 'ios-list-box-outline',
                name: 'primarySportsClass',
                title: '班级及课程管理',
                component: resolve => {
                    require(['@/views/sportsClass/sportsClass.vue'], resolve);
                }
            },
            {
                path: 'primarySportsClassConfig',
                icon: 'ios-list-box-outline',
                name: 'primarySportsClassConfig',
                title: '班级及课程管理',
                component: resolve => {
                    require(['@/views/cd/highSchool/sportsClass/primarySportsClassConfig.vue'], resolve);
                }
            },
            {
                path: 'sportsStudentManage',
                icon: 'ios-list-box-outline',
                name: 'sportsStudentManage',
                title: '导入体育课分班',
                component: resolve => {
                    require(['@/views/cd/highSchool/sportsClass/sportsStudentManage.vue'], resolve);
                }
            },
            {
                path: 'classPlanExportCDHigh',
                icon: 'ios-list-box-outline',
                name: 'classPlanExportCDHigh',
                title: '导入体育课分班',
                component: resolve => {
                    require(['@/views/cd/highSchool/sportsClass/classPlanExportCDHigh.vue'], resolve);
                }
            },
            {
                path: 'sportsStudentClassManage',
                icon: 'ios-list-box-outline',
                name: 'sportsStudentClassManage',
                title: '体育课成员分班',
                component: resolve => {
                    require(['@/views/cd/highSchool/sportsClass/sportsStudentClassManage.vue'], resolve);
                }
            },
            {
                path: 'classPlanCDHigh',
                icon: 'ios-list-box-outline',
                name: 'classPlanCDHigh',
                title: '体育课排课',
                component: resolve => {
                    require(['@/views/cd/highSchool/sportsClass/classPlan.vue'], resolve);
                }
            },
            {
                path: 'classPlan',
                icon: 'ios-list-box-outline',
                name: 'classPlan',
                title: '体育课排课',
                component: resolve => {
                    require(['@/views/sportsClass/classPlan.vue'], resolve);
                }
            },
            {
                path: 'classPlanExport',
                icon: 'ios-list-box-outline',
                name: 'classPlanExport',
                title: '班级排课信息导入',
                component: resolve => {
                    require(['@/views/sportsClass/classPlanExport.vue'], resolve);
                }
            },
            {
                path: 'classPlanExportV2',
                icon: 'ios-list-box-outline',
                name: 'classPlanExportV2',
                title: '班级排课信息导入',
                component: resolve => {
                    require(['@/views/sportsClass/classPlanExportV2.vue'], resolve);
                }
            },
            {
                path: 'classTestInfo',
                icon: 'ios-list-box-outline',
                name: 'classTestInfo',
                title: '考试项目',
                component: resolve => {
                    require(['@/views/sportsClass/classTestInfo.vue'], resolve);
                }
            },
            {
                path: 'teachingManage',
                icon: 'ios-list-box-outline',
                name: 'teachingManage',
                title: '智能教学管理',
                component: resolve => {
                    require(['@/views/devicewristband/teachingManage.vue'], resolve);
                }
            },
            {
                path: 'bathGroup',
                icon: 'ios-list-box-outline',
                name: 'bathGroup',
                title: '批量分组',
                component: resolve => {
                    require(['@/views/devicewristband/bathGroup.vue'], resolve);
                }
            },
            {
                path: 'giveDevice',
                icon: 'ios-list-box-outline',
                name: 'giveDevice',
                title: '分配手环',
                component: resolve => {
                    require(['@/views/devicewristband/giveDevice.vue'], resolve);
                }
            },
        ]
    },
    {
        path: '/roleManage',
        icon: 'md-people',
        name: 'roleManage',
        title: '人员管理',
        parentCode: 'top_config',
        parentName: '基础配置',
        parentIcon: 'ios-settings-outline',
        component: Main,
        children: [
            {
                path: 'studentInfoManage',
                icon: 'ios-list-box-outline',
                name: 'studentInfoManage',
                title: '学生管理',
                component: resolve => {
                    require(['@/views/datamanage/primaryschool/studentInfoManage.vue'], resolve);
                }
            },
            {
                path: 'studentInfoDetail',
                icon: 'ios-list-box-outline',
                name: 'studentInfoDetail',
                title: '学生详情',
                props: true,
                component: resolve => {
                    require(['@/views/datamanage/primaryschool/studentInfoDetail.vue'], resolve);
                }
            },
            {
                path: 'operatorManage',
                icon: 'ios-list-box-outline',
                name: 'operatorManage',
                title: '教师管理',
                component: resolve => {
                    require(['@/views/operatorManage/teacherList.vue'], resolve);
                }
            },
            {
                path: 'teacherDetail',
                icon: 'ios-list-box-outline',
                name: 'teacherDetail',
                title: '人员明细',
                component: resolve => {
                    require(['@/views/operatorManage/teacherDetail.vue'], resolve);
                }
            },
            {
                path: 'schoolTestShow',
                icon: 'ios-list-box-outline',
                name: 'schoolTestShow',
                title: '人员明细',
                component: resolve => {
                    require(['@/views/schoolTest/schoolTestShow.vue'], resolve);
                }
            },
            {
                path: 'groupDetail',
                icon: 'ios-list-box-outline',
                name: 'groupDetail',
                title: '权限组详情',
                component: resolve => {
                    require(['@/views/operatorManage/groupDetail.vue'], resolve);
                }
            },
            {
                path: 'studentExamInfo',
                icon: 'ios-list-box-outline',
                name: 'studentExamInfo',
                title: '学生体育成绩',
                component: resolve => {
                    require(['@/views/datamanage/primaryschool/studentExamInfo.vue'], resolve);
                }
            },
            {
                path: 'exportTaskManage',
                icon: 'ios-list-box-outline',
                name: 'exportTaskManage',
                title: '学生信息导入管理',
                component: resolve => {
                    require(['@/views/datamanage/primaryschool/exportTaskManage.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/StudentExempt',
        icon: 'ios-home',
        name: 'StudentExempt',
        title: '免试管理',
        parentCode: 'top_config',
        parentName: '基础配置',
        parentIcon: 'ios-settings-outline',
        component: Main,
        children: [
            {
                path: 'StudentExempt',
                icon: 'ios-list-box-outline',
                name: 'StudentExempt',
                title: '免试管理',
                component: resolve => {
                    require(['@/views/StudentExempt/StudentExempt.vue'], resolve);
                }
            },
        ]
    },
    {
        path: '/highStudentExempt',
        icon: 'ios-home',
        name: 'highStudentExempt',
        title: '免试管理',
        parentCode: 'top_config',
        parentName: '基础配置',
        parentIcon: 'ios-settings-outline',
        component: Main,
        children: [
            {
                path: 'highStudentExempt',
                icon: 'ios-list-box-outline',
                name: 'highStudentExempt',
                title: '免试管理',
                component: resolve => {
                    require(['@/views/cd/highSchool/sportsClass/highStudentExempt.vue'], resolve);
                }
            },
        ]
    },
    {
        path: '/dataManage',
        icon: 'md-git-branch',
        name: 'dataManage',
        title: '体质测试',
        parentCode: 'top_test',
        parentName: '体质测试',
        parentIcon: 'md-stats',
        component: Main,
        children: [
            {
                path: 'studentExemptManage',
                icon: 'ios-list-box-outline',
                name: 'studentExemptManage',
                title: '免试管理',
                component: resolve => {
                    require(['@/views/datamanage/primaryschool/studentManage.vue'], resolve);
                }
            },
            // {
            //     path: 'schoolTestData',
            //     icon: 'ios-list-box-outline',
            //     name: 'schoolTestData',
            //     title: '体测数据管理',
            //     component: resolve => { require(['@/views/datamanage/primaryschool/schoolTestData.vue'], resolve); }
            // },
            {
                path: 'classTestResult',
                icon: 'ios-list-box-outline',
                name: 'classTestResult',
                title: '班级体测数据',
                component: resolve => {
                    require(['@/views/datamanage/primaryschool/classTestResult.vue'], resolve);
                }
            },
            {
                path: 'classTestDetail',
                icon: 'ios-list-box-outline',
                name: 'classTestDetail',
                title: '学生测试详情',
                component: resolve => {
                    require(['@/views/datamanage/primaryschool/classTestDetail.vue'], resolve);
                }
            },
            {
                path: 'studentExemptDetail',
                icon: 'ios-list-box-outline',
                name: 'studentExemptDetail',
                title: '学生免试详情',
                component: resolve => {
                    require(['@/views/datamanage/primaryschool/studentExemptDetail.vue'], resolve);
                }
            },
            {
                path: 'schoolTestShowConfig',
                icon: 'ios-list-box-outline',
                name: 'schoolTestShowConfig',
                title: '体测成绩上报',
                component: resolve => { require(['@/views/schoolTest/schoolTestShowConfig.vue'], resolve); }
            },
            {
                path: 'testResultTask',
                icon: 'ios-list-box-outline',
                name: 'testResultTask',
                title: '体测修改管理',
                component: resolve => {
                    require(['@/views/schoolTest/testEdite/testResultTask.vue'], resolve);
                }
            },
            {
                path: 'testResultChangeDetail',
                icon: 'ios-list-box-outline',
                name: 'testResultChangeDetail',
                title: '体测修改详情',
                component: resolve => {
                    require(['@/views/schoolTest/testEdite/testResultChangeDetail.vue'], resolve);
                }
            },
            {
                path: 'testTeacherWorkload',
                icon: 'ios-list-box-outline',
                name: 'testTeacherWorkload',
                title: '体测工作量分析',
                component: resolve => {
                    require(['@/views/schoolTest/testTeacherWorkload.vue'], resolve);
                }
            },
            {
                path: 'supplementGradeList',
                icon: 'ios-list-box-outline',
                name: 'supplementGradeList',
                title: '补测管理',
                component: resolve => {
                    require(['@/views/schoolTest/supplementGradeList.vue'], resolve);
                }
            },
            {
                path: 'schoolTestDetail',
                icon: 'ios-list-box-outline',
                name: 'schoolTestDetail',
                title: '体测数据明细',
                component: resolve => {
                    require(['@/views/schoolTest/schoolTestDetail.vue'], resolve);
                }
            },
            {
                path: 'schoolTestStudentExport',
                icon: 'ios-list-box-outline',
                name: 'schoolTestStudentExport',
                title: '体测初始学生导入',
                component: resolve => {
                    require(['@/views/schoolTest/schoolTestStudentExport.vue'], resolve);
                }
            },
            {
                path: 'studebtTestList',
                icon: 'ios-list-box-outline',
                name: 'studebtTestList',
                title: '学生测试信息',
                component: resolve => {
                    require(['@/views/schoolTest/studebtTestList.vue'], resolve);
                }
            },
            // {
            //     path: 'scoreChangeManage',
            //     icon: 'ios-list-box-outline',
            //     name: 'scoreChangeManage',
            //     title: '体测合格率调整',
            //     component: resolve => { require(['@/views/scorechange/scoreChangeManage.vue'], resolve); }
            // },
            // {
            //     path: 'scoreChangeDetail',
            //     icon: 'ios-list-box-outline',
            //     name: 'scoreChangeDetail',
            //     title: '及格率调整',
            //     component: resolve => { require(['@/views/scorechange/scoreChangeDetail.vue'], resolve); }
            // }
        ]
    },
    {
        path: '/testDataManage',
        icon: 'md-stats',
        name: 'testDataManage',
        title: '数据管理',
        parentCode: 'top_test',
        parentName: '体质测试',
        parentIcon: 'md-stats',
        component: Main,
        children: [
            {
                path: 'queryStudentList',
                icon: 'ios-list-box-outline',
                name: 'queryStudentList',
                title: '按学生查询',
                component: resolve => {
                    require(['@/views/datamanage/primaryschool/queryStudentList.vue'], resolve);
                }
            },
            {
                path: 'classTestResultHis',
                icon: 'ios-list-box-outline',
                name: 'classTestResultHis',
                title: '历史数据班级详情',
                component: resolve => {
                    require(['@/views/datamanage/primaryschool/classTestResultHis.vue'], resolve);
                }
            },
            {
                path: 'queryClassTestData',
                icon: 'ios-list-box-outline',
                name: 'queryClassTestData',
                title: '历史数据班级列表',
                component: resolve => {
                    require(['@/views/datamanage/primaryschool/queryClassTestData.vue'], resolve);
                }
            },
            {
                path: 'queryGradeTestData',
                icon: 'ios-list-box-outline',
                name: 'queryGradeTestData',
                title: '历史数据年级列表',
                component: resolve => {
                    require(['@/views/datamanage/primaryschool/queryGradeTestData.vue'], resolve);
                }
            },
            {
                path: 'queryClassList',
                icon: 'ios-list-box-outline',
                name: 'queryClassList',
                title: '按班级查询',
                component: resolve => {
                    require(['@/views/datamanage/primaryschool/queryClassList.vue'], resolve);
                }
            },
            {
                path: 'queryGradeList',
                icon: 'ios-list-box-outline',
                name: 'queryGradeList',
                title: '按年级查询',
                component: resolve => {
                    require(['@/views/datamanage/primaryschool/queryGradeList.vue'], resolve);
                }
            },
            {
                path: 'classTestResultThis',
                icon: 'ios-list-box-outline',
                name: 'classTestResultThis',
                title: '班级详情',
                component: resolve => {
                    require(['@/views/datamanage/primaryschool/classTestResultThis.vue'], resolve);
                }
            },
            {
                path: 'queryProjectList',
                icon: 'ios-list-box-outline',
                name: 'queryProjectList',
                title: '按项目查询',
                component: resolve => {
                    require(['@/views/datamanage/primaryschool/queryProjectList.vue'], resolve);
                }
            },
            {
                path: 'queryHistoryData',
                icon: 'ios-list-box-outline',
                name: 'queryHistoryData',
                title: '历史数据查询',
                component: resolve => {
                    require(['@/views/datamanage/primaryschool/newQueryHistoryData.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/dataMonitoring',
        icon: 'md-stats',
        name: 'dataMonitoring',
        title: '体质测试数据管理',
        parentCode: 'top_data',
        parentName: '数据监控',
        parentIcon: 'md-stats',
        component: Main,
        children: [
            {
                path: 'monitoring',
                icon: 'ios-list-box-outline',
                name: 'monitoring',
                title: '体育数据监控',
                component: resolve => {
                    require(['@/views/dataMonitoring/monitoring.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/examManage',
        icon: 'md-clipboard',
        name: 'examManage',
        title: '技能/体能',
        parentCode: 'top_skills',
        parentName: '技能/体能',
        parentIcon: 'md-clipboard',
        component: Main,
        children: [
            {
                path: 'examExemptStudent',
                icon: 'ios-list-box-outline',
                name: 'examExemptStudent',
                title: '免试管理',
                component: resolve => {
                    require(['@/views/exam/examExemptStudent.vue'], resolve);
                }
            },
            {
                path: 'examExemptDetail',
                icon: 'ios-list-box-outline',
                name: 'examExemptDetail',
                title: '中小学免试详情',
                component: resolve => {
                    require(['@/views/exam/examExemptDetail.vue'], resolve);
                }
            },
            {
                path: 'highStudentExemptDetail',
                icon: 'ios-list-box-outline',
                name: 'highStudentExemptDetail',
                title: '高中免试详情',
                component: resolve => {
                    require(['@/views/cd/highSchool/sportsClass/highStudentExemptDetail.vue'], resolve);
                }
            },
            {
                path: 'examItemManage',
                icon: 'ios-list-box-outline',
                name: 'examItemManage',
                title: '考核项目列表',
                component: resolve => {
                    require(['@/views/exam/examItemManage.vue'], resolve);
                }
            },
            {
                path: 'examItemClassList',
                icon: 'ios-list-box-outline',
                name: 'examItemClassList',
                title: '考核项目配置',
                component: resolve => {
                    require(['@/views/examManage/examItemClassList.vue'], resolve);
                }
            },
            {
                path: 'examItemDetail',
                icon: 'ios-list-box-outline',
                name: 'examItemDetail',
                title: '项目详情',
                component: resolve => {
                    require(['@/views/exam/examItemDetail.vue'], resolve);
                }
            },
            {
                path: 'examStandardDetail',
                icon: 'ios-list-box-outline',
                name: 'examStandardDetail',
                title: '项目标准详情',
                component: resolve => {
                    require(['@/views/exam/examStandardDetail.vue'], resolve);
                }
            },
            {
                path: 'examSupplement',
                icon: 'ios-list-box-outline',
                name: 'examSupplement',
                title: '补考管理',
                component: resolve => {
                    require(['@/views/examManage/examSupplement.vue'], resolve);
                }
            },
            {
                path: 'classExamManage',
                icon: 'ios-list-box-outline',
                name: 'classExamManage',
                title: '班级学生成绩',
                component: resolve => {
                    require(['@/views/examManage/classExamManage.vue'], resolve);
                }
            },
            {
                path: 'studentExamDetail',
                icon: 'ios-list-box-outline',
                name: 'studentExamDetail',
                title: '学生测试成绩详情',
                component: resolve => {
                    require(['@/views/examManage/studentExamDetail.vue'], resolve);
                }
            },
            {
                path: 'studentExamDetail1',
                icon: 'ios-list-box-outline',
                name: 'studentExamDetail1',
                title: '学生测试成绩详情',
                component: resolve => {
                    require(['@/views/healthKonowledge/studentExamDetail.vue'], resolve);
                }
            },
            {
                path: 'examItemconfigure',
                icon: 'ios-list-box-outline',
                name: 'examItemconfigure',
                title: '配置考核项目',
                component: resolve => {
                    require(['@/views/examManage/examItemconfigure.vue'], resolve);
                }
            },
            {
                path: 'examManageAnalyze',
                icon: 'ios-list-box-outline',
                name: 'examManageAnalyze',
                title: '技能/体能分析',
                component: resolve => {
                    require(['@/views/scorechange/skillsAssessment.vue'], resolve);
                }
            },

        ]
    },
    {
        path: '/examManageCD',
        icon: 'md-clipboard',
        name: 'examManageCD',
        title: '运动技能',
        parentCode: 'top_skills',
        parentName: '运动技能',
        parentIcon: 'md-clipboard',
        component: Main,
        children: [
            {
                path: 'skillItemListManage',
                icon: 'ios-list-box-outline',
                name: 'skillItemListManage',
                title: '技能项目列表',
                component: resolve => {
                    require(['@/views/cd/highSchool/skills/skillItemListManage.vue'], resolve);
                }
            },
            {
                path: 'skillItemConfiguration',
                icon: 'ios-list-box-outline',
                name: 'skillItemConfiguration',
                title: '技能项目配置',
                component: resolve => {
                    require(['@/views/cd/highSchool/skills/skillItemConfiguration.vue'], resolve);
                }
            },
            {
                path: 'skillItemConfigurationDetail',
                icon: 'ios-list-box-outline',
                name: 'skillItemConfigurationDetail',
                title: '技能项目配置',
                component: resolve => {
                    require(['@/views/cd/highSchool/skills/skillItemConfigurationDetail.vue'], resolve);
                }
            },
            {
                path: 'learningAttitudeManage',
                icon: 'ios-list-box-outline',
                name: 'learningAttitudeManage',
                title: '学习态度管理',
                component: resolve => {
                    require(['@/views/cd/highSchool/learningAttitude/learningAttitudeManage.vue'], resolve);
                }
            },
            {
                path: 'schoolExerciseManage',
                icon: 'ios-list-box-outline',
                name: 'schoolExerciseManage',
                title: '课外锻炼管理',
                component: resolve => {
                    require(['@/views/cd/highSchool/skills/afterSchool/schoolExerciseManage.vue'], resolve);
                }
            },
            {
                path: 'schoolExerciseManageDetail',
                icon: 'ios-list-box-outline',
                name: 'schoolExerciseManageDetail',
                title: '课外锻炼管理详情',
                component: resolve => {
                    require(['@/views/cd/highSchool//skills/afterSchool/schoolExerciseManageDetail.vue'], resolve);
                }
            },
            {
                path: 'schoolExerciseRecordingManage',
                icon: 'ios-list-box-outline',
                name: 'schoolExerciseRecordingManage',
                title: '课外锻炼录入',
                component: resolve => {
                    require(['@/views/cd/highSchool//skills/afterSchool/schoolExerciseRecordingManage.vue'], resolve);
                }
            },
            // {
            //     path: 'skillItemSupplementManage',
            //     icon: 'ios-list-box-outline',
            //     name: 'skillItemSupplementManage',
            //     title: '补考管理',
            //     component: resolve => { require(['@/views/cd/highSchool/skills/skillItemSupplementManage.vue'], resolve); }
            // },
            {
                path: 'learningAttitudeHis',
                icon: 'ios-list-box-outline',
                name: 'learningAttitudeHis',
                title: '学习态度记录',
                component: resolve => {
                    require(['@/views/cd/highSchool/learningAttitude/learningAttitudeHis.vue'], resolve);
                }

            },

        ]
    },
    {
        path: '/examDataManageHigh',
        icon: 'md-paper',
        name: 'examDataManageHigh',
        title: '运动技能数据管理',
        parentCode: 'top_skills',
        parentName: '运动技能',
        parentIcon: 'md-clipboard',
        component: Main,
        children: [
            {
                path: 'examQueryStudentHigh',
                icon: 'ios-list-box-outline',
                name: 'examQueryStudentHigh',
                title: '按学生查询',
                component: resolve => {
                    require(['@/views/cd/highSchool/skillData/examQueryStudent.vue'], resolve);
                }
            },
            {
                path: 'studentExamDetailHighCD',
                icon: 'ios-list-box-outline',
                name: 'studentExamDetailHighCD',
                title: '学生详情',
                component: resolve => {
                    require(['@/views/cd/highSchool/skillData/studentExamDetail.vue'], resolve);
                }
            },
            {
                path: 'examQueryExamClassTestHigh',
                icon: 'ios-list-box-outline',
                name: 'examQueryExamClassTestHigh',
                title: '按项目查询',
                component: resolve => {
                    require(['@/views/cd/highSchool/skillData/examQueryExamClassTest.vue'], resolve);
                }
            },
        ]
    },
    {
        path: '/examDataManage',
        icon: 'md-paper',
        name: 'examDataManage',
        title: '技能/体能数据管理',
        parentCode: 'top_skills',
        parentName: '技能/体能',
        parentIcon: 'md-clipboard',
        component: Main,
        children: [
            {
                path: 'examQueryStudent',
                icon: 'ios-list-box-outline',
                name: 'examQueryStudent',
                title: '按学生查询',
                component: resolve => {
                    require(['@/views/examData/examQueryStudent.vue'], resolve);
                }
            },
            {
                path: 'examQueryClass',
                icon: 'ios-list-box-outline',
                name: 'examQueryClass',
                title: '按班级查询',
                component: resolve => {
                    require(['@/views/examData/examQueryClass.vue'], resolve);
                }
            },
            {
                path: 'examQueryGrade',
                icon: 'ios-list-box-outline',
                name: 'examQueryGrade',
                title: '按年级查询',
                component: resolve => {
                    require(['@/views/examData/examQueryGrade.vue'], resolve);
                }
            },
            {
                path: 'examQueryExamClassTest',
                icon: 'ios-list-box-outline',
                name: 'examQueryExamClassTest',
                title: '按考核项目查询',
                component: resolve => {
                    require(['@/views/examData/examQueryExamClassTest.vue'], resolve);
                }
            },
        ]
    },
    {
        path: '/physicalFitnessManage',
        icon: 'logo-python',
        name: 'physicalFitnessManage',
        title: '体能配置管理',
        parentCode: 'physicalFitnessManage',
        parentName: '体能',
        parentIcon: 'logo-python',
        component: Main,
        children: [
            {
                path: 'physicalFitnessItemList',
                icon: 'ios-list-box-outline',
                name: 'physicalFitnessItemList',
                title: '体能项目配置',
                component: resolve => {
                    require(['@/views/cd/highSchool/physicalFitnessManage/physicalFitnessItemList.vue'], resolve);
                }
            },
            {
                path: 'physicalFitnessData',
                icon: 'ios-list-box-outline',
                name: 'physicalFitnessData',
                title: '体能数据统计',
                component: resolve => {
                    require(['@/views/cd/highSchool/physicalFitnessManage/physicalFitnessData.vue'], resolve);
                }
            },
            {
                path: 'physicalFitnessItemConfige',
                icon: 'ios-list-box-outline',
                name: 'physicalFitnessItemConfige',
                title: '体能项目配置',
                component: resolve => {
                    require(['@/views/cd/highSchool/physicalFitnessManage/physicalFitnessItemConfige.vue'], resolve);
                }
            },
        ]
    },
    {
        path: '/healthknowledge',
        icon: 'ios-book-outline',
        name: 'healthknowledge',
        title: '健康知识',
        parentCode: 'top_healthknowledge',
        parentName: '健康知识',
        parentIcon: 'ios-book-outline',
        component: Main,
        children: [
            {
                path: 'paperManage',
                icon: 'ios-list-box-outline',
                name: 'paperManage',
                title: '试卷管理',
                component: resolve => {
                    require(['@/views/healthKonowledge/paperManage.vue'], resolve);
                }
            },
            {
                path: 'paperScoreManage',
                icon: 'ios-list-box-outline',
                name: 'paperScoreManage',
                title: '成绩管理',
                component: resolve => {
                    require(['@/views/healthKonowledge/paperScoreManage.vue'], resolve);
                }
            },
            {
                path: 'paperClassResults',
                icon: 'ios-list-box-outline',
                name: 'paperClassResults',
                title: '班级成绩',
                component: resolve => {
                    require(['@/views/healthKonowledge/paperClassResults.vue'], resolve);
                }
            },
            {
                path: 'paperEntryResults',
                icon: 'ios-list-box-outline',
                name: 'paperEntryResults',
                title: '录入成绩',
                component: resolve => {
                    require(['@/views/healthKonowledge/paperEntryResults.vue'], resolve);
                }
            },
            {
                path: 'paperClassStudentResults',
                icon: 'ios-list-box-outline',
                name: 'paperClassStudentResults',
                title: '修改单个学生成绩',
                component: resolve => {
                    require(['@/views/healthKonowledge/paperClassStudentResults.vue'], resolve);
                }
            },
            {
                path: 'paperManageDetail',
                icon: 'ios-list-box-outline',
                name: 'paperManageDetail',
                title: '试卷详情',
                component: resolve => {
                    require(['@/views/healthKonowledge/paperManageDetail.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/sportsClassMonitoring',
        icon: 'logo-instagram',
        name: 'sportsClassMonitoring',
        title: '学习态度',
        parentCode: 'top_sportsClass',
        parentName: '课堂监控',
        parentIcon: 'logo-python',
        component: Main,
        children: [
            {
                path: 'sportsClassStandard',
                icon: 'ios-list-box-outline',
                name: 'sportsClassStandard',
                title: '评分标准',
                component: resolve => {
                    require(['@/views/sportsClass/sportsClassStandard.vue'], resolve);
                }
            },
            {
                path: 'sportsClassManage',
                icon: 'ios-list-box-outline',
                name: 'sportsClassManage',
                title: '学习态度管理',
                component: resolve => {
                    require(['@/views/sportsClass/sportsClassManage.vue'], resolve);
                }
            },
            {
                path: 'sportsClassStudentHis',
                icon: 'ios-list-box-outline',
                name: 'sportsClassStudentHis',
                title: '学习态度记录',
                component: resolve => {
                    require(['@/views/sportsClass/sportsClassStudentHis.vue'], resolve);
                }
            },
            {
                path: 'sportsClassAnalyze',
                icon: 'ios-list-box-outline',
                name: 'sportsClassAnalyze',
                title: '学习态度分析',
                component: resolve => {
                    require(['@/views/scorechange/classroomMonitoring.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/sportsHealthData',
        icon: 'md-bicycle',
        name: 'sportsHealthData',
        title: '运动与健康数据',
        parentCode: 'top_sportsClass',
        parentName: '课堂监控',
        parentIcon: 'logo-python',
        component: Main,
        children: [
            {
                path: 'dataStatistical',
                icon: 'ios-list-box-outline',
                name: 'dataStatistical',
                title: '数据概况',
                component: resolve => {
                    require(['@/views/sportsHealthData/dataStatistical.vue'], resolve);
                }
            },
            {
                path: 'studentSportsData',
                icon: 'ios-list-box-outline',
                name: 'studentSportsData',
                title: '学生运动数据',
                component: resolve => {
                    require(['@/views/sportsHealthData/studentSportsData.vue'], resolve);
                }
            },
            {
                path: 'classMonitoringData',
                icon: 'ios-list-box-outline',
                name: 'classMonitoringData',
                title: '课程监控数据',
                component: resolve => {
                    require(['@/views/sportsHealthData/classMonitoringData.vue'], resolve);
                }
            },
            {
                path: 'studentSportsDataDetail',
                icon: 'ios-list-box-outline',
                name: 'studentSportsDataDetail',
                title: '学生详情',
                component: resolve => {
                    require(['@/views/sportsHealthData/studentSportsDataDetail.vue'], resolve);
                }
            }
        ]
    },
    // {
    //     path: '/subordinateSchool',
    //     icon: 'ios-folder',
    //     name: 'subordinateSchool',
    //     title: '下属学校',
    //     parentCode: 'top_config',
    //     parentName: '基础配置',
    //     parentIcon: 'ios-settings-outline',
    //     component: Main,
    //     children: [
    //         {
    //             path: 'subordinateSchoolList',
    //             icon: 'ios-list-box-outline',
    //             name: 'subordinateSchoolList',
    //             title: '学校管理',
    //             component: resolve => { require(['@/views/subordinateSchool/subordinateSchoolList.vue'], resolve); }
    //         },
    //         {
    //             path: 'subordinateSchoolTestData',
    //             icon: 'ios-list-box-outline',
    //             name: 'subordinateSchoolTestData',
    //             title: '体测数据',
    //             component: resolve => { require(['@/views/subordinateSchool/subordinateSchoolTestData.vue'], resolve); }
    //         },
    //         {
    //             path: 'subordinateClassTestResult',
    //             icon: 'ios-list-box-outline',
    //             name: 'subordinateClassTestResult',
    //             title: '班级体测数据',
    //             component: resolve => { require(['@/views/subordinateSchool/subordinateClassTestResult.vue'], resolve); }
    //         }
    //     ]
    // },
    {
        path: '/exerciseFamily',
        icon: 'ios-basketball-outline',
        name: 'exerciseFamily',
        title: '课后作业',
        parentCode: 'top_exercise',
        parentName: '课后作业',
        parentIcon: 'ios-basketball-outline',
        component: Main,
        children: [
            {
                path: 'exerciseFamilyStandard',
                icon: 'ios-list-box-outline',
                name: 'exerciseFamilyStandard',
                title: '课后作业标准配置',
                component: resolve => {
                    require(['@/views/exerciseFamily/exerciseFamilyStandard.vue'], resolve);
                }
            },
            {
                path: 'exercisePlanList',
                icon: 'ios-list-box-outline',
                name: 'exercisePlanList',
                title: '锻炼计划管理',
                component: resolve => {
                    require(['@/views/exerciseFamily/exercisePlanList.vue'], resolve);
                }
            },
            {
                path: 'exercisePlanDetail',
                icon: 'ios-list-box-outline',
                name: 'exercisePlanDetail',
                title: '锻炼计划详情',
                component: resolve => {
                    require(['@/views/exerciseFamily/exercisePlanDetail.vue'], resolve);
                }
            },
            {
                path: 'exciseSchoolDetail',
                icon: 'ios-list-box-outline',
                name: 'exciseSchoolDetail',
                title: '锻炼计划详情',
                component: resolve => {
                    require(['@/views/exerciseFamily/exciseSchoolDetail.vue'], resolve);
                }
            },
            {
                path: 'studentExerciseHis',
                icon: 'ios-list-box-outline',
                name: 'studentExerciseHis',
                title: '锻炼记录监控',
                component: resolve => {
                    require(['@/views/exerciseFamily/studentExerciseHis.vue'], resolve);
                }
            },
            {
                path: 'studentExerciseHisDetail',
                icon: 'ios-list-box-outline',
                name: 'studentExerciseHisDetail',
                title: '锻炼记录监控详情',
                component: resolve => {
                    require(['@/views/exerciseFamily/studentExerciseHisDetail.vue'], resolve);
                }
            },
            {
                path: 'studentExerciseManage',
                icon: 'ios-list-box-outline',
                name: 'studentExerciseManage',
                title: '学生锻炼管理',
                component: resolve => {
                    require(['@/views/exerciseFamily/studentExerciseManage.vue'], resolve);
                }
            },
            {
                path: 'exerciseComboList',
                icon: 'ios-list-box-outline',
                name: 'exerciseComboList',
                title: '作业标准配置',
                component: resolve => {
                    require(['@/views/exerciseFamily/exerciseComboList.vue'], resolve);
                }
            },
            {
                path: 'exerciseComboDetail',
                icon: 'ios-list-box-outline',
                name: 'exerciseComboDetail',
                title: '作业标准配置',
                component: resolve => {
                    require(['@/views/exerciseFamily/exerciseComboDetail.vue'], resolve);
                }
            },
            {
                path: 'exerciseFamilyStandardSingle',
                icon: 'ios-list-box-outline',
                name: 'exerciseFamilyStandardSingle',
                title: '课后作业标准配置',
                component: resolve => {
                    require(['@/views/exerciseFamily/exerciseFamilyStandardSingle.vue'], resolve);
                }
            },
            {
                path: 'homeworkRecord',
                icon: 'ios-list-box-outline',
                name: 'homeworkRecord',
                title: '课后作业考核录入',
                component: resolve => {
                    require(['@/views/exerciseFamily/homeworkRecord.vue'], resolve);
                }
            },
            {
                path: 'familyExerciseAnalyze',
                icon: 'ios-list-box-outline',
                name: 'familyExerciseAnalyze',
                title: '课后作业分析',
                component: resolve => {
                    require(['@/views/dataAnalyze/familyExerciseAnalyze.vue'], resolve);
                }
            },
        ]
    },
    {
        path: '/exerciseManage',
        icon: 'ios-clock-outline',
        name: 'exerciseManage',
        title: '锻炼数据管理',
        parentCode: 'top_exercise',
        parentName: '课后作业',
        parentIcon: 'ios-basketball-outline',
        component: Main,
        children: [
            {
                path: 'exerciseManageDate',
                icon: 'ios-list-box-outline',
                name: 'exerciseManageDate',
                title: '按日期查询',
                component: resolve => {
                    require(['@/views/exerciseManage/exerciseManageDate.vue'], resolve);
                }
            },
            {
                path: 'exerciseManageStudent',
                icon: 'ios-list-box-outline',
                name: 'exerciseManageStudent',
                title: '按学生查询',
                component: resolve => {
                    require(['@/views/exerciseManage/exerciseManageStudent.vue'], resolve);
                }
            },
            {
                path: 'additionalRecordingStudentManage',
                icon: 'ios-list-box-outline',
                name: 'additionalRecordingStudentManage',
                title: '课后作业补录',
                component: resolve => {
                    require(['@/views/exerciseManage/additionalRecordingStudentManage.vue'], resolve);
                }
            },
            {
                path: 'exerciseManageClass',
                icon: 'ios-list-box-outline',
                name: 'exerciseManageClass',
                title: '按班级查询',
                component: resolve => {
                    require(['@/views/exerciseManage/exerciseManageClass.vue'], resolve);
                }
            },
            {
                path: 'exerciseManageGrade',
                icon: 'ios-list-box-outline',
                name: 'exerciseManageGrade',
                title: '按年级查询',
                component: resolve => {
                    require(['@/views/exerciseManage/exerciseManageGrade.vue'], resolve);
                }
            },
            {
                path: 'exerciseManageStudentDetail',
                icon: 'ios-list-box-outline',
                name: 'exerciseManageStudentDetail',
                title: '学生锻炼详情',
                component: resolve => {
                    require(['@/views/exerciseManage/exerciseManageStudentDetail.vue'], resolve);
                }
            },
            {
                path: 'exerciseManageDateDetail',
                icon: 'ios-list-box-outline',
                name: 'exerciseManageDateDetail',
                title: '锻炼数据管理',
                component: resolve => {
                    require(['@/views/exerciseManage/exerciseManageDateDetail.vue'], resolve);
                }
            },
            {
                path: 'exerciseManageStudentSingle',
                icon: 'ios-list-box-outline',
                name: 'exerciseManageStudentSingle',
                title: '按学生查询',
                component: resolve => {
                    require(['@/views/exerciseManage/exerciseManageStudentSingle.vue'], resolve);
                }
            },
            {
                path: 'exerciseManageClassSingle',
                icon: 'ios-list-box-outline',
                name: 'exerciseManageClassSingle',
                title: '按班级查询',
                component: resolve => {
                    require(['@/views/exerciseManage/exerciseManageClassSingle.vue'], resolve);
                }
            },
            {
                path: 'exerciseManageGradeSingle',
                icon: 'ios-list-box-outline',
                name: 'exerciseManageGradeSingle',
                title: '按年级查询',
                component: resolve => {
                    require(['@/views/exerciseManage/exerciseManageGradeSingle.vue'], resolve);
                }
            },
        ]
    },
    {
        path: '/sportsTotalScore',
        icon: 'md-pulse',
        name: 'sportsTotalScore',
        title: '综合评价',
        parentCode: 'top_sports_score',
        parentName: '综合评价',
        parentIcon: 'md-pulse',
        component: Main,
        children: [
            {
                path: 'sportsScoreStudent',
                icon: 'ios-list-box-outline',
                name: 'sportsScoreStudent',
                title: '按学生查询',
                component: resolve => {
                    require(['@/views/sportsScore/sportsScoreStudent.vue'], resolve);
                }
            },
            {
                path: 'sportsScoreStudentDetail',
                icon: 'ios-list-box-outline',
                name: 'sportsScoreStudentDetail',
                title: '学生详情',
                component: resolve => {
                    require(['@/views/sportsScore/sportsScoreStudentDetail.vue'], resolve);
                }
            },
            {
                path: 'sportsScoreStudentDetailCD',
                icon: 'ios-list-box-outline',
                name: 'sportsScoreStudentDetailCD',
                title: '学生详情',
                component: resolve => {
                    require(['@/views/sportsScore/sportsScoreStudentDetailCD.vue'], resolve);
                }
            },
            {
                path: 'sportsScoreClass',
                icon: 'ios-list-box-outline',
                name: 'sportsScoreClass',
                title: '按班级查询',
                component: resolve => {
                    require(['@/views/sportsScore/sportsScoreClass.vue'], resolve);
                }
            },
            {
                path: 'sportsScoreGrade',
                icon: 'ios-list-box-outline',
                name: 'sportsScoreGrade',
                title: '按年级查询',
                component: resolve => {
                    require(['@/views/sportsScore/sportsScoreGrade.vue'], resolve);
                }
            },
            {
                path: 'sportsScoreYear',
                icon: 'ios-list-box-outline',
                name: 'sportsScoreYear',
                title: '体育分值查询',
                component: resolve => {
                    require(['@/views/sportsScore/sportsScoreYear.vue'], resolve);
                }
            },
            {
                path: 'sportsScoreYearDetail',
                icon: 'ios-list-box-outline',
                name: 'sportsScoreYearDetail',
                title: '分值详情',
                component: resolve => {
                    require(['@/views/sportsScore/sportsScoreYearDetail.vue'], resolve);
                }
            },
            {
                path: 'subjectReport',
                icon: 'ios-list-box-outline',
                name: 'subjectReport',
                title: '学生成绩上报',
                component: resolve => {
                    require(['@/views/sportsScore/subjectReport.vue'], resolve);
                }
            },
            {
                path: 'lessonReport',
                icon: 'ios-list-box-outline',
                name: 'lessonReport',
                title: '学课报告',
                component: resolve => {
                    require(['@/views/sportsScore/lessonReport.vue'], resolve);
                }
            },
            {
                path: 'subjectReportDetail',
                icon: 'ios-list-box-outline',
                name: 'subjectReportDetail',
                title: '学生上报信息',
                component: resolve => {
                    require(['@/views/sportsScore/subjectReportDetail.vue'], resolve);
                }
            },
            {
                path: 'highSportsScoreStudent',
                icon: 'ios-list-box-outline',
                name: 'highSportsScoreStudent',
                title: '按学生查询',
                component: resolve => {
                    require(['@/views/cd/highSchool/sportsScore/sportsScoreStudent.vue'], resolve);
                }
            },
            {
                path: 'sportsYearSemesterScoreStudentDetail',
                icon: 'ios-list-box-outline',
                name: 'sportsYearSemesterScoreStudentDetail',
                title: '按学生查询',
                component: resolve => {
                    require(['@/views/cd/highSchool/sportsScore/sportsYearSemesterScoreStudentDetail.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/healthRecordManage',
        icon: 'ios-paper-outline',
        name: 'healthRecordManage',
        title: '数据档案',
        parentCode: 'top_healthrecord',
        parentName: '数据档案',
        parentIcon: 'ios-paper-outline',
        component: Main,
        children: [
            {
                path: 'healthRecordStudent',
                icon: 'ios-list-box-outline',
                name: 'healthRecordStudent',
                title: '学生档案',
                component: resolve => {
                    require(['@/views/healthRecord/healthRecordStudent.vue'], resolve);
                }
            },
            {
                path: 'healthRecordDetail',
                icon: 'ios-list-box-outline',
                name: 'healthRecordDetail',
                title: '健康档案详情',
                component: resolve => {
                    require(['@/views/healthRecord/healthRecordDetail.vue'], resolve);
                }
            },
            {
                path: 'healthDetection',
                icon: 'ios-list-box-outline',
                name: 'healthDetection',
                title: '学生健康监测',
                component: resolve => {
                    require(['@/views/healthDetection/healthDetection.vue'], resolve);
                }
            },
            {
                path: 'dayList',
                icon: 'ios-list-box-outline',
                name: 'dayList',
                title: '学生健康监测列表',
                component: resolve => {
                    require(['@/views/healthDetection/dayList.vue'], resolve);
                }
            },
            {
                path: 'childrenNCPDetailInfo',
                icon: 'ios-list-box-outline',
                name: 'childrenNCPDetailInfo',
                title: '学生健康监测报告',
                component: resolve => {
                    require(['@/views/healthDetection/childrenNCPDetailInfo.vue'], resolve);
                }
            },
            {
                path: 'dataFilesManage',
                icon: 'ios-list-box-outline',
                name: 'dataFilesManage',
                title: '历史数据',
                component: resolve => {
                    require(['@/views/healthDetection/dataFilesManage.vue'], resolve);
                }
            },
            {
                path: 'dataFilesGradeInfo',
                icon: 'ios-list-box-outline',
                name: 'dataFilesGradeInfo',
                title: '历史学期信息',
                component: resolve => {
                    require(['@/views/healthDetection/dataFilesGradeInfo.vue'], resolve);
                }
            },
            {
                path: 'hisStudentExempt',
                icon: 'ios-list-box-outline',
                name: 'hisStudentExempt',
                title: '历史学期免试列表',
                component: resolve => {
                    require(['@/views/datafiles/hisStudentExempt.vue'], resolve);
                }
            },
            {
                path: 'hisStudentExemptDetail',
                icon: 'ios-list-box-outline',
                name: 'hisStudentExemptDetail',
                title: '历史学期免试详情',
                component: resolve => {
                    require(['@/views/datafiles/hisStudentExemptDetail.vue'], resolve);
                }
            },
            {
                path: 'dataFilesScoreStudent',
                icon: 'ios-list-box-outline',
                name: 'dataFilesScoreStudent',
                title: '数据档案学生列表',
                component: resolve => {
                    require(['@/views/healthDetection/dataFilesScoreStudent.vue'], resolve);
                }
            },
            {
                path: 'dataFilesScoreStudentDetail',
                icon: 'ios-list-box-outline',
                name: 'dataFilesScoreStudentDetail',
                title: '数据档案学生详情',
                component: resolve => {
                    require(['@/views/healthDetection/dataFilesScoreStudentDetail.vue'], resolve);
                }
            },
            {
                path: 'exportDataFilesStudnetTaskManage',
                icon: 'ios-list-box-outline',
                name: 'exportDataFilesStudnetTaskManage',
                title: '数据档案导入学生',
                component: resolve => {
                    require(['@/views/healthDetection/exportDataFilesStudnetTaskManage.vue'], resolve);
                }
            },
            {
                path: 'educationHistoryReport',
                icon: 'ios-list-box-outline',
                name: 'educationHistoryReport',
                title: '历史数据报送',
                component: resolve => {
                    require(['@/views/healthDetection/educationHistoryReport.vue'], resolve);
                }
            },
            {
                path: 'studentSubjectHisReportDetail',
                icon: 'ios-list-box-outline',
                name: 'studentSubjectHisReportDetail',
                title: '历史数据报送学生数据',
                component: resolve => {
                    require(['@/views/healthDetection/studentSubjectHisReportDetail.vue'], resolve);
                }
            },
            {
                path: 'actionStaminaGrade',
                icon: 'ios-list-box-outline',
                name: 'actionStaminaGrade',
                title: '技能体能历史年级数据',
                component: resolve => {
                    require(['@/views/healthDetection/actionStaminaGrade.vue'], resolve);
                }
            },
            {
                path: 'actionStaminaStudentList',
                icon: 'ios-list-box-outline',
                name: 'actionStaminaStudentList',
                title: '技能体能历史学生列表',
                component: resolve => {
                    require(['@/views/healthDetection/actionStaminaStudentList.vue'], resolve);
                }
            },
            {
                path: 'actionStaminaStudentDetail',
                icon: 'ios-list-box-outline',
                name: 'actionStaminaStudentDetail',
                title: '技能体能历史学生详情',
                component: resolve => {
                    require(['@/views/healthDetection/actionStaminaStudentDetail.vue'], resolve);
                }
            },
            {
                path: 'actionStaminaRepair',
                icon: 'ios-list-box-outline',
                name: 'actionStaminaRepair',
                title: '技能体能历史学生补录',
                component: resolve => {
                    require(['@/views/healthDetection/actionStaminaRepair.vue'], resolve);
                }
            },
            {
                path: 'actionStaminaHisConfige',
                icon: 'ios-list-box-outline',
                name: 'actionStaminaHisConfige',
                title: '技能体能历史配置',
                component: resolve => {
                    require(['@/views/healthDetection/actionStaminaHisConfige.vue'], resolve);
                }
            },
            {
                path: 'actionStaminaConfigeChoose',
                icon: 'ios-list-box-outline',
                name: 'actionStaminaConfigeChoose',
                title: '技能体能历史配置选择',
                component: resolve => {
                    require(['@/views/healthDetection/actionStaminaConfigeChoose.vue'], resolve);
                }
            },
            {
                path: 'hisExerciseManageClass',
                icon: 'ios-list-box-outline',
                name: 'hisExerciseManageClass',
                title: '历史学期课后作业按班级管理',
                component: resolve => { require(['@/views/datafiles/hisExerciseManageClass.vue'], resolve); }
            },
            {
                path: 'hisExerciseManageStudent',
                icon: 'ios-list-box-outline',
                name: 'hisExerciseManageStudent',
                title: '历史学期课后作业按学生管理',
                component: resolve => { require(['@/views/datafiles/hisExerciseManageStudent.vue'], resolve); }
            },
            {
                path: 'hisExerciseMakeUpManage',
                icon: 'ios-list-box-outline',
                name: 'hisExerciseMakeUpManage',
                title: '历史学期课后作业按学生补录',
                component: resolve => { require(['@/views/datafiles/hisExerciseMakeUpManage.vue'], resolve); }
            },
            {
                path: 'hisStudyLearningManage',
                icon: 'ios-list-box-outline',
                name: 'hisStudyLearningManage',
                title: '历史学期课后作业按学生补录',
                component: resolve => { require(['@/views/datafiles/hisStudyLearningManage.vue'], resolve); }
            },
            {
                path: 'hisStudyLearningStudent',
                icon: 'ios-list-box-outline',
                name: 'hisStudyLearningStudent',
                title: '历史学期课后作业学习态度详情',
                component: resolve => { require(['@/views/datafiles/hisStudyLearningStudent.vue'], resolve); }
            },
            {
                path: 'hisPaperScoreManage',
                icon: 'ios-list-box-outline',
                name: 'hisPaperScoreManage',
                title: '历史学期健康知识管理',
                component: resolve => { require(['@/views/datafiles/hisPaperScoreManage.vue'], resolve); }
            },
            {
                path: 'hisPaperClassResults',
                icon: 'ios-list-box-outline',
                name: 'hisPaperClassResults',
                title: '历史学期健康知识详情',
                component: resolve => { require(['@/views/datafiles/hisPaperClassResults.vue'], resolve); }
            },
            {
                path: 'hisHealthScoreTaskManage',
                icon: 'ios-list-box-outline',
                name: 'hisHealthScoreTaskManage',
                title: '健康知识导入',
                component: resolve => { require(['@/views/datafiles/hisHealthScoreTaskManage.vue'], resolve); }
            },
            {
                path: 'hisPaperEntryResults',
                icon: 'ios-list-box-outline',
                name: 'hisPaperEntryResults',
                title: '历史学期健康知识详情',
                component: resolve => { require(['@/views/datafiles/hisPaperEntryResults.vue'], resolve); }
            },
            {
                path: 'hisActivityClassList',
                icon: 'ios-list-box-outline',
                name: 'hisActivityClassList',
                title: '历史学期体质测试班级管理',
                component: resolve => { require(['@/views/datafiles/hisActivityClassList.vue'], resolve); }
            },
            {
                path: 'hisActivityStudentList',
                icon: 'ios-list-box-outline',
                name: 'hisActivityStudentList',
                title: '历史学期体质测试学生管理',
                component: resolve => { require(['@/views/datafiles/hisActivityStudentList.vue'], resolve); }
            },
            {
                path: 'hisActivityClassTestDetail',
                icon: 'ios-list-box-outline',
                name: 'hisActivityClassTestDetail',
                title: '历史学期体质测试学生管理',
                component: resolve => { require(['@/views/datafiles/hisActivityClassTestDetail.vue'], resolve); }
            },

        ]
    },
    {
        path: '/dataReport',
        icon: 'ios-mail-open-outline',
        name: 'dataReport',
        title: '数据报送',
        parentCode: 'top_dataReport',
        parentName: '数据报送',
        parentIcon: 'ios-mail-open-outline',
        component: Main,
        children: [
            {
                path: 'reportStudentManage',
                icon: 'ios-list-box-outline',
                name: 'reportStudentManage',
                title: '报送学生管理',
                component: resolve => {
                    require(['@/views/dataReport/reportStudentManage.vue'], resolve);
                }
            },
            {
                path: 'nationReport',
                icon: 'ios-list-box-outline',
                name: 'nationReport',
                title: '体质健康数据上报',
                component: resolve => {
                    require(['@/views/dataReport/nationReport.vue'], resolve);
                }
            },
            {
                path: 'educationReport',
                icon: 'ios-list-box-outline',
                name: 'educationReport',
                title: '教育局上报',
                component: resolve => {
                    require(['@/views/dataReport/educationReport.vue'], resolve);
                }
            },
            {
                path: 'parentReport',
                icon: 'ios-list-box-outline',
                name: 'parentReport',
                title: '家长端成绩推送',
                component: resolve => {
                    require(['@/views/dataReport/parentReport.vue'], resolve);
                }
            },
            {
                path: 'editAuthority',
                icon: 'ios-list-box-outline',
                name: 'editAuthority',
                title: '编辑权限申请',
                component: resolve => {
                    require(['@/views/editAuthority/editAuthority.vue'], resolve);
                }
            },
            {
                path: 'importStudentInfo',
                icon: 'ios-list-box-outline',
                name: 'importStudentInfo',
                title: '初始数据导入',
                component: resolve => {
                    require(['@/views/dataReport/importStudentInfo.vue'], resolve);
                }
            },
            {
                path: 'nationReportDetail',
                icon: 'ios-list-box-outline',
                name: 'nationReportDetail',
                title: '体质健康数据上报详情',
                component: resolve => {
                    require(['@/views/dataReport/nationReportDetail.vue'], resolve);
                }
            },
            {
                path: 'studentNationReportDetail',
                icon: 'ios-list-box-outline',
                name: 'studentNationReportDetail',
                title: '学生成绩详情',
                component: resolve => {
                    require(['@/views/dataReport/studentNationReportDetail.vue'], resolve);
                }
            },
            {
                path: 'studentSubjectReportDetail',
                icon: 'ios-list-box-outline',
                name: 'studentSubjectReportDetail',
                title: '学生成绩详情',
                component: resolve => {
                    require(['@/views/dataReport/studentSubjectReportDetail.vue'], resolve);
                }
            },
            {
                path: 'parentReportChangeStudent',
                icon: 'ios-list-box-outline',
                name: 'parentReportChangeStudent',
                title: '成绩变动学生',
                component: resolve => {
                    require(['@/views/dataReport/parentReportChangeStudent.vue'], resolve);
                }
            },

        ]
    },
    {
        path: '/psychological',
        icon: 'ios-trending-up',
        name: 'psychological',
        title: '心理评测',
        parentCode: 'top_psychological',
        parentName: '心理评测',
        parentIcon: 'ios-trending-up',
        component: Main,
        children: [
            {
                path: 'psychologicalSummary',
                icon: 'ios-list-box-outline',
                name: 'psychologicalSummary',
                title: '心理评测汇总数据',
                component: resolve => {
                    require(['@/views/psychological/psychologicalSummary.vue'], resolve);
                }
            },
            {
                path: 'psychologicalDetail',
                icon: 'ios-list-box-outline',
                name: 'psychologicalDetail',
                title: '心理评测详情数据',
                component: resolve => {
                    require(['@/views/psychological/psychologicalDetail.vue'], resolve);
                }
            },
            {
                path: 'administration',
                icon: 'ios-list-box-outline',
                name: 'administration',
                title: '心理测试管理',
                component: resolve => { require(['@/views/psychological/psychologicalAdministration.vue'], resolve); }
            },
            {
                path: 'psychologicalAside',
                icon: 'ios-list-box-outline',
                name: 'psychologicalAside',
                title: '心理测评详情',
                component: resolve => { require(['@/views/psychological/psychologicalTest.vue'], resolve); }
            }
        ]
    },
    // {
    //     path: '/dataAnalyze',
    //     icon: 'ios-pulse-strong',
    //     name: 'dataAnalyze',
    //     title: '数据分析',
    //     parentCode: 'top_data',
    //     parentName: '数据分析',
    //     parentIcon: 'ios-pulse-strong',
    //     component: Main,
    //     children: [
    //         {
    //             path: 'ArealDistribution',
    //             icon: 'ios-list-box-outline',
    //             name: 'ArealDistribution',
    //             title: '区域分布',
    //             component: resolve => { require(['@/views/dataAnalyze/ArealDistribution.vue'], resolve); }
    //         },
    //         {
    //             path: 'TransverseTestDataAnalyze',
    //             icon: 'ios-list-box-outline',
    //             name: 'TransverseTestDataAnalyze',
    //             title: '横向体测数据分析',
    //             component: resolve => { require(['@/views/dataAnalyze/TransverseTestDataAnalyze.vue'], resolve); }
    //         },
    //         // {
    //         //     path: 'analysisManageCervix',
    //         //     icon: 'ios-list-box-outline',
    //         //     name: 'analysisManageCervix',
    //         //     title: '体测数据分析',
    //         //     component: resolve => { require(['@/views/scorechange/analysisManageCervix.vue'], resolve); }
    //         // },
    //         // {
    //         //     path: 'schoolTestAnalyze',
    //         //     icon: 'ios-list-box-outline',
    //         //     name: 'schoolTestAnalyze',
    //         //     title: '体测数据分析',
    //         //     component: resolve => { require(['@/views/scorechange/schoolShowAnalysis.vue'], resolve); }
    //         // },
    //         {
    //             path: 'familyExerciseAnalyze',
    //             icon: 'ios-list-box-outline',
    //             name: 'familyExerciseAnalyze',
    //             title: '课后作业分析',
    //             component: resolve => { require(['@/views/dataAnalyze/familyExerciseAnalyze.vue'], resolve); }
    //         },
    //         {
    //             path: 'examManageAnalyze',
    //             icon: 'ios-list-box-outline',
    //             name: 'examManageAnalyze',
    //             title: '技能/体能分析',
    //             component: resolve => { require(['@/views/scorechange/skillsAssessment.vue'], resolve); }
    //         },
    //         {
    //             path: 'skillsAssessmentHealth',
    //             icon: 'ios-list-box-outline',
    //             name: 'skillsAssessmentHealth',
    //             title: '健康知识分析',
    //             component: resolve => { require(['@/views/scorechange/skillsAssessmentHealth.vue'], resolve); }
    //         },
    //         {
    //             path: 'sportsClassAnalyze',
    //             icon: 'ios-list-box-outline',
    //             name: 'sportsClassAnalyze',
    //             title: '学习态度分析',
    //             component: resolve => { require(['@/views/scorechange/classroomMonitoring.vue'], resolve); }
    //         }
    //     ]
    // },
    // {
    //     path: '/push',
    //     icon: 'ios-chatbubbles',
    //     name: 'push',
    //     title: '消息管理',
    //     parentCode: 'top_message',
    //     parentName: '通知公告',
    //     parentIcon: 'ios-chatbubbles',
    //     component: Main,
    //     children: [
    //         {
    //             path: 'pushManage',
    //             icon: 'ios-list-box-outline',
    //             name: 'pushManage',
    //             title: '推送消息',
    //             component: resolve => { require(['@/views/push/pushManage.vue'], resolve); }
    //         },
    //         {
    //             path: 'pushDetail',
    //             icon: 'ios-list-box-outline',
    //             name: 'pushDetail',
    //             title: '消息详情',
    //             component: resolve => { require(['@/views/push/pushDetail.vue'], resolve); }
    //         }
    //     ]
    // }
];
// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    ...appRouter,
    page500,
    page403,
    page404
];
