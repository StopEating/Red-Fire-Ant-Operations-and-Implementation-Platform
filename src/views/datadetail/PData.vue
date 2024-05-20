<template>
  <div class="jd">
      <el-page-header  @back="goBack"> 
  <template #breadcrumb>
    <el-breadcrumb separator-icon="ArrowRight" style="padding:10px;margin:0;">
      <el-breadcrumb-item>
        项目列表
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        项目详情
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        实施数据
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        数据详情
      </el-breadcrumb-item>
    </el-breadcrumb>
  </template>
  <template #content>
    <span class="text-large font-600 mr-3">评估数据详情 </span>
  </template>
</el-page-header>
<el-backtop target=".jd" :right="100" :bottom="100"></el-backtop>
<el-tabs @tab-click="childs($event,id,1,4)" v-model="activeName" class="tabs">

  <el-tab-pane label="常规诱集"  name="1" :ids="id">
<el-descriptions class="margin-top" :column="3" size="small" border v-for="(item,index) in cgyjtype" :key="index" style="margin-top:10px">
<template v-slot:extra>
 <!-- @click="deletepointdata(item.id,1,index)" -->
<el-button type="danger" round size="small" @click="deletepointdata(item.id,1,index)">删除</el-button>
</template>
<el-descriptions-item >
<template v-slot:label>
  诱集时间
</template>
{{item.acttime}}
</el-descriptions-item>
<el-descriptions-item>
<template v-slot:label>
工作人员
</template>
{{item.cuser}}
</el-descriptions-item>
<el-descriptions-item>
<template v-slot:label>
 手机
</template>
{{item.cphone}}
</el-descriptions-item>
<el-descriptions-item>
<template v-slot:label>
  位置坐标
</template>
{{item.lnglat}}
<!-- <img style="width:100px;height:100px;"  :src="e" v-for="e in youjiimg[index]" preview="1" > -->
</el-descriptions-item>
<el-descriptions-item>
<template v-slot:label>
 工蚁数
</template>
{{item.antnum}}头/瓶
</el-descriptions-item>
<el-descriptions-item>
<template v-slot:label>
 诱集图片
</template>
<template v-if="item.imgurl[0]==null">
  <el-empty description="没有图片噢~" />
</template>
 <template v-else>
  <!-- <img style="width:100px;height:100px" :src="item.imgurl.split(';')[0]||item.imgurl" preview="1" > -->
  <el-image
    style="width: 100px; height: 100px"
    :src="item.imgurl[0]"
    :preview-src-list="item.imgurl"
    :initial-index="4"
    fit="cover"
  />
 </template>
</el-descriptions-item>
</el-descriptions> 
</el-tab-pane>
<el-tab-pane label="踏查数据" name="2" :ids="id">
<el-descriptions class="margin-top" :column="3" size="small" border v-for="(item,index) in tctype" :key="index" style="margin-top:10px">
<template v-slot:extra>
 <!-- @click="deletepointdata(item.id,1,index)" -->
<el-button type="danger" round size="small" @click="deletepointdata(item.id,2,index)">删除</el-button>
</template>
<el-descriptions-item >
<template v-slot:label>
  踏查时间
</template>
{{item.acttime}}
</el-descriptions-item>
<el-descriptions-item>
<template v-slot:label>
工作人员
</template>
{{item.cuser}}
</el-descriptions-item>
<el-descriptions-item>
<template v-slot:label>
 手机
</template>
{{item.cphone}}
</el-descriptions-item>
<el-descriptions-item>
<template v-slot:label>
  位置坐标
</template>
{{item.lnglat}}
<!-- <img style="width:100px;height:100px;"  :src="e" v-for="e in youjiimg[index]" preview="1" > -->
</el-descriptions-item>
<el-descriptions-item>
<template v-slot:label>
 是否活蚁巢
</template>
{{item.isnest}}
</el-descriptions-item>
<el-descriptions-item>
<template v-slot:label>
 蚁巢图片
</template>
<template v-if="item.imgurl[0]==null">
  <el-empty description="没有图片噢~" />
