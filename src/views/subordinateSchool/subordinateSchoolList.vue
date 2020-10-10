<template>
    <div>
        <div>
            <h1>学校管理</h1>
        </div>
        <div style="margin-top:15px;">
            <div class="top-search">
                <div class="left-input">
                    <div style="margin:5px 20px;">
                        <Select v-model="schoolTypeId" placeholder="请选择学校类型" style="width:120px">
                            <Option v-for="item in schoolTypeList" :value="item.schoolTypeId" :key="item.schoolTypeId">{{ item.schoolTypeName }}</Option>
                        </Select>
                    </div>
                    <div style="margin:5px 20px;">
                        <Select v-model="provinceId" clearable style="width:120px" placeholder="请选择省份">
                            <Option v-for="item in provinceList" :value="item.provinceId" :key="item.provinceId">{{ item.provinceName }}</Option>
                        </Select>
                    </div>
                    <div style="margin:5px 20px;">
                        <Select v-model="cityId" clearable style="width:120px" placeholder="请选择市">
                            <Option v-for="item in cityList" :value="item.cityId" :key="item.cityId">{{ item.cityName }}</Option>
                        </Select>
                    </div>
                    <div style="margin:5px 20px;">
                        <Select v-model="countryId" clearable style="width:120px" placeholder="请选择区县">
                            <Option v-for="item in countyList" :value="item.countyId" :key="item.countyId">{{ item.countyName }}</Option>
                        </Select>
                    </div>
                    <div style="margin:5px 20px;">
                        <Select v-model="submitType" clearable style="width:120px" placeholder="请选择上报状态">
                            <Option v-for="item in submitTypeList" :value="item.itemId" :key="item.itemId">{{ item.itemName }}</Option>
                        </Select>
                    </div>
                    <div style="margin:5px 20px;">
                        <Input v-model="schoolName" placeholder="输入学校名称" style="width: 120px"></Input>
                    </div>
                </div>
                <div class="right-btns">
                    <Button v-on:click="classQuery(1)" type="success" style="background-color:#00c693" icon="ios-search">查询</Button>
                </div>
            </div>
            <br>
            <div>
                <Row>
                    <div style="">
                        <Table border :loading="loading" :columns="resultColumns" :data="resultData"></Table>
                    </div>
                    <br>
                    <div style="float: right;">
                        <Page :total="total" :current="pageNum" :page-size="pageSize" @on-change='pageNumChange' @on-page-size-change='pageSizechange' show-total show-sizer></Page>
                    </div>
                </Row>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'schoolList',
  data() {
    return {
      loading:false,
      schoolTypeList: [
        {
          schoolTypeId: '',
          schoolTypeName: '全部'
        },
        {
          schoolTypeId: '1',
          schoolTypeName: '幼儿园'
        },
        {
          schoolTypeId: '2',
          schoolTypeName: '小学'
        },
        {
          schoolTypeId: '3',
          schoolTypeName: '初中'
        },
        {
          schoolTypeId: '4',
          schoolTypeName: '高中'
        }
      ],
      schoolTypeId: '0',
      provinceList: [],
      provinceId: '',
      cityList: [],
      cityId: '',
      countyList:[],
      countryId:"",
      submitType:"",
      schoolName: '',
      submitTypeList:[
        {
          itemId:"",
          itemName:"全部"
        },
        {
          itemId:"1",
          itemName:"去年体测已上报"
        },
        {
          itemId:"2",
          itemName:"去年体测未上报"
        },
        {
          itemId:"3",
          itemName:"今年体测已上报"
        },
        {
          itemId:"4",
          itemName:"今年体测未上报"
        }
      ],
      resultColumns: [
        {
          title: '所属地区',
          key: 'belongArea',
          align: 'center',
          minWidth:100
        },
        {
          title: '类型',
          key: 'schoolType',
          align: 'center',
          width: 150,
          render: (h, params) => {
            const row = params.row
            const schoolType = row.schoolType == '1' ? '幼儿园' : row.schoolType == '2' ? '小学':row.schoolType == '3' ? '初中':row.schoolType == '4' ? '高中':row.schoolType == '5' ? '大学':row.schoolType == '6' ? '科研院':"";     
            return h(
              'div',
              schoolType
            )
          }
        },
        {
          title: '学校名称',
          key: 'schoolName',
          align: 'center',
          minWidth:100,
        },{
          title: '联系人',
          key: 'dataCharge',
          align: 'center',
          minWidth:100
        },{
          title: '联系电话',
          key: 'phone',
          align: 'center',
          minWidth:100
        },
        {
          title: '去年体测数据是否上报',
          key: 'lastYear',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row
            const lastYear = row.lastYear == '1' ? '已上报' : '未上报/未测试'
            return h(
              'div',
              lastYear
            )
          }
        },
        {
          title: '今年体测数据是否上报',
          key: 'lastYear',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row
            const currentLast = row.currentLast == '1' ? '已上报' : '未上报/未测试'
            return h(
              'div',
              currentLast
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 150,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'success'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.pageToSubordinateSchoolTest(params.row.schoolId,params.row.schoolType,params.row.schoolName);
                    }
                  }
                },
                '查看体测情况'
              )]);
          }
        }
      ],
      resultData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    pageToSubordinateSchoolTest(schoolId,schoolType,schoolName){
        sessionStorage.setItem('subordinateSchoolList-subordinateSchoolTestData-subordinateSchoolId', schoolId);
        sessionStorage.setItem('subordinateSchoolList-subordinateSchoolTestData-schoolType', schoolType);
        sessionStorage.setItem('subordinateSchoolList-subordinateSchoolTestData-schoolName', schoolName);
        this.$router.push({ name: 'subordinateSchoolTestData' })
    },
    getProvinceList(){ //获取省信息
        this.$axios.get("/v1/region/get/allProvinceInfo").then(res => {
            this.provinceList=res.data.response
            });
    },
    getCityList(newVal,oldVal){ //根据省iD获取市信息
        if(newVal !=oldVal){
            if(newVal==''){
                this.cityList=[];
            }else{
        this.$axios.get("/v1/region/get/allCityInfoByProvinceId?provinceId="+newVal).then(res => {
            this.cityList=res.data.response
            });
            }
        }
    },
    getCountyList(newVal,oldVal){ //根据省iD获取市信息
        if(newVal !=oldVal){
            if(newVal==''){
                this.cityList=[];
            }else{
        this.$axios.get("/v1/region/get/allCountyInfoByCityId?cityId="+newVal).then(res => {
            this.countyList=res.data.response
            });
            }
        }
    },
    classQuery(QueryMethod) {
      //查询方法  QueryMethod 查询方式 1:查询按钮；0 翻页

      if (QueryMethod == 1) {
        //查询按钮查询页码设置为1
        this.pageNum = 1
      }
      sessionStorage.setItem('teacherList-getSchoolInfoList-pageNum', this.pageNum);
      sessionStorage.setItem('teacherList-getSchoolInfoList-pageSize', this.pageSize);
      sessionStorage.setItem('teacherList-getSchoolInfoList-schoolName', this.schoolName);
      sessionStorage.setItem('teacherList-getSchoolInfoList-schoolTypeId', this.schoolTypeId == '0' ? '' : this.schoolTypeId);
      this.loading = true;
      this.$axios.get('/v1/subordinate/getSubordinateSchoolInfoList?pageNum='+this.pageNum
                  +'&pageSize='+this.pageSize
                  +'&schoolName='+this.schoolName
                  +'&schoolType='+(this.schoolTypeId?this.schoolTypeId:'')
                  +'&provinceId='+this.provinceId
                  +'&cityId='+this.cityId
                  +'&countryId='+this.countryId
                  +'&submitType='+this.submitType).then(res => {
        this.loading = false;
        if (res.data.code == 10000) {
          this.resultData = res.data.response.result
          this.pageNum = res.data.response.pageNum
          this.pageSize = res.data.response.pageSize
          this.total = res.data.response.total
        } else {
          this.$Message.info(res.data.msg)
        }
      })
    },
    pageNumChange(value) {
      //页码改变方法处理
      if (this.pageNum != value) {
        this.pageNum = value
        this.classQuery(0)
      }
    },
    pageSizechange(value) {
      //页面大小改变方法处理
      if (this.pageSize != value) {
        this.pageSize = value
        this.pageNum = 1;
        this.classQuery(1)
      }
    },
  },
  watch: {
      provinceId:'getCityList',
      cityId:'getCountyList',
  },
  created() {
     this.getProvinceList();
  },
  mounted() {
    if(sessionStorage.getItem('teacherList-getSchoolInfoList-pageNum') != null && sessionStorage.getItem('teacherList-getSchoolInfoList-pageNum') != undefined){
       this.pageNum = Number(sessionStorage.getItem('teacherList-getSchoolInfoList-pageNum'));
       this.pageSize = Number(sessionStorage.getItem('teacherList-getSchoolInfoList-pageSize'));
       this.schoolName = sessionStorage.getItem('teacherList-getSchoolInfoList-schoolName');
       this.schoolTypeId = sessionStorage.getItem('teacherList-getSchoolInfoList-schoolTypeId');
    }
    if (
      sessionStorage.getItem('schoolList-queryData') != undefined &&
      sessionStorage.getItem('isSchoolDetailBack') != undefined
    ) {
      //页面返回时 根据缓存的查询条件查询
      let queryData = JSON.parse(sessionStorage.getItem('schoolList-queryData'))
      this.schoolName = queryData.schoolName
      //   this.provinceId=queryData.provinceId;
      //   this.cityId=queryData.cityId,
      this.schoolTypeId = queryData.schoolTypeId
      this.pageNum = queryData.pageNum
      this.pageSize = queryData.pageSize
      this.classQuery(0)
    } else {
      this.classQuery(1)
    }
    sessionStorage.removeItem('schoolList-queryData')
    sessionStorage.removeItem('isSchoolDetailBack')
  }
}
</script>