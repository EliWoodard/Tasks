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
  
    var taskBoxColor = document.createElement("div");
    taskBoxColor.classList.add("task-color");
  
    var textBox = document.createElement("div");
    textBox.classList.add("text-box");
  
    var titleBox = document.createElement("div");
    titleBox.classList.add("task-title-box");
    titleBox.textContent = task.title;
  
    var dateBox = document.createElement("div");
    dateBox.classList.add("task-date-box");
    var [year, month, day] = task.date.split('-').map(Number); 
    month -= 1;
    var date = new Date(year, month, day);
    var month = date.toLocaleString('default', { month: 'short' });
    var day = date.getDate();
    dateBox.textContent = month + " " + day;
    
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    if (date.getTime() === today.getTime()) {
      dateBox.style.color = "#e1970a";
      taskBox.classList.add("due-today");
    } else if (date < today) {
      dateBox.style.color = "#bf0c0c";
      taskBox.classList.add("overdue");
    }

    console.log(date.getTime());
    console.log(today.getTime());
  
    var subjectBox = document.createElement("div");
    subjectBox.classList.add("task-subject-box");
    subjectBox.textContent = task.subject;
  
    var descriptionBox = document.createElement("div");
    descriptionBox.classList.add("task-description-box");
    descriptionBox.textContent = task.description;
  
    var completeButton = document.createElement("button");
    completeButton.classList.add("task-button-box");
    completeButton.textContent = "Complete";
  
    taskBox.appendChild(taskBoxColor);
    textBox.appendChild(titleBox);
    textBox.appendChild(subjectBox);
    taskBox.appendChild(textBox);
    taskBox.appendChild(dateBox);
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
  
    var selectedSubject = subjectSelect.value;
    var courses = JSON.parse(localStorage.getItem('courses')) || [];
    var selectedCourse = courses.find(function(course) {
      return course.name === selectedSubject;
    });
    var selectedCourseColor = selectedCourse ? selectedCourse.color : '';
    taskBoxColor.style.backgroundColor = selectedCourseColor;
    taskBoxColor.style.backgroundColor = task.color;
  }

  saveButton.addEventListener("click", function() {
    var selectedSubject = subjectSelect.value;
    var courses = JSON.parse(localStorage.getItem('courses')) || [];
    var selectedCourse = courses.find(function(course) {
      return course.name === selectedSubject;
    });
    var selectedCourseColor = selectedCourse ? selectedCourse.color : '';

    var newTask = {
      title: taskTitleInput.value,
      description: taskDescriptionTextarea.value,
      date: dueDateInput.value,
      subject: subjectSelect.value,
      color: selectedCourseColor
    };

    createTask(newTask);

    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    discardButton.click();
  });
});
