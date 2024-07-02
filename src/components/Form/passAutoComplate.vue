<template>
  <span class="passComplate">
    <input type="text" autocomplete="off">
    <input type="password" autocomplete="off">
    <input type="password" autocomplete="off">
  </span>
</template>

<style lang="scss" scoped>
.passComplate {
  position: fixed !important;
  z-index: -1 !important;
  bottom: -999px !important;
}
</style>