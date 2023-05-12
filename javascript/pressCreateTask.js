document.addEventListener("DOMContentLoaded", function() {
  var tasksButton = document.querySelector(".create-task-button");
  var tasksSection = document.querySelector(".AddTaskWindow");
  var overlay = document.querySelector(".overlay");

  tasksSection.style.display = "none";
  overlay.style.display = "none";

  tasksButton.addEventListener("click", function() {
    console.log("Button clicked!");
    tasksSection.style.display = tasksSection.style.display === "none" ? "grid" : "none";
    overlay.style.display = overlay.style.display === "none" ? "block" : "none";
    tasksSection.classList.toggle("active");
  });
});
