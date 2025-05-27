<script setup>
defineProps({
  shape: {},
  selectedId: String,
  onMouseDown: Function,
})
</script>

<template>
  <image
      :x="shape.x"
      :y="shape.y"
      :width="shape.width"
      :height="shape.height"
      :href="shape.href"
      @mousedown="e => onMouseDown(e, shape)"
  />
</template>

<style scoped>

</style>