<template>
  <div class="map-edit">
    <!-- <el-button @click="initEdit(markerRef)" :disabled="isEdit" size="default">初始化</el-button> -->
    <template v-if="EditRef">
      <el-button @click="startEdit()" size="default" v-if="!isEdit">开始编辑</el-button>
      <el-button @click="endEdit()" size="default" v-if="isEdit">结束编辑</el-button>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  AMap: Object,
  mapRef: Object,
})
const emit = defineEmits(["change"])
const type = inject("type")

const EditRef = ref(null);
const isEdit = ref(false)
const markerRef = ref(null)
const notChange = ref(true) // 是否打断 emit

const initEdit = (marker) => {
  markerRef.value = marker
  const edit = type.value == 'circle' ? new props.AMap.CircleEditor(props.mapRef, marker) : new props.AMap.PolygonEditor(props.mapRef, marker)
  edit.on('end', e => {
    if (notChange.value) return
    let { target } = e
    let { center, radius } = target._opts
    let newCenter = Array.isArray(center) ? center : center.toArray()
    mapPathToAddress(newCenter).then((val) => {
      let { address, adcode, adcodeAddress } = val
      emit("change", {
        type: type.value,
        data: {
          type: type.value,
          path: JSON.stringify(newCenter),
          address: address,
          radius: radius + '',
          adcode: calcAdCode(adcode).join(","),
          adcodeArr: calcAdCode(adcode),
          adcodeAddress
        },
      })
    })
  })
  EditRef.value = edit
}
const startEdit = () => {
  if (EditRef.value == null) return
  isEdit.value = true
  EditRef.value.open()
}
const endEdit = (notchange = false) => {
  notChange.value = notchange
  if (EditRef.value == null) return
  isEdit.value = false
  EditRef.value.close(notchange)
}
const removeEditMarker = () => {
  props.mapRef.remove(markerRef.value)
}
// 经纬度转地址
function mapPathToAddress(val) {
  return new Promise(resolve => {
    let geocoder = new props.AMap.Geocoder({
      city: '全国'
    })
    geocoder.getAddress(val, (status, result) => {
      if (status === 'complete' && result.info === 'OK') {
        let { addressComponent, formattedAddress } = result.regeocode
        resolve({
          address: formattedAddress,
          adcode: addressComponent.adcode,
          adcodeAddress: `${addressComponent.province},${addressComponent.city == '' ? '市辖区' : addressComponent.city},${addressComponent.district}`,
        })
      }
    })
  })
}

// 计算全部adcode
const calcAdCode = adcode => {
  if (adcode == '' || adcode.length == 0) return []
  if (Array.isArray(adcode)) adcode = adcode.slice(-1) + ''
  let adcodes = [],
    ad1 = adcode.slice(0, 2),
    ad2 = adcode.slice(0, 4);
  adcodes = [ad1 + '0000', ad2 + '00', adcode]
  return adcodes
}

defineExpose({
  init: initEdit,
  isEdit,
  endEdit,
  removeEditMarker
});
</script>
<style lang="scss" scoped>
.map-edit {
  position: absolute;
  top: 20px;
  right: 30px;
}
</style>