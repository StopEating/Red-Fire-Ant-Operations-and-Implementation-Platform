<template>
  <div id="typemap">
    <div class="block"  style="z-index:10000;">
      <el-breadcrumb separator-icon="ArrowRight" s>
      <el-breadcrumb-item :to="{path:'/projectdetail',query:{id}}">项目详情</el-breadcrumb-item>
    <el-breadcrumb-item >监测生境统计图</el-breadcrumb-item>
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
    <div id="type">
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent,onMounted,ref,reactive,inject } from 'vue';
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
let ydata=[]
  // let types=[
  //           '全部',
  //           '绿化带',
  //           '公园',
  //           '堤坝',
  //           '农地',
  //           '果园',
  //           '鱼塘塘基',
  //           '村庄',
  //           '其他',
  //           '林地',
  //           '学校',
  //           '住宅',
  //           '景区'
  //           ]
const init=  ()=>{
  echarts.init(document.getElementById('type')!).dispose(); // 销毁实例
      var app: any = {};
      type EChartsOption = echarts.EChartsOption

      var chartDom = document.getElementById('type')!;
      var myChart = echarts.init(chartDom);
      var option: EChartsOption;

option = {
  legend: {},
  dataZoom: [//给x轴设置滚动条  
                           {  
                               start:0,//默认为0  
                               end:10,
                               type: 'slider',  
                               show: true,  
                               xAxisIndex: [0],  
                               handleSize: 0,//滑动条的 左右2个滑动条的大小  
                               height: 8,//组件高度  
                               left: 50, //左边的距离  
                               right: 40,//右边的距离  
                               bottom: 26,//右边的距离  
                               handleStyle: {  
                                   borderColor: "#cacaca",  
                                   borderWidth: 1,  
                                   shadowBlur: 2,  
                                   shadowColor: "#ddd",  
                               },  
                               fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{  
                                   //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变  
                                   //给第一个设置0，第四个设置1，就是垂直渐变  
                                   offset: 0,  
                                   color: '#1eb5e5'  
                               }, {  
                                   offset: 1,  
                                   color: '#5ccbb1'  
                               }]),  
                               backgroundColor: '#ddd',//两边未选中的滑动条区域的颜色  
                               showDataShadow: false,//是否显示数据阴影 默认auto  
                               showDetail: false,//即拖拽时候是否显示详细数值信息 默认true  
                               handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',  
                              //  filterMode: 'filter'
                           },  
                           //下面这个属性是里面拖到  
                           {  
                               type: 'inside',  
                               show: true,  
                               xAxisIndex: [0],  
                               start: 0,//默认为1  
                               end: 50
                           },  
                       ],
  tooltip: {},
  color:['#ad6c3e','#9e5b88','#3e5b28','#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
  dataset: {
    source: ydata
  },
  xAxis: { type: 'category' },
  yAxis: {},
  // Declare several bar series, each will be mapped
  // to a column of dataset.source by default.
  series: [
    { type: 'bar',
			label: {
        show: true,
        position: 'top',
			 },
  	},
    { type: 'bar',
			label: {
        show: true,
        position: 'top',
			 },
  	},
    { type: 'bar',
			label: {
        show: true,
        position: 'top',
			 },
  	},
    { type: 'bar',
			label: {
        show: true,
        position: 'top',
			 },
  	},
    { type: 'bar',
			label: {
        show: true,
        position: 'top',
			 },
  	},
    { type: 'bar',
			label: {
        show: true,
        position: 'top',
			 },
  	},
    { type: 'bar',
			label: {
        show: true,
        position: 'top',
			 },
  	},
    { type: 'bar',
			label: {
        show: true,
        position: 'top',
			 },
  	},
    { type: 'bar',
			label: {
        show: true,
        position: 'top',
			 },
  	},
    { type: 'bar',
			label: {
        show: true,
        position: 'top',
			 },
  	},
    { type: 'bar',
			label: {
        show: true,
        position: 'top',
			 },
  	},
    { type: 'bar',
			label: {
        show: true,
        position: 'top',
			 },
  	},
    ]
};

option && myChart.setOption(option);
window.addEventListener('resize', () => {
            if (myChart) {
              myChart.resize()
            }
          })
}
// reload()
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
axios.get('https://e7luck.cn/hhycc/visual/jcsgpoint?code='+cityid+'&pjid='+id+'&ctype='+1).then(res=>{
  ydata=[]
 let produuct= ['product', 
            '绿化带',
            '公园',
            '堤坝',
            '农地',
            '果园',
            '鱼塘塘基',
            '村庄',
            '其他',
            '林地',
            '学校',
            '住宅',
            '景区'];
 let sgt1:any
 (ydata as any).push(produuct)
if( res.data.data!==null){
  res.data.data.forEach(i => {
  sgt1=[];
  (sgt1 as any).push(i.name)
  if(i.sgs!==null){
  i.sgs.forEach(e => {
    (sgt1 as any).push(e.count)
  });
    (ydata as any).push(sgt1)
 }else{
  for(var j=1;j<=11;j++){
    (sgt1 as any).push(0)
  }
  (ydata as any).push(sgt1)
 }
 });
 init()
}
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
axios.get('https://e7luck.cn/hhycc/visual/jcsgpoint?code='+cityid2+'&pjid='+id+'&ctype='+type).then(res=>{
  console.log(res)
  ydata=[]
 let produuct= ['product', 
            '绿化带',
            '公园',
            '堤坝',
            '农地',
            '果园',
            '鱼塘塘基',
            '村庄',
            '其他',
            '林地',
            '学校',
            '住宅',
            '景区'];
 let sgt1:any
 (ydata as any).push(produuct)
 if( res.data.data!==null){
  res.data.data.forEach(i => {
  sgt1=[];
  (sgt1 as any).push(i.name)
  if(i.sgs!==null){
  i.sgs.forEach(e => {
    (sgt1 as any).push(e.count)
  });
    (ydata as any).push(sgt1)
 }else{
  for(var j=1;j<=11;j++){
    (sgt1 as any).push(0)
  }
  (ydata as any).push(sgt1)
 }
 });
 init()}
endLoading()
})
}
</script>

<style scoped>
#typemap{
  width:100%;
  height:100%;
  margin:0;
  padding:0;
}
.block{
  padding-top:5px;
}
#type{
  width:98%;
  height:90%;
  margin:0 auto;
  margin-top:1%
}
</style>
