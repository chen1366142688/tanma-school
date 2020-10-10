<template>
    <div>
        <div>
            <h1>轮播图管理</h1>
        </div>
        <div style="margin-top:15px;">
            <Card>
                <div class="top-search">
                    <div class="left-input">
                        <div style="margin:5px 20px;">
                            <span>跳转状态：</span>
                            <Select v-model="herfStatus" size="small" style="width:120px;">
                                <Option v-for="item in herfList" :value="item.status" :key="item.status">{{ item.lable }}</Option>
                            </Select>
                        </div>
                        <div style="margin:5px 20px;">
                            <span>类型：</span>
                            <Select v-model="bannerType" size="small" style="width:120px;">
                                <Option v-for="item in bannerTypeList" :value="item.type" :key="item.type">{{ item.name }}</Option>
                            </Select>
                        </div>
                        <div style="margin:5px 20px;">
                            <span>名称：</span>
                            <Input v-model="bannerName" size="small" placeholder="轮播图名称" style="width:160px;"></Input>
                        </div>
                    </div>
                    <div class="right-btns">
                        <Button type="success" @click="querySearch">查询</Button>
                        <Button type="success" @click="restore">重置查询条件</Button>
                        <Button type="success" @click="addBanner">新增轮播图</Button>
                    </div>
                </div>
            </Card>
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
        <Modal v-model="modal1" title="温馨提示" @on-ok="deleteThis" @on-cancel="cancel">
            <p>是否删除该轮播图？</p>
        </Modal>
    </div>
</template>

