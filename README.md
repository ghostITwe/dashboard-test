# Модуль SPA

## Что надо сделать
1. Создать холст, использовать SVG-тэг
2. Создать шаблон для прямоугольника, круга, текста, линии
3. Создать панель с кнопками для создания элементов на странице (прямоугольник, текст, линия). Каждому элементу при создании необходимо выдавать уникальный id
4. Сделать передвижение элементов с помощью мышки
5. Изменение текста в шаблоне "Текст"

## Создание холста
Нам надо создать холст на котором будут создаваться элементы, почему именно SVG?

SVG - это векторная графика и в HTML5 есть определенные SVG тэги для работы с графикой

Тэги:
- Прямоугольник: rect
- Круг: circle
- Линия: line
- Текст: text
- Изображение: image

Создадим в папке components CanvasEditor.vue или же другое название которое хотите

После чего создадим папку shapes, чтобы разграничить наши фигуры
Каждый элемент будет с префиксом ShapeRect и т.д, но можно сэкономить время и сделать просто Rect, Circle, Line, Text, Image

Каждый элемент будет иметь свойства:
1. shape - объект, который будет иметь все свойства фигуры
2. selectedId - строковое поле, которое определяет ID для выбора фигуры
3. onMouseDown - функция для движения мыши, которая будет в каждом элементе

### Работа в CanvasEditor.vue

Первым делом создаём несколько переменных, которые будут реактивными и хранить состояние нашего холста
1. shapes - массив фигур
2. selectedId - выбранная фигура, нужна для передвижения мышкой
3. dragging - переключатель, проверяющий выбран элемент для перетаскивания или нет
4. dragOffset - объект, который определяет начальный x,y для движения мышкой
5. editingTextId - айди выбранного текста, который надо редактировать
6. editingTextValue - реактивная переменная, которая следит за значением
7. fileInput - файловое поле для добавления картинки на холст
8. id - идентификатор, который будет накопителем при создании новых фигур

```js
const shapes = ref([]),
    selectedId = ref(''),
    dragging = ref(false),
    dragOffset = ref({
        x: 0,
        y: 0
    }),
    editingTextId = ref(null),
    editingTextValue = ref(''),
    fileInput = ref(''),
    id = ref(0);
```

Первым делом создадим в тэге template создадим тэг main, в котором будет всё что связанно с холстом:
1. nav с кнопками, которые будут создавать на холсте фигуры
2. svg - наш холст, данный тэг необходим для добавления элементов векторной графики


В тэге template делаем холст svg для наших фигур, а также ещё один template в котором будут добавлены наши фигуры

Добавляем внутрь наши созданные шаблоны фигур, в каждой фигуре внутри делаем атрибут v-if="shape.type === 'rect'", для того, чтобы определить что за тип у нашей фигуры и отрендерить её, после чего через :, передаем в наши компоненты параметры shape, selected-id и on-mouse-down
пример с прямоугольником
```vue
<template v-for="shape in shapes" :key="shape.id">
  <ShapeRect
      v-if="shape.type === 'rect'"
      :shape="shape"
      :selected-id="selectedId"
      :on-mouse-down="onMouseDown"
  />
</template>
```
Создаим функцию, которая будет генерировать нам ID
```js
function createId() {
  return "id-" + id.value++
}
```
Для создания фигуры напишем функцию createShape, которая принимает type - тип фигуры

```js
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
```

В switch мы смотрим какой у нас тип нашей фигуры и добавляем в нашу реактивную переменную shapes объект нашей фигуры
В функции есть переменная baseData, которая изначально задаёт начальные параметры нашей фигуры, такие как:
1. уникальный id нашего созданного блока
2. начальный x и y, при создании нашей фигуры (Я тут сделал её чтобы в рандомном месте была, но можно добавить что угодно)
3. type - тип нашей фигуры, которую мы создаём

Внутри тэга svg добавляем наши фигуры, которые описаны внутри нашей папки shapes, через v-if, v-if-else

Чтобы мы могли вращать наши фигуры c фокусом сделаем 3 функции, onMouseDown для того, чтобы мы могли активировать мышкой движение нашего элемента
```js
function onMouseDown(e, shape) {
  selectedId.value = shape.id;
  dragging.value = true;

  dragOffset.value.x = e.offsetX - shape.x;
  dragOffset.value.y = e.offsetY - shape.y;
}
```
Переменные, которые мы передаем в функцию - это e (event наш) и наша фигура shape
внутри функции мы в selectedId ставим текущий shape.id нашей фигуры, которую мы будем перемещать и ставим dragging.value = true, чтобы понять что элемент имеет возможность перетаскиваться

Дальше мы изменяем в объекте dragOffset.value.x и y, e.offsetX и e.offsetY это текущей положение курсора нашей мыши

Следующая функция onMouseMove(e), делает передвижение нашей мышки с элементом
```js
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
```
Здесь мы сначала проверяем, если нет значения у dragging и нет текущего выбранного id, то завершаем функцию

Дальше получаем нашу фигуру по Id, через метод ***find***, который есть у массивов сравнивая текущий выбранный id и все наши фигуры
Если нет фигуры, то завершаем функцию

Следующее, что мы делаем - это получаем наш svg, можно сделать двумя способами
1. через e.currentTarget.getBoundingClientRect()
2. через document.querySelector(".canvas"), по классу для нашего svg

После чего мы обновляем shape.x, shape.y у нашей выбранной фигуры

Функция onMouseUp() делает очищение dragging и selectedId, когда отпускаем нажатие мышки
```js
function onMouseUp() {
  dragging.value = false;
  selectedId.value = '';
}
```

На тэг svg надо будеть накинуть наши функции
```vue
<svg
  class="canvas" 
  @mousemove="onMouseMove"
  @mouseup="onMouseUp"
  @mouseleave="onMouseUp"
>
  /// остальной наш код
</svg>
```
### Работа с фигурой - текст
Для изменения дабл кликом текста, нужно рядом с компонентом ShapeText создать foreignObject, данный элемент необходим в SVG для того, чтобы в вектор добавить HTML-элемент для изменения текста нам понадобиться input,

В атрибуты :x, :y передаем такие же значения как у нашей фигуры - Текст и его размеры через width и height
Далее внутрь foreignObject вставляем наш input, в который добавляем атрибуты:
1. v-model для отслеживания изменения текста
2. @blur - создание сокрытия нашего текста инпутом
3. @keyup.enter - тригер при нажатии на кнопку enter сохранять новое значение текстовой фигуры
4. style - для небольшой стилизации, но можно вынести и в тэг style в компоненете

```vue
<foreignObject
    v-if="shape.type === 'text'" && editingTextId === shape.id
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
```

Как мы видим в input есть некоторые функции и переменные для изменения текста, нам необходимо их создать, в самом начале скрипта CanvasEditor я добавил переменную editingTextValue, переменные можно назвать как угодно
Код для открытия и изменения текста
```js
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
```


