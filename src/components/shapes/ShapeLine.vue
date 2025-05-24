<script setup>
defineProps({
  shape: {},
  selectedId: String,
  onMouseDown: Function
})
</script>
<template>
  <line
      :x1="shape.x"
      :y1="shape.y"
      :x2="shape.x + shape.length"
      :y2="shape.y"
      stroke="black"
      @mousedown="e => onMouseDown(e, shape)"
  />
</template>