<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">体测数据分析</h2>
    </div>
    <div>
      <Card style="height:100px;">
        <div class="top-search">
          <div class="left-input">
            <div style="margin:5px 10px;">
              <span>对比学年：</span>
              <Select v-model="year" size="small" style="width:140px;">
                <Option v-for="item in yearList" :value="item.value" :key="item.value">{{ item.name }}</Option>
              </Select>
            </div>
            <div style="margin:5px 10px;">
              <span>数据维度：</span>
              <Select v-model="dataType" size="small" style="width:120px;">
                <Option
                  v-for="item in dataTypeList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.name }}</Option>
              </Select>
            </div>
            <div style="margin:5px 10px;">
              <span>学校类型：</span>
              <Select v-model="schoolType" size="small" style="width:120px;">
                <Option
                  v-for="item in schoolTypeList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.name }}</Option>
              </Select>
            </div>
          </div>
          <div class="right-btns">
            <Button type="success"  @click="search">查询</Button>
          </div>
        </div>
      </Card>
      <br>
      <div>
        <Row>
          <div style>
            <div id="myCharts" :style="{width: '100%', height: '600px'}"></div>
          </div>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "schoolList",
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
      seriesData: [],
      legendData: [],
      selected: {}
    };
  },
  methods: {
    drawGen(response) {
      var vm = this;
      vm.genData(response);
      let myCharts = this.$echarts.init(document.getElementById("myCharts"));
      myCharts.setOption({
        title: {
          text: vm.year + "年国家体测  合格率数据分析",
          subtext: "区域分布（平均%）",
          subtextStyle: {
            color: "#000",
            fontSize: 14
          },
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        // color: [
        //   "#3489ca",
        //   "#e50014",
        //   "#f9f8cc",
        //   "#d3e7f0",
        //   "#571e85",
        //   "#ec7e81"
        // ],
        legend: {
          type: "scroll",
          orient: "vertical",
          right: 10,
          top: 20,
          bottom: 20,
          data: vm.legendData,
          selected: vm.selected
        },
        series: [
          {
            name: "区域分布",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            data: vm.seriesData.sort(function(a, b) {
              return a.value - b.value;
            }),
            label: {
              normal: {
                textStyle: {
                  color: "rgba(0, 0, 0, 0.8)"
                },
                formatter: "{d}  "
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: "rgba(0, 0, 0, 0.8)"
                },
                smooth: 0.1,
                length: 10,
                length2: 20
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.9)"
              }
            }
          }
        ]
      });
    },
    genData(response) {
      var vm = this;
      //   console.log(response);
      var legendData = [];
      var seriesData = [];
      var selected = {};
      if (response) {
        for (var i = 0; i < response.length; i++) {
          // console.log(response[i].areaName);
          var name = response[i].areaName;
          legendData.push(name);
          seriesData.push({
            name: name,
            value: response[i].percent
          });
          selected[name] = true;
        }
      }

      vm.legendData = legendData;
      vm.seriesData = seriesData;
      vm.selected = selected;
        console.log(selected)
    },

    getAcademyTestDataAreaAnalyze() {
      this.loading = true;
      var vm = this;
      let data = {
        dataDimension: vm.dataType,
        nowYear: vm.year,
        schoolType: vm.schoolType
      };
      this.$axios
        .post("/v1/clubstatistical/getAcademyTestDataAreaAnalyze", data)
        .then(res => {
          this.loading = false;
          vm.drawGen(res.data.response);
          if (res.data.code > 39999) {
            this.$Message.info(res.data.msg);
          }
        });
    },
    search() {
      var vm = this;
      vm.getAcademyTestDataAreaAnalyze();
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
  watch: {},
  created() {},
  mounted() {
    var vm = this;
    vm.createYearList();
  }
};
</script>