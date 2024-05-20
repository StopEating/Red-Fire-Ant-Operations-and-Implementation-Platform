<template>
  <div>
    <el-descriptions border>
        <template #title>
            <el-breadcrumb separator-icon="ArrowRight" style="padding:10px;margin:0;">
    <el-breadcrumb-item :to="{ path: '/projectlist' }">项目列表</el-breadcrumb-item>
    <el-breadcrumb-item>项目详情</el-breadcrumb-item>
  </el-breadcrumb>
        </template>
    <el-descriptions-item label="项目名称：">{{des.data.name}}</el-descriptions-item>
    <el-descriptions-item label="项目负责人：">{{des.data.user}}</el-descriptions-item>
    <el-descriptions-item label="负责人手机：">{{des.data.phone}}</el-descriptions-item>
    <el-descriptions-item label="承担单位：">{{des.data.uniname}}</el-descriptions-item>
    <el-descriptions-item label="实施区划：">{{des.data.alias}}</el-descriptions-item>
    <el-descriptions-item label="项目起止日期：">{{des.data.starttime}}-{{des.data.endtime}}</el-descriptions-item>
    <el-descriptions-item label="药剂企业：">{{des.data.pscompany}}</el-descriptions-item>
    <el-descriptions-item label="药剂名称：">{{des.data.psname}}</el-descriptions-item>
    <el-descriptions-item label="主要成分：">{{des.data.pscomposi}}</el-descriptions-item>
    <el-descriptions-item label="立项日期：">{{des.data.adddate}}</el-descriptions-item>
   
  </el-descriptions>
  <hr>
  <el-form label-width="120px" style="margin-top:30px;">
    <el-form-item label="项目实施数据:" label-width="13%" style="font-weight:600">
      <!-- <el-button round @click='turnpage("数据查看")' style="margin-left:30px">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">数据查看</span>
  </el-button> -->
  <el-button round @click='turnpage("监测数据查看")' style="margin-left:30px">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">监测数据查看</span>
  </el-button>
  <el-button round @click='turnpage("防控数据查看")' >
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">防控数据查看</span>
  </el-button>
    </el-form-item>
    <el-form-item label="数据可视化:" label-width="13%" style="font-weight:600">
  <template v-if='!(des.data.name).includes("韶关市")'>
    <el-button round @click='turnpage("监测数据地图")' style="margin-left:30px">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">监测数据地图</span>
  </el-button>
  <el-button round @click='turnpage("防控数据地图")' >
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">防控数据地图</span>
  </el-button>
  </template>
  <el-button round @click='turnpage("装置数据地图")' v-if='(des.data.name).includes("韶关市")||(des.data.name).includes("测试")'>
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">装置数据地图</span>
  </el-button>
  <el-button round @click='turnpage("防控工作轨迹")' >
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">防控工作轨迹</span>
  </el-button>
  <el-button round @click='turnpage("监测样点统计图")' >
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">监测样点统计图</span>
  </el-button>
  <el-button round @click='turnpage("监测生境统计图")' >
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">监测生境统计图</span>
  </el-button>
  <el-button round @click='turnpage("监测工作轨迹")' >
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">监测工作轨迹</span>
  </el-button>
    </el-form-item>
  <el-form-item label="边界管理:" label-width="13%" style="font-weight:600">
    <el-button round @click='turnpage("防控区边界管理")'  style="margin-left:30px">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">防控区边界管理</span>
  </el-button>
  <el-button round @click='turnpage("样区边界管理")' >
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">样区边界管理</span>
  </el-button>
  </el-form-item>
  <el-form-item label="数据统计" label-width="13%" style="font-weight:600">
    <el-button round @click='turnpage("防控面积汇总")'  style="margin-left:30px">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">防控面积汇总表</span>
  </el-button>
  <el-button round @click='turnpage("防控面积按生境汇总")'  style="margin-left:30px">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">防控面积按生境汇总表</span>
  </el-button>
  <el-button round @click='turnpage("监测面积汇总")'  style="margin-left:30px">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">监测面积汇总表</span>
  </el-button>
  <el-button round @click='turnpage("样区防控面积统计")'  style="margin-left:30px">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">样区防控面积统计表</span>
  </el-button>
  </el-form-item>
  <el-form-item label="数据导出" label-width="13%" style="font-weight:600">
    <el-button round @click='turnpage("防控区数据")'  style="margin-left:30px">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">防控区数据</span>
  </el-button>
  <el-button round @click='turnpage("样区数据")'  style="margin-left:30px">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">样区数据</span>
  </el-button>
  <el-button round @click='turnpage("监测点数据")'  style="margin-left:30px">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">监测点数据</span>
  </el-button>
  <el-button round @click='turnpage("防控点数据")'  style="margin-left:30px">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">防控点数据</span>
  </el-button>
  </el-form-item>
  <!-- <el-form-item label="卫星地图" label-width="13%" style="font-weight:600">
    <el-button round @click='turnpage("防控面积汇总")'  style="margin-left:30px">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">防控面积汇总表</span>
  </el-button>
  <el-button round @click='turnpage("防控面积按生境汇总")'  style="margin-left:30px">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">防控面积按生境汇总表</span>
  </el-button>
  <el-button round @click='turnpage("监测面积汇总")'  style="margin-left:30px">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">监测面积汇总表</span>
  </el-button>
  </el-form-item> -->
   </el-form>
 <!-- <template v-if="false"> -->
  <!-- <el-descriptions border :column="1" >
  <el-descriptions-item label="项目实施数据："  label-class-name="my-label"
      class-name="my-content"> 
      <el-button round @click='turnpage("数据查看")' size="small">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">数据查看</span>
  </el-button>
