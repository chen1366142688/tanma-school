<template>
  <div style="margin-left:15px;">
    <Tabs type="card">
      <TabPane label="合格率调整">
        <Card>
          <Form :label-width="200" class="function">
            <FormItem label="任务名称：" class="functionItem">
              <Input
                :disabled="disTf"
                v-model="taskName"
                size="small"
                placeholder="任务名称"
                style="width:180px;"
              ></Input>
            </FormItem>
            <FormItem label="体测活动：" class="functionItem">
              <Select :disabled="disTf" v-model="activityId" size="small" style="width:180px;">
                <Option
                  v-for="item in activityList"
                  :value="item.activityId"
                  :key="item.activityId"
                  :disabled="disTf"
                >{{ item.activityName }}</Option>
              </Select>
              <span v-if="passRateOld">当前活动的的原始数据及格率：{{passRateOld}}%</span>
            </FormItem>
            <FormItem label="及格率：" class="functionItem">
              <Input
                :disabled="disTf"
                v-model="passRate"
                size="small"
                placeholder="及格率"
                style="width:180px;"
              ></Input>
            </FormItem>
            <FormItem label="年级:" class="functionItem">
              <CheckboxGroup v-model="gradeIds">
                <Checkbox
                  :disabled="disTf"
                  :label="item.startYear"
                  v-for="(item,index) in gradeList"
                >{{item.startName}}</Checkbox>
              </CheckboxGroup>
            </FormItem>
            <Card>
              <p>
                <span>男生标准：
                  <i style="color:red">（未及格学生的各个项目分数将会从下方设置的最小值分数到最大值分数随机选取一个分数）</i>
                </span>
              </p>
              <FormItem label="BMI得分区间：" class="functionItem">
                <span>最小分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="heighMin"
                  size="small"
                  placeholder="最小分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">最大分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="heighMax"
                  size="small"
                  placeholder="最大分数"
                  style="width:180px;"
                ></Input>
                <span style="color:red">*最小值和最大值只能为整数,下同</span>
              </FormItem>
              <FormItem label="肺活量分数区间：" class="functionItem">
                <span>最小分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="vitalMin"
                  size="small"
                  placeholder="最小分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">最大分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="vitalMax"
                  size="small"
                  placeholder="最大分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">
                  ({{vitalValueMin}} -- {{vitalValueMax}} ml,
                  <i style="color:red">数据仅供参考，下同</i> )
                </span>
              </FormItem>
              <FormItem label="50米跑分数区间：" class="functionItem">
                <span>最小分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="run50Min"
                  size="small"
                  placeholder="最小分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">最大分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="run50Max"
                  size="small"
                  placeholder="最大分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">({{run50ValueMin}} -- {{run50ValueMax}} s)</span>
              </FormItem>
              <FormItem
                label="立定跳远分数区间："
                class="functionItem"
                v-if="schoolType != '1' && schoolType!='2'"
              >
                <span>最小分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="jumpMin"
                  size="small"
                  placeholder="最小分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">最大分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="jumpMax"
                  size="small"
                  placeholder="最大分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">({{jumpValueMin}} -- {{jumpValueMax}} cm)</span>
              </FormItem>
              <FormItem label="坐位体前屈分数区间：" class="functionItem">
                <span>最小分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="sitMin"
                  size="small"
                  placeholder="最小分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">最大分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="sitMax"
                  size="small"
                  placeholder="最大分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">({{sitValueMin}} -- {{sitValueMax}} cm)</span>
              </FormItem>
              <!-- <FormItem label="800米跑分数区间：" class="functionItem">
                <span>最小分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="run800Min"
                  size="small"
                  placeholder="最小分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">最大分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="run800Max"
                  size="small"
                  placeholder="最大分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">({{run800ValueMin}}--{{run800ValueMax}} s)</span>
              </FormItem>-->
              <FormItem
                label="1000米跑分数区间："
                class="functionItem"
                v-if="schoolType != '1' && schoolType!='2'"
              >
                <span>最小分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="run1000Min"
                  size="small"
                  placeholder="最小分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">最大分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="run1000Max"
                  size="small"
                  placeholder="最大分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">({{run1000ValueMin}} -- {{run1000ValueMax}} s)</span>
              </FormItem>
              <FormItem
                label="一分钟仰卧起坐分数区间："
                class="functionItem"
                v-if="schoolType == '1' || schoolType=='2'"
              >
                <span>最小分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="sitUpMin"
                  size="small"
                  placeholder="最小分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">最大分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="sitUpMax"
                  size="small"
                  placeholder="最大分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">({{sitUpValueMin}}--{{sitUpValueMax}} 次)</span>
              </FormItem>
              <FormItem
                label="引体向上分数区间："
                class="functionItem"
                v-if="schoolType != '1' && schoolType!='2'"
              >
                <span>最小分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="pullMin"
                  size="small"
                  placeholder="最小分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">最大分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="pullMax"
                  size="small"
                  placeholder="最大分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">({{pullValueMin}} -- {{pullValueMax}} 次)</span>
              </FormItem>

              <FormItem
                label="一分钟跳绳分数区间："
                class="functionItem"
                v-if="schoolType == '1' || schoolType=='2'"
              >
                <span>最小分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="ropeMin"
                  size="small"
                  placeholder="最小分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">最大分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="ropeMax"
                  size="small"
                  placeholder="最大分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">({{ropeValueMin}} -- {{ropeValueMax}} 次)</span>
              </FormItem>
              <FormItem
                label="50米X8往返跑分数区间："
                class="functionItem"
                v-if="schoolType == '1' || schoolType=='2'"
              >
                <span>最小分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="run58Min"
                  size="small"
                  placeholder="最小分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">最大分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="run58Max"
                  size="small"
                  placeholder="最大分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">({{run58ValueMin}} -- {{run58ValueMax}} s)</span>
              </FormItem>
            </Card>
            <Card>
              <p>
                <span>女生标准：
                  <i style="color:red">（未及格学生的各个项目分数将会从下方设置的最小值分数到最大值分数随机选取一个分数）</i>
                </span>
              </p>
              <FormItem label="BMI得分区间：" class="functionItem">
                <span>最小分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="heighMin2"
                  size="small"
                  placeholder="最小分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">最大分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="heighMax2"
                  size="small"
                  placeholder="最大分数"
                  style="width:180px;"
                ></Input>
                <span style="color:red">*最小值和最大值只能为整数,下同</span>
              </FormItem>
              <FormItem label="肺活量分数区间：" class="functionItem">
                <span>最小分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="vitalMin2"
                  size="small"
                  placeholder="最小分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">最大分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="vitalMax2"
                  size="small"
                  placeholder="最大分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">
                  ({{vitalValueMin2}} -- {{vitalValueMax2}} ml,
                  <i style="color:red">数据仅供参考，下同</i> )
                </span>
              </FormItem>
              <FormItem label="50米跑分数区间：" class="functionItem">
                <span>最小分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="run50Min2"
                  size="small"
                  placeholder="最小分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">最大分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="run50Max2"
                  size="small"
                  placeholder="最大分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">({{run50ValueMin2}} -- {{run50ValueMax2}} s)</span>
              </FormItem>
              <FormItem
                label="立定跳远分数区间："
                class="functionItem"
                v-if="schoolType !='1' && schoolType!='2'"
              >
                <span>最小分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="jumpMin2"
                  size="small"
                  placeholder="最小分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">最大分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="jumpMax2"
                  size="small"
                  placeholder="最大分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">({{jumpValueMin2}} -- {{jumpValueMax2}} cm)</span>
              </FormItem>
              <FormItem label="坐位体前屈分数区间：" class="functionItem">
                <span>最小分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="sitMin2"
                  size="small"
                  placeholder="最小分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">最大分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="sitMax2"
                  size="small"
                  placeholder="最大分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">({{sitValueMin2}} -- {{sitValueMax2}} cm)</span>
              </FormItem>
              <FormItem
                label="800米跑分数区间："
                class="functionItem"
                v-if="schoolType !='1' && schoolType!='2'"
              >
                <span>最小分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="run800Min2"
                  size="small"
                  placeholder="最小 年级"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">最大分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="run800Max2"
                  size="small"
                  placeholder="最大分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">({{run800ValueMin2}} -- {{run800ValueMax2}} s)</span>
              </FormItem>
              <!-- <FormItem label="1000米跑分数区间：" class="functionItem">
                <span>最小分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="run1000Min2"
                  size="small"
                  placeholder="最小分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">最大分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="run1000Max2"
                  size="small"
                  placeholder="最大分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">({{run1000ValueMin2}}--{{run1000ValueMax2}} s)</span>
              </FormItem>-->
              <FormItem label="一分钟仰卧起坐分数区间：" class="functionItem">
                <span>最小分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="sitUpMin2"
                  size="small"
                  placeholder="最小分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">最大分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="sitUpMax2"
                  size="small"
                  placeholder="最大分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">({{sitUpValueMin2}} -- {{sitUpValueMax2}} 次)</span>
              </FormItem>
              <!-- <FormItem label="引体向上分数区间：" class="functionItem">
                <span>最小分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="pullMin2"
                  size="small"
                  placeholder="最小分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">最大分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="pullMax2"
                  size="small"
                  placeholder="最大分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">({{pullValueMin}}--{{pullValueMax}} 次)</span>
              </FormItem>-->
              <FormItem
                label="一分钟跳绳分数区间："
                class="functionItem"
                v-if="schoolType == '1' || schoolType=='2'"
              >
                <span>最小分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="ropeMin2"
                  size="small"
                  placeholder="最小分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">最大分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="ropeMax2"
                  size="small"
                  placeholder="最大分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">({{ropeValueMin2}} -- {{ropeValueMax2}} 次)</span>
              </FormItem>
              <FormItem
                label="50米X8往返跑分数区间："
                class="functionItem"
                v-if="schoolType == '1' || schoolType=='2'"
              >
                <span>最小分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="run58Min2"
                  size="small"
                  placeholder="最小分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">最大分数：</span>
                <Input
                  :disabled="disTf"
                  v-model="run58Max2"
                  size="small"
                  placeholder="最大分数"
                  style="width:180px;"
                ></Input>
                <span style="margin-left:40px">({{run58ValueMin2}} -- {{run58ValueMax2}} s)</span>
              </FormItem>
            </Card>
          </Form>
        </Card>
        <div style="margin-top:10px;padding-left:40%">
          <Button
            @click="pageToList"
            style="float:left; margin-right:50px;width:100px"
            type="success"
          >返回</Button>
          <div style="width:20px;"></div>
          <Button
            style="float:left;width:100px"
            @click="baseSubmit"
            type="success"
            :disabled="disTf"
          >提交结果</Button>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import Vue from "vue";
