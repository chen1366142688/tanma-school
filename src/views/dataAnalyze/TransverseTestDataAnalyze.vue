<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">体测数据分析</h2>
    </div>
    <div>
      <Card style="height:100px;">
        <div>
          <div>
            <span>对比学年：</span>
            <Select v-model="year" size="small" style="width:140px;">
              <Option v-for="item in yearList" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
            <span style="margin-left:20px;">数据维度：</span>
            <Select v-model="dataType" size="small" style="width:120px;">
              <Option
                v-for="item in dataTypeList"
                :value="item.value"
                :key="item.value"
              >{{ item.name }}</Option>
            </Select>
            <span style="margin-left:20px;">学校类型：</span>
            <Select v-model="schoolType" size="small" style="width:120px;">
              <Option
                v-for="item in schoolTypeList"
                :value="item.value"
                :key="item.value"
              >{{ item.name }}</Option>
            </Select>
            <Button type="success" style="margin-left:80px;" @click="search">查询</Button>
          </div>
        </div>
      </Card>
      <br>
      <div>
        <Row>
          <div style>
           <div id="myChart" :style="{width: '100%', height: '800px'}"></div>
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
       loading: false,
      yearList: [],
      year: "",
      dataTypeList: [
        {
          value: "1",
          name: "优秀率"
        },
        {
          value: "2",
          name: "良好率"
        },
        {
          value: "3",
          name: "合格率"
        },
        {
          value: "4",
          name: "不合格率"
        }
      ],
      dataType: "3",
      schoolTypeList: [
        {
          value: "2",
          name: "小学"
        },
        {
          value: "3",
          name: "初中"
        },
        {
          value: "4",
          name: "高中"
        }
      ],
      schoolType: "2",
      schoolNameList: [],
      percentList: [],
    }
  },
  methods: {
    drawLine(response){
        var vm=this;
        // console.log(response)
        vm.genData(response);
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
            title: { 
              text:  vm.year + "年国家体测  合格率数据分析",
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
                show:true,    
                name:'学校',
                data: vm.schoolNameList,
                axisLine:{
                  symbol:['none', 'arrow'],
                  symbolSize:[10,15]
                },
                axisTick:{
                  length:1
                },
                axisLabel:{
                //    rotate:270,    
                }
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
                barWidth:20,
                data:vm.percentList
            }]
        });
    },
    genData(response) {
      var vm = this;
      if (response) {
        for (var i = 0; i < response.length; i++) {
          var name = response[i].schoolName;
          var percent = response[i].percent;
          vm.schoolNameList.push(name);
          vm.percentList.push(Number(percent))
        }
      }
    },
    getAcademyTestDataAnalyze() {
      this.loading = true;
      var vm = this;
      let data = {
        dataDimension: vm.dataType,
        nowYear: vm.year,
        schoolType: vm.schoolType
      };
      this.$axios
        .post("/v1/clubstatistical/getAcademyTestDataAnalyze", data)
        .then(res => {
          this.loading = false;
          vm.schoolNameList=[],
          vm.percentList=[],
          vm.drawLine(res.data.response);
          if (res.data.code > 39999) {
            this.$Message.info(res.data.msg);
          }
        });
    },
   search() {
      var vm = this;
      vm.getAcademyTestDataAnalyze();
    },
    createYearList() {
      var vm = this;
      var date = new Date();
      var year = date.getFullYear();
      if (year - 4 > 2018) {
        vm.yearList = [
          {
            value: year,
            name: year + "年国家体测"
          },
          {
            value: year - 1,
            name: year - 1 + "年国家体测"
          },
          {
            value: year - 2,
            name: year - 2 + "年国家体测"
          },
          {
            value: year - 3,
            name: year - 3 + "年国家体测"
          },
          {
            value: year - 4,
            name: year - 4 + "年国家体测"
          }
        ];
      } else if (year - 3 > 2018) {
        vm.yearList = [
          {
            value: year,
            name: year + "年国家体测"
          },
          {
            value: year - 1,
            name: year - 1 + "年国家体测"
          },
          {
            value: year - 2,
            name: year - 2 + "年国家体测"
          },
          {
            value: year - 3,
            name: year - 3 + "年国家体测"
          }
        ];
      } else if (year - 2 > 2018) {
        vm.yearList = [
          {
            value: year,
            name: year + "年国家体测"
          },
          {
            value: year - 1,
            name: year - 1 + "年国家体测"
          },
          {
            value: year - 2,
            name: year - 2 + "年国家体测"
          }
        ];
      } else if (year - 1 > 2018) {
        vm.yearList = [
          {
            value: year,
            name: year + "年国家体测"
          },
          {
            value: year - 1,
            name: year - 1 + "年国家体测"
          }
        ];
      } else {
        vm.yearList = [
          {
            value: year,
            name: year + "年国家体测"
          }
        ];
      }
      vm.year = year;
      vm.search();
    }
    
  },
  watch: {
   
  },
  created() {
  },
  mounted() {
   var vm = this;
    vm.createYearList();
  }
}
</script>