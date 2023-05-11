document.addEventListener("DOMContentLoaded", function() {
  var discardButton = document.querySelector(".task-button");
  var tasksSection = document.querySelector(".AddTaskWindow");
  tasksSection.style.display = "none";

  discardButton.addEventListener("click", function() {
    tasksSection.style.display = "none";
    tasksSection.classList.remove("active");
  });
});
