document.addEventListener("DOMContentLoaded", function () {
  const { dom, format, storage, storageKeys } = window.TasksApp;

  const elements = {
    settingsButton: dom.query("#settingsButton"),
    settingsOverlay: dom.query("#settingsOverlay"),
    closeButton: dom.query("#closeButton"),
    clearCacheButton: dom.query("#clearCache"),
    tabs: {
      profile: dom.query("#profile-button"),
      filters: dom.query("#filters-button"),
      background: dom.query("#background-button")
    },
    pages: {
      profile: dom.query("#profilePage"),
      filters: dom.query("#filterPage"),
      background: dom.query("#backgroundPage")
    },
    tasksSize: dom.query("#tasksSize"),
    coursesSize: dom.query("#coursesSize"),
    totalSize: dom.query("#totalSize"),
    availableSize: dom.query("#availableSize")
  };

  if (!elements.settingsButton || !elements.settingsOverlay || !elements.closeButton) {
    return;
  }

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  restorePosition();
  switchSettingsPage("profile");

  elements.settingsButton.addEventListener("click", function (event) {
    event.stopPropagation();
    const shouldOpen = elements.settingsOverlay.hidden;
    dom.setVisible(elements.settingsOverlay, shouldOpen, "flex");
    elements.settingsButton.setAttribute("aria-expanded", String(shouldOpen));

    if (shouldOpen) {
      calculateCacheSize();
    }
  });

  elements.closeButton.addEventListener("click", closeSettings);

  Object.entries(elements.tabs).forEach(([pageName, button]) => {
    button.addEventListener("click", function () {
      switchSettingsPage(pageName);
    });
  });

  elements.clearCacheButton.addEventListener("click", function () {
    const shouldClear = window.confirm("Clear all saved tasks, courses, and preferences?");

    if (!shouldClear) {
      return;
    }

    localStorage.clear();
    window.location.reload();
  });

  elements.settingsOverlay.addEventListener("mousedown", function (event) {
    if (event.target.closest("button, input, label, select")) {
      return;
    }

    isDragging = true;
    offsetX = event.clientX - (parseInt(elements.settingsOverlay.offsetLeft, 10) || 0);
    offsetY = event.clientY - (parseInt(elements.settingsOverlay.offsetTop, 10) || 0);
  });

  document.addEventListener("mousemove", function (event) {
    if (!isDragging) {
      return;
    }

    elements.settingsOverlay.style.left = `${event.clientX - offsetX}px`;
    elements.settingsOverlay.style.top = `${event.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", function () {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    localStorage.setItem(storageKeys.settingsPosition, JSON.stringify({
      left: elements.settingsOverlay.style.left,
      top: elements.settingsOverlay.style.top
    }));
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !elements.settingsOverlay.hidden) {
      closeSettings();
    }
  });

  function switchSettingsPage(pageName) {
    Object.entries(elements.tabs).forEach(([name, button]) => {
      const isActive = name === pageName;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
      dom.setVisible(elements.pages[name], isActive, "flex");
    });
  }

  function closeSettings() {
    dom.setVisible(elements.settingsOverlay, false);
    elements.settingsButton.setAttribute("aria-expanded", "false");
  }

  function restorePosition() {
    const savedPosition = storage.safeParse(localStorage.getItem(storageKeys.settingsPosition), null);

    if (!savedPosition) {
      return;
    }

    if (savedPosition.top) {
      elements.settingsOverlay.style.top = savedPosition.top;
    }

    if (savedPosition.left) {
      elements.settingsOverlay.style.left = savedPosition.left;
    }
  }

  function calculateCacheSize() {
    const tasksRaw = localStorage.getItem(storageKeys.tasks) || "[]";
    const coursesRaw = localStorage.getItem(storageKeys.courses) || "[]";
    const tasksSize = tasksRaw.length;
    const coursesSize = coursesRaw.length;
    const totalSize = tasksSize + coursesSize;
    const availableSize = 5 * 1024 * 1024 - totalSize;

    elements.tasksSize.textContent = `Tasks Size: ${format.bytes(tasksSize)}`;
    elements.coursesSize.textContent = `Courses Size: ${format.bytes(coursesSize)}`;
    elements.totalSize.textContent = `Total Size: ${format.bytes(totalSize)}`;
    elements.availableSize.textContent = `Available Size: ${format.bytes(availableSize)}`;
  }
});
