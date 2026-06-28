document.addEventListener("DOMContentLoaded", function () {
  const { dom, events } = window.TasksApp;
  const tasksButton = dom.query(".create-task-button");

  if (!tasksButton) {
    return;
  }

  tasksButton.addEventListener("click", function () {
    dom.emit(events.openTaskForm);
  });
});
