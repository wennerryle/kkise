/**
 * docs: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
 */
export enum MouseButtons {
    /** Кнопки не нажаты */
    None = 0,
    /** Левая кнопка (обычно) */
    Primary = 1,
    /** Правая кнопка */
    Secondary = 2,
    /** Колесико (средняя кнопка) */
    Auxiliary = 4,
    /** Боковая кнопка "Назад" */
    Fourth = 8,
    /** Боковая кнопка "Вперед" */
    Fifth = 16,
}
