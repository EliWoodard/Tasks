document.addEventListener("DOMContentLoaded", function() {
  var discardButton = document.querySelector("#discard-button");
  var tasksSection = document.querySelector(".AddTaskWindow");
  var taskContainer = document.querySelector(".Tasks");
  var taskTitleInput = document.querySelector(".task-title");
  var taskDescriptionTextarea = document.querySelector("#task-Description");
  var dueDateInput = document.querySelector("#date");
  var subjectSelect = document.querySelector("#subject-select");
  var overlay = document.querySelector(".overlay");
  var saveButton = document.querySelector("#save-button");

  tasksSection.style.display = "none";

  discardButton.addEventListener("click", function() {
    console.log("Discard button clicked!");
    taskTitleInput.value = ""; // Clear the task title input
    taskDescriptionTextarea.value = ""; // Clear the task description textarea
    dueDateInput.value = ""; // Reset the due date input
    subjectSelect.value = ""; // Reset the subject dropdown
    overlay.style.display = "none";
    tasksSection.style.display = "none";
    tasksSection.classList.remove("active");
  });

  saveButton.addEventListener("click", function() {
    console.log("Save button clicked!");
    var taskBox = document.createElement("div");
    taskBox.classList.add("task-box");

    var titleBox = document.createElement("div");
    titleBox.classList.add("task-title-box");
    titleBox.textContent = taskTitleInput.value;
    taskContainer.appendChild(taskBox);
taskBox.appendChild(titleBox);
    discardButton.click();
  });
});
