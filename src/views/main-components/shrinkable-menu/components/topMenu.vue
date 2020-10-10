<template>
  <div>
    <Menu
      ref="topMenu"
      mode="horizontal"
      :theme="theme1"
      :active-name="$route.name"
      @on-select="changeMenu"
    >
      <MenuItem
        v-for="(item,index) in menuList"
        :name="item.parentCode+'-'+item.name"
        :key="index+item"
        :id="item.name"
      >
        <Icon :type="item.parentIcon" size="26" style="vertical-align:middle"/>
        <span>{{item.parentName || item.name}}</span>
      </MenuItem>
    </Menu>
  </div>
</template>
<script>
export default {
  name: "topMenu",
  props: {
    menuList: Array,
    theme1: String
  },
  methods: {
    changeMenu(active) {
      let _this= this;
      active = active == null ? `${this.$store.state.app.menuList[0].parentCode}-${this.$store.state.app.menuList[0].name}` : active;
      sessionStorage.setItem('selectedName',active)
      _this.$store.commit("setStateName",active);
      let active1= active.split("-")[0];
      let active2= active.split("-")[1];
      _this.$store.commit("modifyMnueList",active1);
      // if(_this.$store.state.app.menuList.length == 1){
        _this.$emit('on-change', active2)
      // }
      let elementArr = _this.siblings(document.getElementById(active2));
      if(elementArr){
        for (let val of elementArr) {val.className = "ivu-menu-item";}
      }
      if(document.getElementById(active2)){
        document.getElementById(active2).className ="ivu-menu-item ivu-menu-item-active ivu-menu-item-selected";
      }
      this.$emit('on-click', this.$store.state.app.menuList.length>0?this.$store.state.app.menuList[0].children[0].name : this.$store.state.app.menuListAll[0].children[0].name)
    },
    changmenuColor(name) {
      
      if (name == "") return;
      let elementArr = this.siblings(document.getElementById(name));
      if(elementArr){
        for (let val of elementArr) {val.className = "ivu-menu-item";}
        document.getElementById(name).className ="ivu-menu-item ivu-menu-item-active ivu-menu-item-selected";
      }
    },
    siblings(elm) {
      if(!elm){return}
      var a = [];
      var p = elm.parentNode.children;
      for (var i = 0, pl = p.length; i < pl; i++) {
        if (p[i] !== elm) a.push(p[i]);
      }
      return a;
    },
  },
  created() {},
  mounted() {
    this.changeMenu(sessionStorage.getItem('selectedName') == '-' ? `${this.$store.state.app.nameData}-${this.$store.state.app.name}` : sessionStorage.getItem('selectedName'))
    this.changmenuColor(sessionStorage.getItem('selectedName') == '-' ? this.$store.state.app.name : sessionStorage.getItem('selectedName').split("-")[1]);
  },
  updated() {
    this.$nextTick(() => {
      if (this.$refs.topMenu) {
        this.changmenuColor(sessionStorage.getItem('selectedName') == null ? this.$store.state.app.menuList[0].name : sessionStorage.getItem('selectedName').split("-")[1]);
        this.$refs.topMenu.updateOpened();
      }
    });
  }
};
</script>


