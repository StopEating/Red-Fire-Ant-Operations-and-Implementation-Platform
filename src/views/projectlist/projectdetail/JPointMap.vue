<template>
  <div class="pointmap">
    <div class="block"  style="z-index:10000;">
      <el-breadcrumb separator-icon="ArrowRight" s>
      <el-breadcrumb-item :to="{path:'/projectdetail',query:{id}}">项目详情</el-breadcrumb-item>
    <el-breadcrumb-item >监测点统计图</el-breadcrumb-item>
  </el-breadcrumb>
<div style="width:50%;margin:0 auto">
  <el-select placeholder="请选择" style="margin-right:1%;width:100px" v-model="ctypes">
    <el-option
      v-for="item in ctype"
      :key="item.id"
      :label="item.lebel"
      :value="item.lebel"
      >
    </el-option>
  </el-select>
     <el-select placeholder="请选择" style="margin-right:1%;width: 100px;" v-model="area">
    <el-option
      v-for="item in areas"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <el-select placeholder="请选择" style="margin-right:1%;width:150px" v-model="subarea">
    <el-option
      v-for="item in subareas"
      :key="item.cityid"
      :label="item.lebel"
      :value="item.lebel"
      @click="check(item.cityid)"
      >
    </el-option>
  </el-select>
 <el-button @click="getpoint()" type="primary"> 查询</el-button>

</div>
  </div>
<div id="point">

</div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent,onMounted,ref,reactive,inject} from 'vue';
import * as echarts from 'echarts';
import axios from 'axios'
import { useRouter } from 'vue-router';
import { startLoading,endLoading } from '@/untils/loading';
const reload = inject<any>("reload");
const router=useRouter()
const id=router.currentRoute.value.query.id
const cityid='4402'
let cityid2='4402'
let area=ref('韶关市')
let areas=[
            {
              label:'韶关市',
              value:'韶关市',
            }
             ]
interface options{
    lebel:string,
    cityid:string
  }
const ctype=[
    {
    lebel:'监测',
    id:'1'
  },
  { lebel:'评估',
    id:'4'}
  ]
let subarea=ref('全部')
let ctypes=ref('监测')
let subareas=reactive<options[]>([])
let xdata=[]
let ydata=[]
const init=()=>{
  echarts.init(document.getElementById('point')!).dispose(); // 销毁实例
  var chartDom = document.getElementById('point')!;
  var myChart = echarts.init(chartDom);
type EChartsOption = echarts.EChartsOption
var option: EChartsOption;
option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      axisLabel:{
        interval:0,
        rotate: 30
      },
      data:xdata,
      axisTick: {
        alignWithLabel: true
      }
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '数量',
      type: 'bar',
      barWidth: '60%',
      data: ydata,
			label: {
        show: true,
        position: 'top',
			 },
    }
  ]
};

option && myChart.setOption(option);
window.addEventListener('resize', () => {
            if (myChart) {
              myChart.resize()
            }
          })
}
startLoading()
// 获取区级名称以及id
axios.get('https://e7luck.cn/hhycc/region/showbyparent?cityid='+4402).then(res=>{
  (subareas as any).push({cityid: "4402",
lebel: "全部"})
 res.data.data.children.forEach(i => {
  (subareas as any).push(i)
 });
})
// 初始化echart图为武江区监测数据
axios.get('https://e7luck.cn/hhycc/visual/jcpoint?code='+cityid+'&pjid='+id+'&ctype='+1).then(res=>{
  init()

  startLoading
  console.log(res)
  xdata=[]
  ydata=[]
 if(res.data.data!==null){
  res.data.data.forEach(i => {
 ( xdata as any).push(i.name);
 ( ydata as any).push(i.count);
  });
}

  init()
  endLoading()
});
const check=(id)=>{
  cityid2=id
}
const getpoint=()=>{
  startLoading()
let type
if(ctypes.value=='监测'){
  type=1
}
if(ctypes.value=='评估'){
  type=4
}
axios.get('https://e7luck.cn/hhycc/visual/jcpoint?code='+cityid2+'&pjid='+id+'&ctype='+type).then(res=>{
  console.log(res)
  xdata=[]
  ydata=[]
  if(res.data.data!==null){
  res.data.data.forEach(i => {
 ( xdata as any).push(i.name);
 ( ydata as any).push(i.count);
  });
  init()

}
  endLoading()
})
}
</script>

<style scoped>
.pointmap{
  width:100%;
  height:100%;
  margin:0;
  padding:0;
}
.block{
  padding-top:5px;
}
#point{
  width: 95%;
  height:90%;
  margin:0;
  padding:0;
}
</style>
