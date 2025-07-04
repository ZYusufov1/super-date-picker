# Super Date Picker

Компонент выбора диапазона дат и времени для React 18+.  
Вдохновлён `EuiSuperDatePicker` из Elastic UI и повторяет его ключевой функционал.

---

## Возможности

- Три режима: Absolute, Relative, Now
- Preset-кнопки (Today, This week, Yesterday и др.)
- История Recently used - хранит до 10 последних диапазонов
- Автообновление с паузой и возобновлением
- Поддержка date-math выражений `now-15m`, `now-24h`
- Локализация через `date-fns` locale, ограничения `minDate` и `maxDate`
- Поставляется только с одним CSS-модулем, без сторонних UI-фреймворков

---

## Установка

```bash
npm i @your-org/super-date-picker
# или
yarn add @your-org/super-date-picker
