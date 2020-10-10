<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">学生：{{studentName}}-{{registerCode}}</h2>
    </div>
    <div>
      <Tabs type="card">
        <TabPane name="operator" label="完成情况">
          <div>
           <Card>
            <div class="top-search">
                <div class="left-input">
                    <div style="margin:5px 20px;">
                        <span>开始日期：</span>
                        <DatePicker :value="startTime" @on-change="startTimeChange" :clearable="true" format="yyyy-MM-dd" type="datetime" placeholder="起始时间" style="width: 120px" on-clear="dateClear"></DatePicker>
                    </div>
                    <div style="margin:5px 20px;">
                        <span>截止日期：</span>
                        <DatePicker :value="endTime" @on-change="endTimeChange" :clearable="true" format="yyyy-MM-dd" type="datetime" placeholder="截止时间" style="width: 120px" on-clear="dateClear"></DatePicker>
                    </div>
                    <div style="margin:5px 20px;">
                        <span>完成状态：</span>
                        <Select v-model="completeStatus"  style="width:120px;">
                            <Option
                            v-for="item in completeStatusList"
                            :value="item.itemId"
                            :key="item.itemId"
                            >{{ item.itemName }}</Option>
                        </Select>
                    </div>
                </div>
                <div class="right-btns">
                    <Button type="success" @click="querySearch()">查询</Button>
                    <Button type="success" @click="goback()">返回</Button>
               </div>
            </div>
          </Card>
          <br>
            <Row>
              <div style>
                <Table border max-height="580"  :loading="loading" :columns="resultColumns" :data="resultData"></Table>
              </div>
              <br />
              <div style="float: right;">
                <Page
                  :total="total"
                  :current="pageNum"
                  :page-size="pageSize"
                  @on-change="pageNumChange"
                  @on-page-size-change="pageSizechange"
                  show-total
                  show-sizer
                ></Page>
              </div>
            </Row>
          </div>
        </TabPane>
        <TabPane name="group" label="锻炼记录">
          <div>
            <Card>
              <div class="top-search">
                    <div class="left-input">
                        <div style="margin:5px 20px;">
                            <span>开始<span style="visibility:hidden">班级</span>日期：</span>
                            <DatePicker :value="startTime1" @on-change="startTimeChange1" :clearable="true" format="yyyy-MM-dd" type="datetime" placeholder="起始时间" style="width: 120px" on-clear="dateClear"></DatePicker>
                        </div>
                        <div style="margin:5px 20px;">
                            <span>截止<span style="visibility:hidden">班级</span>日期：</span>
                            <DatePicker :value="endTime1" @on-change="endTimeChange1" :clearable="true" format="yyyy-MM-dd" type="datetime" placeholder="截止时间" style="width: 120px" on-clear="dateClear"></DatePicker>
                        </div>
                        <div style="margin:5px 20px;">
                            <span>是否上传视频：</span>
                            <Select v-model="upLoadVideo"  style="width:120px;">
                            <Option
                                v-for="item in upLoadVideoList"
                                :value="item.itemId"
                                :key="item.itemId"
                            >{{ item.itemName }}</Option>
                            </Select>
                        </div>
                    </div>
                    <div class="right-btns">
                        <Button @click="querySearch1()" type="success">查询</Button>
                        <Button @click="goback()" type="success">返回</Button>
                    </div>
              </div>
            </Card>
            <br>
            <Row>
              <div style>
                <Table border max-height="600" :loading="loading" :columns="resultColumnsj" :data="resultDatasj"></Table>
              </div>
              <br />
              <div style="float: right;">
                <Page
                  :total="total1"
                  :current="pageNum1"
                  :page-size="pageSize1"
                  @on-change="pageNumChange1"
                  @on-page-size-change="pageSizechange1"
                  show-total
                  show-sizer
                ></Page>
              </div>
            </Row>
          </div>
        </TabPane>
      </Tabs>
    </div>
    <Modal
            v-model="showVideo1"
            :title="videoName"
            @on-ok="cancleShowVideo1"
            @on-cancel="cancleShowVideo1"
            :mask-closable="false"
            :loading="false"
            ok-text="关闭"
            cancel-text=""
            width="1200px"
    >
      <div>
      <div style="margin-top:10px;display: inline-block" v-for="(item,key) in videoUrlList">
        <div style="margin-top: 20px">{{curTime}}</div>
        <video :src="item" v-if="item!=''" style="width: 500px;height:300px; margin-left: 20px;margin-top: 20px" :autoplay="isAuto" controls="controls" />
      </div>
      </div>
    </Modal>
    <Modal
      v-model="showVideo"
      :title="videoStudentName"
      @on-ok="cancleShowVideo"
      @on-cancel="cancleShowVideo"
      :mask-closable="false"
      :loading="false"
      ok-text="关闭"
      cancel-text=""
      width="700px"
    >
      <div style="margin-top:10px;">
        <video :src="videoUrl" v-if="videoUrl!=''" style="width: 500px;height:300px" autoplay="true" controls="controls" />
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "schoolList",
  data() {
    return {
      videoName: '',
    curTime: '',
    isAuto: false,
      loading: false,
      schoolId: "",
      schoolType: "",
      registerCode: "",
      studentName: "",
      studentId:"",
      showVideo:false,
      videoUrl:"",
      showVideo1:false,
      videoUrlList:"",
      videoStudentName:"",
      nowDay:"",
      resultColumns:[],
      resultColumns6: [
        {
          title: "日期",
          key: "dayTime",
          align: "center",
          type:'html',
          width: 110
        },
        {
          title: "计划1",
          key: "plan1",
          align: "center",
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      (row.completeStatus=='1' && row.completeType=='2')?"已完成 无视频":row.plan1
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount1>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo1,row.dayTime,row.plan1)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount1==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=='2'?(
                        (row.completeStatus=='1' && row.completeType=='1')?'家长自行布置(已完成作业)':
                        (row.completeStatus=='1' && row.completeType=='2')?'由教师完成':'家长自行布置(未完成作业)'
                        )
                      :(row.completeStatus=='1' && row.completeType=='2')?'由教师完成':row.allTimeDuration1>0&&row.videoCount1==0?'已完成 无视频': row.plan1!=''&&row.allTimeDuration1==0?'未完成作业':''
            )
            ])
          }

        },
        {
          title: "计划2",
          key: "plan2",
          align: "center",
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan2
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount2>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo2,row.dayTime,row.plan2)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount2==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                   row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration2>0&&row.videoCount2==0?'已完成 无视频':row.plan2!=''&& row.allTimeDuration2==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划3",
          key: "plan3",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan3
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount3>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo3,row.dayTime,row.plan3)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount3==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration3>0&&row.videoCount3==0?'已完成 无视频': row.plan3!=''&&row.allTimeDuration3==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划4",
          key: "plan4",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan4
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount4>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo4,row.dayTime,row.plan4)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount4==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration4>0&&row.videoCount4==0?'已完成 无视频': row.plan4!=''&&row.allTimeDuration4==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划5",
          key: "plan5",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                     row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"": row.plan5
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount5>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo5,row.dayTime,row.plan5)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount5==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration5>0&&row.videoCount5==0?'已完成 无视频': row.plan5=''&&row.allTimeDuration5==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划6",
          key: "plan6",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan6
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount6>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo6,row.dayTime,row.plan6)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount6==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                        row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration6>0&&row.videoCount6==0?'已完成 无视频': row.plan6!=''&&row.allTimeDuration6==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "当日锻炼情况",
          key: "overPlan",
          align: "center",
          type:'html',
          width: 290
        },
      ],
      resultColumns7: [
        {
          title: "日期",
          key: "dayTime",
          align: "center",
          type:'html',
          width: 110
        },
{
          title: "计划1",
          key: "plan1",
          align: "center",
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      (row.completeStatus=='1' && row.completeType=='2')?"已完成 无视频":row.plan1
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount1>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo1,row.dayTime,row.plan1)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount1==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=='2'?(
                        (row.completeStatus=='1' && row.completeType=='1')?'家长自行布置(已完成作业)':
                        (row.completeStatus=='1' && row.completeType=='2')?'由教师完成':'家长自行布置(未完成作业)'
                        )
                      :(row.completeStatus=='1' && row.completeType=='2')?'由教师完成':row.allTimeDuration1>0&&row.videoCount1==0?'已完成 无视频': row.plan1!=''&&row.allTimeDuration1==0?'未完成作业':''
            )
            ])
          }

        },
        {
          title: "计划2",
          key: "plan2",
          align: "center",
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan2
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount2>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo2,row.dayTime,row.plan2)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount2==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                   row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration2>0&&row.videoCount2==0?'已完成 无视频':row.plan2!=''&& row.allTimeDuration2==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划3",
          key: "plan3",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan3
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount3>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo3,row.dayTime,row.plan3)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount3==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration3>0&&row.videoCount3==0?'已完成 无视频': row.plan3!=''&&row.allTimeDuration3==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划4",
          key: "plan4",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan4
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount4>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo4,row.dayTime,row.plan4)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount4==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration4>0&&row.videoCount4==0?'已完成 无视频': row.plan4!=''&&row.allTimeDuration4==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划5",
          key: "plan5",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                     row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"": row.plan5
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount5>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo5,row.dayTime,row.plan5)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount5==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration5>0&&row.videoCount5==0?'已完成 无视频': row.plan5=''&&row.allTimeDuration5==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划6",
          key: "plan6",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan6
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount6>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo6,row.dayTime,row.plan6)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount6==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                        row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration6>0&&row.videoCount6==0?'已完成 无视频': row.plan6!=''&&row.allTimeDuration6==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划7",
          key: "plan7",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan7
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount7>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo7,row.dayTime,row.plan7)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount7==null?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration7>0&&row.videoCount7==null?'已完成 无视频': row.plan7!=''&&row.allTimeDuration7==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "当日锻炼情况",
          key: "overPlan",
          align: "center",
          type:'html',
          width: 290
        },
      ],
      resultColumns8: [
        {
          title: "日期",
          key: "dayTime",
          align: "center",
          type:'html',
          width: 110
        },
        {
          title: "计划1",
          key: "plan1",
          align: "center",
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      (row.completeStatus=='1' && row.completeType=='2')?"已完成 无视频":row.plan1
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount1>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo1,row.dayTime,row.plan1)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount1==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=='2'?(
                        (row.completeStatus=='1' && row.completeType=='1')?'家长自行布置(已完成作业)':
                        (row.completeStatus=='1' && row.completeType=='2')?'由教师完成':'家长自行布置(未完成作业)'
                        )
                      :(row.completeStatus=='1' && row.completeType=='2')?'由教师完成':row.allTimeDuration1>0&&row.videoCount1==0?'已完成 无视频': row.plan1!=''&&row.allTimeDuration1==0?'未完成作业':''
            )
            ])
          }

        },
        {
          title: "计划2",
          key: "plan2",
          align: "center",
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan2
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount2>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo2,row.dayTime,row.plan2)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount2==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                   row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration2>0&&row.videoCount2==0?'已完成 无视频':row.plan2!=''&& row.allTimeDuration2==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划3",
          key: "plan3",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan3
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount3>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo3,row.dayTime,row.plan3)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount3==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration3>0&&row.videoCount3==0?'已完成 无视频': row.plan3!=''&&row.allTimeDuration3==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划4",
          key: "plan4",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan4
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount4>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo4,row.dayTime,row.plan4)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount4==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration4>0&&row.videoCount4==0?'已完成 无视频': row.plan4!=''&&row.allTimeDuration4==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划5",
          key: "plan5",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                     row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"": row.plan5
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount5>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo5,row.dayTime,row.plan5)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount5==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration5>0&&row.videoCount5==0?'已完成 无视频': row.plan5=''&&row.allTimeDuration5==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划6",
          key: "plan6",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan6
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount6>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo6,row.dayTime,row.plan6)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount6==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                        row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration6>0&&row.videoCount6==0?'已完成 无视频': row.plan6!=''&&row.allTimeDuration6==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划7",
          key: "plan7",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan7
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount7>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo7,row.dayTime,row.plan7)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount7==null?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration7>0&&row.videoCount7==null?'已完成 无视频': row.plan7!=''&&row.allTimeDuration7==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划8",
          key: "plan8",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan8
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount8>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo8,row.dayTime,row.plan8)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount8==null?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration8>0&&row.videoCount8==null?'已完成 无视频': row.plan8!=''&&row.allTimeDuration8==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "当日锻炼情况",
          key: "overPlan",
          align: "center",
          type:'html',
          width: 290
        },
      ],
      resultColumns9: [
        {
          title: "日期",
          key: "dayTime",
          align: "center",
          type:'html',
          width: 110
        },
        {
          title: "计划1",
          key: "plan1",
          align: "center",
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      (row.completeStatus=='1' && row.completeType=='2')?"已完成 无视频":row.plan1
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount1>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo1,row.dayTime,row.plan1)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount1==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=='2'?(
                        (row.completeStatus=='1' && row.completeType=='1')?'家长自行布置(已完成作业)':
                        (row.completeStatus=='1' && row.completeType=='2')?'由教师完成':'家长自行布置(未完成作业)'
                        )
                      :(row.completeStatus=='1' && row.completeType=='2')?'由教师完成':row.allTimeDuration1>0&&row.videoCount1==0?'已完成 无视频': row.plan1!=''&&row.allTimeDuration1==0?'未完成作业':''
            )
            ])
          }

        },
        {
          title: "计划2",
          key: "plan2",
          align: "center",
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan2
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount2>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo2,row.dayTime,row.plan2)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount2==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                   row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration2>0&&row.videoCount2==0?'已完成 无视频':row.plan2!=''&& row.allTimeDuration2==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划3",
          key: "plan3",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan3
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount3>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo3,row.dayTime,row.plan3)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount3==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration3>0&&row.videoCount3==0?'已完成 无视频': row.plan3!=''&&row.allTimeDuration3==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划4",
          key: "plan4",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan4
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount4>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo4,row.dayTime,row.plan4)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount4==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration4>0&&row.videoCount4==0?'已完成 无视频': row.plan4!=''&&row.allTimeDuration4==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划5",
          key: "plan5",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                     row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"": row.plan5
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount5>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo5,row.dayTime,row.plan5)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount5==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration5>0&&row.videoCount5==0?'已完成 无视频': row.plan5=''&&row.allTimeDuration5==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划6",
          key: "plan6",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan6
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount6>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo6,row.dayTime,row.plan6)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount6==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                        row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration6>0&&row.videoCount6==0?'已完成 无视频': row.plan6!=''&&row.allTimeDuration6==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划7",
          key: "plan7",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan7
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount7>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo7,row.dayTime,row.plan7)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount7==null?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration7>0&&row.videoCount7==null?'已完成 无视频': row.plan7!=''&&row.allTimeDuration7==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划8",
          key: "plan8",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan8
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount8>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo8,row.dayTime,row.plan8)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount8==null?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration8>0&&row.videoCount8==null?'已完成 无视频': row.plan8!=''&&row.allTimeDuration8==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划9",
          key: "plan9",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan9
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount9>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo9,row.dayTime,row.plan9)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount9==null?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration9>0&&row.videoCount9==null?'已完成 无视频': row.plan9!=''&&row.allTimeDuration9==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "当日锻炼情况",
          key: "overPlan",
          align: "center",
          type:'html',
          width: 290
        },
      ],
      resultColumns10: [
        {
          title: "日期",
          key: "dayTime",
          align: "center",
          type:'html',
          width: 110
        },
        {
          title: "计划1",
          key: "plan1",
          align: "center",
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      (row.completeStatus=='1' && row.completeType=='2')?"已完成 无视频":row.plan1
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount1>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo1,row.dayTime,row.plan1)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount1==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=='2'?(
                        (row.completeStatus=='1' && row.completeType=='1')?'家长自行布置(已完成作业)':
                        (row.completeStatus=='1' && row.completeType=='2')?'由教师完成':'家长自行布置(未完成作业)'
                        )
                      :(row.completeStatus=='1' && row.completeType=='2')?'由教师完成':row.allTimeDuration1>0&&row.videoCount1==0?'已完成 无视频': row.plan1!=''&&row.allTimeDuration1==0?'未完成作业':''
            )
            ])
          }

        },
        {
          title: "计划2",
          key: "plan2",
          align: "center",
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan2
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount2>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo2,row.dayTime,row.plan2)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount2==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                   row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration2>0&&row.videoCount2==0?'已完成 无视频':row.plan2!=''&& row.allTimeDuration2==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划3",
          key: "plan3",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan3
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount3>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo3,row.dayTime,row.plan3)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount3==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration3>0&&row.videoCount3==0?'已完成 无视频': row.plan3!=''&&row.allTimeDuration3==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划4",
          key: "plan4",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan4
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount4>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo4,row.dayTime,row.plan4)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount4==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration4>0&&row.videoCount4==0?'已完成 无视频': row.plan4!=''&&row.allTimeDuration4==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划5",
          key: "plan5",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                     row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"": row.plan5
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount5>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo5,row.dayTime,row.plan5)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount5==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration5>0&&row.videoCount5==0?'已完成 无视频': row.plan5=''&&row.allTimeDuration5==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划6",
          key: "plan6",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan6
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount6>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo6,row.dayTime,row.plan6)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount6==0?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                        row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration6>0&&row.videoCount6==0?'已完成 无视频': row.plan6!=''&&row.allTimeDuration6==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划7",
          key: "plan7",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan7
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount7>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo7,row.dayTime,row.plan7)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount7==null?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration7>0&&row.videoCount7==null?'已完成 无视频': row.plan7!=''&&row.allTimeDuration7==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划8",
          key: "plan8",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan8
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount8>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo8,row.dayTime,row.plan8)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount8==null?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration8>0&&row.videoCount8==null?'已完成 无视频': row.plan8!=''&&row.allTimeDuration8==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划9",
          key: "plan9",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan9
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount9>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo9,row.dayTime,row.plan9)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount9==null?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration9>0&&row.videoCount9==null?'已完成 无视频': row.plan9!=''&&row.allTimeDuration9==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "计划10",
          key: "plan10",
          align: "center",
          // type:'html',
          width: 205,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.plan10
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount10>0?'':'none',
                          marginTop: '10px',
                          marginBottom: '5px',
                          // width: '80px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                            this.toshowVideo1(row.totailVideo10,row.dayTime,row.plan10)
                          }
                        }
                      },
                      '查看视频'
              ),
              h(
                      'div',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          // marginRight: '5px',
                          display: row.videoCount10==null?'':'none',
                          margin: 'auto',
                          marginTop: '5px',
                          width: '200px',
                          // height: '15px',
                          fontSize: '5px',
                          font: '1px'
                        },
                        on: {
                          click: () => {
                          }
                        }
                      },
                      row.exerciseType=="2"?"":(row.completeStatus=='1' && row.completeType=='2')?"":row.allTimeDuration10>0&&row.videoCount10==null?'已完成 无视频': row.plan10!=''&&row.allTimeDuration10==0?'未完成作业':''
              )
            ])
          }
        },
        {
          title: "当日锻炼情况",
          key: "overPlan",
          align: "center",
          type:'html',
          width: 290
        },
      ],

      
      resultColumnsj: [
        {
          title: '锻炼计划名称',
          key: 'planName',
          align: 'center',
          minWidth:100
        },
        {
          title: '类型',
          key: 'itemOrientationName',
          align: 'center',
          minWidth:100,
        },
        {
          title: '难度',
          key: 'itemLevelName',
          align: 'center',
          minWidth:100,
        },
        {
          title: '锻炼时长(分钟)',
          key: 'runTime',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row
            let time = row.timeDuration==null?0:row.timeDuration;
            const text = (time/1000/60).toFixed(1);
            return h('div', text)
          },
        },
        {
          title: '是否上传视频',
          key: 'resultValue',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row
            const text = row.resultValue != null && row.resultValue !=""?"是":"否";
            return h('div', text)
          },
        },
        {
          title: '锻炼时间',
          key: 'createTime',
          align: 'center',
          minWidth:100,
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
           const row = params.row
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    disabled: row.resultValue != null && row.resultValue != ""  ?false:true
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.toShowVideo(row.resultValue,row.studentName,row.planName)
                    }
                  }
                },
                '查看视频'
              )
            ])
          }
        },
      ],
      resultData: [],
      resultDatasj: [],
      holiday: "",
      holidayTf: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      pageNum1: 1,
      pageSize1: 10,
      total1: 0,
      startTime:"",
      endTime:"",
      startTime1:"",
      endTime1:"",
      completeStatus:"",
      semesterOver:"",
      yearSemester:"",
      completeStatusList:[
        {
          itemId:"",
          itemName:"全部",
        },
        {
          itemId:"1",
          itemName:"已完成",
        },
        {
          itemId:"0",
          itemName:"未完成",
        }
      ],
      upLoadVideo:"",
      upLoadVideoList:[
        {
          itemId:"",
          itemName:"全部",
        },
        {
          itemId:"1",
          itemName:"是",
        },
        {
          itemId:"0",
          itemName:"否",
        }
      ]
    };
  },
  methods: {
    toshowVideo1(videoUrlList,dayTime,planName){
      this.showVideo1 = true;
      this.videoUrlList= videoUrlList.split(',');
      // this.videoUrlList= [1]
      if(videoUrlList.length == 1){
        this.isAuto = true
        };
      this.videoName = planName;
      this.curTime = dayTime.substring(0,10);
    },
     startTimeChange(time){
        this.startTime = time;
     },
     endTimeChange(time){
        this.endTime = time;
     },
     startTimeChange1(time){
        this.startTime1 = time;
     },
     endTimeChange1(time){
        this.endTime1 = time;
     },
     goback(){ //返回
        this.$router.go(-1);
     },
    getStudentInfoList(schoolId) {
      var vm = this;
      vm.loading = true;
      let data = {
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        studentId: vm.studentId,
        completeStatus:vm.completeStatus,
        startTime:vm.startTime,
        endTime:(vm.endTime==""||vm.endTime==null)?"":vm.endTime+' 23:29:25',
        semesterOver:vm.semesterOver,
        yearSemester:vm.semesterOver,

      };
      this.$axios
        .post("/v1/familyexerciseanalyze/queryStudentExerciseByDateAndStudent", data)
        .then(res => {
          vm.loading = false;
          if (res.data.code == 10000) {
            let resultList = res.data.response;
            let maxCount = 0;
            var weekArray = new Array("日", "一", "二", "三", "四", "五", "六");
            if(resultList != null && resultList.length > 0){
                for(let i=0;i<resultList.length;i++){
                    if(resultList[i].planCount > maxCount){
                        maxCount = resultList[i].planCount;
                    }
                    if(resultList[i].dayTime == vm.nowDay){
                       resultList[i].dayTime = resultList[i].dayTime+"</br><font style='color:#00BA8A' >今天</font>"
                    }else{
                      var week = weekArray[new Date(resultList[i].dayTime).getDay()];
                      resultList[i].dayTime = resultList[i].dayTime+"</br>星期"+week
                    }
                    // resultList[i].plan1 = this.getShowString(resultList[i].plan1,resultList[i].allTimeDuration1,resultList[i].videoCount1);
                    // resultList[i].plan2 = this.getShowString(resultList[i].plan2,resultList[i].allTimeDuration2,resultList[i].videoCount2);
                    // resultList[i].plan3 = this.getShowString(resultList[i].plan3,resultList[i].allTimeDuration3,resultList[i].videoCount3);
                    // resultList[i].plan4 = this.getShowString(resultList[i].plan4,resultList[i].allTimeDuration4,resultList[i].videoCount4);
                    // resultList[i].plan5 = this.getShowString(resultList[i].plan5,resultList[i].allTimeDuration5,resultList[i].videoCount5);
                    // resultList[i].plan6 = this.getShowString(resultList[i].plan6,resultList[i].allTimeDuration6,resultList[i].videoCount6);
                    // resultList[i].plan7 = this.getShowString(resultList[i].plan7,resultList[i].allTimeDuration7,resultList[i].videoCount7);
                    // resultList[i].plan8 = this.getShowString(resultList[i].plan8,resultList[i].allTimeDuration8,resultList[i].videoCount8);
                    // resultList[i].plan9 = this.getShowString(resultList[i].plan9,resultList[i].allTimeDuration9,resultList[i].videoCount9);
                    // resultList[i].plan10 = this.getShowString(resultList[i].plan10,resultList[i].allTimeDuration10,resultList[i].videoCount10);
                     let overPlanCount = 0 ;
                     if(resultList[i].allTimeDuration1 != null && resultList[i].allTimeDuration1 > 0){
                        overPlanCount = overPlanCount +1;
                     }
                     if(resultList[i].allTimeDuration2 != null && resultList[i].allTimeDuration2 > 0){
                        overPlanCount = overPlanCount +1;
                     }
                     if(resultList[i].allTimeDuration3 != null && resultList[i].allTimeDuration3 > 0){
                        overPlanCount = overPlanCount +1;
                     }
                     if(resultList[i].allTimeDuration4 != null && resultList[i].allTimeDuration4 > 0){
                        overPlanCount = overPlanCount +1;
                     }
                     if(resultList[i].allTimeDuration5 != null && resultList[i].allTimeDuration5 > 0){
                        overPlanCount = overPlanCount +1;
                     }
                     if(resultList[i].allTimeDuration6 != null && resultList[i].allTimeDuration6 > 0){
                        overPlanCount = overPlanCount +1;
                     }
                     if(resultList[i].allTimeDuration7 != null && resultList[i].allTimeDuration7 > 0){
                        overPlanCount = overPlanCount +1;
                     }
                     if(resultList[i].allTimeDuration8 != null && resultList[i].allTimeDuration8 > 0){
                        overPlanCount = overPlanCount +1;
                     }
                     if(resultList[i].allTimeDuration9 != null && resultList[i].allTimeDuration9 > 0){
                        overPlanCount = overPlanCount +1;
                     }
                     if(resultList[i].allTimeDuration10 != null && resultList[i].allTimeDuration10 > 0){
                        overPlanCount = overPlanCount +1;
                     }
                     if(resultList[i].completeStatus == '1'){
                       if(resultList[i].exerciseType=='1' && resultList[i].completeType=='1'){
                         resultList[i].overPlan='已完成</br>'+resultList[i].planCount+'个计划全部完成'
                       }else{
                        resultList[i].overPlan='已完成</br>'
                       }
                     }else{
                       if(resultList[i].exerciseType=='1' && resultList[i].completeType=='1'){
                          resultList[i].overPlan="<font style='color:#00BA8A' >未完成</font></br>有<font style='color:#00BA8A' >"+(resultList[i].planCount-overPlanCount)+"</font>个计划未完成"
                       }else{
                        resultList[i].overPlan="<font style='color:#00BA8A' >未完成</font></br>"
                       }
                       
                     }
                }
            }
            if(maxCount <= 6){
                vm.resultColumns = vm.resultColumns6;
            }else if(maxCount == 7){
                vm.resultColumns = vm.resultColumns7;
            }else if(maxCount == 8){
                vm.resultColumns = vm.resultColumns8;
            }else if(maxCount == 9){
                vm.resultColumns = vm.resultColumns9;
            }else if(maxCount == 10){
                vm.resultColumns = vm.resultColumns10;
            }

            vm.resultData = resultList;
          } else {
            if (res.data.code > 39999) {
              vm.$Message.info(res.data.msg);
            }
          }
        });
    },
    toShowVideo(resultValueUrl,studentName,planName){
        this.showVideo = true;
        this.videoUrl= resultValueUrl;
        this.videoStudentName=studentName+"--"+planName;
    },
    cancleShowVideo(){
        this.showVideo = false;
        this.videoUrl= "";
        this.videoStudentName= "";
    },
    cancleShowVideo1(){
        this.showVideo1 = false;
        this.videoUrlList = [];
    },
    getShowString(planName,allTimeDuration,videoCount){
        if(planName == "" || planName == null){
          return "";
        }
        let video = "未上传";
        let flishInfo="<font style='color:#00C693;' >未完成作业</font>"
        if(videoCount > 0){
            video = "已经上传";
        }
        if(planName != "" && planName != null && allTimeDuration !=null && allTimeDuration > 0 ){
            let duration = allTimeDuration/1000/60;
            if(videoCount == 0){
              flishInfo="<font>"+"已完成&nbsp;&nbsp;&nbsp;"+"无视频</font>"
            }else {
              flishInfo="<Button style='color:#00C693;' @click='showVideo1()'  type='success'>查看视频</Button>"
            }
            // flishInfo="<font>"+duration.toFixed(2)+"分钟&nbsp;&nbsp;&nbsp;"+videoCount+"个视频</font>"
        }

        return  "<div style='margin-top:8px;margin-bottom:5px;width:175px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;' >"+planName+"</div>"+
              "<div style='margin-bottom:8px;width:175px;'>"+flishInfo+"</div>";
    },
    countStudentList(schoolId) {
      var vm = this;
      let data = {
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        studentId: vm.studentId,
        completeStatus:vm.completeStatus,
        startTime:vm.startTime,
        endTime:(vm.endTime==""||vm.endTime==null)?"":vm.endTime+' 23:29:25',
        semesterOver:vm.semesterOver,
        yearSemester:vm.semesterOver
      };
      this.$axios
        .post("/v1/familyexerciseanalyze/queryStudentExerciseByDateAndStudentCount", data)
        .then(res => {
          if (res.data.code == 10000) {
            this.total = res.data.response;
          } else {
            if (res.data.code > 39999) {
              this.$Message.info(res.data.msg);
            }
          }
        });
    },
    getStudentInfoListHoliday(schoolId) {
      var vm = this
      vm.loading=true;
      let date={
        pageNo: vm.pageNum1,
        pageSize: vm.pageSize1,
        dateStart:vm.startTime1,
        dateEnd: (vm.endTime1=="" || vm.endTime1==null)?"":vm.endTime1+' 23:29:25',
        studentId:vm.studentId,
        upLoadVideo:vm.upLoadVideo,
        semesterOver:vm.semesterOver,
        yearSemester:vm.semesterOver
      }
      this.$axios.post('/v1/exercise/family/querySchoolStudentExerciseResultHis',date).then(res => {
        vm.loading=false;
        if (res.data.code == 10000) {
          vm.resultDatasj = res.data.response
        } else {
          if (res.data.code > 39999) {
          vm.$Message.info(res.data.msg)
          }
        }
      })
    },
    countStudentListHoliday(schoolId) {
      var vm = this;
      let date={
        pageNo: vm.pageNum1,
        pageSize: vm.pageSize1,
        dateStart:vm.startTime1,
        dateEnd: (vm.endTime1=="" || vm.endTime1==null)?"":vm.endTime1+' 23:29:25',
        studentId:vm.studentId,
        upLoadVideo:vm.upLoadVideo,
        semesterOver:vm.semesterOver,
        yearSemester:vm.semesterOver
      }
      this.$axios.post('/v1/exercise/family/querySchoolStudentExerciseResultHisCount',date).then(res => {
        if (res.data.code == 10000) {
          this.total1 = res.data.response
        } else {
          if (res.data.code > 39999) {
          this.$Message.info(res.data.msg)
          }
        }
      })
    },
    querySearch() {
      this.pageNum = 1;
      this.search();
    },
    querySearch1() {
      this.pageNum1 = 1;
      this.search1();
    },
    search() {
      var vm = this;
      let schoolId = vm.schoolId;
      vm.getStudentInfoList(schoolId);
      vm.countStudentList(schoolId);
    },
     search1() {
      var vm = this;
      let schoolId = vm.schoolId;
      vm.getStudentInfoListHoliday(schoolId);
      vm.countStudentListHoliday(schoolId);
    },
    pageNumChange(value) {
      //页码改变方法处理
      if (this.pageNum != value) {
        this.pageNum = value;
        this.search();
      }
    },
    pageSizechange(value) {
      //页面大小改变方法处理
      if (this.pageSize != value) {
        this.pageNum = 1;
        this.pageSize = value;
        this.search();
      }
    },
    pageNumChange1(value) {
      //页码改变方法处理
      if (this.pageNum1 != value) {
        this.pageNum1 = value;
        this.search1();
      }
    },
    pageSizechange1(value) {
      //页面大小改变方法处理
      if (this.pageSize1 != value) {
        this.pageNum1 = 1;
        this.pageSize1 = value;
        this.search1();
      }
    }
  },
  watch: {
  },
  created() {
    //  this.getProvinceList();
  },
  mounted() {
    //    0 未知类型 1 幼儿园 2小学 3初中 4高中5大学
    var vm = this;
    vm.resultColumns = vm.resultColumns6;
    let schoolId = sessionStorage.getItem("schoolId");
    vm.schoolId = schoolId;
    let schoolType = sessionStorage.getItem("schoolType");
    vm.schoolType = schoolType;
    vm.studentId =  sessionStorage.getItem('exerciseManageStudent-exerciseManageStudentDetail-studentId');
    vm.studentName =  sessionStorage.getItem('exerciseManageStudent-exerciseManageStudentDetail-studentName');
    vm.registerCode =  sessionStorage.getItem('exerciseManageStudent-exerciseManageStudentDetail-registerCode');

    vm.yearSemester =  sessionStorage.getItem('exerciseManageStudent-exerciseManageStudentDetail-yearSemester');
    vm.semesterOver =  sessionStorage.getItem('exerciseManageStudent-exerciseManageStudentDetail-semesterOver');

    let date=new Date;
    var mon = date.getMonth() + 1;
    var day = date.getDate();
    var nowDay = date.getFullYear() + "-" + (mon<10?"0"+mon:mon) + "-" +(day<10?"0"+day:day);
    vm.nowDay = nowDay;
    vm.search();
    vm.search1();
  }
};
</script>
