import {otherRouter, appRouter} from '@/router/router';

const app = {
    state: {
        menuList: [],
        menuListAll: [],
        name: '',
        nameData: '',
        routers: [
            otherRouter,
            ...appRouter
        ]
    },
    mutations: {
        updateMenulist (state) {
            // 获取当前所有路由
            sessionStorage.setItem('scholl-appRouter', JSON.stringify(appRouter));
            let appRouterTemp = null;
            let schollAppRouter = sessionStorage.getItem('scholl-appRouter');
            let menuListSession = sessionStorage.getItem('menuList');
            if (schollAppRouter) {
                appRouterTemp = JSON.parse(schollAppRouter);
            } else {
                appRouterTemp = appRouter;
            }
            // 当前账号的权限菜单列表
            let menuListRes = [];
            if (menuListSession) {
                menuListRes = menuListSession.split(',');
            }
            // 如果权限菜单长度大于零
            var data = new Map();
            if (menuListRes !== null && menuListRes.length > 0) {
                for (let val of menuListRes) { data.set(val, 1); }
            }
            // 循环所有菜单,name不包含在权限菜单中的数据直接删除
            for (let i = 0; i < appRouterTemp.length; i++) {
                if (data.get(appRouterTemp[i].name) != 1) {
                    appRouterTemp.splice(i, 1);
                    i--;
                } else {
                    for (let j = 0; j < appRouterTemp[i].children.length; j++) {
                        if (data.get(appRouterTemp[i].children[j].name) != 1) {
                            appRouterTemp[i].children.splice(j, 1);
                            j--;
                        }
                    }
                    if (appRouterTemp[i].children.length === 0) {
                        appRouterTemp.splice(i, 1);
                        i--;
                    }
                }
            }
            // 获取到匹配好的第一个对象
            let [first] = appRouterTemp;
            sessionStorage.setItem('first', JSON.stringify(first));
            state.menuListAll = appRouterTemp;
        },
        modifyMnueList (state, active) {
            let newArr = state.menuListAll.some((item) => { return item.parentCode == active; });
            let first = sessionStorage.getItem('first') ? JSON.parse(sessionStorage.getItem('first')) : {};
            if (!newArr) { active = first.parentCode; }
            state.menuList = [...state.menuListAll].filter((val, index, arr) => {
                return val.parentCode == active;
            });
        },
        setStateName (state, name) {
            let first = sessionStorage.getItem('first') ? JSON.parse(sessionStorage.getItem('first')) : {};
            state.name = name ? name.split('-')[1] : first.name;
            state.nameData = name ? name.split('-')[0] : first.parentCode;
        }
    }
};

export default app;
