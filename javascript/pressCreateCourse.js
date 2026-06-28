document.addEventListener("DOMContentLoaded", function () {
  const { dom, events, storage } = window.TasksApp;

  const elements = {
    addButton: dom.query(".add-course-button"),
    courseWindow: dom.query(".AddCourseWindow"),
    overlay: dom.query(".overlay"),
    discardButton: dom.query("#discard-course-button"),
    saveButton: dom.query("#save-course-button"),
    nameInput: dom.query("#course-name"),
    colorInput: dom.query("#course-color"),
    message: dom.query("#courseFormMessage"),
    coursesContainer: dom.query(".Courses")
  };

  if (Object.values(elements).some((element) => !element)) {
    console.warn("Courses could not initialize because required markup is missing.");
    return;
  }

  renderCourses();
  updateSaveButton();

  elements.addButton.addEventListener("click", showCourseDialog);
  elements.discardButton.addEventListener("click", hideCourseDialog);
  elements.saveButton.addEventListener("click", saveCourse);
  elements.nameInput.addEventListener("input", updateSaveButton);
  elements.colorInput.addEventListener("change", updateSaveButton);

  elements.overlay.addEventListener("click", function (event) {
    if (event.target === elements.overlay && !elements.courseWindow.hidden) {
      hideCourseDialog();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !elements.courseWindow.hidden) {
      hideCourseDialog();
    }
  });

  function renderCourses() {
    const courses = storage.getCourses().sort((firstCourse, secondCourse) => firstCourse.name.localeCompare(secondCourse.name));
    elements.coursesContainer.textContent = "";

    if (!courses.length) {
      elements.coursesContainer.appendChild(dom.createElement("p", {
        className: "empty-state course-empty-state",
        text: "Add a course to start organizing tasks by subject."
      }));
      return;
    }

    courses.forEach((course) => {
      elements.coursesContainer.appendChild(createCourseCard(course));
    });
  }

  function createCourseCard(course) {
    const courseBox = dom.createElement("article", {
      className: "course-box",
      attributes: {
        "data-course-name": course.name
      }
    });
    const colorBox = dom.createElement("span", {
      className: "course-color-box",
      styles: { backgroundColor: course.color }
    });
    const textBox = dom.createElement("span", {
      className: "course-text-box",
      text: course.name
    });
    const actions = dom.createElement("div", { className: "CourseDeleteWindow" });
    const deleteButton = dom.createElement("button", {
      className: "delete-course-button",
      text: "Remove",
      attributes: {
        type: "button",
        "aria-label": `Remove ${course.name}`
      }
    });

    actions.appendChild(deleteButton);
    courseBox.append(colorBox, textBox, actions);

    courseBox.addEventListener("click", function () {
      const isExpanded = courseBox.classList.toggle("clicked");
      courseBox.setAttribute("aria-expanded", String(isExpanded));
    });

    deleteButton.addEventListener("click", function (event) {
      event.stopPropagation();
      removeCourse(course);
    });

    return courseBox;
  }

  function showCourseDialog() {
    resetForm();
    dom.setVisible(elements.overlay, true, "block");
    dom.setVisible(elements.courseWindow, true, "flex");
    elements.nameInput.focus();
  }

  function hideCourseDialog() {
    dom.setVisible(elements.courseWindow, false);
    dom.setVisible(elements.overlay, false);
    resetForm();
  }

  function saveCourse() {
    const course = {
      name: elements.nameInput.value.trim(),
      color: elements.colorInput.value
    };
    const validation = validateCourse(course);

    if (!validation.isValid) {
      elements.message.textContent = validation.message;
      updateSaveButton();
      return;
    }

    try {
      const courses = storage.getCourses().concat(course);
      storage.saveCourses(courses);
      renderCourses();
      dom.emit(events.coursesChanged, { courses });
      dom.notify("Course added.");
      hideCourseDialog();
    } catch (error) {
      elements.message.textContent = "The course could not be saved. Please try again.";
      console.warn("Unable to save course.", error);
    }
  }

  function removeCourse(courseToRemove) {
    const shouldRemove = window.confirm(`Remove ${courseToRemove.name}? Tasks using this course will keep their saved label.`);

    if (!shouldRemove) {
      return;
    }

    try {
      const courses = storage.getCourses().filter((course) => course.name !== courseToRemove.name);
      storage.saveCourses(courses);
      renderCourses();
      dom.emit(events.coursesChanged, { courses });
      dom.notify("Course removed.");
    } catch (error) {
      elements.message.textContent = "The course could not be removed. Please try again.";
      console.warn("Unable to remove course.", error);
    }
  }

  function resetForm() {
    elements.nameInput.value = "";
    elements.colorInput.value = window.TasksApp.colors.defaultCourse;
    elements.message.textContent = "";
    updateSaveButton();
  }

  function validateCourse(course) {
    if (!course.name) {
      return { isValid: false, message: "Add a course name before saving." };
    }

    const duplicate = storage.getCourses().some((savedCourse) => savedCourse.name.toLowerCase() === course.name.toLowerCase());

    if (duplicate) {
      return { isValid: false, message: "A course with this name already exists." };
    }

    return { isValid: true, message: "" };
  }

  function updateSaveButton() {
    const validation = validateCourse({
      name: elements.nameInput.value.trim(),
      color: elements.colorInput.value
    });

    elements.saveButton.disabled = !validation.isValid;

    if (validation.isValid) {
      elements.message.textContent = "";
    }
  }
});
