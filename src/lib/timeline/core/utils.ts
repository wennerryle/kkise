/**
 * Форматирует секунды в строку вида HH:MM:SS или MM:SS
 * @param totalSeconds - Время в секундах
 */
export function formatTime(totalSeconds: number): string {
    if (totalSeconds < 0) totalSeconds = 0;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const mStr = minutes.toString().padStart(2, "0");
    const sStr = seconds.toString().padStart(2, "0");

    // Если время больше часа, добавляем часы в начало
    if (hours > 0) {
        const hStr = hours.toString();
        return `${hStr}:${mStr}:${sStr}`;
    }

    return `${mStr}:${sStr}`;
}

/**
 * Вспомогательная функция для перевода позиции X в секунды
 * (пригодится для клика по линейке)
 */
export function pxToTime(x: number, zoomLevel: number, scrollLeft = 0) {
    return (x + scrollLeft) / zoomLevel;
}
