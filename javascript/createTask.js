document.addEventListener("DOMContentLoaded", function () {
  const { colors, courses, dates, dom, events, storage } = window.TasksApp;

  const elements = {
    overlay: dom.query(".overlay"),
    createWindow: dom.query(".AddTaskWindow"),
    createTitle: dom.query("#task-title-input"),
    createDescription: dom.query("#task-Description"),
    createDate: dom.query("#date"),
    createSubject: dom.query("#subject-select"),
    createSave: dom.query("#save-button"),
    createDiscard: dom.query("#discard-button"),
    createMessage: dom.query("#taskFormMessage"),
    editOverlay: dom.query("#tasksOverlay"),
    editAccent: dom.query("#tasksOverlayLeft"),
    editTitle: dom.query("#taskTitle"),
    editDate: dom.query("#taskDate"),
    editSubject: dom.query("#taskSubject"),
    editDescription: dom.query("#taskDescription"),
    editSave: dom.query("#saveButton"),
    editDiscard: dom.query("#discardButton"),
    editComplete: dom.query("#completeButton"),
    editMessage: dom.query("#editTaskMessage")
  };

  const requiredElements = Object.values(elements).filter(Boolean);

  if (requiredElements.length !== Object.keys(elements).length) {
    console.warn("Tasks could not initialize because required markup is missing.");
    return;
  }

  const sectionConfigs = [
    { id: "overdue", alwaysVisible: false },
    { id: "due-today", alwaysVisible: true },
    { id: "due-tomorrow", checkboxId: "checkbox1" },
    { id: "due-this-week", checkboxId: "checkbox2" },
    { id: "due-next-week", checkboxId: "checkbox3" },
    { id: "due-this-month", checkboxId: "checkbox4" },
    { id: "due-after", checkboxId: "checkbox5" }
  ].map((config) => {
    const section = dom.query(`#${config.id}`);
    return Object.assign(config, {
      checkbox: config.checkboxId ? dom.query(`#${config.checkboxId}`) : null,
      container: section ? section.querySelector(".task-container") : null,
      section
    });
  });

  let activeTaskId = null;

  initializeFilters();
  populateCourseOptions(elements.createSubject);
  populateCourseOptions(elements.editSubject);
  renderTasks();
  updateCreateButtonState();
  updateEditButtonState();

  document.addEventListener(events.openTaskForm, showCreateDialog);
  document.addEventListener(events.coursesChanged, function () {
    populateCourseOptions(elements.createSubject, elements.createSubject.value);
    populateCourseOptions(elements.editSubject, elements.editSubject.value);
    renderTasks();
  });

  [elements.createTitle, elements.createDate, elements.createSubject, elements.createDescription].forEach((input) => {
    input.addEventListener("input", updateCreateButtonState);
    input.addEventListener("change", updateCreateButtonState);
  });

  [elements.editTitle, elements.editDate, elements.editSubject, elements.editDescription].forEach((input) => {
    input.addEventListener("input", updateEditButtonState);
    input.addEventListener("change", updateEditButtonState);
  });

  elements.createSave.addEventListener("click", saveNewTask);
  elements.createDiscard.addEventListener("click", hideTaskDialogs);
  elements.editSave.addEventListener("click", saveTaskEdits);
  elements.editDiscard.addEventListener("click", hideTaskDialogs);
  elements.editComplete.addEventListener("click", completeActiveTask);

  elements.overlay.addEventListener("click", function (event) {
    if (event.target === elements.overlay && isAnyTaskDialogOpen()) {
      hideTaskDialogs();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isAnyTaskDialogOpen()) {
      hideTaskDialogs();
    }
  });

  function initializeFilters() {
    sectionConfigs.forEach((config) => {
      if (!config.checkbox) {
        return;
      }

      const savedValue = localStorage.getItem(config.checkboxId);
      config.checkbox.checked = savedValue === null ? true : savedValue === "true";
      config.checkbox.addEventListener("change", function () {
        localStorage.setItem(config.checkboxId, String(config.checkbox.checked));
        renderTasks();
      });
    });
  }

  function renderTasks() {
    const tasks = storage.getTasks().sort(sortTasks);
    const counts = Object.fromEntries(sectionConfigs.map((config) => [config.id, 0]));

    sectionConfigs.forEach((config) => {
      if (config.container) {
        config.container.textContent = "";
      }
    });

    tasks.forEach((task) => {
      const bucket = dates.getTaskBucket(task.date);
      const section = sectionConfigs.find((config) => config.id === bucket);

      if (!section || !section.container || !isSectionVisible(section)) {
        return;
      }

      section.container.appendChild(createTaskCard(task, bucket));
      counts[bucket] += 1;
    });

    sectionConfigs.forEach((config) => {
      const hasTasks = counts[config.id] > 0;
      const shouldShow = config.id === "overdue" ? hasTasks : isSectionVisible(config);

      dom.setVisible(config.section, shouldShow, "flex");

      if (shouldShow && config.container && !hasTasks) {
        config.container.appendChild(createEmptyState(config.id));
      }
    });
  }

  function createTaskCard(task, bucket) {
    const accentColor = courses.getCourseColor(task.subject, task.color);
    const taskBox = dom.createElement("button", {
      className: `task-box ${bucket}`,
      attributes: {
        type: "button",
        "data-task-id": task.id,
        "aria-label": `Edit ${task.title}`
      }
    });

    const colorBox = dom.createElement("span", {
      className: "task-color",
      styles: { backgroundColor: accentColor }
    });
    const textBox = dom.createElement("span", { className: "text-box" });
    const titleBox = dom.createElement("span", { className: "task-title-box", text: task.title || "Untitled task" });
    const subjectBox = dom.createElement("span", { className: "task-subject-box", text: task.subject || "No course" });
    const dateBox = dom.createElement("span", {
      className: "task-date-box",
      text: dates.formatShortDate(task.date)
    });
    const descriptionBox = dom.createElement("span", {
      className: "task-description-box",
      text: task.description
    });

    if (bucket === "due-today") {
      taskBox.classList.add("due-today");
    }

    if (bucket === "overdue") {
      taskBox.classList.add("overdue");
    }

    textBox.append(titleBox, subjectBox);
    taskBox.append(colorBox, textBox, dateBox, descriptionBox);
    taskBox.addEventListener("click", function () {
      openTaskEditor(task.id);
    });

    return taskBox;
  }

  function createEmptyState(sectionId) {
    const messages = {
      "due-today": "Nothing due today.",
      "due-tomorrow": "No tasks due tomorrow.",
      "due-this-week": "No tasks due later this week.",
      "due-next-week": "No tasks due next week.",
      "due-this-month": "No tasks due later this month.",
      "due-after": "No long-range tasks yet."
    };

    return dom.createElement("p", {
      className: "empty-state",
      text: messages[sectionId] || "No tasks here."
    });
  }

  function isSectionVisible(config) {
    return config.alwaysVisible || !config.checkbox || config.checkbox.checked;
  }

  function showCreateDialog() {
    resetCreateForm();
    populateCourseOptions(elements.createSubject);
    dom.setVisible(elements.overlay, true, "block");
    dom.setVisible(elements.createWindow, true, "grid");
    elements.createTitle.focus();
  }

  function openTaskEditor(taskId) {
    const task = storage.getTasks().find((item) => String(item.id) === String(taskId));

    if (!task) {
      dom.notify("That task could not be found.");
      renderTasks();
      return;
    }

    activeTaskId = task.id;
    populateCourseOptions(elements.editSubject, task.subject);
    elements.editTitle.value = task.title;
    elements.editDate.value = task.date;
    elements.editSubject.value = task.subject;
    elements.editDescription.value = task.description;
    elements.editAccent.style.backgroundColor = courses.getCourseColor(task.subject, task.color);
    elements.editMessage.textContent = "";

    updateEditButtonState();
    dom.setVisible(elements.overlay, true, "block");
    dom.setVisible(elements.editOverlay, true, "flex");
    elements.editTitle.focus();
  }

  function saveNewTask() {
    const nextTask = getCreatePayload({ includeId: true });
    const validation = validateTask(nextTask);

    if (!validation.isValid) {
      elements.createMessage.textContent = validation.message;
      updateCreateButtonState();
      return;
    }

    try {
      const tasks = storage.getTasks();
      storage.saveTasks(tasks.concat(nextTask));
      renderTasks();
      hideTaskDialogs();
      dom.notify("Task created.");
    } catch (error) {
      elements.createMessage.textContent = "The task could not be saved. Please try again.";
      console.warn("Unable to save task.", error);
    }
  }

  function saveTaskEdits() {
    if (!activeTaskId) {
      return;
    }

    const updatedTask = getEditPayload();
    const validation = validateTask(updatedTask);

    if (!validation.isValid) {
      elements.editMessage.textContent = validation.message;
      updateEditButtonState();
      return;
    }

    const tasks = storage.getTasks();
    const index = tasks.findIndex((task) => String(task.id) === String(activeTaskId));

    if (index === -1) {
      elements.editMessage.textContent = "This task no longer exists.";
      return;
    }

    try {
      tasks[index] = updatedTask;
      storage.saveTasks(tasks);
      renderTasks();
      hideTaskDialogs();
      dom.notify("Task updated.");
    } catch (error) {
      elements.editMessage.textContent = "The task could not be updated. Please try again.";
      console.warn("Unable to update task.", error);
    }
  }

  function completeActiveTask() {
    if (!activeTaskId) {
      return;
    }

    try {
      const tasks = storage.getTasks().filter((task) => String(task.id) !== String(activeTaskId));
      storage.saveTasks(tasks);
      renderTasks();
      hideTaskDialogs();
      dom.notify("Task completed.");
    } catch (error) {
      elements.editMessage.textContent = "The task could not be completed. Please try again.";
      console.warn("Unable to complete task.", error);
    }
  }

  function hideTaskDialogs() {
    dom.setVisible(elements.createWindow, false);
    dom.setVisible(elements.editOverlay, false);
    dom.setVisible(elements.overlay, false);
    activeTaskId = null;
    resetCreateForm();
    resetEditForm();
  }

  function isAnyTaskDialogOpen() {
    return !elements.createWindow.hidden || !elements.editOverlay.hidden;
  }

  function resetCreateForm() {
    elements.createTitle.value = "";
    elements.createDescription.value = "";
    elements.createDate.value = "";
    elements.createSubject.value = "";
    elements.createMessage.textContent = "";
    updateCreateButtonState();
  }

  function resetEditForm() {
    elements.editTitle.value = "";
    elements.editDescription.value = "";
    elements.editDate.value = "";
    elements.editSubject.value = "";
    elements.editMessage.textContent = "";
    updateEditButtonState();
  }

  function getCreatePayload(options) {
    const subject = elements.createSubject.value;
    const config = options || {};

    return {
      id: config.includeId ? createTaskId() : "",
      title: elements.createTitle.value.trim(),
      description: elements.createDescription.value.trim(),
      date: elements.createDate.value,
      subject,
      color: courses.getCourseColor(subject, colors.fallbackTask)
    };
  }

  function getEditPayload() {
    const subject = elements.editSubject.value;

    return {
      id: activeTaskId,
      title: elements.editTitle.value.trim(),
      description: elements.editDescription.value.trim(),
      date: elements.editDate.value,
      subject,
      color: courses.getCourseColor(subject, colors.fallbackTask)
    };
  }

  function validateTask(task) {
    if (!task.title) {
      return { isValid: false, message: "Add a title before saving." };
    }

    if (!dates.parseLocalDate(task.date)) {
      return { isValid: false, message: "Choose a valid due date." };
    }

    return { isValid: true, message: "" };
  }

  function updateCreateButtonState() {
    const validation = validateTask(getCreatePayload());
    elements.createSave.disabled = !validation.isValid;

    if (validation.isValid) {
      elements.createMessage.textContent = "";
    }
  }

  function updateEditButtonState() {
    const validation = validateTask(getEditPayload());
    elements.editSave.disabled = !validation.isValid;

    if (validation.isValid) {
      elements.editMessage.textContent = "";
    }
  }

  function populateCourseOptions(select, selectedValue) {
    const courseList = storage.getCourses();
    const previousValue = selectedValue || "";
    select.textContent = "";
    select.appendChild(new Option("No course", ""));

    courseList.forEach((course) => {
      select.appendChild(new Option(course.name, course.name));
    });

    if (previousValue && !courseList.some((course) => course.name === previousValue)) {
      select.appendChild(new Option(`${previousValue} (removed)`, previousValue));
    }

    select.value = previousValue;
  }

  function sortTasks(firstTask, secondTask) {
    const firstDate = dates.parseLocalDate(firstTask.date);
    const secondDate = dates.parseLocalDate(secondTask.date);
    const firstTime = firstDate ? firstDate.getTime() : Number.MAX_SAFE_INTEGER;
    const secondTime = secondDate ? secondDate.getTime() : Number.MAX_SAFE_INTEGER;

    if (firstTime !== secondTime) {
      return firstTime - secondTime;
    }

    return firstTask.title.localeCompare(secondTask.title);
  }

  function createTaskId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
});