</template>
 <template v-else>
  <!-- <img style="width:100px;height:100px" :src="item.imgurl.split(';')[0]||item.imgurl" preview="1" > -->
  <el-image
    style="width: 100px; height: 100px"
    :src="item.imgurl[0]"
    :preview-src-list="item.imgurl"
    :initial-index="4"
    fit="cover"
  />
 </template>
</el-descriptions-item>
</el-descriptions> 
</el-tab-pane>
<el-tab-pane label="智能诱集" :ids="id" name="3">
<el-descriptions class="margin-top" :column="3" size="small" border v-for="(item,index) in znyjtype" :key="index" style="margin-top:10px">
<template v-slot:extra>
 <!-- @click="deletepointdata(item.id,1,index)" -->
<el-button type="danger" round size="small" @click="deletepointdata(item.id,3,index)">删除</el-button>
</template>
<el-descriptions-item >
<template v-slot:label>
  诱集时间
</template>
{{item.acttime}}
</el-descriptions-item>
<el-descriptions-item>
<template v-slot:label>
工作人员
</template>
{{item.cuser}}
</el-descriptions-item>
<el-descriptions-item>
<template v-slot:label>
 手机
</template>
{{item.cphone}}
</el-descriptions-item>
<el-descriptions-item>
<template v-slot:label>
  位置坐标
</template>
{{item.lnglat}}
<!-- <img style="width:100px;height:100px;"  :src="e" v-for="e in youjiimg[index]" preview="1" > -->
</el-descriptions-item>
<el-descriptions-item>
<template v-slot:label>
 高峰工蚁数
</template>
{{item.antnum}}头/装置
</el-descriptions-item>
<el-descriptions-item>
<template v-slot:label>
 诱集器图片
</template>
<template v-if="item.imgurl[0]==null">
  <el-empty description="没有图片噢~" />
</template>
 <template v-else>
  <!-- <img style="width:100px;height:100px" :src="item.imgurl.split(';')[0]||item.imgurl" preview="1" > -->
  <el-image
    style="width: 100px; height: 100px"
    :src="item.imgurl[0]"
    :preview-src-list="item.imgurl"
    :initial-index="4"
    fit="cover"
  />
 </template>
</el-descriptions-item>
<el-descriptions-item>
  <template v-slot:label>
   诱集过程图
  </template>
 <div class="pops">
  <span style="cursor:pointer;" class="gjmap"  @click="gjechart(item.id,item.cphone)">诱集过程图<el-icon><DArrowRight /></el-icon></span>

 </div>

</el-descriptions-item>
</el-descriptions> 
</el-tab-pane>

</el-tabs>
<div class="demo-pagination-block">
     <el-pagination
     v-model:currentPage="currentPage"
     :page-size="size"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
      style="width:30%;margin:0 auto"
    />
  </div>
  </div>
  <el-drawer v-model="pro" :title="text" :with-header="false" size="50%">
    <div id="gj" style="width:690px;height:560px;margin:0 auto;margin-right:20px;margin-bottom: 10px;" >
    </div>
    <template v-if="showimg">
    <el-image
      style="width: 80px; height: 80px"
      :src="imgs[index]"
      :preview-src-list="[imgs[index]]"
      :initial-index="4"
      fit="cover"
    />
   </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { defineComponent,reactive,ref } from 'vue';
import { useRouter } from 'vue-router';
import {startLoading,endLoading} from '@/untils/loading'
import axios from 'axios';
import { ElMessage,ElMessageBox} from 'element-plus';
import * as echarts from 'echarts'
  const currentPage = ref(1)
    const small = ref(false)
    const background = ref(false)
    const disabled = ref(false)
    const total=ref(0)
    const size=5
  const router=useRouter()
  const id=router.currentRoute.value.query.id
  const activeName = ref('1')
  interface fk{
  acttime:string
  carea:string
  cphone:string
  ctype:number
  cuser:string
  ftype:number
  id:number
  imgurl:any
  lnglat:string
  lnglats:string
  pesticide:string
  pid:number

}
interface yj{
  acttime:string
  antnum:string
  cphone:string
  ctype:number
  cuser:string
  id:number
  imgurl:any
  lnglat:string
  pid:number

}
interface tc{
  acttime:string
  cphone:string
  ctype:number
  cuser:string
  harea:number
  id:number
  imgurl:any
  lnglat:string
  pid:number
  isnest:number
}
// 监测/评估
let znyjtype=reactive<yj[]>([])
let cgyjtype=reactive<yj[]>([])
let tctype=reactive<tc[]>([])
let child=ref(1)

