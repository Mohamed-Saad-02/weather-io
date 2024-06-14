"use strict";
export function removeClassName(element, className) {
  element.classList.remove(className);
}
export function addClassName(element, className) {
  element.classList.add(className);
}
export const weekDayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * @param {number} localtime Unix date in secondes
 * @returns {string} Date String formate *Sunday 10, Jan*
 */
export const getDate = function (localtime) {
  const date = new Date(localtime);
  const weekDayName = weekDayNames[date.getDay()];
  const monthName = monthNames[date.getMonth()];
  return `${weekDayName} ${date.getDate()},${monthName}`;
};

/**
 * @param {number} dateUnix Unix date in secondes
 * @returns {string} Date String formate *10 AM*
 */
export const getHours = function (dateUnix) {
  const date = new Date(dateUnix * 1000);
  const hours = date.getHours();
  const period = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12} ${period}`;
};
