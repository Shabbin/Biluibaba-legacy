const parseTime = (s) => {
  var c = s.split(":");
  return parseInt(c[0]) * 60 + parseInt(c[1]);
};

const convertHours = (mins) => {
  var hour = Math.floor(mins / 60);
  var mins = mins % 60;
  var converted = pad(hour, 2) + ":" + pad(mins, 2);
  return converted;
};

const pad = (str, max) => {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
};

const calculateTimeSlot = (start_time, end_time, duration, interval) => {
  var i, formatted_time;
  var time_slots = new Array();

  for (var i = start_time; i <= end_time; i = i + duration + interval) {
    formatted_time = convertHours(i);
    time_slots.push(formatted_time);
  }

  return time_slots;
};

module.exports = { parseTime, convertHours, pad, calculateTimeSlot };
