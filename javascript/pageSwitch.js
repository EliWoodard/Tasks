document.addEventListener("DOMContentLoaded", function () {
  const { dom } = window.TasksApp;

  const tasksButton = dom.query("#tasks-button");
  const coursesButton = dom.query("#courses-button");
  const tasksSection = dom.query(".Tasks");
  const taskCreateSection = dom.query(".Task-Create");
  const coursesSection = dom.query(".Courses");
  const courseAdderSection = dom.query(".Course-Adder");
  const titleTasksSection = dom.query(".Title-Tasks");
  const titleCoursesSection = dom.query(".Title-Courses");

  if ([tasksButton, coursesButton, tasksSection, taskCreateSection, coursesSection, courseAdderSection, titleTasksSection, titleCoursesSection].some((element) => !element)) {
    return;
  }

  tasksButton.addEventListener("click", function () {
    showTasksView(true);
  });

  coursesButton.addEventListener("click", function () {
    showTasksView(false);
  });

  function showTasksView(showTasks) {
    tasksButton.classList.toggle("active", showTasks);
    coursesButton.classList.toggle("active", !showTasks);
    tasksButton.setAttribute("aria-pressed", String(showTasks));
    coursesButton.setAttribute("aria-pressed", String(!showTasks));

    dom.setVisible(tasksSection, showTasks, "flex");
    dom.setVisible(taskCreateSection, showTasks, "block");
    dom.setVisible(titleTasksSection, showTasks, "block");
    dom.setVisible(coursesSection, !showTasks, "flex");
    dom.setVisible(courseAdderSection, !showTasks, "block");
    dom.setVisible(titleCoursesSection, !showTasks, "block");
  }
});