</el-descriptions-item>
  <el-descriptions-item label="数据可视化："  label-class-name="my-label"
      class-name="my-content">
      <el-button round @click='turnpage("监测数据地图")' size="small">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">监测数据地图</span>
  </el-button>
  <el-button round @click='turnpage("监测生境统计图")' size="small">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">监测生境统计图</span>
  </el-button>
  <el-button round @click='turnpage("监测点统计图")' size="small">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">监测点统计图</span>
  </el-button>
  <el-button round @click='turnpage("防控数据地图")' size="small">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">防控数据地图</span>
  </el-button>
  <el-button round @click='turnpage("工作轨迹")' size="small">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">防控工作轨迹</span>
  </el-button>
  <el-button round @click='turnpage("工作轨迹")' size="small">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">监测工作轨迹</span>
  </el-button>
    </el-descriptions-item>

    <el-descriptions-item label="数据统计："  label-class-name="my-label"
      class-name="my-content">
      <el-button round @click='turnpage("监测数据地图")' size="small">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">防控面积汇总表</span>
  </el-button>
  <el-button round @click='turnpage("监测生境统计图")' size="small">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">监测生境统计图</span>
  </el-button>
  <el-button round @click='turnpage("监测样点统计图")' size="small">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">生境防控面积汇总表</span>
  </el-button>
  <el-button round @click='turnpage("防控数据地图")' size="small">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">样区防控面积统计表</span>
  </el-button>
  <el-button round @click='turnpage("工作轨迹")' size="small">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">监测面积统计表</span>
  </el-button>
    </el-descriptions-item>
    <el-descriptions-item label="边界管理："  label-class-name="my-label"
      class-name="my-content">
      <el-button round @click='turnpage("监测数据地图")' size="small">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">防控区边界管理</span>
  </el-button>
  <el-button round @click='turnpage("监测生境统计图")' size="small">
    <el-icon style="vertical-align: middle">
      <Search />
    </el-icon>
    <span style="vertical-align: middle">样区边界管理</span>
  </el-button>
    </el-descriptions-item>
    <el-descriptions-item label="数据导出："  label-class-name="my-label"
      class-name="my-content">
      <el-button round @click='turnpage' size="small"> 
        <el-icon><Download /></el-icon>
    <span style="vertical-align: middle">导出</span>
  </el-button>
    </el-descriptions-item>
  </el-descriptions> -->
 <!-- </template> -->
  </div>
</template>

