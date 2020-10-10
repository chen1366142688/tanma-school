<style>
  .navSelect{
    width:100%;
    height:100px;
    background-color: #ffffff;
  }
</style>

<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">体测数据分析</h2>
    </div>
    <div>
        <Card>
            <div class="top-search">
                <div class="left-input">
                    <div style="margin:5px 20px;">
                        <span>年级：</span>
                        <Select v-model="grade" size="small" style="width:120px;">
                            <Option v-for="item in schoolGradeList" :value="item.grade" :key="item.grade">{{ item.label }}</Option>
                        </Select>
                    </div>
                    <div style="margin:5px 20px;">
                        <span>班级：</span>
                        <Select v-model="studentClass" size="small" style="width:120px;">
                            <Option v-for="item in classList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                    <div style="margin:5px 20px;">
                        <span>数据维度：</span>
                        <Select v-model="dataDimensionCode" size="small" :style="{width: '120px',marginRight:'20px'}">
                            <Option v-for="item in dataDimension" :value="item.dataDimensionId" :key="item.dataDimensionId">{{ item.dataDimensionName }}</Option>
                        </Select>
                    </div>
                    <div style="margin:5px 20px;">
                        <span>数据类型：</span>
                        <Select v-model="dataDimensionClass" size="small" :style="{width: '120px',marginRight:'20px'}">
                            <Option v-for="item in dataDimensionList" :value="item.dataDimensionId" :key="item.dataDimensionId">{{ item.dataDimensionName }}</Option>
                        </Select>
                    </div>
                </div>
                <div class="right-btns">
                    <Button type="success" @click="restore">重置条件</Button>
                    <Button type="success" @click="querySearch">对比分析</Button>
                </div>
            </div>
        </Card >
        <CheckboxGroup v-model="checkGroup" @on-change="onchangeCheck" :style="{textAlign:'right',marginRight:'240px',marginTop:'40px'}">
            <Checkbox v-for="(item,index) in yearList"  :label="item.year" :key="index" :value="item.yearId"></Checkbox>
        </CheckboxGroup>
        <div id="myChart" :style="{width: '100%', height: '600px', marginTop: '50px'}"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'analysisManageUnirun',
  data() {
    return {
      schoolId: '',
      grade: '',
      primaryList: [
        {
          grade: "",
          label: '全部'
        },
        {
          grade: 1,
          label: '一年级'
        },
        {
          grade: 2,
          label: '二年级'
        },
        {
          grade: 3,
          label: '三年级'
        },
        {
          grade: 4,
          label: '四年级'
        },
        {
          grade: 5,
          label: '五年级'
        },
        {
          grade: 6,
          label: '六年级'
        }
      ],
      middleList: [
        {
          grade: "",
          label: '全部'
        },
        {
          grade: 7,
          label: '七年级'
        },
        {
          grade: 8,
          label: '八年级'
        },
        {
          grade: 9,
          label: '九年级'
        }
      ],
      highList: [
        {
          grade: "",
          label: '全部'
        },
        {
          grade: 10,
          label: '高一'
        },
        {
          grade: 11,
          label: '高二'
        },
        {
          grade: 12,
          label: '高三'
        }
      ],
      collegeList: [
        {
          grade: "",
          label: '全部'
        },
        {
          grade: 13,
          label: '大一'
        },
        {
          grade: 14,
          label: '大二'
        },
        {
          grade: 15,
          label: '大三'
        },
        {
          grade: 16,
          label: '大四'
        }
      ],
      schoolGradeList: [],
      studentClass: '',
      classList: [
        {
          value: "",
          label: '全部'
        },
        {
          value: 1,
          label: '1班'
        },
        {
          value: 2,
          label: '2班'
        },
        {
          value: 3,
          label: '3班'
        },
        {
          value: 4,
          label: '4班'
        },
        {
          value: 5,
          label: '5班'
        },
        {
          value: 6,
          label: '6班'
        },
        {
          value: 7,
          label: '7班'
        },
        {
          value: 8,
          label: '8班'
        },
        {
          value: 9,
          label: '9班'
        },
        {
          value: 10,
          label: '10班'
        },
        {
          value: 11,
          label: '11班'
        },
        {
          value: 12,
          label: '12班'
        },
        {
          value: 13,
          label: '13班'
        },
        {
          value: 14,
          label: '14班'
        },
        {
          value: 15,
          label: '15班'
        },
        {
          value: 16,
          label: '16班'
        },
        {
          value: 17,
          label: '17班'
        },
        {
          value: 18,
          label: '18班'
        },
        {
          value: 19,
          label: '19班'
        },
        {
          value: 20,
          label: '20班'
        },
        {
          value: 21,
          label: '21班'
        },
        {
          value: 22,
          label: '22班'
        },
        {
            value: 23,
            label: '23班'
        },
        {
            value: 24,
            label: '24班'
        },
        {
            value: 25,
            label: '25班'
        }
      ],
      dataDimensionCode:'',
      dataDimension:[
        {
          dataDimensionId:1,
          dataDimensionName:'优秀'
        },
        {
          dataDimensionId:2,
          dataDimensionName:'良好'
        },
        {
          dataDimensionId:3,
          dataDimensionName:'合格'
        },
        {
          dataDimensionId:4,
          dataDimensionName:'不及格'
        },
      ],
      dataDimensionClass:'',
      dataDimensionList:[
        {
          dataDimensionId:1,
          dataDimensionName:'调整前'
        },
        {
          dataDimensionId:2,
          dataDimensionName:'调整后'
        }
      ],
      option:{},
      myChart:null,
      yearList:[],
      checkGroup:[],
      checkGroupList: [],
      title:''
    }
  },
  methods: {
    drawLine(){
        this.myChart = this.$echarts.init(document.getElementById('myChart'))
        this.option={
            title: { 
              text: '',
              left:190,
              textStyle:{
                color:'#333',
                fontSize:12,
                lineHeight:16
              }
            },
             tooltip: {
                trigger:'item',
                padding:[0,10,0,10],
                formatter:'{a} </br>{b}:{c}%'
            },
            xAxis: {
                name:'学年',
                data: [],
                axisLine:{
                  symbol:['none', 'arrow'],
                  symbolSize:[10,15]
                },
                axisTick:{
                  length:0
                },
                max:12
            },
            yAxis: {
                type : 'value',
                name:'%',
                nameTextStyle:{
                  align:'right'
                },
                nameGap:20,
                min: 0,
                max: 100,
                interval: 10,
                axisLine:{
                  symbol:['none', 'arrow'],
                  symbolSize:[10,15],
                  symbolOffset:[0,11]
                },
            },
            series: [{
                name: '百分比',
                type: 'bar',
                itemStyle:{
                  normal:{
                    color:"#cc6600",
                    label:{
                      show:true,
                      position:'top',
                      color:'#333',
                      formatter:'{c}%'
                    }
                  }
                },
                barWidth:30,
                barWidth:30,
                data: []
            }]
        };
        this.myChart.setOption(this.option)
    },
    onchangeCheck(data){
      let vm= this;
      console.log(data)
      
      let arr= new Array();
      for(let i=vm.yearList.length-1;i>=0;i--){
        for(let j=data.length-1;j>=0;j--){
          if(vm.yearList[i].year == data[j]){
            arr.push(vm.yearList[i].yearId)
          }
        }
      }
      
      vm.checkGroupList= arr;
     vm.querySearch()
    },
    querySearch(){
      var vm = this 
      let data={
        "classId": vm.studentClass,
        "collegeCode": vm.college,
        "dataDimension":vm.dataDimensionCode,
        "majorCode": vm.major,
        "schoolId":vm.schoolId,
        "startSchool": vm.grade,
        "yearList": vm.checkGroupList
      }
      this.$axios.post(`/v1/clubstatistical/getPrimaryTestDataAnalyze`, data).then(res => {
        if (res.data.code == 10000) {
          let result= res.data.response.map(function(val){
            return val.percent;
          })
          let resultYear= res.data.response.map(function(val){
            return val.year;
          })
          let resultAllList=new Array();
          for(let i=0;i<vm.yearList.length;i++){
              for(let j=0;j< resultYear.length;j++){
                if(vm.yearList[i].yearId == resultYear[j]){
                  resultAllList.push(vm.yearList[i].year)
                }
              }
          }
          let r=vm.schoolGradeList.filter(function(x){
           return x.grade == vm.grade
          })
            let cla=vm.classList.filter(function(x){
            return x.value == vm.studentClass
          })
          let Dim=vm.dataDimension.filter(function(x){
            return x.dataDimensionId == vm.dataDimensionCode
          })
          if(vm.checkGroupList.length==vm.yearList.length){
            vm.title=vm.yearList[0].year+'-'+vm.yearList[vm.yearList.length-1].year
          }else{
            vm.title=vm.checkGroup.join(",");
          }
          vm.option.title.text = `${vm.title} ${r.length>0 ? r[0].label == '全部' ? '全校班级' : r[0].label : ''}${cla.length>0 ? cla[0].label == '全部'&&r[0].label == '全部' ? '': cla[0].label:''}${Dim.length>0 ? Dim[0].dataDimensionName : ''}数据分析`;
          vm.option.xAxis.data=resultAllList;
          vm.option.series[0].data=result;
          vm.myChart.setOption(vm.option)
        } else {
          if (res.data.code > 39999) {
          vm.$Message.info(res.data.msg)
          }
        }
      })
    },
    restore(){
      let vm= this;
      vm.grade= '';
      // vm.schoolGradeList=[];
      vm.college= '';
      // vm.collegesList= [];
      vm.major= '';
      // vm.majorList= [];
      vm.studentClass= '';
      // vm.classList= [];
      vm.dataDimensionCode='',
      // vm.dataDimension=[];
      vm.dataDimensionClass=''
      // vm.dataDimensionList=[]
      vm.drawLine();
    },
    getSchoolCollegeBySchoolId(schoolId) {
      var vm = this
      this.$axios
        .get('/v1/student/getSchoolCollegeBySchoolId?schoolId=' + schoolId)
        .then(res => {
          if (res.data.code == 10000) {
            vm.collegesList = res.data.response
          } else {
            if (res.data.code > 39999) {
                vm.$Message.info(res.data.msg)
            }
          }
        })
    },
    getSchoolMajorBySchoolId(schoolId, collegeCode) {
      var vm = this
      this.$axios
        .get(
          '/v1/school/queryMajorList?schoolId=' +
            schoolId +
            '&collegeCode=' +
            collegeCode
        )
        .then(res => {
          if (res.data.code == 10000) {
            vm.majorList = res.data.response
            vm.majorList=[];
            let all={
              majorCode:'',
              majorName:'全部'
            }
             vm.majorList.push(all)
            vm.majorList = vm.majorList.concat(res.data.response)
          } else {
            if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg)
            }
          }
        })
    },
    queryStudentClassManageList(schoolId, majorCode) {
      var vm = this
      this.$axios
        .get(
          `/v1/school/queryStudentClassManageList?schoolId=${schoolId}&majorCode=${majorCode}`
        )
        .then(res => {
          if (res.data.code == 10000) {
            vm.classList = res.data.response
            vm.classList=[];
            let all={
              classId:'',
              className:'全部'
            }
             vm.classList.push(all)
            vm.classList = vm.classList.concat(res.data.response)
          } else {
            if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg)
            }
          }
        })
    },
    getFullYearFun(){
      const vm= this;
      const date=new Date;
      let year=date.getFullYear();
      let list=[
        {
          year:year+'下半年',
          yearId:year+'2'
        },
        {
          year:year+'上半年',
          yearId:year+'1'
        },
        {
          year:year-1+'下半年',
          yearId:year-1+'2'
        },
        {
          year:year-1+'上半年',
          yearId:year-1+'1'
        },
        {
          year:year-2+'下半年',
          yearId:year-2+'2'
        },
        {
          year:year-2+'上半年',
          yearId:year-2+'1'
        }
      ]
      vm.yearList = list.reverse();
      vm.checkGroup=vm.yearList.map(function(val){
        return val.year;
      })
      
      vm.checkGroupList=vm.yearList.map(function(val){
        return val.yearId;
      })
      let resInfo=vm.checkGroupList.map(function(val){
        return val*0
      })
    },
  },
  watch: {
    college: function() {
      var vm = this
      if(vm.college==''){return}
      vm.getSchoolMajorBySchoolId(vm.schoolId, vm.college)
    },
    major: function(){
      let vm= this;
      vm.queryStudentClassManageList(vm.schoolId, vm.major)
    },
  },
  created() {
    //年份
    this.getFullYearFun();
  },
  mounted() {
    //    0 未知类型 1 幼儿园 2小学 3初中 4高中5大学
    var vm = this
    let schoolId = sessionStorage.getItem('schoolId')
    vm.schoolId = schoolId
    let schoolType = sessionStorage.getItem('schoolType')
    vm.schoolType=schoolType;
    vm.drawLine()
    // vm.updateUrl =this.$axios.defaults.baseURL + '/v1/file/upload?type=excel';
    if (schoolType) {
      if ('0' == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList
          .concat(vm.primaryList)
          .concat(vm.middleList)
          .concat(vm.highList)
          .concat(vm.collegeList)
      }
      // if("1"==schoolType){
      //     vm.schoolGradeList=vm.schoolGradeList.concat(vm.primaryList).concat(vm.middleList).concat(vm.highList).concat(vm.collegeList);
      // }
      if ('2' == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList.concat(vm.primaryList)
      }
      if ('3' == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList.concat(vm.middleList)
      }
      if ('4' == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList.concat(vm.highList)
      }
      if ('5' == schoolType) {
        var date=new Date;
          var year=date.getFullYear(); 
          var month=date.getMonth()+1;
          // month =(month<10 ? "0"+month:month); 
          // var mydate = (year.toString()+month.toString());
          vm.collegeList=[
             {
          grade: 13,
          label: (month>9?year:year-1)+'级'
        },
        {
          grade: 14,
          label: (month>9?year-1:year-2)+'级'
        },
        {
          grade: 15,
          label: (month>9?year-2:year-3)+'级'
        },
        {
          grade: 16,
          label: (month>9?year-3:year-4)+'级'
        }
          ]
        vm.schoolGradeList = vm.schoolGradeList.concat(vm.collegeList)
        vm.getSchoolCollegeBySchoolId(vm.schoolId)
      }
    } else {
      vm.schoolGradeList = vm.schoolGradeList
        .concat(vm.primaryList)
        .concat(vm.middleList)
        .concat(vm.highList)
        .concat(vm.collegeList)
    }
   }
}
</script>