

<template>
    <Menu ref="sideMenu" :active-name="$route.name" :open-names="openNames" :theme="menuTheme" width="auto" @on-select="changeMenu">
        <template v-for="(item, index) in menuList">
            <MenuItem class="menu_line_top" :id="item.children[0].name" v-if="item.children.length<=0 || item.name == 'indexManage'" :name="item.children[0].name" :key="index">
                <Icon :type="item.icon"  :size="iconSize" :key="item.path"></Icon>
                <span class="layout-text" :key="item.path">{{ itemTitle(item) }}</span>
            </MenuItem>
            <Submenu v-if="item.children.length > 0 && item.name != 'indexManage'" :name="item.name" :key="item.path">
                <template slot="title">
                    <Icon :type="item.icon" size="20"></Icon>
                    <span class="layout-text">{{ itemTitle(item) }}</span>
                </template>
                <template v-for="(child, jindex) in item.children">
                    <MenuItem :id="child.name" :name="child.name" :key="child.name + jindex">
                        <Icon :type="child.icon" :size="iconSize" :key="child.name + jindex"></Icon>
                        <span class="layout-text" :key="jindex">{{ child.title }}</span>
                    </MenuItem>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>
<style lang="less">
    @import '../styles/menu.less';
</style>

<script>
export default {
    name: 'sidebarMenu',
    props: {
        menuList: Array,
        iconSize: Number,
        menuTheme: {
            type: String,
            default: 'dark'
        },
        openNames: {
            type: Array
        }
    },
    methods: {
        changeMenu (active) {
            this.$emit('on-change', active)
        },
        
        itemTitle (item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n);
            } else {
                return item.title;
            }
        }
    },
    created(){
    },
    updated () {
        this.$nextTick(() => {
            if (this.$refs.sideMenu) {
                this.$refs.sideMenu.updateOpened();
            }
        });
    }
};
</script>