// 折线图
let xaixs=reactive<any[]>([])
  let yaixs=reactive<any[]>([])
  let imgs=reactive<any[]>([])
  let showimg=ref(false)
  let pro=ref(false)
  let index=ref()
  let name=''
  let text=ref('')
var myChart
  const goBack=()=>{
  router.back()
  }
        // 分页
        const handleCurrentChange = (val:number) => {
    let num=(val-1)*5
        init(child.value,num)
       
}
// 监测、评估
const childs=(event,pid,type,ctype)=>{
startLoading()
 child.value=event.props.name
axios.get('https://e7luck.cn/hhycc/user/pointdata?pid='+pid+"&type="+type+"&child="+child.value+"&ctype="+ctype+'&start='+0+'&rows='+5).then(res=>{
  let data=res.data
    console.log(res)
  if(data.rows){
    if(child.value==1){
      cgyjtype.length=0
    total.value=data.total
      data.rows.forEach((i)=> {
      if(i.imgurl!==null&&i.imgurl.indexOf(';')!==-1){
  i.imgurl=i.imgurl.split(';')
  }else{
    i.imgurl=[i.imgurl]
  }
      (cgyjtype as any).push(i)
    })
  
    }else if(child.value==2){
      total.value=data.total
        tctype.length=0
        data.rows.forEach((i)=> {
        if(i.imgurl!==null&&i.imgurl.indexOf(';')!==-1){
        i.imgurl=i.imgurl.split(';')
        }else{
          i.imgurl=[i.imgurl]
        }
        if(i.isnest==true){
          i.isnest='是'
        }if(i.isnest==false){
          i.isnest='否'
        }
            ( tctype as any).push(i)
          })
          }else if(child.value==3){
            total.value=data.total
        znyjtype.length=0
     
        data.rows.forEach((i)=> {

        if(i.imgurl!==null&&i.imgurl.indexOf(';')!==-1){
        i.imgurl=i.imgurl.split(';')
        }else{
          i.imgurl=[i.imgurl]
        }if(i.antnum==null){
          i.antnum=0
        }
            (znyjtype as any).push(i)
          })
          }
         
  setTimeout(()=>{
    endLoading()
  },1000)
}else{
  setTimeout(()=>{
    endLoading()
  },1000)
}

})
}
// 默认显示常规诱集数据
startLoading()
const init=(child=1,num=0)=>{
  axios.get('https://e7luck.cn/hhycc/user/pointdata?pid='+id+"&type="+1+"&child="+child+"&ctype="+4+'&start='+num+'&rows='+5).then(res=>{
    let data=res.data
    console.log(res)
  if(data.rows){
    if(child==1){
      cgyjtype.length=0
    total.value=data.total
      data.rows.forEach((i)=> {
      if(i.imgurl!==null&&i.imgurl.indexOf(';')!==-1){
  i.imgurl=i.imgurl.split(';')
  }else{
    i.imgurl=[i.imgurl]
  }
      (cgyjtype as any).push(i)
    })
  
    }else if(child==2){
      total.value=data.total
        tctype.length=0
        data.rows.forEach((i)=> {
        if(i.imgurl!==null&&i.imgurl.indexOf(';')!==-1){
        i.imgurl=i.imgurl.split(';')
        }else{
          i.imgurl=[i.imgurl]
        }
        if(i.isnest==true){
          i.isnest='是'
        }if(i.isnest==false){
          i.isnest='否'
        }
            ( tctype as any).push(i)
          })
          }else if(child==3){
            total.value=data.total
        znyjtype.length=0
     
        data.rows.forEach((i)=> {

        if(i.imgurl!==null&&i.imgurl.indexOf(';')!==-1){
        i.imgurl=i.imgurl.split(';')
        }else{
          i.imgurl=[i.imgurl]
        }if(i.antnum==null){
          i.antnum=0
        }
            (znyjtype as any).push(i)
          })
          }
         
  setTimeout(()=>{
    endLoading()
  },1000)
}else{
  setTimeout(()=>{
    endLoading()
  },1000)
}
})
}
init()
   // 删除
   const deletepointdata=(id,e,index)=>{
    console.log(id,e,index)
    ElMessageBox.confirm(
    '确定删除此数据?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      axios({
  method:'delete',
  url:'https://e7luck.cn/hhycc/user/delpointdt?pid='+id+'&type='+e
}).then(res=>{
  console.log(res)
  if(res.data.status==200){
    ElMessage({
    showClose: true,
    message: '删除成功！',
    type: 'success',
  })
  if(e==1){
      cgyjtype.splice(index,1)

    }if(e==2){
      tctype.splice(index,1)
    }if(e==3){
      znyjtype.splice(index,1)
    }
  }else{
    ElMessage({
    showClose: true,
    message: res.data.msg,
    type: 'error',
  })
  }
})
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })

  }

