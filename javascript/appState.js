(function () {
  const APP_NAMESPACE = "tasksApp";
  const DEFAULT_COURSE_COLOR = "#2e8b57";
  const FALLBACK_TASK_COLOR = "#6b7280";

  const storageKeys = {
    tasks: "tasks",
    courses: "courses",
    backgroundId: "backgroundOptionId",
    backgroundValue: "backgroundOptionValue",
    gradientState: "gradientCheckboxState",
    gradientStart: "color1",
    gradientEnd: "color2",
    settingsPosition: "settingsOverlayPosition"
  };

  const events = {
    coursesChanged: "tasks:courses-changed",
    tasksChanged: "tasks:tasks-changed",
    openTaskForm: "tasks:open-task-form",
    notify: "tasks:notify"
  };

  const selectors = {
    appStatus: "#app-status"
  };

  function safeParse(value, fallback) {
    if (!value) {
      return fallback;
    }

    try {
      return JSON.parse(value);
    } catch (error) {
      console.warn("Unable to read saved Tasks data.", error);
      return fallback;
    }
  }

  function readCollection(key) {
    const value = safeParse(localStorage.getItem(key), []);
    return Array.isArray(value) ? value : [];
  }

  function writeCollection(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function normalizeText(value) {
    return String(value || "").trim();
  }

  function isHexColor(value) {
    return /^#[0-9a-f]{6}$/i.test(value);
  }

  function normalizeCourse(course) {
    return {
      name: normalizeText(course && course.name),
      color: isHexColor(course && course.color) ? course.color : DEFAULT_COURSE_COLOR
    };
  }

  function normalizeTask(task) {
    return {
      id: task && task.id ? task.id : createId(),
      title: normalizeText(task && task.title),
      description: normalizeText(task && task.description),
      date: normalizeText(task && task.date),
      subject: normalizeText(task && task.subject),
      color: isHexColor(task && task.color) ? task.color : FALLBACK_TASK_COLOR
    };
  }

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function getCourses() {
    return readCollection(storageKeys.courses).map(normalizeCourse).filter((course) => course.name);
  }

  function saveCourses(courses) {
    writeCollection(storageKeys.courses, courses.map(normalizeCourse).filter((course) => course.name));
  }

  function getTasks() {
    return readCollection(storageKeys.tasks).map(normalizeTask).filter((task) => task.title || task.date || task.description);
  }

  function saveTasks(tasks) {
    writeCollection(storageKeys.tasks, tasks.map(normalizeTask));
  }

  function parseLocalDate(dateString) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString || "")) {
      return null;
    }

    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return null;
    }

    date.setHours(0, 0, 0, 0);
    return date;
  }

  function startOfToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  function addDays(date, days) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
  }

  function getWeekBounds(today) {
    const start = new Date(today);
    start.setDate(start.getDate() - start.getDay() + (start.getDay() === 0 ? -6 : 1));
    start.setHours(0, 0, 0, 0);

    const end = addDays(start, 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  function getTaskBucket(dateString) {
    const date = parseLocalDate(dateString);

    if (!date) {
      return "due-after";
    }

    const today = startOfToday();
    const tomorrow = addDays(today, 1);
    const thisWeek = getWeekBounds(today);
    const nextWeekStart = addDays(thisWeek.end, 1);
    nextWeekStart.setHours(0, 0, 0, 0);
    const nextWeekEnd = addDays(nextWeekStart, 6);
    nextWeekEnd.setHours(23, 59, 59, 999);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    if (date < today) {
      return "overdue";
    }

    if (date.getTime() === today.getTime()) {
      return "due-today";
    }

    if (date.getTime() === tomorrow.getTime()) {
      return "due-tomorrow";
    }

    if (date > tomorrow && date <= thisWeek.end) {
      return "due-this-week";
    }

    if (date >= nextWeekStart && date <= nextWeekEnd) {
      return "due-next-week";
    }

    if (date > nextWeekEnd && date <= endOfMonth) {
      return "due-this-month";
    }

    return "due-after";
  }

  function formatShortDate(dateString) {
    const date = parseLocalDate(dateString);

    if (!date) {
      return "No date";
    }

    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric"
    });
  }

  function formatBytes(bytes) {
    const normalizedBytes = Math.max(Number(bytes) || 0, 0);

    if (normalizedBytes < 1024) {
      return `${normalizedBytes} bytes`;
    }

    return `${(normalizedBytes / 1024).toFixed(1)} KB`;
  }

  function getCourseColor(courseName, fallbackColor) {
    const course = getCourses().find((item) => item.name === courseName);
    return course ? course.color : fallbackColor || FALLBACK_TASK_COLOR;
  }

  function query(selector, root) {
    return (root || document).querySelector(selector);
  }

  function queryAll(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function createElement(tagName, options) {
    const element = document.createElement(tagName);
    const config = options || {};

    if (config.className) {
      element.className = config.className;
    }

    if (config.text !== undefined) {
      element.textContent = config.text;
    }

    if (config.attributes) {
      Object.entries(config.attributes).forEach(([name, value]) => {
        element.setAttribute(name, value);
      });
    }

    if (config.styles) {
      Object.assign(element.style, config.styles);
    }

    return element;
  }

  function setVisible(element, shouldShow, displayValue) {
    if (!element) {
      return;
    }

    element.hidden = !shouldShow;
    element.style.display = shouldShow ? displayValue || "" : "none";
  }

  function emit(name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail: detail || {} }));
  }

  function notify(message) {
    const status = query(selectors.appStatus);

    if (status) {
      status.textContent = message || "";
    }

    emit(events.notify, { message });
  }

  window.TasksApp = Object.assign(window.TasksApp || {}, {
    appName: APP_NAMESPACE,
    colors: {
      defaultCourse: DEFAULT_COURSE_COLOR,
      fallbackTask: FALLBACK_TASK_COLOR
    },
    events,
    storageKeys,
    storage: {
      getCourses,
      saveCourses,
      getTasks,
      saveTasks,
      safeParse
    },
    dates: {
      parseLocalDate,
      startOfToday,
      getTaskBucket,
      formatShortDate
    },
    courses: {
      getCourseColor
    },
    dom: {
      query,
      queryAll,
      createElement,
      setVisible,
      emit,
      notify
    },
    format: {
      bytes: formatBytes
    }
  });
})();
