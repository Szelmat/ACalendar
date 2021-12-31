document.addEventListener("DOMContentLoaded", function () {
  $('.sidenav').sidenav();

  let dates = document.querySelectorAll(".datepicker");
  M.Datepicker.init(dates, {
    autoClose: true,
    format: "yyyy-mm-dd",
  });

  let times = document.querySelectorAll(".timepicker");
  M.Timepicker.init(times, {
    autoClose: true,
    twelveHour: false,
  });

  let sel = document.querySelectorAll("select");
  let instances = M.FormSelect.init(sel, {});
});