<template>
  <v-chart :option="option1" autoresize :style="{ height: height + 'px' }" />
</template>

<script setup name="">
const props = defineProps({
  height: Number,
  CFG: Object,
});


const option1 = {
    legend: {
      top: "bottom",
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    series: [
      {
        name: "",
        type: "pie",
        radius: [40, 100],
        center: ["45%", "50%"],
        roseType: "area",
        itemStyle: {
          borderRadius: 0,
        },
        data: [
          { value: 40, name: "焦煤" },
          { value: 38, name: "精煤" },
          { value: 32, name: "煤炭" },
          { value: 30, name: "水泥" },
          { value: 28, name: "钢筋" },
        ],
      },
    ],
  };

</script>

<style scoped></style>
