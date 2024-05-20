<template>
    <div class="common-layout">
    <el-container>
      <el-aside :class="showclass">
        <LeftMenu @handleSubmit="submitData"></LeftMenu>
      </el-aside>
      <el-container>
        <el-header style="margin:0;padding:0"><TopBar></TopBar></el-header>
        <hr>
        <el-main>
          <!-- element-plus汉化 -->
          <el-config-provider :locale="locale">
            <router-view></router-view>
          </el-config-provider>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref,watch,inject } from 'vue';
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import LeftMenu from '@/components/common/LeftMenu.vue';
import TopBar from '@/components/common/TopBar.vue'
import { useStore } from 'vuex';
import router from '@/router';


export default defineComponent({
  name: 'HomeView',
  components: {
    ElConfigProvider,
    LeftMenu,
    TopBar
  },
  
  setup(prop,context){
const reload = inject<any>("reload");

//   watch(() =>router.currentRoute.value.path,(newValue,oldValue)=> {
//     if(newValue==='/projectdetail/jpointmap'&&oldValue==='/projectdetail')
//     {
//       console.log(newValue,oldValue)
//     //  window.location.reload()
//      reload()
//     }
//     if(newValue==='/projectdetail/jtypemap'&&oldValue==='/projectdetail'){
//       console.log(newValue,oldValue)
//       reload()
//     }
// },{ immediate: true })
    const store=useStore()
    console.log(store.state.user)
    if(store.state.user.username==''){
      router.push('/')
    }
    let showclass=ref('asideshow')
    // 获取子组件传来的值
    const submitData=(title:any)=>{
      let ifshow=title.value
      if(ifshow){
        showclass.value='asideshow'
      }else{
       showclass.value='aside'
      }
      }

    return {
      showclass,
      submitData,
      locale: zhCn,
    }
  }
});
</script>
<style scoped>
  *{
    margin:0;
    padding:0;
  }
.common-layout{
  width:100%;
  height: 100%;
}
.el-header{
  display: flex;
}
.el-container{
  width:100%;
  height:100%
}
.el-aside{
  width:auto
}
.asideshow {
  width: 200px !important;
  height: 100%;
  margin: 0px;
  padding:0;
}

</style>
<style lang="less" scoped>

</style>
