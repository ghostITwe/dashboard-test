<script setup>
defineProps({
  shape: {},
  selectedId: String,
  onMouseDown: Function
})
</script>
<template>
  <text
      :x="shape.x"
      :y="shape.y"
      font-size="16"
      fill="black"
      :stroke="selectedId === shape.id ? 'red' : 'none'"
      :stroke-width="selectedId === shape.id ? 1 : 0"
      @mousedown="e => onMouseDown(e, shape)"
      style="user-select:none; cursor: move;"
  >
    {{ shape.text }}
  </text>
</template>