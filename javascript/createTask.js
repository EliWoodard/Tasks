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
    var month = date.toLocaleString('default', { month: 'short' });
    var day = date.getDate() + 1;
    dateBox.textContent = month + " " + day;

    var subjectBox = document.createElement("div");
    subjectBox.classList.add("task-subject-box");
    subjectBox.textContent = subjectSelect.value;

    var descriptionBox = document.createElement("div");
    descriptionBox.classList.add("task-description-box");
    descriptionBox.textContent = taskDescriptionTextarea.value;

    var completeButton = document.createElement("button");
    completeButton.classList.add("task-button-box");
    completeButton.textContent = "Complete";

    taskContainer.appendChild(taskBox);
    taskBox.appendChild(titleBox);
    taskBox.appendChild(dateBox);
    taskBox.appendChild(subjectBox);
    taskBox.appendChild(descriptionBox);
    taskBox.appendChild(completeButton);

    discardButton.click();

    taskBox.addEventListener("click", function() {
      this.classList.toggle("expanded");
    });

    completeButton.addEventListener("click", function() {
      taskBox.remove();
    });
  });
});
