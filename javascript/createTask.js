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
    taskTitleInput.value = "";
    taskDescriptionTextarea.value = "";
    dueDateInput.value = "";
    subjectSelect.value = "";
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

    var dateBox = document.createElement("div");
    dateBox.classList.add("task-date-box");
    var date = new Date(dueDateInput.value);
    var month = date.toLocaleString('default', { month: 'short' }); // Get the short month name (e.g., May)
    var day = date.getDate(); // Get the day
    dateBox.textContent = month + "-" + day;

    var subjectBox = document.createElement("div");
    subjectBox.classList.add("task-subject-box");
    subjectBox.textContent = subjectSelect.value;

    taskContainer.appendChild(taskBox);
    taskBox.appendChild(titleBox);
    taskBox.appendChild(dateBox);
    taskBox.appendChild(subjectBox);
    discardButton.click();
  });
});
