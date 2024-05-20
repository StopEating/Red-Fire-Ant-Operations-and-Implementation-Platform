<template>
    <div class="map-page-container" style="width:100%">
   
      <!-- <SelectArea></SelectArea> -->
      <!-- 描述 -->
      <div class="block" style="z-index:200;margin-left:0.5%;;font-size:6px;background-color: aliceblue;">
              <div style="margin-bottom:5px">
                标记点区分：
              </div>
              <div>
               <img src="@/assets/img/0.png" alt="" style="width:20px;height:20px"><span>:样区标记点</span>
              </div>
              <div>
               <img src="@/assets/img/1.png" alt="" style="width:20px;height:20px"><span>:区域撒播数据标记点</span>
              </div>
              <div>
               <img src="@/assets/img/2.png" alt="" style="width:20px;height:20px"><span>:蚁巢环施数据标记点</span>
              </div>
              <div>
              <span style="color:#e02fff;font-weight: 600;font-size: 20px;">——</span><span>:防控区边界</span>
              </div>
              <div>
              <span style="color:#bd478a;font-weight: 600;font-size: 20px;">——</span><span>:样区边界</span>
              </div>
    </div>
      <!-- 选择框 -->
      <div class="block2"  style="z-index:99999;">
        <el-breadcrumb separator-icon="ArrowRight" style="padding:10px;margin:0;margin-left:-18%">
        <el-breadcrumb-item :to="{path:'/projectdetail',query:{id}}">项目详情</el-breadcrumb-item>
      <el-breadcrumb-item >防控数据地图</el-breadcrumb-item>
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
    <el-select placeholder="请选择防控区" style="margin-right:1%;width: 15%;" v-model="area">
      <el-option
        v-for="item in areas"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select placeholder="请选择显示标记点" style="margin-right:1%;width: 10%;" v-model="point">
      <el-option
        v-for="item in points"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        @click="changepoint"
        >
      </el-option>
    </el-select>
    <el-switch
      v-model="showad"
      width="4em"
      active-text="显示地点"
      inactive-text="隐藏地点"
      @change="ifshow"
    />
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
        @init="init"
        style="width:100%;height:100%"
      ><el-amap-layer-satellite></el-amap-layer-satellite></el-amap>
    </div>
  </template>

  <script lang="ts" setup>
    import SelectArea from '@/components/common/SelectArea.vue'
    import axios from 'axios'
    import {useRouter} from 'vue-router'
    import {ref,reactive} from "vue";
    import { endLoading, startLoading } from '@/untils/loading';
    const router=useRouter()
    const id=router.currentRoute.value.query.id
    let city=router.currentRoute.value.query.city
    const showad = ref(true)
    const zoom = ref(35);
    const center = ref([116.471354, 39.994257]);
    let map = null;
     let markers=reactive([])
     let qymarkers=reactive([])
     let ycmarkers=reactive([])
     interface options{
      label:string
      value:string
     }
     let areas=reactive<options[]>([])
      const types=[
        {
          value:'防控',
          label:'防控'
        },
        {
          value:'回防',
          label:'回防'
        }
      ]
      const points=[
            {value:'样区',label:'样区'},
            {value:'样区+监测点',label:'样区+防控点'}
       ]
      //  查询条件
        let point=ref('样区')
        let area=ref('全部')
        let type=ref('防控')
        // 样区点数组
     let delmarkers=[]
     let nocontents=[]
    //  监测点数组
      let qypoints=[]
      let ycpoints=[]
      let qyarea:any[]=[]
      let infoWindow
      let bjfks=reactive([])//防控边界
     let bjyqs=reactive([])//样区边界
     let bjfkspy=[]//防控边界数组
     let bjyqspy=[]//样区边界数组
     let bjfksarea:any[]=[]
      let bjyqsarea:any[]=[]
    
        // 进入卫星图层
        const towxmap=()=>{
    router.push({path:'/projectdetail/fdatamap',query:{id,city}})
  }
     axios.get('https://e7luck.cn/hhycc/user/listareas?pjid='+id).then(res=>{
     areas.push({value:'全部',label:'全部'})
     let data=res.data.data
     data.forEach(i => {
      areas.push({value:i.id,label:i.aname})
     });
     })
    
    
    const init = (e) => {
     infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
      // 绘制边界
      AMap.plugin('AMap.DistrictSearch', function () {
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
            strokeWeight: 5,
            path: bounds[i],
            fillOpacity: 0.4,
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
      // 绘制点
    axios.get('https://e7luck.cn/hhycc/user/mapfkdata?pid='+id+'&ctype='+2+'&aid='+0).then(res=>{
      console.log(res)
      // 获取样区点
       markers=res.data.data.arrs
       bjfks=res.data.data.bjfks
       bjyqs=res.data.data.bjyqs
       if(markers!==null){
        //  获取监测点
        markers.forEach(i=>{
      if((i as any).fkdatas!==null){
       ( (i as any).fkdatas as any).forEach(j => {
          if((j as any).ftype=='区域撒播'){
            (qymarkers as any).push(j)
          }
          if((j as any).ftype=='蚁巢环施'){
          (ycmarkers as any).push(j)
       }
        });
      
     
      }
       })
      //  绘制标记点
      // 样区点：
    markers.forEach(function(marker) {
      let lng=(marker as any).lnglat.split(',')[0]
      let lat=(marker as any).lnglat.split(',')[1]
       // 有文本的标记点
          let markerss=new AMap.Marker({
                map: map,
                enableHighAccuracy: true, 
                icon: new AMap.Icon({     
                image: require('/static/img/0.png'),
                size: new AMap.Size(25, 25),  //图标大小
                imageSize: new AMap.Size(25,25),
              }),
            position: [lng,lat],
            offset: new AMap.Pixel(-13, -30)
            });
            // 无文本的标记点
            let nocontent=new AMap.Marker({
                map: map,
                icon: new AMap.Icon({     
                image: require('/static/img/0.png'),
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
           
            (markerss as any).on('click', markerClick);
            // 设置标记点文本
            (markerss as any).setLabel({
            direction:'right',
            offset: new AMap.Pixel(10, 0),  //设置文本标注偏移量
            content: "<div class='info'>"+`${(marker as any).addr}`+"</div>", //设置文本标注内容
        });
       if(img)
        {
           // 设置信息窗体
           (markerss as any).content = `<div>
              <div>样区：${(marker as any).addr}</div>
              <div>防控区:${(marker as any).aname}</div>
              <div>日期：${(marker as any).adddate}</div>
              <div>经纬度:${(marker as any).lnglat}</div>
              <div style="width:100px;height:100px">
              <img src='${img[0]}' style="width:100px;height:100px"/>
              </div>
              <a href="${img[0]}" target='blank'>打开图片</a>
              </div>`;
           (nocontent as any).content = `<div>
              <div >样区：${(marker as any).addr}</div>
              <div>防控区:${(marker as any).aname}</div>
              <div>日期：${(marker as any).adddate}</div>
              <div>经纬度:${(marker as any).lnglat}</div>
              <div style="width:100px;height:100px">
              <img src='${img[0]}' style="width:100px;height:100px"/>
              </div>
              <a href="${img[0]}" target='blank'>打开图片</a>
              </div>`; 
              (nocontent as any).on('click', markerClick);
        }
            // 设置标记点文本
              //默认初始化不出现信息窗体,打开初始化就出现信息窗体
              // markerss.emit('click', {target: markerss});
              (nocontents as any).push(nocontent);
              (delmarkers as any).push(markerss)
        });
    }
     if(bjfks!==null){
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
                strokeWeight: 5,
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
        });
    
        (map as any).add(bjfkspy);
        
     }
     if(bjyqs!==null)
     {
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
                strokeWeight: 5,
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
        });
        (map as any).add(bjyqspy);
     }
    })
      map = e;
      (map as any).setFitView();
    }
    // 标记点显示
    const changepoint=()=>{
     // 绘制监测点
    if(point.value=='样区+监测点'){
      showad.value=false
      ifshow(showad.value)
      //区域撒播
    qymarkers.forEach(function(marker) {
      let lng=(marker as any).lnglat.split(',')[0]
      let lat=(marker as any).lnglat.split(',')[1]
       // 有文本的标记点
        let markers=new AMap.Marker({
                map: map,
                enableHighAccuracy: true, 
                icon: new AMap.Icon({     
                image: require('/static/img/1.png'),
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
       
        if(img)
        {
             // 设置信息窗体
             (markers as any).content = `<div>
              <div>日期:${(marker as any).acttime}</div>
              <div>防控方式：${(marker as any).ftype}</div>
              <div>样区面积:${(marker as any).carea}亩</div>
              <div>经纬度:${(marker as any).lnglat}</div>
              <div style="width:100px;height:100px">
              <img src='${img[0]}' style="width:100px;height:100px"/>
              </div>
              <a href="${img[0]}" target='blank'>打开图片</a>
              </div>`;
            (markers as any).on('click', markerClick);
        }else{
           // 设置信息窗体
           (markers as any).content = `<div>
            <div>日期:${(marker as any).acttime}</div>
              <div>防控方式：${(marker as any).ftype}</div>
              <div>样区面积:${(marker as any).carea}亩</div>
              <div>经纬度:${(marker as any).lnglat}</div>
              </div>`;
            (markers as any).on('click', markerClick);
        }
        (qypoints as any).push(markers)
    if((marker as any).lnglats!==""){
      let lnglats=[];
      (marker as any).lnglats=(marker as any).lnglats.split(';');
      (marker as any).lnglats.forEach(i => {
                let lng=i.split(',')[0]*1
                let lat=i.split(',')[1]*1
               let lnglat:any[]=[lng,lat];
              ( lnglats as any).push(lnglat)
            });
            qyarea.push(lnglats)
            for(var i=0;i<qyarea.length;i++){
                var bezierCurve = new  AMap.Polygon({
                path:qyarea[i],
                isOutline: true,
                outlineColor: '#ffeeff',
                borderWeight: 1,
                strokeColor: "#ccebc5", 
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
            (map as any).add(bezierCurve);
            }
    }
        });
        //蚁巢环施
    ycmarkers.forEach(function(marker) {
      let lng=(marker as any).lnglat.split(',')[0]
      let lat=(marker as any).lnglat.split(',')[1]
       // 有文本的标记点
      let markerss =new AMap.Marker({
                map: map,
                enableHighAccuracy: true, 
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
        if(img)
        {
             // 设置信息窗体
             (markerss as any).content = `<div>
              <div>日期:${(marker as any).acttime}</div>
              <div>防控方式：${(marker as any).ftype}</div>
              <div>样区面积:${(marker as any).carea}亩</div>
              <div>经纬度:${(marker as any).lnglat}</div>
              <div style="width:100px;height:100px">
              <img src='${img[0]}' style="width:100px;height:100px"/>
              </div>
              <a href="${img[0]}" target='blank'>打开图片</a>
              </div>`;
            (markerss as any).on('click', markerClick);
        }else{
           // 设置信息窗体
           (markerss as any).content = `<div>
            <div>日期:${(marker as any).acttime}</div>
              <div>防控方式：${(marker as any).ftype}</div>
              <div>样区面积:${(marker as any).carea}亩</div>
              <div>经纬度:${(marker as any).lnglat}</div>
              </div>`;
            (markerss as any).on('click', markerClick);
        }
            (ycpoints as any).push(markerss)
        });
    }
        else{
          (map as any).remove(qypoints);
          (map as any).remove(ycpoints)
        }
    }
    const check=()=>{
      showad.value=true
      point.value='样区'
      let types
      let aname=area.value
      if(type.value=='防控'){
        types=2
      }
      if(type.value=='回防'){
        types=3
      }
      if(area.value==''||area.value=='全部'){
    aname='0'
  }
      (map as any).remove(bjfkspy);
       (map as any).remove(bjyqspy);
       bjfkspy=[]
       bjyqspy=[];
       bjfksarea=[]
      bjyqsarea=[]
       bjfks=[]
       bjyqs=[];
       (map as any).remove(nocontents);
       (map as any).remove(delmarkers);
       (map as any).remove(qypoints);
       (map as any).remove(ycpoints);
      ycmarkers.length=0;
      qymarkers.length=0;
       nocontents.length=0;
       delmarkers.length=0;
       startLoading()
      axios.get('https://e7luck.cn/hhycc/user/mapfkdata?pid='+id+'&ctype='+types+'&aid='+aname).then(res=>{
        console.log(res)
      // 获取样区点
     if(res.data&&res.data.data!==null){
      markers=res.data.data.arrs;
      bjfks=res.data.data.bjfks
       bjyqs=res.data.data.bjyqs
       
    if(markers!==null){
        //  获取监测点
        markers.forEach(i=>{
      if((i as any).fkdatas!==null){
       ( (i as any).fkdatas as any).forEach(j => {
          if((j as any).ftype=='区域撒播'){
            (qymarkers as any).push(j)
          }
          if((j as any).ftype=='蚁巢环施'){
          (ycmarkers as any).push(j)
       }
        });
      
     
      }
       })
      //  绘制标记点
      // 样区点：
    markers.forEach(function(marker) {
      let lng=(marker as any).lnglat.split(',')[0]
      let lat=(marker as any).lnglat.split(',')[1]
       // 有文本的标记点
          let markerss=new AMap.Marker({
                map: map,
                enableHighAccuracy: true, 
                icon: new AMap.Icon({     
                image: require('/static/img/0.png'),
                size: new AMap.Size(25, 25),  //图标大小
                imageSize: new AMap.Size(25,25),
              }),
            position: [lng,lat],
            offset: new AMap.Pixel(-13, -30)
            });
            // 无文本的标记点
            let nocontent=new AMap.Marker({
                map: map,
                icon: new AMap.Icon({     
                image: require('/static/img/0.png'),
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
           
            (markerss as any).on('click', markerClick);
            // 设置标记点文本
            (markerss as any).setLabel({
            direction:'right',
            offset: new AMap.Pixel(10, 0),  //设置文本标注偏移量
            content: "<div class='info'>"+`${(marker as any).addr}`+"</div>", //设置文本标注内容
        });
       if(img)
        {
           // 设置信息窗体
           (markerss as any).content = `<div>
              <div>样区：${(marker as any).addr}</div>
              <div>防控区:${(marker as any).aname}</div>
              <div>日期：${(marker as any).adddate}</div>
              <div>经纬度:${(marker as any).lnglat}</div>
              <div style="width:100px;height:100px">
              <img src='${img[0]}' style="width:100px;height:100px"/>
              </div>
              <a href="${img[0]}" target='blank'>打开图片</a>
              </div>`;
           (nocontent as any).content = `<div>
              <div >样区：${(marker as any).addr}</div>
              <div>防控区:${(marker as any).aname}</div>
              <div>日期：${(marker as any).adddate}</div>
              <div>经纬度:${(marker as any).lnglat}</div>
              <div style="width:100px;height:100px">
              <img src='${img[0]}' style="width:100px;height:100px"/>
              </div>
              <a href="${img[0]}" target='blank'>打开图片</a>
              </div>`; 
              (nocontent as any).on('click', markerClick);
        }
            // 设置标记点文本
              //默认初始化不出现信息窗体,打开初始化就出现信息窗体
              // markerss.emit('click', {target: markerss});
              (nocontents as any).push(nocontent);
              (delmarkers as any).push(markerss)
        });
    }
     if(bjfks!==null){
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
                strokeWeight: 5,
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
        });
    
        (map as any).add(bjfkspy);
        
     }
     if(bjyqs!==null)
     {
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
                strokeWeight: 5,
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
        });
        (map as any).add(bjyqspy);
     }
     }
     endLoading()
    })
    
    }
    // 信息窗体显示以及关闭
    function markerClick(e) {
            infoWindow.setContent(e.target.content);
            infoWindow.open(map, e.target.getPosition());
        }
    const ifshow=(e)=>{
    if(e){
      // 显示label
      (map as any).add(delmarkers);
      (map as any).remove(nocontents);
    
    }else{
      // 去掉label
      (map as any).add(nocontents);
        (map as any).remove(delmarkers)
    }
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