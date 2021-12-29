document.addEventListener("DOMContentLoaded", function () {
  var dates = document.querySelectorAll(".datepicker");
  M.Datepicker.init(dates, {
    autoClose: true,
    format: "yyyy-mm-dd",
  });
});
document.addEventListener("DOMContentLoaded", function () {
  var times = document.querySelectorAll(".timepicker");
  M.Timepicker.init(times, {
    autoClose: true,
    twelveHour: false,
  });
});
