
<template>
    <div class="map-page-container" style="width:100%">
      <!-- <SelectArea></SelectArea> -->
      <!-- 描述 -->
      <div class="block" style="z-index:200;margin-left:0.5%;;font-size:6px;background-color: aliceblue;padding:5px">
              <div style="margin-bottom:5px">
               颜色区分：
              </div>
              <div>
               <img src="@/assets/img/4.png" alt="" style="width:20px;height:20px"><span>:诱集数据点</span>
              </div>
              <div>
               <img src="@/assets/img/2.png" alt="" style="width:20px;height:20px"><span>:踏查数据点</span>
              </div>
              <div>
              <span style="color:#e02fff;font-weight: 600;font-size: 20px;">——</span><span>:防控区边界</span>
              </div>
              <div>
              <span style="color:#bd478a;font-weight: 600;font-size: 20px;">——</span><span>:样区边界</span>
              </div>
              <div>
              <span style="color:#68e7f9;font-weight: 600;font-size: 20px;">------</span><span>:工作轨迹</span>
              </div>
    </div>
      <!-- 选择框 -->
      <div class="block2"  style="z-index:99999;">
        <el-breadcrumb separator-icon="ArrowRight" style="padding:10px;margin:0;margin-left:-18%">
        <el-breadcrumb-item :to="{path:'/projectdetail',query:{id}}">项目详情</el-breadcrumb-item>
      <el-breadcrumb-item >防控工作轨迹</el-breadcrumb-item>
    </el-breadcrumb>
    <div >
      <el-select placeholder="请选择监测/评估" style="margin-right:1%;width: 10%;" v-model="type">
      <el-option
        v-for="item in types"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select placeholder="请选择防控区" style="margin-right:1%;width: 15%;" v-model="area" clearable>
      <el-option
        v-for="item in areas"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        @click="getchild(item.value)"
        >
      </el-option>
    </el-select>
    <el-select placeholder="请选择样区" style="margin-right:1%;width: 20%;" v-model="yarea" clearable>
      <el-option
        v-for="item in yareas"
        :key="item.id"
        :label="item.label"
        :value="item.id">
      </el-option>
    </el-select>
    <!-- <el-select placeholder="请选择防控方式" style="margin-right:1%;width: 15%;" v-model="method">
      <el-option
        v-for="item in methods"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select> -->
    <el-button style="margin-left:3%;" type="primary" @click="check">
      查询
    </el-button>
    <el-button style="margin-left:3%;" type="primary" @click="towxmap">查看普通地图</el-button>
    </div>
    </div>
    <!-- 地图 -->
      <el-amap
        :center="center"
        :zoom="zoom"
        :doubleClickZoom="false"
        @init="init"
        style="width:100%;height:100%"
      ><el-amap-layer-satellite></el-amap-layer-satellite></el-amap>
    </div>
  </template>
 
    <script lang="ts" setup>
      import axios from 'axios'
      import {useRouter} from 'vue-router'
      import {ref,reactive} from "vue";
      import { event } from 'jquery';
      import { startLoading,endLoading } from '@/untils/loading';
      const router=useRouter()
      const id=router.currentRoute.value.query.id
      let city=router.currentRoute.value.query.city
      const zoom = ref(35);
      const center = ref([116.471354, 39.994257]);
      let map = null;
       let bjfks=reactive([])//防控边界
       let bjsby=reactive([])//撒播边界
       let bjyqs=reactive([])//样区边界
       let gjjsy=reactive([])//工作轨迹
       let yjdatas=reactive([])//技术员施药轨迹
       let tcdatas=reactive([])//员工施药轨迹
       let bjfkspy=[]//防控边界数组
       let bjsbypy=[]//撒播边界数组
       let bjyqspy=[]//样区边界数组
       interface options{
        label:string
        value:string
        id?:number
       }
       let areas=reactive<options[]>([])
       let yareas=reactive<options[]>([])
        const types=[
          {
            value:'1',
            label:'监测'
          },
          {
            value:'4',
            label:'评估'
          }
        ]
        const methods=[
        {
            value:'蚁巢环施',
            label:'蚁巢环施'
          },
          {
            value:'区域撒播',
            label:'区域撒播'
          }
        ]
        const points=[
              {value:'样区',label:'样区'},
              {value:'样区+监测点',label:'样区+防控点'}
         ]
        //  查询条件
          let point=ref('样区')
          let area=ref('0')
          let yarea=ref('全部')
          let type=ref('1')
          let  method=ref('全部')
          //数据数组
       let nocontents=[]
    let tccontents=[]
      //  监测点数组
        let bjfksarea:any[]=[]
        let bjyqsarea:any[]=[]
        let gjjsyarea:any[]=[]
        let infoWindow
        let gjjsyline
        let starts=[]
  let ends=[]
  let jgs=[]
              // 进入卫星图层
              const towxmap=()=>{
      router.push({path:'/projectdetail/jworkline',query:{id,city}})
    }
         // 获取防控区
   axios.get('https://e7luck.cn/hhycc/user/listareas?pjid='+id).then(res=>{
   areas.push({value:'0',label:'全部'})
   let data=res.data.data
   data.forEach(i => {
    areas.push({value:i.id,label:i.aname})
   });
   })
  // 获取样区
  const getchild=(aname)=>{
    axios.get('https://e7luck.cn/hhycc/user/addrs?pjid='+id+'&aid='+aname+'&ptype='+type.value).then(res=>{
      console.log(res)
      yareas.length=0
      yarea.value=''
      let data=res.data.data.list
     if(data){
      data.forEach(i => {
      yareas.push({value:i.addr,label:i.addr,id:i.pid})
      });}
    })
  }
  
  const init = (e) => {
    startLoading()
   infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
    // 绘制边界
    AMap.plugin('AMap.DistrictSearch',function () {
    // 创建行政区查询对象
    var district = new AMap.DistrictSearch({
      // 返回行政区边界坐标等具体信息
      extensions: 'all',
      // 设置查询行政区级别为 区 
      level: 'district'
    })
    let alias
    if(city?.includes('-')){
      alias=city
      city=alias.split('-')[1]
    }
    district.search(city, function(status, result) {
      // 获取边界信息
      var bounds = result.districtList[0].boundaries
      var polygons = []
      if (bounds) {
        for (var i = 0, l = bounds.length; i < l; i++) {
         //生成行政区划polygon
         var polygon = new AMap.Polygon({
          map: map,
          strokeWeight: 3,
          path: bounds[i],
          fillOpacity: 0.8,
          fillColor: 'pink',
          strokeColor: 'red'
         })
          e.add(polygon)
       }
       // 地图自适应
       (map as any).setFitView();
     }
   })
  })
    // 绘制点以及边界
     axios.get('https://e7luck.cn/hhycc/user/jcguijis?pjid='+id+'&ctype='+1+'&aid='+0).then(res=>{
    let data=res.data.data
     bjfks=data.bjfks
     bjyqs=data.bjyqs
     gjjsy=data.gjjsy
     yjdatas=data.yjdatas
     tcdatas=data.tcdatas
   if(bjfks){
     // 防控区边界
     bjfks.forEach( gj=>{
        let lnglats=[];
        (gj as any)=(gj as any).split(';');
        (gj as any).forEach( i => {
              let lng=i.split(',')[0]*1
              let lat=i.split(',')[1]*1
             let lnglat:any[]=[lng,lat];
            ( lnglats as any).push(lnglat)
        })
         bjfksarea.push(lnglats)
          for(var j=0;j<bjfksarea.length;j++){
        let bezierCurve = new AMap.Polygon({
              path:bjfksarea[j],
              isOutline: true,
              fillColor: 'transparent',
              borderWeight: 1,
              strokeColor: "#e02fff", 
              strokeOpacity: 1,
              strokeWeight: 2,
              // 线样式还支持 'dashed'
              strokeStyle: "solid",
              // strokeStyle是dashed时有效
              strokeDasharray: [10, 10],
              lineJoin: 'round',
              lineCap: 'round',
              zIndex: 50,
          });
          (bjfkspy as any).push(bezierCurve);
          }
      })}
     if(bjyqs){
     // 样区边界
     bjyqs.forEach( gj=>{
        let lnglats=[];
        (gj as any)=(gj as any).split(';');
        (gj as any).forEach( i => {
              let lng=i.split(',')[0]*1
              let lat=i.split(',')[1]*1
             let lnglat:any[]=[lng,lat];
            ( lnglats as any).push(lnglat)
        })
          bjyqsarea.push(lnglats)
          for(var j=0;j<bjyqsarea.length;j++){
        let bezierCurve = new AMap.Polygon({
              path:bjyqsarea[j],
              isOutline: true,
              fillColor: 'transparent',
              borderWeight: 1,
              strokeColor: "#bd478a", 
              strokeOpacity: 1,
              strokeWeight: 2,
              // 线样式还支持 'dashed'
              strokeStyle: "solid",
              // strokeStyle是dashed时有效
              strokeDasharray: [10, 10],
              lineJoin: 'round',
              lineCap: 'round',
              zIndex: 50,
          });
          ( bjyqspy as any).push(bezierCurve);
          }
      })}
 
if(yjdatas){
  //     //诱集数据
  yjdatas.forEach( function(marker) {
    let lng=(marker as any).lnglat.split(',')[0]
      let lat=(marker as any).lnglat.split(',')[1]
          // 无文本的标记点
          let nocontent= new AMap.Marker({
              map: map,
              icon: new AMap.Icon({     
              image: require('/static/img/4.png'),
              size: new AMap.Size(25, 25),  //图标大小
              imageSize: new AMap.Size(25,25),
            }),
          position: [lng,lat],
          offset: new AMap.Pixel(-13, -30)
          });
        let img
        if((marker as any).imgurl!==null)
        {
          img=(marker as any).imgurl.split(';');
        }
          (nocontent as any).on('click', markerClick);
          if(img)
       {
         // 设置信息窗体
         (nocontent as any).content = `<div>
            <div >日期：${(marker as any).acttime}</div>
            <div>经纬度:${(marker as any).lnglat}</div>
            <div>工蚁数:${(marker as any).antnum}</div>
            <div style="width:100px;height:100px">
            <img src='${img[0]}' style="width:100px;height:100px"/>
            </div>
            <a href="${img[0]}" target='blank'>打开图片</a>
            </div>`; 
            (nocontent as any).on('click', markerClick);
       }
       else{
        (nocontent as any).content = `<div>
            <div >日期：${(marker as any).acttime}</div>
            <div>经纬度:${(marker as any).lnglat}</div>
            <div>工蚁数:${(marker as any).antnum}</div>
            </div>`; 
            (nocontent as any).on('click', markerClick);
       }
          // 设置标记点文本
            //默认初始化不出现信息窗体,打开初始化就出现信息窗体
            // markerss.emit('click', {target: markerss});
            (nocontents as any).push(nocontent);
      });}
 if(tcdatas){
 //     // 踏查数据
 tcdatas.forEach( function(marker) {
      let isnest
      let lng=(marker as any).lnglat.split(',')[0]
      let lat=(marker as any).lnglat.split(',')[1]
          // 无文本的标记点
          let tcnocontent= new AMap.Marker({
              map: map,
              icon: new AMap.Icon({     
              image: require('/static/img/2.png'),
              size: new AMap.Size(25, 25),  //图标大小
              imageSize: new AMap.Size(25,25),
            }),
          position: [lng,lat],
          offset: new AMap.Pixel(-13, -30)
          });
        let img
        if((marker as any).imgurl!==null)
        {
          img=(marker as any).imgurl.split(';');
        }
          (tcnocontent as any).on('click', markerClick);
          if(img)
       {
       
        if((marker as any).isnest==true){
          isnest='是'
        }else if((marker as any).isnest==false){
          isnest='否'
        }
         // 设置信息窗体
         (tcnocontent as any).content = `<div>
            <div >日期：${(marker as any).acttime}</div>
            <div>经纬度:${(marker as any).lnglat}</div>
            <div>是否有蚁巢:${isnest}</div>
            <div style="width:100px;height:100px">
            <img src='${img[0]}' style="width:100px;height:100px"/>
            </div>
            <a href="${img[0]}" target='blank'>打开图片</a>
            </div>`; 
            (tcnocontent as any).on('click', markerClick);
       }
       else{
        (tcnocontent as any).content = `<div>
            <div >日期：${(marker as any).acttime}</div>
            <div>经纬度:${(marker as any).lnglat}</div>
            <div>是否有蚁巢:${isnest}</div>
            </div>`; 
            (tcnocontent as any).on('click', markerClick);
       }
          // 设置标记点文本
            //默认初始化不出现信息窗体,打开初始化就出现信息窗体
            // markerss.emit('click', {target: markerss});
            (tccontents as any).push(tcnocontent);
      });}
     
  if(gjjsy){
   // 工作轨迹
   gjjsy.forEach( function(marker) {
    // 轨迹
     if((marker as any).lnglats!==""){
    
       let lnglats=[];
  let ckpoints=[];

      (marker as any).lnglats=(marker as any).lnglats.split(';');
     (marker as any).lnglats.forEach(i => {
            let lng=i.split(',')[0]*1
            let lat=i.split(',')[1]*1
           let lnglat:any[]=[lng,lat];
          ( lnglats as any).push(lnglat)
          
        });

   if((marker as any).ckpoints!==null){

    (marker as any).ckpoints=(marker as any).ckpoints.split(';');
    if(ckpoints!==null){
        (marker as any).ckpoints.forEach(i => {
            let lng=i.split(',')[0]*1
            let lat=i.split(',')[1]*1
           let lnglat:any[]=[lng,lat];
          (ckpoints as any).push(lnglat)
        });
       (ckpoints as any).forEach(i=>{
          let jg= new AMap.Marker({
            map: map,
            position: i, //基点位置
            zIndex: 10,
            anchor: 'bottom-center',
            icon: new AMap.Icon({     
            image:'//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png',
            size: new AMap.Size(25, 25),  //图标大小
            imageSize: new AMap.Size(25,25),
          }),
          });
          // (jg as any).on('click', markerClick);
          (jgs as any).push(jg)
        })
      }
   }
        // 开始图标
       let start= new AMap.Marker({
            map: map,
            position: lnglats[0], //基点位置
            icon: "https://webapi.amap.com/theme/v1.3/markers/n/start.png",
            zIndex: 10,
            anchor: 'bottom-center',
        });
        // 结束图标
        let end=new AMap.Marker({
            map: map,
            position: lnglats[lnglats.length-1], //基点位置
            icon: "https://webapi.amap.com/theme/v1.3/markers/n/end.png",
            zIndex: 10,
            anchor: 'bottom-center',
        });
        (starts as any).push(start);
        (ends as any).push(end);
        // 点击图标
        
        (start as any).content = `<div>
          <div >开始时间：${(marker as any).sttime}</div>
          </div>`; 
          (end as any).content = `<div>
          <div >结束时间：${(marker as any).edtime}</div>
          </div>`; 
         
          (start as any).on('click', markerClick);
          (end as any).on('click', markerClick);
          gjjsyline= new  AMap.Polyline({
              path: lnglats,
              strokeColor: "#68e7f9",
              strokeWeight: 6,
              strokeOpacity: 0.9,
              zIndex: 60,
              bubble: true,
              showDir:true,
              strokeStyle:'solid',
              cursor:'pointer',
              start: `<div>
          <div >开始时间：${(marker as any).sttime}</div>
          </div>`,
          end:`<div>
          <div >结束时间：${(marker as any).edtime}</div>
          </div>`,
          ckpoint:ckpoints

        });
        (map as any).add( gjjsyline);
        ( gjjsyline as any).on('click', lineClick);
        ( gjjsyline as any).on('dblclick', reshow);
        gjjsyarea.push( gjjsyline)

}  

    });}
          (map as any).add(bjfkspy);
          (map as any).add(bjyqspy);
          endLoading()
  })
    map = e;
  }
  // 信息窗体显示以及关闭
  function markerClick(e) {
          infoWindow.setContent(e.target.content);
          infoWindow.open(map, e.target.getPosition());
      }
      // 折线点击隐藏
