<script setup>
import ShapeRect from './shapes/ShapeRect.vue'
import ShapeCircle from './shapes/ShapeCircle.vue'
import ShapeLine from './shapes/ShapeLine.vue'
import ShapeText from './shapes/ShapeText.vue'

import {ref} from 'vue'
import ShapeImage from "@/components/shapes/ShapeImage.vue";

const shapes = ref([]),
    selectedId = ref(''),
    dragging = ref(false),
    dragOffset = ref({
      x: 0,
      y: 0
    }),
    editingTextId = ref(null),
    editingTextValue = ref(''),
    fileInput = ref('');

function createId() {
  return 'id-' + Math.random().toString(36).substr(2, 9);
}

function createShape(type) {
  const baseData = {
    id: createId(),
    x: 50 + Math.random() * 200,
    y: 50 + Math.random() * 200,
    type
  };

  switch (type) {
    case 'rect':
      shapes.value.push({...baseData, width: 100, height: 60});
      break;
    case 'circle':
      shapes.value.push({...baseData, radius: 40});
      break;
    case 'line':
      shapes.value.push({...baseData, length: 100});
      break;
    case 'text':
      shapes.value.push({...baseData, text: "Text"});
      break;
  }
}

function onMouseDown(e, shape) {
  selectedId.value = shape.id;
  dragging.value = true;

  dragOffset.value.x = e.offsetX - shape.x;
  dragOffset.value.y = e.offsetY - shape.y;
}

function onMouseMove(e) {
  if (!dragging.value || !selectedId.value) return;

  const shape = shapes.value.find(shape => shape.id === selectedId.value)
  if (!shape) return;

  const svg  = e.currentTarget.getBoundingClientRect();

  let x = e.clientX - svg.left - dragOffset.value.x;
  let y = e.clientY - svg.top - dragOffset.value.y;

  shape.x = Math.max(0, Math.min(x, svg.width));
  shape.y = Math.max(0, Math.min(y, svg.height));
}

function onMouseUp() {
  dragging.value = false;
  selectedId.value = '';
}

function startEditingText(shape) {
  editingTextId.value = shape.id;
  editingTextValue.value = shape.text;
}

function endEditingText() {
  if (!editingTextId.value) return;

  const shape = shapes.value.find(shape => shape.id === editingTextId.value);

  if (!shape) return;
  shape.text = editingTextValue.value;
  editingTextId.value = '';
}

function triggerImageUpload() {
  fileInput.value.click();
}

function onUploadImage(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result;
    createImage(dataUrl);
  }
  reader.readAsDataURL(file);
}

function createImage(href) {
  shapes.value.push({
    id: createId(),
    x: 50 + Math.random() * 200,
    y: 50 + Math.random() * 200,
    type: 'image',
    width: 200,
    height: 200,
    href,
  });

  function sendShapesToServer() {
    console.log(JSON.stringify(shapes.value));
  }

  sendShapesToServer();
}

</script>

<template>
  <main>
    <nav>
      <button @click="createShape('rect')">Прямоугольник</button>
      <button @click="createShape('circle')">Круг</button>
      <button @click="createShape('line')">Линия</button>
      <button @click="createShape('text')">Текст</button>
      <button @click="triggerImageUpload()">Изображение</button>
      <input type="file" ref="fileInput" @change="onUploadImage" accept="image/*" style="display: none">
    </nav>

    <section>
      <svg
          class="canvas"
          @mousemove="onMouseMove"
          @mouseup="onMouseUp"
          @mouseleave="onMouseUp"
      >
        <template v-for="shape in shapes" :key="shape.id">
          <ShapeRect
              v-if="shape.type === 'rect'"
              :shape="shape"
              :selected-id="selectedId"
              :on-mouse-down="onMouseDown"
          />
          <ShapeCircle
              v-else-if="shape.type === 'circle'"
              :shape="shape"
              :selected-id="selectedId"
              :on-mouse-down="onMouseDown"
          />
          <ShapeLine
              v-else-if="shape.type === 'line'"
              :shape="shape"
              :selected-id="selectedId"
              :on-mouse-down="onMouseDown"
          />
          <ShapeText
              v-else-if="shape.type === 'text' && editingTextId !== shape.id"
              :shape="shape"
              :selected-id="selectedId"
              :on-mouse-down="onMouseDown"
              @dblclick="() => startEditingText(shape)"
          />
          <foreignObject
              v-if="shape.type === 'text' && editingTextId === shape.id"
              :x="shape.x"
              :y="shape.y - 20"
              width="150"
              height="30"
          >
            <input
                v-model="editingTextValue"
                @blur="endEditingText"
                @keyup.enter="endEditingText"
                type="text"
                style="width: 100%; height: 100%; font-size: 16px;"
            />
          </foreignObject>
          <ShapeImage
              v-else-if="shape.type === 'image'"
              :shape="shape"
              :selected-id="selectedId"
              :on-mouse-down="onMouseDown"
          />
        </template>
      </svg>
    </section>
  </main>
</template>

<style scoped>
nav {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
}

button {
  padding: 0.5rem 1rem;
  font-size: 14px;
  cursor: pointer;
}

.canvas {
  width: 100vw;
  height: 100vh;
  background-color: white;
  border: 1px solid #ccc;
  user-select: none;
}

main {
  overflow: hidden;
}
</style>
