"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertHoursToMinutes = void 0;
function ConvertHoursToMinutes(hourString) {
    const [hours, minutes] = hourString.split(":").map(Number);
    const minutesAmount = hours * 60 + minutes;
    return minutesAmount;
}
exports.ConvertHoursToMinutes = ConvertHoursToMinutes;
