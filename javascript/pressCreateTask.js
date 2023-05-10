document.addEventListener("DOMContentLoaded", function() {
  var tasksButton = document.querySelector(".create-task-button");
  var tasksSection = document.querySelector(".AddTaskWindow");

  tasksSection.style.display = "none";

  tasksButton.addEventListener("click", function() {
    console.log("Button clicked!");
    tasksSection.style.display = tasksSection.style.display === "none" ? "grid" : "none";
      tasksSection.classList.toggle("active");
  });
});
