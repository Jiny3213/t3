'use client'
import AMapLoader from "@amap/amap-jsapi-loader";
import "@amap/amap-jsapi-types";
import { useState, useEffect } from "react";
import { env } from "~/env"

// https://lbs.amap.com/tools/picker 高德坐标拾取
export default function Travel() {
  useEffect(() => {
    if(window !== undefined) {
      import('@amap/amap-jsapi-loader').then(async AMapLoader => {
        await AMapLoader.load({
          key: "2ab558f5882448e52cf054c18807eee8", //申请好的 Web 端开发者 Key，首次调用 load 时必填
          version: "2.0", //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
          plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['AMap.Scale','...','...']
        })
        const map = new AMap.Map("container", {
          zoom: 16,
          center: [113.368885,23.097868],
          // mapStyle: "amap://styles/whitesmoke", //设置地图的显示样式
          viewMode: "2D"
        })
        //创建一个 Marker 实例：
        const marker = new AMap.Marker({
          position: new AMap.LngLat(113.373177,23.094979), //经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: "停车场",
          label: {
            content: '这是标注',
            direction: 'bottom',
            offset: new AMap.Pixel(0, 0)
          }
        });
        marker.on("click", function (e) {
          alert("你点击了Marker");
        })
        //将创建的点标记添加到已有的地图实例：
        map.add(marker);

        // AMap.plugin("AMap.Driving", function () {
        //   var driving = new AMap.Driving({
        //     policy: 0, //驾车路线规划策略，0是速度优先的策略
        //     //map 指定将路线规划方案绘制到对应的 AMap.Map 对象上
        //     map: map,
        //     //panel 指定将结构化的路线详情数据显示的对应的 DOM 上，传入值需是 DOM 的 ID
        //     panel: "my-panel",
        //   });
        //   var points = [
        //     { keyword: "六元素体验中心", city: "广州" },
        //     { keyword: "文化公园（地铁站）", city: "广州" },
        //   ];
        //   driving.search(points, function (status, result) {
        //     console.log(status, result)
        //     //status：complete 表示查询成功，no_data 为查询无结果，error 代表查询错误
        //     //查询成功时，result 即为对应的驾车导航信息
        //   });
        // });
      })
    }
  }, [])
  
  return (
  <div>
    <div id="container" style={{width: '100%', height: '300px'}}>
      {/* <div id="my-panel"></div> */}
    </div>
    <div id="my-panel"></div>
  </div>
  )
}