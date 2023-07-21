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
  var tasksOverlay = document.querySelector("#tasksOverlay");
  var tasksOverlayLeft = document.querySelector("#tasksOverlayLeft");

  tasksSection.style.display = "none";

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
  
    taskBox.appendChild(taskBoxColor);
    textBox.appendChild(titleBox);
    textBox.appendChild(subjectBox);
    taskBox.appendChild(textBox);
    taskBox.appendChild(dateBox);
    taskBox.appendChild(descriptionBox);
    taskContainer.appendChild(taskBox);
  
    taskBox.addEventListener("click", function() {
      var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      var currentTask = tasks.find(t => t.id === task.id);
      showTasksOverlay(currentTask, taskBox);
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

  function showTasksOverlay(task, taskBox) {
    overlay.style.display = "flex";
    tasksOverlay.style.display = "flex";
    tasksOverlayLeft.style.display = "flex";
  
    if (task) {
      document.querySelector('#taskTitle').value = task.title;
      document.querySelector('#taskSubject').value = task.subject;
      document.querySelector('#taskDate').value = task.date;
      document.querySelector('#taskDescription').value = task.description;
    }
  
    var [year, month, day] = task.date.split('-').map(Number);
    month -= 1;
    var date = new Date(year, month, day);
    var monthName = date.toLocaleString('default', { month: 'short' });
    var dayNumber = date.getDate();
    document.querySelector('#taskDate').textContent = monthName + " " + dayNumber;
  
    document.querySelector('#taskDescription').textContent = task.description;
  
    var courses = JSON.parse(localStorage.getItem('courses')) || [];
    var selectedCourse = courses.find(function (course) {
      return course.name === task.subject;
    });
  
    var selectedCourseColor = selectedCourse ? selectedCourse.color : '';
    tasksOverlayLeft.style.backgroundColor = selectedCourseColor;
  
    tasksOverlay.task = task;
    tasksOverlay.taskBox = taskBox;
  }
  
  
  function hideTasksOverlay() {
    overlay.style.display = "none";
    tasksSection.style.display = "none";
    tasksOverlay.style.display = "none";
    taskTitleInput.value = "";
    taskDescriptionTextarea.value = "";
    dueDateInput.value = "";
    subjectSelect.value = "";
  }

  saveButton.addEventListener("click", function() {
    var selectedSubject = subjectSelect.value;
    var courses = JSON.parse(localStorage.getItem('courses')) || [];
    var selectedCourse = courses.find(function(course) {
      return course.name === selectedSubject;
    });
    var selectedCourseColor = selectedCourse ? selectedCourse.color : '';

    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    var newTask = {
      id: (tasks.length || 0) + 1, 
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

  document.querySelector('#saveButton').addEventListener("click", function() {
    var title = document.querySelector('#taskTitle').value;
    var date = document.querySelector('#taskDate').value;
    var subject = document.querySelector('#taskSubject').value;
    var description = document.querySelector('#taskDescription').value;
  
    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    var index = tasks.findIndex(t => t.id === tasksOverlay.task.id);
  
    var selectedSubject = document.querySelector('#taskSubject').value;
    var courses = JSON.parse(localStorage.getItem('courses')) || [];
    var selectedCourse = courses.find(function(course) {
      return course.name === selectedSubject;
    });
    var selectedCourseColor = selectedCourse ? selectedCourse.color : '';
  
    var updatedTask = {
      id: tasksOverlay.task.id, 
      title: title,
      description: description,
      date: date,
      subject: subject,
      color: selectedCourseColor
    };
  
    if (index > -1) {
      tasks.splice(index, 1, updatedTask);
    } else {
      tasks.push(updatedTask);
    }
  
    var taskBox = tasksOverlay.taskBox;
    taskBox.querySelector('.task-title-box').textContent = title;
    taskBox.querySelector('.task-subject-box').textContent = subject;
    taskBox.querySelector('.task-description-box').textContent = description;
    taskBox.querySelector('.task-date-box').textContent = new Date(date).toLocaleString('default', { month: 'short' }) + " " + new Date(date).getDate();
  
    tasksOverlay.task = updatedTask;
  
    localStorage.setItem('tasks', JSON.stringify(tasks));
  
    hideTasksOverlay();
});

  overlay.addEventListener('click', function(event) {
    if (event.target === overlay) {  
      hideTasksOverlay();
    }
  });

  discardButton.addEventListener("click", function() {
    overlay.style.display = "none";
    tasksSection.style.display = "none";
    taskTitleInput.value = "";
    taskDescriptionTextarea.value = "";
    dueDateInput.value = "";
    subjectSelect.value = "";
  });

  document.querySelector('#discardButton').addEventListener('click', function() {
    hideTasksOverlay();
  });    

  document.querySelector('#completeButton').addEventListener("click", function() {
    var title = document.querySelector('#taskTitle').value;
    var date = document.querySelector('#taskDate').value;
    var subject = document.querySelector('#taskSubject').value;
    var description = document.querySelector('#taskDescription').value;
  
    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    var index = tasks.findIndex(t => t.title === title && t.date === date && t.subject === subject && t.description === description);
    if (index > -1) {
      tasks.splice(index, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      tasksOverlay.taskBox.remove(); 
    }
  
    hideTasksOverlay();
  });
});
