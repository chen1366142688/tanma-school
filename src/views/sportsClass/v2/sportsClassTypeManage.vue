<template>
  <div>
    <div>
      <h1>体育类型管理</h1>
    </div>
    <div style="margin-top:15px;">
      <Card style="height: 80px;">
        <div style="margin-top: 15px;margin-left:20px;">
          <span >体育类型：</span>
          <Input v-model="typeName"  placeholder="请输入类型" style="width: 240px;" />
          <Button type="success" style="margin-left:40px;" @click="querySearch">查询</Button>
           <Button type="success" style="margin-right:40px;float:right" @click="addNewType">新增体育类型</Button>
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
    <Modal v-model="modal1" title="新增/修改" :mask-closable="false" @on-ok="upsertSportsClassType">
            <span >类型名称：</span>
          <Input v-model="sportsClassTypeName"  placeholder="请输入类型名称" style="width: 240px;" />
        </Modal>
  </div>
</template>

<script>
export default {
  name: 'schoolList',
  data() {
    return {
      loading:false,
      modal1:false,
      schoolId: '',
      typeName:'',
      sportsClassTypeId:'',
      sportsClassTypeName:'',
      resultColumns: [
          {
          title: '体育类型',
          key: 'sportsClassTypeName',
          align: 'center'
          //   minWidth: 250
        },
        {
          title: '创建老师',
          key: 'teacherName',
          align: 'center'
          //   width: 150
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center',
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
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
                      this.updateName(params.row.sportsClassTypeId)
                    }
                  }
                },
                "修改"
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
    getSportsTypeList() {
      var vm = this
      vm.loading=true;
      let data = {
        "pageNo": vm.pageNum,
        "pageSize": vm.pageSize,
        "sportsClassTypeName":vm.typeName
        }
      this.$axios.post('/v1/sports/class/getSportsTypeList', data).then(res => {
        vm.loading=false;
        if (res.data.code == 10000) {
          vm.resultData = res.data.response
        } else {
          if (res.data.code > 39999) {
          vm.$Message.info(res.data.msg)
          }
        }
      })
    },
    querySearch(){
      this.pageNum = 1;
      this.pageNo = 1
      this.search();
    },
    search() {
      var vm = this
      vm.getSportsTypeList()
      vm.countSportsTypeList()
    },
    countSportsTypeList() {
      var vm = this
      let data = {
        "pageNo": vm.pageNum,
        "pageSize": vm.pageSize,
        "sportsClassTypeName":vm.typeName
        }
      this.$axios.post('/v1/sports/class/countSportsTypeList', data).then(res => {
        if (res.data.code == 10000) {
          this.total = res.data.response
        } else {
          if (res.data.code > 39999) {
          this.$Message.info(res.data.msg)
          }
        }
      })
    },
    updateName(sportsClassTypeId){
        var vm=this;
        vm.sportsClassTypeId=sportsClassTypeId;
        for(var i=0;i<vm.resultData.length;i++){
            if(vm.resultData[i].sportsClassTypeId=vm.sportsClassTypeId){
                vm.sportsClassTypeName=vm.resultData[i].sportsClassTypeName
            }
        }
        vm.modal1=true;
    },
    addNewType(){
        var vm=this;
        vm.sportsClassTypeId='';
        vm.sportsClassTypeName='';
        vm.modal1=true;

    },
    upsertSportsClassType() {
      //编辑时获取场馆数据
      // this.pageTitle = '学校编辑'
      var vm=this;
      if(!vm.sportsClassTypeName){
          vm.$Message.info("请填写体育类型");
          return;
      }
      this.$axios
        .get('/v1/sports/class/upsertSportsClassType?typeId='+vm.sportsClassTypeId+'&typeName=' +vm.sportsClassTypeName )
        .then(res => {
          if (res.data.code == 10000) {
            // console.log(res)
            if(res.data.response.code=="1"){
                this.$Message.info("操作成功")
            }
            vm.search();
          } else {
            if (res.data.code > 39999) {
            this.$Message.info(res.data.msg)
            }
          }
        })
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
        this.search()
      }
    },
  },
  watch: {
  },
  created() {
    //  this.getProvinceList();
  },
  mounted() {
    //    0 未知类型 1 幼儿园 2小学 3初中 4高中5大学
    var vm = this
    
    let schoolId = sessionStorage.getItem('schoolId')
    vm.schoolId = schoolId
    vm.search()
  }
}
</script>