// 轨迹图
const gjechart=(dvdid,phone)=>{
  pro.value=true
  showimg.value=false
  xaixs.length=0
    yaixs.length=0
    imgs.length=0
    index.value=''
    text.value=''
  axios.get('https://e7luck.cn/hhycc/user/dvdata?dvdid='+dvdid+'&phone='+phone).then(res=>{
    console.log(res)
    let data=res.data.data.datas;
    text.value=(data[0].coldate as any).substr(0,11)+' 编号：'+res.data.data.ornum+'   经纬度：'+data[0].lnglat;
  if(data){
    data.forEach(i => {
      let coldate=(i.coldate as any).substr(11);
     (xaixs as any).push(coldate);
     (yaixs as any).push(i.anum);
     (imgs as any).push(i.imgurl)
    });
  }
  name=''
      setTimeout(()=>{
        initechart()//这个是绘制图形的函数
      },500)
  })
  
}

// 显示折线图
const initechart=()=>{
  console.log(Event.prototype)
  // $('.remove-popover')[0].remove()
  
  type EChartsOption = echarts.EChartsOption
      var chartDom= document.getElementById('gj')!;
      myChart= echarts.init(chartDom);
      var option: EChartsOption;
      myChart.clear();
    option = {
  tooltip: {
    trigger: 'axis'
  },
  toolbox: {
    show: true,
    feature: {
      saveAsImage: {}
    },
  },
  title:{
    text:text.value,
    textStyle:{
      fontSize:14
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: true,
    axisLabel:{
      interval:0,
      rotate: 30, // 倾斜30度
      fontSize:8,
      // color: function (value, index) {
      //   console.log(value)
      //             return name !== "" && name === value
      //               ? "black"
      //               : "#666666";
      //           },

    },
    data:xaixs
  },
  yAxis: {
    type: 'value',
    axisLine:{
    show:true
    },
    axisLabel: {
      formatter: '{value}个'
    },
   
  },
  series: [
    {
      name: 'Highest',
      type: 'line',
      symbol:'circle',
      symbolSize:7,
      data: yaixs,
      markPoint: {
        data: [
          { type: 'max', name: 'Max' },
          { type: 'min', name: 'Min' },
        ],
      },
          color:'#d06969', //折线点的颜色
          lineStyle:{
            color:'#d06969',
          },
          itemStyle:{
            color:(value)=>{
                  return name !== "" && name === value.name
                    ?  "red"
                    :"#d06969" ;
                },
          }
    },
  ]
    };
// 点击点显示图片
myChart.on('click', function(param) {
  name=param.name;
     (index.value as any)=param.dataIndex;
     initechart()
      showimg.value=true
    });
option && myChart.setOption(option);

    

}

</script>

<style scoped>
.demo-pagination-block {
  margin-top: 10px;
  height: 30px;
  width:100%

}
.tabs{
  margin-bottom: 20px;
 
}
.jd{
  height: 100%; 
overflow-x: hidden;
}
</style>
<style lang="less" scoped>
  /deep/ .el-empty{
  width:100px;
  height:100px
}
/deep/ .el-empty__image svg{
  width:90px;
  height:90px
}
/deep/ .el-empty__description{
  margin:0;
}
/deep/ .el-empty__description p{
  font-size: small;
}
</style>
