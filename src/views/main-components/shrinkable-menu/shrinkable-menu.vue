<style lang="less">
    @import './styles/menu.less';
</style>

<template>
    <div :style="{background: bgColor}" class="ivu-shrinkable-menu">
        <slot name="top"></slot>
        <sidebar-menu 
            ref="sidebarMenuBut"
            v-show="!shrink"
            :menu-theme="theme" 
            :menu-list="menuList" 
            :open-names="openNames"
            @on-change="handleChange"
        ></sidebar-menu>
        <sidebar-menu-shrink 
            v-show="shrink"
            :menu-theme="theme" 
            :menu-list="menuList" 
            :icon-color="shrinkIconColor"
            @on-change="handleChange"
        ></sidebar-menu-shrink>
    </div>
</template>

<script>
import sidebarMenu from './components/sidebarMenu.vue';
import sidebarMenuShrink from './components/sidebarMenuShrink.vue';
import util from '@/libs/util';
export default {
    name: 'shrinkableMenu',
    components: {
        sidebarMenu,
        sidebarMenuShrink
    },
    props: {
        shrink: {
            type: Boolean,
            default: false
        },
        menuList: {
            type: Array,
            required: true
        },
        theme: {
            type: String,
            default: 'dark',
            validator (val) {
                return util.oneOf(val, ['dark', 'light']);
            }
        },
        beforePush: {
            type: Function
        },
        openNames: {
            type: Array
        }
    },
    computed: {
        bgColor () {
            return this.theme === '#00BA8A';
        },
        shrinkIconColor () {
            return this.theme === 'dark' ? '#00BA8A' : '#00C693';
        }
    },
    mounted(){
    },
    methods: {
        handleChange (name) {
          let _this = this;
          if(sessionStorage.getItem('activeName') != null && sessionStorage.getItem('activeName') != ''){
              if(document.getElementById(sessionStorage.getItem('activeName')) && document.getElementById(sessionStorage.getItem('activeName')).parentNode && document.getElementById(sessionStorage.getItem('activeName')).parentNode.parentNode){
                  document.getElementById(sessionStorage.getItem('activeName')).parentNode.parentNode.className = 'ivu-menu-submenu';
                  let elementArr = _this.siblings(document.getElementById(sessionStorage.getItem('activeName')));
                    for (let vals of elementArr) { vals.className = "ivu-menu-item"; }
                    document.getElementById(sessionStorage.getItem('activeName')).className = "ivu-menu-item";
              }
              
          }
          
          sessionStorage.setItem('activeName',name)
            let willpush = true;
            if (this.beforePush !== undefined) {
                if (!this.beforePush(name)) {
                    willpush = false;
                }
            }
            if (willpush) {
                this.$router.push({
                    name: name
                });
            }
            setTimeout(()=>{
              document.getElementById(name).parentNode.parentNode.className = 'ivu-menu-submenu ivu-menu-item-active ivu-menu-opened'
              let elementArr = _this.siblings(document.getElementById(name));
              for (let val of elementArr) {val.className = "ivu-menu-item";}
              document.getElementById(name).className ="ivu-menu-item ivu-menu-item-active ivu-menu-item-selected";
            },100)
            // this.$emit('on-change', name);
            // this.$refs.sidebarMenuBut.changeMenu(name);
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
    }
};
</script>
