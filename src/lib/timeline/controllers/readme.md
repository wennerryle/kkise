## Ответственность

Преобразование DOM-событий (pointer, wheel, drag) в вызовы методов TimelineContext

## Правила

- Знают о DOM API (PointerEvent, setPointerCapture, devicePixelRatio)
- Знают о TimelineContext и вызывают его методы
- Не мутируют state/ напрямую
- Каждый контроллер - один тип взаимодействия