function lineClick(e) {
  (map as any).remove(starts);
  (map as any).remove(ends);
  (map as any).remove(jgs);
  let len=e.target._opts.path.length
  let jgpoint=e.target._opts.ckpoint
  for(let i=0;i< gjjsyarea.length;i++){
    gjjsyarea[i].setOptions({strokeColor:'#68e7f9'});
    ( gjjsyarea[i] as any).hide()
  }
      // 开始图标
      let start= new AMap.Marker({
            map: map,
            position:e.target._opts.path[0], //基点位置
            icon: "https://webapi.amap.com/theme/v1.3/markers/n/start.png",
            zIndex: 10,
            anchor: 'bottom-center',
        });
        (start as any).content=e.target._opts.start;
        // 结束图标
        let end=new AMap.Marker({
            map: map,
            position:e.target._opts.path[len-1], //基点位置
            icon: "https://webapi.amap.com/theme/v1.3/markers/n/end.png",
            zIndex: 10,
            anchor: 'bottom-center',
        });
        (end as any).content=e.target._opts.end;
        // 经过图标
        (jgpoint as any).forEach(i=>{
          let jg= new AMap.Marker({
            map: map,
            position: i, //基点位置
            zIndex: 10,
            anchor: 'bottom-center',
            icon: new AMap.Icon({     
            image:'//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png',
            size: new AMap.Size(25, 25),  //图标大小
            imageSize: new AMap.Size(25,25),
          }),
          });
          (jg as any).on('click', markerClick);
          (jgs as any).push(jg)
        });
        (starts as any).push(start);
        (ends as any).push(end);
        // // 点击图标
          (start as any).on('click', markerClick);
          (end as any).on('click', markerClick);
        e.target.setOptions({strokeColor:'yellow'});
        e.target.show()
    }
    // 折线双击显示
    function reshow(e){
      (map as any).add(starts);
      (map as any).add(ends);
      (map as any).add(jgs)
  for(let i=0;i< gjjsyarea.length;i++){
    gjjsyarea[i].setOptions({strokeColor:'#68e7f9'});
    ( gjjsyarea[i] as any).show()
  }
    }

  // 绘制边界
  const reinit=(id,types,aname,yarea,e)=>{
   startLoading();
     (map as any).remove(bjfkspy);
     (map as any).remove(nocontents);
     (map as any).remove(tccontents);
     (map as any).remove(bjsbypy);
     (map as any).remove(bjyqspy);
     (map as any).remove(gjjsyarea);
     (map as any).remove(starts);
     (map as any).remove(ends)
     bjfkspy=[]
     nocontents=[];
     tccontents=[]
     bjyqspy=[];
     bjfksarea=[]
    bjyqsarea=[]
    gjjsyarea=[]
     bjfks.length=0
     bjsby.length=0
     gjjsy=[]
     yjdatas=[]
     tcdatas=[]
    axios.get('https://e7luck.cn/hhycc/user/jcguijis?pjid='+id+'&ctype='+type.value+'&aid='+aname+'&pid='+yarea).then(res=>{
      console.log(res)
    let data=res.data.data
     bjfks=data.bjfks
     bjyqs=data.bjyqs
     gjjsy=data.gjjsy
     yjdatas=data.yjdatas
     tcdatas=data.tcdatas
     if(bjfks){
     // 防控区边界
     bjfks.forEach( gj=>{
        let lnglats=[];
        (gj as any)=(gj as any).split(';');
        (gj as any).forEach( i => {
              let lng=i.split(',')[0]*1
              let lat=i.split(',')[1]*1
             let lnglat:any[]=[lng,lat];
            ( lnglats as any).push(lnglat)
        })
         bjfksarea.push(lnglats)
          for(var j=0;j<bjfksarea.length;j++){
        let bezierCurve = new AMap.Polygon({
              path:bjfksarea[j],
              isOutline: true,
              fillColor: 'transparent',
              borderWeight: 1,
              strokeColor: "#e02fff", 
              strokeOpacity: 1,
              strokeWeight: 2,
              // 线样式还支持 'dashed'
              strokeStyle: "solid",
              // strokeStyle是dashed时有效
              strokeDasharray: [10, 10],
              lineJoin: 'round',
              lineCap: 'round',
              zIndex: 50,
          });
          (bjfkspy as any).push(bezierCurve);
          }
      })}
     if(bjyqs){
     // 样区边界
     bjyqs.forEach( gj=>{
        let lnglats=[];
        (gj as any)=(gj as any).split(';');
        (gj as any).forEach( i => {
              let lng=i.split(',')[0]*1
              let lat=i.split(',')[1]*1
             let lnglat:any[]=[lng,lat];
            ( lnglats as any).push(lnglat)
        })
          bjyqsarea.push(lnglats)
          for(var j=0;j<bjyqsarea.length;j++){
        let bezierCurve = new AMap.Polygon({
              path:bjyqsarea[j],
              isOutline: true,
              fillColor: 'transparent',
              borderWeight: 1,
              strokeColor: "#bd478a", 
              strokeOpacity: 1,
              strokeWeight: 2,
              // 线样式还支持 'dashed'
              strokeStyle: "solid",
              // strokeStyle是dashed时有效
              strokeDasharray: [10, 10],
              lineJoin: 'round',
              lineCap: 'round',
              zIndex: 50,
          });
          ( bjyqspy as any).push(bezierCurve);
          }
      })}
 
if(yjdatas){
  //     //诱集数据
  yjdatas.forEach( function(marker) {
    let lng=(marker as any).lnglat.split(',')[0]
      let lat=(marker as any).lnglat.split(',')[1]
          // 无文本的标记点
          let nocontent= new AMap.Marker({
              map: map,
              icon: new AMap.Icon({     
              image: require('/static/img/4.png'),
              size: new AMap.Size(25, 25),  //图标大小
              imageSize: new AMap.Size(25,25),
            }),
          position: [lng,lat],
          offset: new AMap.Pixel(-13, -30)
          });
        let img
        if((marker as any).imgurl!==null)
        {
          img=(marker as any).imgurl.split(';');
        }
          (nocontent as any).on('click', markerClick);
          if(img)
       {
         // 设置信息窗体
         (nocontent as any).content = `<div>
            <div >日期：${(marker as any).acttime}</div>
            <div>经纬度:${(marker as any).lnglat}</div>
            <div>工蚁数:${(marker as any).antnum}</div>
            <div style="width:100px;height:100px">
            <img src='${img[0]}' style="width:100px;height:100px"/>
            </div>
            <a href="${img[0]}" target='blank'>打开图片</a>
            </div>`; 
            (nocontent as any).on('click', markerClick);
       }
       else{
        (nocontent as any).content = `<div>
            <div >日期：${(marker as any).acttime}</div>
            <div>经纬度:${(marker as any).lnglat}</div>
            <div>工蚁数:${(marker as any).antnum}</div>
            </div>`; 
            (nocontent as any).on('click', markerClick);
       }
          // 设置标记点文本
            //默认初始化不出现信息窗体,打开初始化就出现信息窗体
            // markerss.emit('click', {target: markerss});
            (nocontents as any).push(nocontent);
      });}
 if(tcdatas){
 //     // 踏查数据
 tcdatas.forEach( function(marker) {
      let isnest
      let lng=(marker as any).lnglat.split(',')[0]
      let lat=(marker as any).lnglat.split(',')[1]
          // 无文本的标记点
          let tcnocontent= new AMap.Marker({
              map: map,
              icon: new AMap.Icon({     
              image: require('/static/img/2.png'),
              size: new AMap.Size(25, 25),  //图标大小
              imageSize: new AMap.Size(25,25),
            }),
          position: [lng,lat],
          offset: new AMap.Pixel(-13, -30)
          });
        let img
        if((marker as any).imgurl!==null)
        {
          img=(marker as any).imgurl.split(';');
        }
          (tcnocontent as any).on('click', markerClick);
          if(img)
       {
       
        if((marker as any).isnest==true){
          isnest='是'
        }else if((marker as any).isnest==false){
          isnest='否'
        }
         // 设置信息窗体
         (tcnocontent as any).content = `<div>
            <div >日期：${(marker as any).acttime}</div>
            <div>经纬度:${(marker as any).lnglat}</div>
            <div>是否有蚁巢:${isnest}</div>
            <div style="width:100px;height:100px">
            <img src='${img[0]}' style="width:100px;height:100px"/>
            </div>
            <a href="${img[0]}" target='blank'>打开图片</a>
            </div>`; 
            (tcnocontent as any).on('click', markerClick);
       }
       else{
        (tcnocontent as any).content = `<div>
            <div >日期：${(marker as any).acttime}</div>
            <div>经纬度:${(marker as any).lnglat}</div>
            <div>是否有蚁巢:${isnest}</div>
            </div>`; 
            (tcnocontent as any).on('click', markerClick);
       }
          // 设置标记点文本
            //默认初始化不出现信息窗体,打开初始化就出现信息窗体
            // markerss.emit('click', {target: markerss});
            (tccontents as any).push(tcnocontent);
      });}
     
  if(gjjsy){
   // 工作轨迹
   gjjsy.forEach( function(marker) {
    // 轨迹
     if((marker as any).lnglats!==""){
    
       let lnglats=[];
  let ckpoints=[];

      (marker as any).lnglats=(marker as any).lnglats.split(';');
     (marker as any).lnglats.forEach(i => {
            let lng=i.split(',')[0]*1
            let lat=i.split(',')[1]*1
           let lnglat:any[]=[lng,lat];
          ( lnglats as any).push(lnglat)
          
        });

   if((marker as any).ckpoints!==null){

    (marker as any).ckpoints=(marker as any).ckpoints.split(';');
    if(ckpoints!==null){
        (marker as any).ckpoints.forEach(i => {
            let lng=i.split(',')[0]*1
            let lat=i.split(',')[1]*1
           let lnglat:any[]=[lng,lat];
          (ckpoints as any).push(lnglat)
        });
       (ckpoints as any).forEach(i=>{
          let jg= new AMap.Marker({
            map: map,
            position: i, //基点位置
            zIndex: 10,
            anchor: 'bottom-center',
            icon: new AMap.Icon({     
            image:'//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png',
            size: new AMap.Size(25, 25),  //图标大小
            imageSize: new AMap.Size(25,25),
          }),
          });
          // (jg as any).on('click', markerClick);
          (jgs as any).push(jg)
        })
      }
   }
        // 开始图标
       let start= new AMap.Marker({
            map: map,
            position: lnglats[0], //基点位置
            icon: "https://webapi.amap.com/theme/v1.3/markers/n/start.png",
            zIndex: 10,
            anchor: 'bottom-center',
        });
        // 结束图标
        let end=new AMap.Marker({
            map: map,
            position: lnglats[lnglats.length-1], //基点位置
            icon: "https://webapi.amap.com/theme/v1.3/markers/n/end.png",
            zIndex: 10,
            anchor: 'bottom-center',
        });
        (starts as any).push(start);
        (ends as any).push(end);
        // 点击图标
        
        (start as any).content = `<div>
          <div >开始时间：${(marker as any).sttime}</div>
          </div>`; 
          (end as any).content = `<div>
          <div >结束时间：${(marker as any).edtime}</div>
          </div>`; 
         
          (start as any).on('click', markerClick);
          (end as any).on('click', markerClick);
          gjjsyline= new  AMap.Polyline({
              path: lnglats,
              strokeColor: "#68e7f9",
              strokeWeight: 6,
              strokeOpacity: 0.9,
              zIndex: 60,
              bubble: true,
              showDir:true,
              strokeStyle:'solid',
              cursor:'pointer',
              start: `<div>
          <div >开始时间：${(marker as any).sttime}</div>
          </div>`,
          end:`<div>
          <div >结束时间：${(marker as any).edtime}</div>
          </div>`,
          ckpoint:ckpoints

        });
        (map as any).add( gjjsyline);
        ( gjjsyline as any).on('click', lineClick);
        ( gjjsyline as any).on('dblclick', reshow);
        gjjsyarea.push( gjjsyline)

}  

    });}
          (map as any).add(bjfkspy);
          (map as any).add(bjyqspy);
          endLoading()
  })
  }
  const check=()=>{
    point.value='样区'
    let types
    let aname=area.value
    let yname=yarea.value
    if(type.value=='监测'){
      types=1
    }
    if(type.value=='评估'){
      types=4
    }
    if(area.value=='全部'||area.value==''){
      aname='0'
    }if(yarea.value=='全部'||yarea.value==''){
      yname=0 as any as string
    }
    reinit(id,types,aname,yname,event)
  
  }
  
  
      
      </script>
  
  <style scoped>
    /* *{
      margin:0;
      padding:0;
    } */
  .demo-image__error .image-slot {
    font-size: 30px;
  }
  .demo-image__error .image-slot .el-icon {
    font-size: 30px;
  }
  .demo-image__error .el-image {
    width: 100%;
    height: 200px;
  }
    .map-page-container{
      width: 100%;
      height:100%;
      position:relative;
      top:0;
      left:0;
    }
    .block{
    position: absolute;
    top: 14%;
    left: 2%;
    text-align: left;
  }
    .block2{
   width:80%;
    position: absolute;
    top: 2%;
    padding-left:15%
   /* left: 28%; */
  }
   .icon{
    width:20px;
    height:20px;
    -webkit-border-radius: 50% 50% 50% 0;
      border-radius: 50% 50% 50% 0;
    background: green;
      border:1px solid white;
      -webkit-transform: rotate(-45deg);
      -moz-transform: rotate(-45deg);
      -o-transform: rotate(-45deg);
      -ms-transform: rotate(-45deg);
      transform: rotate(-45deg);
      margin:5px;
      display: inline-block;
      vertical-align: middle;
  }
  </style>
  <style lang="less" scoped>
    /deep/ .el-main{
      width:50%!important;
    }
  </style>