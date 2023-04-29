document.addEventListener("DOMContentLoaded", function() {
  var tasksButton = document.getElementById("tasks-button");
  var coursesButton = document.getElementById("courses-button");
  var tasksSection = document.querySelector(".Tasks");
  var taskCreateSection = document.querySelector(".Task-Create");
  var coursesSection = document.querySelector(".Courses");
  var courseAdderSection = document.querySelector(".Course-Adder");
  var titleTasksSection = document.querySelector(".Title-Tasks");
  var titleCoursesSection = document.querySelector(".Title-Courses");

  tasksButton.addEventListener("click", function() {
    tasksButton.classList.add("active");
    coursesButton.classList.remove("active");
    tasksSection.style.display = "block";
    taskCreateSection.style.display = "block";
    coursesSection.style.display = "none";
    courseAdderSection.style.display = "none";
    titleTasksSection.style.display = "block";
    titleCoursesSection.style.display = "none";
  });

  coursesButton.addEventListener("click", function() {
    tasksButton.classList.remove("active");
    coursesButton.classList.add("active");
    tasksSection.style.display = "none";
    taskCreateSection.style.display = "none";
    coursesSection.style.display = "block";
    courseAdderSection.style.display = "block";
    titleTasksSection.style.display = "none";
    titleCoursesSection.style.display = "block";
  });
});
