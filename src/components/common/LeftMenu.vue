<template>
  <div class="leftmenu">
   
    <el-menu
    class="el-menu-vertical-demo"
    default-active="2"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
    @select="selectItem"
  >
  <div class="logobox">
     <img class="logoimg" src="../../assets/img/logo.png" alt="肇庆市红火蚁防控单位管理系统">
    </div>
<template v-for="menu in allmenu" :key="menu.menuid"> 
  <!-- 有二级及以下标题 -->
  <el-sub-menu v-if="menu.menus!==null" :index="menu.menuid">
   <template #title >
        <!-- 有二级的一级 -->
            <i v-html="menu.icon"></i>
            <span :index="menu.url">{{menu.menuname}}</span>
    </template>
          <template v-for="submenu in menu.menus" :key="submenu.menuid">
            <!-- 二级 -->
            <template v-if="submenu.menus==null">
              <el-menu-item :index="submenu.url" class="items">{{submenu.menuname}}</el-menu-item>
            </template>
            
            <!-- 三级 -->
         <template v-else>
          <el-sub-menu :index="submenu.menuid">
            <template #title><span>{{submenu.menuname}}</span></template>
            <el-menu-item :index="chmenu.url" v-for="chmenu in submenu.menus" :key="chmenu.menuid">{{chmenu.menuname}}
            </el-menu-item>
          </el-sub-menu>
         </template>

         </template>
  </el-sub-menu>

  <!-- 无二级标题 -->
  <el-menu-item  v-else :index="menu.url" >
    <component :is="menu.icon" style="width: 16px; height:16px;margin-right: 10px;"/>
    
          <template #title>
            
            <span>{{menu.menuname}}</span>
          </template>
 </el-menu-item>
</template>
  </el-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref,onMounted} from 'vue';
import { useRouter } from 'vue-router';
import emitter from '../../untils/bus'
import { useStore } from 'vuex';
export default defineComponent({
 setup(prop,context){
  const store=useStore()
  const router = useRouter();
  let type=store.state.user.type
  let allmenu
  if(type==0){
   allmenu=[
          {
                menuid: 13,
                menuname: '项目列表',
                url: '/projectlist',
                menus: null,
                icon:'List'
             },
        {
          menuid: 10,
          menuname: '新增项目',
          url: '/operatingunit/additem',
          menus:null,
          icon:"DocumentAdd"
        },
        // {
        //   menuid: 11,
        //   menuname: '成员列表',
        //   hasthird:null,
        //   url: null,
        //   menus:null,
        //   icon:'Stamp'
        // },
  ]
  }else if(type==1){
    allmenu=[
          {
                menuid: 13,
                menuname: '项目列表',
                url: '/projectlist',
                menus: null,
                icon:'List'
             },
        // {
        //   menuid: 11,
        //   menuname: '成员列表',
        //   hasthird:null,
        //   url: null,
        //   menus:null,
        //   icon:'Stamp'
        // },
  ]
  }
 
let isCollapse = ref(false)
// 是否收起或展开，为true展开
let activeIndex=ref('')
const handleOpen = (key: string, keyPath: string[]) => {
  activeIndex.value=key
}
const handleClose = (key: string, keyPath: string[]) => {
}
    // 向父组件传值
     onMounted(()=>{
      emitter.on('mittFn', (title:any) => {
        isCollapse.value=!isCollapse.value
        // 是否展开，点击切换布尔值
      // 向index传TopBar传来的值：true or false
      context.emit('handleSubmit', title) // 向上传递事件
        })
     })
    
    const selectItem=(key: string, keyPath: string[])=>{
      router.push(key)
     } 

    return {
      isCollapse,
      handleOpen,
      handleClose,
      selectItem,
      allmenu,
      activeIndex
    }
  },
})
</script>

<style scoped >
.logobox {
  height: 40px;
  line-height: 40px;
  color: #9d9d9d;
  font-size: 20px;
  text-align: center;
  padding: 20px 0px;
  transition: width 1s;
}
.leftmenu{
  height:100%;
}
.items{
  color:aliceblue!important;
  background-color: #334157!important;
}
.items:hover{
  color:raliceblue!important;
  background-color: #2a3546!important;
}
</style>
<style lang="less" scoped>
/deep/ .el-menu{
  background-color: #334157;
  height:100%
}
/deep/ .el-sub-menu__title{
  color:aliceblue!important;
  background-color: #334157;
}

/deep/ .el-menu-item{
  color:aliceblue!important;
  background-color: #334157!important;
}
/deep/ .el-menu-item:hover{
  color:raliceblue!important;
  background-color: #2a3546!important;
}
/deep/ .el-sub-menu__title:hover{
  color:raliceblue!important;
  background-color: #2a3546!important;
}
/deep/ .el-menu-item.is-active{
color: var(--el-color-primary)!important;
}

</style>