<script lang="ts">
    
import { defineComponent,reactive,ref,onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios'
import { ElLoading} from 'element-plus';
import {startLoading,endLoading} from '@/untils/loading'
export default defineComponent({
 setup(){

  const router = useRouter()
  const store=useStore()
  const id=router.currentRoute.value.query.id
  let alias=ref('')
  const des=reactive({data:{
    adddate:'',
    addduser:'',
    alias:'',
    code:'',
    endtime:'',
    id:'',
    name:'',
    phone:'',
    pscompany:'',
    pscomposi:'',
    psname:'',
    starttime:'',
    uniname:'',
    yearold:'',
    user:''
  }})
  const init=()=>{
  
    startLoading()
    let phone=store.state.user.phone
    axios.get('https://e7luck.cn/hhycc/user/listproject?phone='+phone+'&start=0&rows=9').then(res=>{
          console.log(res)
          let data=res.data.rows
         const form= data.filter(i=>{
            return i.id==id
          })
          des.data=(form[0])
          alias.value=form[0].alias
        setTimeout(() => {
          endLoading()
        }, 500);
        })

    }
init()
    const turnpage=(e)=>{
      let city=alias.value
        if(e=='数据查看'){
            router.push({path:'/projectdetail/projectdata',query:{id,city}})
        } else if(e=='监测数据查看'){
          let ptype=1
            router.push({path:'/projectdetail/projectdata',query:{id,city,ptype}})
        } else if(e=='防控数据查看'){
          let ptype=2
            router.push({path:'/projectdetail/projectdata',query:{id,city,ptype}})
        }else if(e=='监测数据地图'){
            router.push({path:'/projectdetail/jdatamap',query:{id,city}})
        }else if(e=='监测生境统计图'){
            router.push({path:'/projectdetail/jtypemap',query:{id}})
        }else if(e=='监测样点统计图'){
            router.push({path:'/projectdetail/jpointmap',query:{id}})
        }else if(e=='防控数据地图'){
            router.push({path:'/projectdetail/fdatamap',query:{id,city}})
        }else if(e=='防控工作轨迹'){
            router.push({path:'/projectdetail/fworkline',query:{id,city}})
        }else if(e=='装置数据地图'){
            router.push({path:'/projectdetail/zdatamap',query:{id,city}})
        }else if(e=='监测工作轨迹'){
          router.push({path:'/projectdetail/jworkline',query:{id,city}})
        }else if(e=='防控区边界管理'){
          router.push({path:'/map/refarea',query:{id,city}})
        }else if(e=='样区边界管理'){
          router.push({path:'/map/reyarea',query:{id,city}})
        }
        else if(e=='防控面积汇总'){
          router.push({path:'/datas/farea',query:{id,city}})
        }else if(e=='防控面积按生境汇总'){
          router.push({path:'/datas/fsarea',query:{id,city}})
        }
        else if(e=='监测面积汇总'){
          router.push({path:'/datas/jarea',query:{id,city}})
        }else if(e=='样区防控面积统计'){
          router.push({path:'/datas/yfarea',query:{id,city}})
        }else if(e=='防控区数据'){
          router.push({path:'/datas/fkdatas',query:{id,city}})
        }else if(e=='样区数据'){
          router.push({path:'/datas/ydatas',query:{id,city}})
        }else if(e=='监测点数据'){
          router.push({path:'/datas/jcpointdatas',query:{id,city}})
        }else if(e=='防控点数据'){
          router.push({path:'/datas/fkpointdatas',query:{id,city}})
        }
    }
   onActivated(()=>{
    init()
   })
    return {
    turnpage,
    des
    }
  },
})
</script>

<style scoped lang="less">
/deep/ .el-descriptions__body{
    margin-left:5%;
    text-align:left;
}   
.my-content{
    width:85%;
.el-button{
    margin:5px;
}
}
</style>

<style scoped>
 .el-descriptions{
    --el-descriptions-table-border: 0px ;
    --el-descriptions-item-bordered-label-background: transparant;
}
.my-label{
width:15%;
padding:20px;
}
</style>