<script>
export default {
  name: 'schoolList',
  data() {
    return {
      modal1: false,
      loading: false,
      bannerId: '',
      schoolId: '',
      herfStatus: '',
      herfList: [
        {
          status: '1',
          lable: '跳转'
        },
        {
          status: '2',
          lable: '不跳转'
        }
      ],
      bannerType: '',
      bannerTypeList: [
        {
          type: '1',
          name: '宣传图'
        },
        {
          type: '2',
          name: '广告'
        }
      ],
      bannerName: '',
      resultColumns: [
        {
          title: '名称',
          key: 'bannerName',
          align: 'center',
          minWidth:100
        },
        {
          title: '跳转状态',
          key: 'herfStatus',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row
            const text = row.herfStatus == '1' ? '跳转' : '不跳转'
            return h('div', text)
          }
        },
        {
          title: '类型',
          key: 'bannerType',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row
            const text = row.bannerType == '1' ? '宣传图' : '广告'
            return h('div', text)
          }
        },
        {
          title: '排序',
          key: 'bannerSort',
          align: 'center',
          minWidth:100
        },
        {
          title: '图片',
          key: 'bannerSort',
          align: 'center',
          minWidth:100,
           render: (h, params) => {
            const row = params.row
            const text =row.imgUrl
            return h(
              'img',{
                attrs:{
                  src:text,
                },
                style:{
                  width:'40px',
                  height:'30px'
                }
              }
            )
          }
        },
        {
          title: '启用状态',
          key: 'enableStatus',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row
            const color = row.enableStatus == '1' ? 'green' : 'gray'
            const text = row.enableStatus == '1' ? '已启用' : '未启用'
            return h(
              'Tag',
              {
                props: {
                  type: 'dot',
                  color: color
                }
              },
              text
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              row.enableStatus == '1'
                ? h(
                    'Button',
                    {
                      props: {
                        type: 'warning'
                      },
                      style: {
                        marginRight: '10px'
                      },
                      on: {
                        click: () => {
                          this.updateEnableStatus(row.bannerId, '2')
                        }
                      }
                    },
                    '关闭'
                  )
                : h(
                    'Button',
                    {
                      props: {
                        type: 'success'
                      },
                      style: {
                        marginRight: '10px'
                      },
                      on: {
                        click: () => {
                          this.updateEnableStatus(row.bannerId, '1')
                        }
                      }
                    },
                    '启用'
                  ),
              h(
                'Button',
                {
                  props: {
                    type: 'success'
                  },
                  style: {
                    marginRight: '10px'
                  },
                  on: {
                    click: () => {
                      this.toDetail(row.bannerId)
                    }
                  }
                },
                '详情'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error'
                  },
                  style: {},
                  on: {
                    click: () => {
                      this.deleteWarning(row.bannerId)
                    }
                  }
                },
                '删除'
              )
            ])
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
    updateEnableStatus(bannerId, status) {
      let vm = this
      this.$axios
        .get(
          '/v1/banner/updateEnableStatus?bannerId=' +
            bannerId +
            '&enableStatus=' +
            status
        )
        .then(res => {
          if (res.data.code == 10000) {
            vm.$Message.info('操作成功！')
            vm.search()
          } else {
            if (res.data.code > 39999) {
              vm.$Message.info(res.data.msg)
            }
          }
        })
    },
    getBaseListBySchoolId(schoolId) {
      var vm = this
      vm.loading = true
      let data = {
        bannerName: vm.bannerName,
        bannerType: vm.bannerType,
        herfStatus: vm.herfStatus,
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        schoolId: schoolId
      }
      this.$axios.post('/v1/banner/getBaseListBySchoolId', data).then(res => {
        vm.loading = false
        if (res.data.code == 10000) {
          vm.resultData = res.data.response
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg)
          }
        }
      })
    },
    countBaseListBySchoolId(schoolId) {
      var vm = this
      let data = {
        bannerName: vm.bannerName,
        bannerType: vm.bannerType,
        herfStatus: vm.herfStatus,
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        schoolId: schoolId
      }
      this.$axios.post('/v1/banner/countBaseListBySchoolId', data).then(res => {
        if (res.data.code == 10000) {
          this.total = res.data.response
        } else {
          if (res.data.code > 39999) {
            this.$Message.info(res.data.msg)
          }
        }
      })
    },
    querySearch() {
      this.pageNum = 1
      this.pageNo = 1
      this.search()
    },
    search() {
      var vm = this
      let schoolId = vm.schoolId
      vm.getBaseListBySchoolId(schoolId)
      vm.countBaseListBySchoolId(schoolId)
    },
    restore() {
      var vm = this
      vm.bannerName = ''
      vm.pageNo = 1
      vm.pageSize = 10
      vm.bannerType = ''
      vm.herfStatus = ''
      vm.querySearch()
    },
    deleteWarning(bannerId) {
      var vm = this
      vm.modal1 = true
      vm.bannerId = bannerId
    },
    deleteThis() {
      var vm = this
      this.$axios
        .get('/v1/banner/updateInfoStatus?bannerId=' + vm.bannerId)
        .then(res => {
          if (res.data.code == 10000) {
            vm.$Message.info('操作成功！')
            vm.bannerId = ''
            vm.search()
          } else {
            if (res.data.code > 39999) {
              this.$Message.info(res.data.msg)
            }
          }
        })
    },
    cancel() {
      // this.$Message.info('Clicked cancel');
    },
    pageNumChange(value) {
      //页码改变方法处理
      if (this.pageNum != value) {
        this.pageNum = value
        this.search()
      }
    },
    pageSizechange(value) {
      //页面大小改变方法处理
      if (this.pageSize != value) {
        this.pageSize = value
        this.pageNum = 1;
        this.querySearch()
      }
    },
    toDetail(bannerId) {
      var vm = this
      sessionStorage.setItem('baseConfig-bannerManage-bannerId', bannerId)
      this.$router.push({ name: 'bannerDetail' })
    },
    addBanner() {
      var vm = this
      sessionStorage.removeItem('baseConfig-bannerManage-bannerId')
      this.$router.push({ name: 'bannerDetail' })
    }
  },
  watch: {},
  created() {},
  mounted() {
    var vm = this
    let schoolId = sessionStorage.getItem('schoolId')
    vm.schoolId = schoolId
    vm.getBaseListBySchoolId(sessionStorage.getItem('schoolId'))
    vm.countBaseListBySchoolId(sessionStorage.getItem('schoolId'))
  }
}
</script>