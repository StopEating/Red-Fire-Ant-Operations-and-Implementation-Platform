import { createRouter, createWebHistory,createWebHashHistory, RouteRecordRaw } from 'vue-router'
import login from '../views/login.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'login',
    component: login,
  },
  {
    path: '/index',
    name: 'index',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/index.vue'),
    children:[
      {
        path: '/projectdetail/projectdata',
        name: '项目数据地图',
        component: () => import(/* webpackChunkName: "about" */ '../views/projectlist/projectdetail/ProjectData.vue'),
         // 路由独享守卫
        beforeEnter: (to, from) => {
          to.meta.isKeepAlive =  (to.name==='项目数据地图' && from.name=='监测')|| (to.name==='项目数据地图' && from.name=='防控')||(to.name==='项目数据地图' && from.name=='回防')||(to.name==='项目数据地图' && from.name=='评估')? true : false
        },

      },
      {
        path: '/projectdetail/jdatamap',
        name: '监测数据地图',
        component: () => import(/* webpackChunkName: "about" */ '../views/projectlist/projectdetail/JDataMap.vue'),
      },
      {
        path: '/projectdetail/jtypemap',
        name: '监测生境统计图',
        component: () => import(/* webpackChunkName: "about" */ '../views/projectlist/projectdetail/JTypeMap.vue'),
      },
      {
        path: '/projectdetail/jpointmap',
        name: '监测样点统计图',
        component: () => import(/* webpackChunkName: "about" */ '../views/projectlist/projectdetail/JPointMap.vue'),
      },
      {
        path: '/projectdetail/fdatamap',
        name: '防控数据地图',
        component: () => import(/* webpackChunkName: "about" */ '../views/projectlist/projectdetail/FDataMap.vue'),
      },
      {
        path: '/projectdetail/zdatamap',
        name: '装置数据地图',
        component: () => import(/* webpackChunkName: "about" */ '../views/projectlist/projectdetail/ZDataMap.vue'),
      },
      {
        path: '/projectdetail/fworkline',
        name: '防控工作轨迹',
        component: () => import(/* webpackChunkName: "about" */ '../views/projectlist/projectdetail/FWorkLine.vue'),
      },
      {
        path: '/projectdetail/jworkline',
        name: '监测工作轨迹',
        component: () => import(/* webpackChunkName: "about" */ '../views/projectlist/projectdetail/JWorkLine.vue'),
      },
      {
        path: '/datas/farea',
        name: '防控面积汇总',
        component: () => import(/* webpackChunkName: "about" */ '../views/datas/FArea.vue'),
      },
      {
        path: '/datas/fsarea',
        name: '防控面积按生境汇总',
        component: () => import(/* webpackChunkName: "about" */ '../views/datas/FSarea.vue'),
      },
      {
        path: '/datas/jarea',
        name: '监测面积汇总',
        component: () => import(/* webpackChunkName: "about" */ '../views/datas/JArea.vue'),
      },{
        path: '/datas/yfarea',
        name: '样区防控面积统计',
        component: () => import(/* webpackChunkName: "about" */ '../views/datas/YFarea.vue'),
      },{
        path: '/datas/fkdatas',
        name: '防控区数据',
        component: () => import(/* webpackChunkName: "about" */ '../views/datas/fkdatas.vue'),
      },{
        path: '/datas/ydatas',
        name: '样区数据',
        component: () => import(/* webpackChunkName: "about" */ '../views/datas/ydatas.vue'),
      },{
        path: '/datas/jcpointdatas',
        name: '监测点数据',
        component: () => import(/* webpackChunkName: "about" */ '../views/datas/jcpointdatas.vue'),
      },{
        path: '/datas/fkpointdatas',
        name: '防控点数据',
        component: () => import(/* webpackChunkName: "about" */ '../views/datas/fkpointdatas.vue'),
      },
      
      {
        path: '/membermanage',
        name: '成员管理',
        component: () => import(/* webpackChunkName: "about" */ '../views/projectlist/MemberManage.vue'),
      },
      {
        path: '/operatingunit/additem',
        name: '新增项目',
        component: () => import(/* webpackChunkName: "about" */ '../views/operatingunit/AddItem.vue'),
      },
      {
        path: '/operatingunit/modifyitem',
        name: '修改项目',
        component: () => import(/* webpackChunkName: "about" */ '../views/operatingunit/ModifyItem.vue'),
      },
      {
        path: '/projectlist',
        name: '项目列表',
        component: () => import(/* webpackChunkName: "about" */ '../views/projectlist/ProjectList.vue'),
      },
      {
        path: '/projectdetail',
        name: '项目详情',
        component: () => import(/* webpackChunkName: "about" */ '../views/projectlist/ProjectDetail.vue'),
      },
      {
        path: '/alterpwd',
        name: '修改密码',
        component: () => import(/* webpackChunkName: "about" */ '../views/member/AlterPwd.vue'),
      },
      // 项目数据详情
      {
        path: '/datadetail/fdata',
        name: '防控',
        component: () => import(/* webpackChunkName: "about" */ '../views/datadetail/FData.vue'),
      },
      {
        path: '/datadetail/jdata',
        name: '监测',
        component: () => import(/* webpackChunkName: "about" */ '../views/datadetail/JData.vue'),
        meta:{
          keepAlive: true //此页面需要缓存
        }
      },
      {
        path: '/datadetail/hdata',
        name: '回防',
        component: () => import(/* webpackChunkName: "about" */ '../views/datadetail/HData.vue'),
      },
      {
        path: '/datadetail/pdata',
        name: '评估',
        component: () => import(/* webpackChunkName: "about" */ '../views/datadetail/PData.vue'),
      },
      {
        path: '/map/refarea',
        name: '防控区边界管理',
        component: () => import(/* webpackChunkName: "about" */ '../views/map/ReFarea.vue'),
      },
      {
        path: '/map/reyarea',
        name: '样区边界管理',
        component: () => import(/* webpackChunkName: "about" */ '../views/map/ReYarea.vue'),
      },
      // 卫星地图
      {
        path: '/wmap/wfdatamap',
        name: '卫星防控数据地图',
        component: () => import(/* webpackChunkName: "about" */ '../views/wmap/WfDatamap.vue'),
      }, {
        path: '/wmap/wfworkline',
        name: '卫星防控工作轨迹图',
        component: () => import(/* webpackChunkName: "about" */ '../views/wmap/WfWorkline.vue'),
      }, {
        path: '/wmap/wjdatamap',
        name: '卫星监测数据地图',
        component: () => import(/* webpackChunkName: "about" */ '../views/wmap/WjDatamap.vue'),
      }, {
        path: '/wmap/wjworkline',
        name: '卫星监测工作轨迹图',
        component: () => import(/* webpackChunkName: "about" */ '../views/wmap/WjWorkline.vue'),
      }, {
        path: '/wmap/wzdatamap',
        name: '卫星装置数据图',
        component: () => import(/* webpackChunkName: "about" */ '../views/wmap/WzDatamap.vue'),
      },
    ]
  },
  {
    path: '/map/gjmap',
    name: '防控轨迹图',
    component: () => import(/* webpackChunkName: "about" */ '../views/map/GjMap.vue'),
  },{
    path: '/wmap/wgjmap',
    name: '卫星防控轨迹图',
    component: () => import(/* webpackChunkName: "about" */ '../views/wmap/WgjMap.vue'),
  }
 
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

export default router
