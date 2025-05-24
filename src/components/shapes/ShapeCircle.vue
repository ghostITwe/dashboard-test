<script setup>
defineProps({
  shape: {},
  selectedId: String,
  onMouseDown: Function
})
</script>

<template>
  <circle
      :cx="shape.x"
      :cy="shape.y"
      :r="shape.radius"
      fill="lightgreen"
      :stroke="selectedId === shape.id ? 'red' : 'black'"
      :stroke-width="selectedId === shape.id ? 3 : 1"
      @mousedown="e => onMouseDown(e, shape)"
  />
</template>