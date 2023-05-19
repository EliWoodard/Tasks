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
    overlay.style.display = "none";
    tasksSection.style.display = "none";
    taskTitleInput.value = "";
    taskDescriptionTextarea.value = "";
    dueDateInput.value = "";
    subjectSelect.value = "";
  });

  var storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  for (var i = 0; i < storedTasks.length; i++) {
    createTask(storedTasks[i]);
  }

  function createTask(task) {
    var taskBox = document.createElement("div");
    taskBox.classList.add("task-box");

    var titleBox = document.createElement("div");
    titleBox.classList.add("task-title-box");
    titleBox.textContent = task.title;

    var dateBox = document.createElement("div");
    dateBox.classList.add("task-date-box");
    var date = new Date(task.date);
    var month = date.toLocaleString('default', { month: 'short' });
    var day = date.getDate() + 1;
    dateBox.textContent = month + " " + day;

    var subjectBox = document.createElement("div");
    subjectBox.classList.add("task-subject-box");
    subjectBox.textContent = task.subject;

    var descriptionBox = document.createElement("div");
    descriptionBox.classList.add("task-description-box");
    descriptionBox.textContent = task.description;

    var completeButton = document.createElement("button");
    completeButton.classList.add("task-button-box");
    completeButton.textContent = "Complete";

    taskBox.appendChild(titleBox);
    taskBox.appendChild(dateBox);
    taskBox.appendChild(subjectBox);
    taskBox.appendChild(descriptionBox);
    taskBox.appendChild(completeButton);
    taskContainer.appendChild(taskBox);

    taskBox.addEventListener("click", function() {
      this.classList.toggle("expanded");
    });

    completeButton.addEventListener("click", function() {
      taskBox.remove();
      var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      var index = tasks.findIndex(t => t.title === task.title && t.date === task.date && t.subject === task.subject && t.description === task.description);
      if (index > -1) {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
    });
  }

  saveButton.addEventListener("click", function() {
    var newTask = {
      title: taskTitleInput.value,
      description: taskDescriptionTextarea.value,
      date: dueDateInput.value,
      subject: subjectSelect.value
    };

    createTask(newTask);

    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    discardButton.click();
  });
});
