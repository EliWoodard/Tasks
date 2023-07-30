document.addEventListener("DOMContentLoaded", function () {
  var discardButton = document.querySelector("#discard-button");
  var tasksSection = document.querySelector(".AddTaskWindow");
  var taskTitleInput = document.querySelector(".task-title");
  var taskDescriptionTextarea = document.querySelector("#task-Description");
  var dueDateInput = document.querySelector("#date");
  var subjectSelect = document.querySelector("#subject-select");
  var overlay = document.querySelector(".overlay");
  var saveButton = document.querySelector("#save-button");
  var tasksOverlay = document.querySelector("#tasksOverlay");
  var tasksOverlayLeft = document.querySelector("#tasksOverlayLeft");
  var overdueSection = document.querySelector("#overdue");
  var overdueTaskContainer = overdueSection.querySelector(".task-container");


  // Get the checkbox elements
  var checkbox0 = { checked: true }; // Always checked
  var checkbox1 = document.querySelector("#checkbox1");
  var checkbox2 = document.querySelector("#checkbox2");
  var checkbox3 = document.querySelector("#checkbox3");
  var checkbox4 = document.querySelector("#checkbox4");
  var checkbox5 = document.querySelector("#checkbox5");

  // Initialize the checkboxes' states from localStorage
  checkbox1.checked = localStorage.getItem("checkbox1") === "true";
  checkbox2.checked = localStorage.getItem("checkbox2") === "true";
  checkbox3.checked = localStorage.getItem("checkbox3") === "true";
  checkbox4.checked = localStorage.getItem("checkbox4") === "true";
  checkbox5.checked = localStorage.getItem("checkbox5") === "true";

  // Get the section elements
  var section0 = document.querySelector("#due-today");
  var section1 = document.querySelector("#due-tomorrow");
  var section2 = document.querySelector("#due-this-week");
  var section3 = document.querySelector("#due-next-week");
  var section4 = document.querySelector("#due-this-month");
  var section5 = document.querySelector("#due-after");

  // Set the sections' display based on the corresponding checkboxes' states
  section0.style.display = checkbox0.checked ? "block" : "none";
  section1.style.display = checkbox1.checked ? "block" : "none";
  section2.style.display = checkbox2.checked ? "block" : "none";
  section3.style.display = checkbox3.checked ? "block" : "none";
  section4.style.display = checkbox4.checked ? "block" : "none";
  section5.style.display = checkbox5.checked ? "block" : "none";

  // The sections array
  var sections = [section0, section1, section2, section3, section4, section5];

  // The checkboxes array
  var checkboxes = [checkbox0, checkbox1, checkbox2, checkbox3, checkbox4, checkbox5];

  checkbox1.addEventListener("change", function () {
    localStorage.setItem("checkbox1", checkbox1.checked);
    section1.style.display = checkbox1.checked ? "block" : "none";
    reassignTasks();
  });
  checkbox2.addEventListener("change", function () {
    localStorage.setItem("checkbox2", checkbox2.checked);
    section2.style.display = checkbox2.checked ? "block" : "none";
    reassignTasks();
  });
  checkbox3.addEventListener("change", function () {
    localStorage.setItem("checkbox3", checkbox3.checked);
    section3.style.display = checkbox3.checked ? "block" : "none";
    reassignTasks();
  });
  checkbox4.addEventListener("change", function () {
    localStorage.setItem("checkbox4", checkbox4.checked);
    section4.style.display = checkbox4.checked ? "block" : "none";
    reassignTasks();
  });
  checkbox5.addEventListener("change", function () {
    localStorage.setItem("checkbox5", checkbox5.checked);
    section5.style.display = checkbox5.checked ? "block" : "none";
    reassignTasks();
  });

  tasksSection.style.display = "none";

  var storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  for (var i = 0; i < storedTasks.length; i++) {
    createTask(storedTasks[i]);
  }

  function createTask(task) {
    var [year, month, day] = task.date.split('-').map(Number);
    month -= 1;
    var date = new Date(year, month, day);

    var taskSectionIndex = getTaskSection(new Date(year, month, day));
    var taskSectionId = getSectionIdFromIndex(taskSectionIndex);
    var taskContainer = document.querySelector('#' + taskSectionId + ' .task-container');

    var checkboxes = [checkbox1, checkbox2, checkbox3, checkbox4, checkbox5];
    var sections = [section0, section1, section2, section3, section4, section5]; // update this line

    var index = taskSectionIndex;

    while (index < sections.length) {
      console.log(index);
      if (index === 0 || (index < checkboxes.length && checkboxes[index].checked)) {

        var taskContainer = sections[index].querySelector(".task-container");
        // ... existing code to create and add the task to the taskContainer ...
        break;
      }
      index++;
    }

    var taskBox = document.createElement("div");
    taskBox.classList.add("task-box");

    var taskBoxColor = document.createElement("div");
    taskBoxColor.classList.add("task-color");
    taskBoxColor.style.backgroundColor = task.color;

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

    taskBox.addEventListener("click", function () {
      var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      var currentTask = tasks.find(t => t.id === task.id);
      showTasksOverlay(currentTask, taskBox);
    });

    if (date < today) {
      // Task is overdue, add it to the overdue section and show the overdue section
      overdueSection.style.display = "block";
      overdueTaskContainer.appendChild(taskBox);
      return; // Exit the function here, no need to add it to other sections
    }

    taskContainer.appendChild(taskBox);

    var selectedSubject = subjectSelect.value;
    var courses = JSON.parse(localStorage.getItem('courses')) || [];
    var selectedCourse = courses.find(function (course) {
      return course.name === selectedSubject;
    });
    var selectedCourseColor = selectedCourse ? selectedCourse.color : '';
    taskBoxColor.style.backgroundColor = task.color;
  }

  var courses = JSON.parse(localStorage.getItem('courses')) || [];
  var taskSubjectSelect = document.querySelector('#taskSubject');

  courses.forEach(function (course) {
    var option = document.createElement('option');
    option.value = course.name;
    option.textContent = course.name;
    taskSubjectSelect.appendChild(option);
  });

  function getSectionIdFromIndex(index) {
    const sectionIds = ["due-today", "due-tomorrow", "due-this-week", "due-next-week", "due-this-month", "due-after"];
    return sectionIds[index];
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

    if (!courses.some(course => course.name === task.subject)) {
      task.subject = 'No Subject';
    }

    var taskSubjectSelect = document.querySelector('#taskSubject');

    // Clear the options in the select element
    taskSubjectSelect.innerHTML = '';

    var selectedSubject = task.subject;
    taskSubjectSelect.value = selectedSubject;

    courses.forEach(function (course) {
      var option = document.createElement('option');
      option.value = course.name;
      option.textContent = course.name;
      taskSubjectSelect.appendChild(option);
    });

    var selectedCourse = courses.find(function (course) {
      return course.name === selectedSubject;
    });

    var selectedSubject = task.subject;
    taskSubjectSelect.value = selectedSubject;

    var selectedCourse = courses.find(function (course) {
      return course.name === selectedSubject;
    });

    var selectedCourseColor = selectedCourse ? selectedCourse.color : '';
    tasksOverlayLeft.style.backgroundColor = selectedCourseColor;

    // Update the task-color
    var taskColor = taskBox.querySelector('.task-color');
    taskColor.style.backgroundColor = selectedCourseColor;

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

  function getTaskSection(date) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    var startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + (startOfWeek.getDay() === 0 ? -6 : 1));

    var endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    var startOfNextWeek = new Date(endOfWeek);
    startOfNextWeek.setDate(startOfNextWeek.getDate() + 1);

    var endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(endOfNextWeek.getDate() + 6);

    var startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    var endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    if (date.getTime() === today.getTime()) {
      return 0;  // Due today
    } else if (date.getTime() === tomorrow.getTime()) {
      return 1;  // Due tomorrow
    } else if (date > tomorrow && date <= endOfWeek) {
      return 2;  // Due this week
    } else if (date > endOfWeek && date <= endOfNextWeek) {
      return 3;  // Due next week
    } else if (date > endOfNextWeek && date <= endOfMonth) {
      return 4;  // Due this month
    } else {
      return 5;  // Due after
    }
  }

  function reassignTasks() {
    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Remove all tasks from the DOM
    var taskBoxes = document.querySelectorAll('.task-box');
    taskBoxes.forEach(function (taskBox) {
      taskBox.remove();
    });

    // Recreate all tasks
    tasks.forEach(function (task) {
      createTask(task);
    });
  }



  /**
   * @description save button used in the creation of new tasks or the AddTaskWindow.
   */
  saveButton.addEventListener("click", function () {
    var selectedSubject = subjectSelect.value;
    var courses = JSON.parse(localStorage.getItem('courses')) || [];
    var selectedCourse = courses.find(function (course) {
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

    hideTasksOverlay();
  });

  /**
   * @description used in the taskOverlay for saving edits to an existing task.
   */
  document.querySelector('#saveButton').addEventListener("click", function () {
    var title = document.querySelector('#taskTitle').value;
    var dateString = document.querySelector('#taskDate').value;
    var subject = document.querySelector('#taskSubject').value;
    var description = document.querySelector('#taskDescription').value;

    var courses = JSON.parse(localStorage.getItem('courses')) || [];

    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    var index = tasks.findIndex(t => t.id === tasksOverlay.task.id);

    var selectedSubject = document.querySelector('#taskSubject').value;
    var selectedCourse = courses.find(function (course) {
      return course.name === selectedSubject;
    });

    var selectedCourseColor = selectedCourse ? selectedCourse.color : '';

    var [year, month, day] = dateString.split('-').map(Number);
    month -= 1;  // Adjust the month number
    var date = new Date(year, month, day);


    var updatedTask = {
      id: tasksOverlay.task.id,
      title: title,
      description: description,
      date: dateString,
      subject: subject,
      color: selectedCourseColor
    };

    if (index > -1) {
      tasks.splice(index, 1, updatedTask);
      tasksOverlay.taskBox.remove();  // Remove the old task from the DOM
      createTask(updatedTask);  // Recreate the task so it gets placed in the correct section
    } else {
      tasks.push(updatedTask);
    }


    var taskBox = tasksOverlay.taskBox;
    taskBox.querySelector('.task-title-box').textContent = title;
    taskBox.querySelector('.task-subject-box').textContent = subject;
    taskBox.querySelector('.task-description-box').textContent = description;

    var dateBox = taskBox.querySelector('.task-date-box');
    dateBox.textContent = date.toLocaleString('default', { month: 'short' }) + " " + date.getDate();

    var today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    taskBox.classList.remove("due-today");
    taskBox.classList.remove("overdue");

    if (date.getTime() === today.getTime()) {
      dateBox.style.color = "#e1970a";
      taskBox.classList.add("due-today");
    } else if (date < today) {
      dateBox.style.color = "#bf0c0c";
      taskBox.classList.add("overdue");
    } else {
      dateBox.style.color = "#2E8B57";
    }

    var taskColor = taskBox.querySelector('.task-color');
    taskColor.style.backgroundColor = updatedTask.color;

    tasksOverlayLeft.style.backgroundColor = updatedTask.color;

    tasksOverlay.task = updatedTask;

    localStorage.setItem('tasks', JSON.stringify(tasks));

    hideTasksOverlay();
  });

  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) {
      hideTasksOverlay();
    }
  });

  discardButton.addEventListener("click", function () {
    overlay.style.display = "none";
    tasksSection.style.display = "none";
    taskTitleInput.value = "";
    taskDescriptionTextarea.value = "";
    dueDateInput.value = "";
    subjectSelect.value = "";
  });

  document.querySelector('#discardButton').addEventListener('click', function () {
    hideTasksOverlay();
  });

  document.querySelector('#completeButton').addEventListener("click", function () {
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
  
    // Check if there are any tasks left in the "overdue" section
    var overdueTasks = document.querySelectorAll('#overdue .task-box');
    if (overdueTasks.length === 0) {
      // If there are no tasks left, hide the "overdue" section
      overdueSection.style.display = "none";
    }
  
    hideTasksOverlay();
  });  
});