import "../tinymce/js/tinymce/langs/zh_CN.js";
import tinymce from "tinymce";
export default {
  data() {
    return {
      schoolType: "",
      taskName: "",
      activityId: "",
      activityList: [],
      passRate: "",
      gradeList: [
        // {
        //   grade:'13',
        //   name:'大一'
        // },
        // {
        //   grade:'14',
        //   name:'大二'
        // },
        // {
        //   grade:'15',
        //   name:'大三'
        // },
        // {
        //   grade:'16',
        //   name:'大四'
        // },
      ],
      gradeIds: [],
      itemScoreList: [],
      heighMin: "",
      heighMax: "",
      vitalMin: "",
      vitalMax: "",
      vitalValueMin: 0,
      vitalValueMax: 0,
      run50Min: "",
      run50Max: "",
      run50ValueMin: 0,
      run50ValueMax: 0,
      jumpMin: "",
      jumpMax: "",
      jumpValueMin: 0,
      jumpValueMax: 0,
      sitMin: "",
      sitMax: "",
      sitValueMin: 0,
      sitValueMax: 0,
      run800Min: "",
      run800Max: "",
      run800ValueMin: 0,
      run800ValueMax: 0,
      run1000Min: "",
      run1000Max: "",
      run1000ValueMin: 0,
      run1000ValueMax: 0,
      sitUpMin: "",
      sitUpMax: "",
      sitUpValueMin: 0,
      sitUpValueMax: 0,
      pullMin: "",
      pullMax: "",
      pullValueMin: 0,
      pullValueMax: 0,

      ropeMin: "",
      ropeMax: "",
      ropeValueMin: "",
      ropeValueMax: "",
      run58Min: "",
      run58Max: "",
      run58ValueMin: "",
      run58ValueMax: "",

      heighMin2: "",
      heighMax2: "",
      vitalMin2: "",
      vitalMax2: "",
      vitalValueMin2: 0,
      vitalValueMax2: 0,
      run50Min2: "",
      run50Max2: "",
      run50ValueMin2: 0,
      run50ValueMax2: 0,
      jumpMin2: "",
      jumpMax2: "",
      jumpValueMin2: 0,
      jumpValueMax2: 0,
      sitMin2: "",
      sitMax2: "",
      sitValueMin2: 0,
      sitValueMax2: 0,
      run800Min2: "",
      run800Max2: "",
      run800ValueMin2: 0,
      run800ValueMax2: 0,
      run1000Min2: "",
      run1000Max2: "",
      run1000ValueMin2: 0,
      run1000ValueMax2: 0,
      sitUpMin2: "",
      sitUpMax2: "",
      sitUpValueMin2: 0,
      sitUpValueMax2: 0,
      pullMin2: "",
      pullMax2: "",
      pullValueMin2: 0,
      pullValueMax2: 0,
      ropeMin2: "",
      ropeMax2: "",
      ropeValueMin2: "",
      ropeValueMax2: "",
      run58Min2: "",
      run58Max2: "",
      run58ValueMin2: "",
      run58ValueMax2: "",

      passRateOld: "",
      schoolId: "",
      teacherId: "",
      disTf: false
    };
  },
  watch: {
    activityId: function() {
      var vm = this;
      vm.getActivityPassRate();
    },
    vitalMin: function() {
      var vm = this;
      vm.getValueByScore(vm.vitalMin, 2, 1, 1, "vitalValueMin");
    },
    vitalMax: function() {
      var vm = this;
      vm.getValueByScore(vm.vitalMax, 2, 1, 2, "vitalValueMax");
    },
    run50Min: function() {
      var vm = this;
      vm.getValueByScore(vm.run50Min, 3, 1, 1, "run50ValueMin");
    },
    run50Max: function() {
      var vm = this;
      vm.getValueByScore(vm.run50Max, 3, 1, 2, "run50ValueMax");
    },
    jumpMin: function() {
      var vm = this;
      vm.getValueByScore(vm.jumpMin, 8, 1, 1, "jumpValueMin");
    },
    jumpMax: function() {
      var vm = this;
      vm.getValueByScore(vm.jumpMax, 8, 1, 2, "jumpValueMax");
    },
    sitMin: function() {
      var vm = this;
      vm.getValueByScore(vm.sitMin, 4, 1, 1, "sitValueMin");
    },
    sitMax: function() {
      var vm = this;
      vm.getValueByScore(vm.sitMax, 4, 1, 2, "sitValueMax");
    },
    // run800Min: function(){
    //   var vm=this;
    //   vm.run800ValueMin=vm.getValueByScore(vm.run800Min,11,2,1);
    // },
    // run800Max: function(){
    //   var vm=this;
    //   vm.run800ValueMax=vm.getValueByScore(vm.run800Max,11,2,2);
    // },
    run1000Min: function() {
      var vm = this;
      vm.getValueByScore(vm.run1000Min, 10, 1, 1, "run1000ValueMin");
    },
    run1000Max: function() {
      var vm = this;
      vm.getValueByScore(vm.run1000Max, 10, 1, 2, "run1000ValueMax");
    },
    sitUpMin: function() {
      var vm = this;
      vm.sitUpValueMin = vm.getValueByScore(vm.sitUpMin, 6, 2, 1);
    },
    sitUpMax: function() {
      var vm = this;
      vm.sitUpValueMax = vm.getValueByScore(vm.sitUpMax, 6, 2, 2);
    },
    pullMin: function() {
      var vm = this;
      vm.getValueByScore(vm.pullMin, 9, 1, 1, "pullValueMin");
    },
    pullMax: function() {
      var vm = this;
      vm.getValueByScore(vm.pullMax, 9, 1, 2, "pullValueMax");
    },
    vitalMin2: function() {
      var vm = this;
      vm.getValueByScore(vm.vitalMin2, 2, 2, 1, "vitalValueMin2");
    },
    vitalMax2: function() {
      var vm = this;
      vm.getValueByScore(vm.vitalMax2, 2, 2, 2, "vitalValueMax2");
    },
    run50Min2: function() {
      var vm = this;
      vm.getValueByScore(vm.run50Min2, 3, 2, 1, "run50ValueMin2");
    },
    run50Max2: function() {
      var vm = this;
      vm.getValueByScore(vm.run50Max2, 3, 2, 2, "run50ValueMax2");
    },
    jumpMin2: function() {
      var vm = this;
      vm.getValueByScore(vm.jumpMin2, 8, 2, 1, "jumpValueMin2");
    },
    jumpMax2: function() {
      var vm = this;
      vm.getValueByScore(vm.jumpMax2, 8, 2, 2, "jumpValueMax2");
    },
    sitMin2: function() {
      var vm = this;
      vm.getValueByScore(vm.sitMin2, 4, 2, 1, "sitValueMin2");
    },
    sitMax2: function() {
      var vm = this;
      vm.getValueByScore(vm.sitMax2, 4, 2, 2, "sitValueMax2");
    },
    run800Min2: function() {
      var vm = this;
      vm.getValueByScore(vm.run800Min2, 11, 2, 1, "run800ValueMin2");
    },
    run800Max2: function() {
      var vm = this;
      vm.getValueByScore(vm.run800Max2, 11, 2, 2, "run800ValueMax2");
    },
    // run1000Min2: "",
    // run1000Max2: "",
    // run1000ValueMin2: 0,
    // run1000ValueMax2: 0,
    sitUpMin2: function() {
      var vm = this;
      vm.getValueByScore(vm.sitUpMin2, 6, 2, 1, "sitUpValueMin2");
    },
    sitUpMax2: function() {
      var vm = this;
      vm.getValueByScore(vm.sitUpMax2, 6, 2, 2, "sitUpValueMax2");
    },
    ropeMin: function() {
      var vm = this;
      vm.getValueByScore(vm.ropeMin, 5, 2, 1, "ropeValueMin");
    },
    ropeMax: function() {
      var vm = this;
      vm.getValueByScore(vm.ropeMax, 5, 2, 2, "ropeValueMax");
    },
    run58Min: function() {
      var vm = this;
      vm.getValueByScore(vm.run58Min, 7, 2, 1, "run58ValueMin");
    },
    run58Max: function() {
      var vm = this;
      vm.getValueByScore(vm.run58Max, 7, 2, 2, "run58ValueMax");
    },
    ropeMin2: function() {
      var vm = this;
      vm.getValueByScore(vm.ropeMin2, 5, 2, 1, "ropeValueMin2");
    },
    ropeMax2: function() {
      var vm = this;
      vm.getValueByScore(vm.ropeMax2, 5, 2, 2, "ropeValueMax2");
    },
    run58Min2: function() {
      var vm = this;
      vm.getValueByScore(vm.run58Min2, 7, 2, 1, "run58ValueMin2");
    },
    run58Max2: function() {
      var vm = this;
      vm.getValueByScore(vm.run58Max2, 7, 2, 2, "run58ValueMax2");
    }
    // pullMin2: "",
    // pullMax2: "",
    // pullValueMin2: 0,
    // pullValueMax2:0,
  }, //以V-model绑定数据时使用的数据变化监测

  created: function() {},
  methods: {
    pageToList() {
      //返回
      this.$router.go(-1);
    },
    getActivitySingleInfoBySchoolId() {
      var vm = this;
      this.$axios
        .get(
          "/v1/testdata/getActivitySingleInfoBySchoolId?schoolId=" + sessionStorage.getItem("schoolId")
        )
        .then(res => {
          if (res.data.code == 10000) {
            vm.activityList = res.data.response;
          } else {
            if (res.data.code > 39999) {
              vm.$Message.info(res.data.msg);
            }
          }
        });
    },
    getActivityPassRate() {
      var vm = this;
      this.$axios
        .get("/v1/testdata/getActivityPassRate?activityId=" + vm.activityId)
        .then(res => {
          if (res.data.code == 10000) {
            vm.passRateOld = res.data.response;
          } else {
            if (res.data.code > 39999) {
              vm.$Message.info(res.data.msg);
            }
          }
        });
    },
    getValueByScore(score, itemId, gender, type, params) {
      var vm = this;
      this.$axios
        .get(
          "/v1/testdata/getValueByScore?score=" +
            score +
            "&itemId=" +
            itemId +
            "&gender=" +
            gender +
            "&type=" +
            type
        )
        .then(res => {
          if (res.data.code == 10000) {
            // vm.activityList = res.data.response;
            if (params == "vitalValueMin") {
              vm.vitalValueMin = res.data.response;
            }
            if (params == "vitalValueMax") {
              vm.vitalValueMax = res.data.response;
            }
            if (params == "run50ValueMin") {
              vm.run50ValueMax = res.data.response;
            }
            if (params == "run50ValueMax") {
              vm.run50ValueMin = res.data.response;
            }
            if (params == "jumpValueMin") {
              vm.jumpValueMin = res.data.response;
            }
            if (params == "jumpValueMax") {
              vm.jumpValueMax = res.data.response;
            }
            if (params == "sitValueMin") {
              vm.sitValueMin = res.data.response;
            }
            if (params == "sitValueMax") {
              vm.sitValueMax = res.data.response;
            }
            if (params == "run1000ValueMin") {
              vm.run1000ValueMax = res.data.response;
            }
            if (params == "run1000ValueMax") {
              vm.run1000ValueMin = res.data.response;
            }
            if (params == "pullValueMin") {
              vm.pullValueMin = res.data.response;
            }
            if (params == "pullValueMax") {
              vm.pullValueMax = res.data.response;
            }
            if (params == "vitalValueMin2") {
              vm.vitalValueMin2 = res.data.response;
            }
            if (params == "vitalValueMax2") {
              vm.vitalValueMax2 = res.data.response;
            }
            if (params == "run50ValueMin2") {
              vm.run50ValueMax2 = res.data.response;
            }
            if (params == "run50ValueMax2") {
              vm.run50ValueMin2 = res.data.response;
            }
            if (params == "jumpValueMin2") {
              vm.jumpValueMin2 = res.data.response;
            }
            if (params == "jumpValueMax2") {
              vm.jumpValueMax2 = res.data.response;
            }
            if (params == "sitValueMin2") {
              vm.sitValueMin2 = res.data.response;
            }
            if (params == "sitValueMax2") {
              vm.sitValueMax2 = res.data.response;
            }
            if (params == "run800ValueMin2") {
              vm.run800ValueMax2 = res.data.response;
            }
            if (params == "run800ValueMax2") {
              vm.run800ValueMin2 = res.data.response;
            }
            if (params == "sitUpValueMin2") {
              vm.sitUpValueMin2 = res.data.response;
            }
            if (params == "sitUpValueMax2") {
              vm.sitUpValueMax2 = res.data.response;
            }

            if (params == "ropeValueMin") {
              vm.ropeValueMin = res.data.response;
            }
            if (params == "ropeValueMax") {
              vm.ropeValueMax = res.data.response;
            }
            if (params == "run58ValueMin") {
              vm.run58ValueMax = res.data.response;
            }
            if (params == "run58ValueMax") {
              vm.run58ValueMin = res.data.response;
            }
            if (params == "ropeValueMin2") {
              vm.ropeValueMin2 = res.data.response;
            }
            if (params == "ropeValueMax2") {
              vm.ropeValueMax2 = res.data.response;
            }
            if (params == "run58ValueMin2") {
              vm.run58ValueMax2 = res.data.response;
            }
            if (params == "run58ValueMax2") {
              vm.run58ValueMin2 = res.data.response;
            }
          } else {
            if (res.data.code > 39999) {
              vm.$Message.info(res.data.msg);
            }
          }
        });
    },
    getTaskDetail(taskId) {
      var vm = this;
      this.$axios
        .get("/v1/changtask/getTaskDetail?taskId=" + taskId)
        .then(function(response) {
          // console.log(response);
          let data = response.data.response;
          vm.activityId = data.activityId;
          vm.changeTaskId = data.changeTaskId;
          vm.heighMax = data.heighMax;
          vm.heighMin = data.heighMin;
          vm.jumpMax = data.jumpMax;
          vm.jumpMin = data.jumpMin;
          vm.passRate = data.passRate;
          vm.pullMax = data.pullMax;
          vm.pullMin = data.pullMin;
          vm.run1000Max = data.run1000Max;
          vm.run1000Min = data.run1000Min;
          vm.run50Max = data.run50Max;
          vm.run50Min = data.run50Min;
          vm.run800Max = data.run800Max;
          vm.run800Min = data.run800Min;
          vm.schoolId = data.schoolId;
          vm.sitMax = data.sitMax;
          vm.sitMin = data.sitMin;
          vm.sitUpMax = data.sitUpMax;
          vm.sitUpMin = data.sitUpMin;
          vm.taskName = data.taskName;
          vm.teacherId = data.teacherId;
          vm.vitalMax = data.vitalMax;
          vm.vitalMin = data.vitalMin;
          // console.log(data.gradeIds.split(","));
          vm.gradeIds = data.gradeIds.split(",");
          vm.heighMax2 = data.heighMax2;
          vm.heighMin2 = data.heighMin2;
          vm.jumpMax2 = data.jumpMax2;
          vm.jumpMin2 = data.jumpMin2;
          vm.pullMax2 = data.pullMax2;
          vm.pullMin2 = data.pullMin2;
          vm.run1000Max2 = data.run1000Max2;
          vm.run1000Min2 = data.run1000Min2;
          vm.run50Max2 = data.run50Max2;
          vm.run50Min2 = data.run50Min2;
          vm.run800Max2 = data.run800Max2;
          vm.run800Min2 = data.run800Min2;
          vm.sitMax2 = data.sitMax2;
          vm.sitMin2 = data.sitMin2;
          vm.sitUpMax2 = data.sitUpMax2;
          vm.sitUpMin2 = data.sitUpMin2;
          vm.vitalMax2 = data.vitalMax2;
          vm.vitalMin2 = data.vitalMin2;

          vm.ropeMin = data.ropeMin;
          vm.ropeMax = data.ropeMax;
          vm.run58Min = data.run58Min;
          vm.run58Max = data.run58Max;

          vm.ropeMin2 = data.ropeMin2;
          vm.ropeMax2 = data.ropeMax2;
          vm.run58Min2 = data.run58Min2;
          vm.run58Max2 = data.run58Max2;
        })
        .catch(function(response) {
          console.log(response);
        });
    },

    baseSubmit() {
      var vm = this;

      if (!vm.taskName) {
        vm.$Message.error("请输入任务名称");
        return false;
      }
      if (!vm.activityId) {
        vm.$Message.error("请选择活动");
        return false;
      }
      if (!vm.passRate) {
        vm.$Message.error("请输入及格率");
        return false;
      }
      if (!vm.gradeIds) {
        vm.$Message.error("请选择年级");
        return false;
      }
      if (!vm.heighMin) {
        vm.$Message.error("请输入最小身高");
        return false;
      }
      if (!vm.heighMax) {
        vm.$Message.error("请输入最大身高");
        return false;
      }
      if (!vm.vitalMin) {
        vm.$Message.error("请输入男生最小肺活量分数");
        return false;
      }
      if (!vm.vitalMax) {
        vm.$Message.error("请输入男生最大肺活量分数");
        return false;
      }
      if (!vm.run50Min) {
        vm.$Message.error("请输入男生最小50米跑分数");
        return false;
      }
      if (!vm.run50Max) {
        vm.$Message.error("请输入男生最大50米跑分数");
        return false;
      }
      if (!vm.jumpMin) {
        vm.$Message.error("请输入男生最小立定跳远分数");
        return false;
      }
      if (!vm.jumpMax) {
        vm.$Message.error("请输入男生最大立定跳远分数");
        return false;
      }
      if (!vm.sitMin) {
        vm.$Message.error("请输入男生最小坐位体前屈分数");
        return false;
      }
      if (!vm.sitMax) {
        vm.$Message.error("请输入男生最大坐位体前屈分数");
        return false;
      }

      if (!vm.run1000Min) {
        vm.$Message.error("请输入男生最小1000米跑分数");
        return false;
      }
      if (!vm.run1000Max) {
        vm.$Message.error("请输入男生最大1000米跑分数");
        return false;
      }

      if (!vm.pullMin) {
        vm.$Message.error("请输入男生最小引体向上分数");
        return false;
      }
      if (!vm.pullMax) {
        vm.$Message.error("请输入男生最大引体向上分数！");
        return false;
      }

      if (!vm.heighMin2) {
        vm.$Message.error("请输入女生最小身高");
        return false;
      }
      if (!vm.heighMax2) {
        vm.$Message.error("请输入女生最大身高");
        return false;
      }
      if (!vm.vitalMin2) {
        vm.$Message.error("请输入女生最小肺活量分数");
        return false;
      }
      if (!vm.vitalMax2) {
        vm.$Message.error("请输入女生最大肺活量分数");
        return false;
      }
      if (!vm.run50Min2) {
        vm.$Message.error("请输入女生最小50米跑分数");
        return false;
      }
      if (!vm.run50Max2) {
        vm.$Message.error("请输入女生最大50米跑分数");
        return false;
      }
      if (!vm.jumpMin2) {
        vm.$Message.error("请输入女生最小立定跳远分数");
        return false;
      }
      if (!vm.jumpMax2) {
        vm.$Message.error("请输入女生最大立定跳远分数");
        return false;
      }
      if (!vm.sitMin2) {
        vm.$Message.error("请输入女生最小坐位体前屈分数");
        return false;
      }
      if (!vm.sitMax2) {
        vm.$Message.error("请输入女生最大坐位体前屈分数");
        return false;
      }

      if (!vm.run800Min2) {
        vm.$Message.error("请输入女生最小800米跑分数");
        return false;
      }
      if (!vm.run800Max2) {
        vm.$Message.error("请输入女生最大800米跑分数");
        return false;
      }

      if (!vm.sitUpMin2) {
        vm.$Message.error("请输入女生最小仰卧起坐分数");
        return false;
      }
      if (!vm.sitUpMax2) {
        vm.$Message.error("请输入女生最大仰卧起坐分数");
        return false;
      }
      //小学数据验证
      if (vm.schoolType == "1" || vm.schoolType == "2") {
        if (!vm.ropeMin) {
          vm.$Message.error("请输入男生最小跳绳分数");
          return false;
        }
        if (!vm.ropeMax) {
          vm.$Message.error("请输入男生最大跳绳分数");
          return false;
        }

        if (!vm.run58Min) {
          vm.$Message.error("请输入男生最小50米X8往返跑分数");
          return false;
        }
        if (!vm.run58Max) {
          vm.$Message.error("请输入男生最大50米X8往返跑分数");
          return false;
        }
        if (!vm.ropeMin2) {
          vm.$Message.error("请输入女生最小跳绳分数");
          return false;
        }
        if (!vm.ropeMax2) {
          vm.$Message.error("请输入女生最大跳绳分数");
          return false;
        }

        if (!vm.run58Min2) {
          vm.$Message.error("请输入女生最小50米X8往返跑分数");
          return false;
        }
        if (!vm.run58Max2) {
          vm.$Message.error("请输入女生最大50米X8往返跑分数");
          return false;
        }
        if (!vm.sitUpMin) {
          vm.$Message.error("请输入男生最小仰卧起坐分数");
          return false;
        }
        if (!vm.sitUpMax) {
          vm.$Message.error("请输入男生最大仰卧起坐分数");
          return false;
        }
      }

      let data = {
        activityId: vm.activityId,
        changeTaskId: vm.changeTaskId,
        heighMax: vm.heighMax,
        heighMin: vm.heighMin,
        jumpMax: vm.jumpMax,
        jumpMin: vm.jumpMin,
        passRate: vm.passRate,
        pullMax: vm.pullMax,
        pullMin: vm.pullMin,
        run1000Max: vm.run1000Max,
        run1000Min: vm.run1000Min,
        run50Max: vm.run50Max,
        run50Min: vm.run50Min,
        // run800Max: vm.run800Max,
        // run800Min: vm.run800Min,
        schoolId: vm.schoolId,
        sitMax: vm.sitMax,
        sitMin: vm.sitMin,
        sitUpMax: vm.sitUpMax,
        sitUpMin: vm.sitUpMin,
        taskName: vm.taskName,
        teacherId: vm.teacherId,
        vitalMax: vm.vitalMax,
        vitalMin: vm.vitalMin,
        heighMax2: vm.heighMax2,
        heighMin2: vm.heighMin2,
        jumpMax2: vm.jumpMax2,
        jumpMin2: vm.jumpMin2,
        // pullMax2: vm.pullMax2,
        // pullMin2: vm.pullMin2,
        // run1000Max2: vm.run1000Max2,
        // run1000Min2: vm.run1000Min2,
        run50Max2: vm.run50Max2,
        run50Min2: vm.run50Min2,
        run800Max2: vm.run800Max2,
        run800Min2: vm.run800Min2,
        sitMax2: vm.sitMax2,
        sitMin2: vm.sitMin2,
        sitUpMax2: vm.sitUpMax2,
        sitUpMin2: vm.sitUpMin2,
        vitalMax2: vm.vitalMax2,
        vitalMin2: vm.vitalMin2,

        ropeMin: vm.ropeMin,
        ropeMax: vm.ropeMax,
        run58Min: vm.run58Min,
        run58Max: vm.run58Max,
        ropeMin2: vm.ropeMin2,
        ropeMax2: vm.ropeMax2,
        run58Min2: vm.run58Min2,
        run58Max2: vm.run58Max2,
        gradeIds2: vm.gradeIds.join(",")
      };
      this.$axios
        .post("/v1/changtask/addChangeTask", data)
        .then(function(response) {
          // console.log(response);
          if (response.data.response == "1") {
            vm.$Message.info("提交成功");
            vm.$router.go(-1);
          } else {
            vm.$Message.info("提交失败");
          }
        })
        .catch(function(response) {
          // console.log(response);
          vm.$Message.info("提交失败");
        });
    },
    getStartYearList() {
      //编辑时获取场馆数据
      // this.pageTitle = '学校编辑'
      this.$axios.get("/v1/school/getStartYearList").then(res => {
        if (res.data.code == 10000) {
          console.log(res);
          let data = res.data.response;
          this.gradeList = data;
          // this.schoolName = data.name
        } else {
          if (res.data.code > 39999) {
            this.$Message.info(res.data.msg);
          }
        }
      });
    }
  },
  mounted() {
    var vm = this;
    let changeTaskId = sessionStorage.getItem(
      "scoreChangeManage-scoreChangeDetail-changeTaskId"
    );
    vm.changeTaskId = changeTaskId;
    vm.schoolType = sessionStorage.getItem("schoolType");
    console.log(vm.schoolType);
    vm.getStartYearList();
    if (
      sessionStorage.getItem("scoreChangeManage-scoreChangeDetail-changeTaskId")
    ) {
      vm.disTf = true;
      vm.getTaskDetail(
        sessionStorage.getItem(
          "scoreChangeManage-scoreChangeDetail-changeTaskId"
        )
      );
    }
    vm.getActivitySingleInfoBySchoolId();
  },
  destroyed() {}
};
</script>
