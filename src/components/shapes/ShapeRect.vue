<script setup>
defineProps({
  shape: {},
  selectedId: String,
  onMouseDown: Function
})
</script>
<template>
  <rect
      :x="shape.x"
      :y="shape.y"
      :width="shape.width"
      :height="shape.height"
      fill="lightblue"
      :stroke="selectedId === shape.id ? 'red' : 'black'"
      :stroke-width="selectedId === shape.id ? 3 : 1"
      @mousedown="e => onMouseDown(e, shape)"
  />
</template>