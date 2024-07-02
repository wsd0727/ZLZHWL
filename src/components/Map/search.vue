<template>
  <div class="map-search">
    <el-input id="keyword" v-model="keyword" placeholder="搜索位置" size="default"></el-input>
    <div id="output"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  AMap: Object,
  mapRef: Object,
});
const emit = defineEmits(["change", "closeedit"]);
const type = inject("type");
const radius = inject("radius");

const keyword = ref("");
const searchConfig = reactive({
  city: "全国",
  input: "keyword",
  output: "output",
});
const pointConfig = reactive({
  icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
  anchor: "bottom-center",
});
const addSearchPlugin = () => {
  const auto = new props.AMap.AutoComplete(searchConfig);
  const placeSearch = new props.AMap.PlaceSearch({ map: props.mapRef });
  auto.on("select", (res) => {
    emit("closeedit")
    placeSearch.setCity(res.poi.adcode);
    placeSearch.setCityLimit(true);
    // placeSearch.search(res.poi.name); //关键字查询查询
    placeSearch.search(res.poi.name, function (status, result) {
      let newMarker = result.poiList.pois.map((el) => {
        let pos = [el.location.lng, el.location.lat];
        var text = new props.AMap.Text({
          text: `<div>${el.name}<div><div class="text-gray">${el.cityname}${el.adname}${el.address}<div>`,
          anchor: "center", // 设置文本标记锚点
          draggable: false,
          cursor: "pointer",
          angle: 0,
          style: {
            padding: ".25rem",
            "margin-bottom": "1rem",
            "border-radius": ".25rem",
            "background-color": "white",
            width: "13rem",
            "border-width": 0,
            "box-shadow": "0 2px 6px 0 rgba(114, 124, 245, .5)",
            "text-align": "center",
            "font-size": "10px",
            color: "blue",
          },
          position: pos,
        });
        return text;
      });
      props.mapRef.add(newMarker);
    });

    let address = res.poi.name;
    let center = `[${res.poi.location.lng},${res.poi.location.lat}]`;
    let adcode = calcAdCode(res.poi.adcode);
    if (type.value == "point") {
      props.mapRef.clearMap();
      const autoPoint = new props.AMap.Marker({
        position: [res.poi.location.lng, res.poi.location.lat],
        ...pointConfig,
      });
      props.mapRef.add([autoPoint]);
      props.mapRef.setFitView();
    }
    emit("change", {
      type: type.value,
      data: {
        type: type.value,
        path: center,
        address: address,
        radius: radius.value,
        adcode: calcAdCode(adcode).join(","),
        adcodeArr: calcAdCode(adcode)
      },
    });
  });
  placeSearch.on("selectChanged", (res) => {
    emit("closeedit")
    let { selected } = res;
    let { data } = selected;
    let address = `${data.pname}${data.cityname}${data.adname}${data.address}`;
    let center = `[${data.location.lng},${data.location.lat}]`;
    let adcode = calcAdCode(data.adcode);
    emit("change", {
      type: type.value,
      data: {
        type: type.value,
        path: center,
        address: address,
        radius: radius.value,
        adcode: calcAdCode(adcode).join(","),
        adcodeArr: calcAdCode(adcode)
      },
      initEdit: true,
    });
  });
};

// 计算全部adcode
const calcAdCode = (adcode) => {
  if (adcode == "" || adcode.length == 0) return [];
  if (Array.isArray(adcode)) adcode = adcode.slice(-1) + "";
  let adcodes = [],
    ad1 = adcode.slice(0, 2),
    ad2 = adcode.slice(0, 4);
  adcodes = [ad1 + "0000", ad2 + "00", adcode];
  return adcodes;
};

defineExpose({ init: addSearchPlugin });
</script>
<style lang="scss" scoped>
.map-search {
  width: 220px;
  position: absolute;
  top: 20px;
  left: 20px;
  #output {
    background: #fff;
    max-height: 340px;
    overflow: auto;
    overflow-x: hidden;
  }
}

.text-gray {
  color: #555 !important;
  width: 13rem;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  white-space: nowrap !important;
}
</style>