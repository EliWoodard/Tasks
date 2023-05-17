document.addEventListener("DOMContentLoaded", function() {
  var addCourseButton = document.querySelector(".add-course-button");
  var courseWindow = document.querySelector(".AddCourseWindow");
  var overlay = document.querySelector(".overlay");
  var discardCourseButton = document.querySelector("#discard-course-button");
  var saveCourseButton = document.querySelector("#save-course-button");
  var courseNameInput = document.querySelector("#course-name");
  var courseColorInput = document.querySelector("#course-color");
  var coursesContainer = document.querySelector(".Courses");

  addCourseButton.addEventListener("click", function() {
    console.log("Add course button clicked!");
    overlay.style.display = "flex";
    courseWindow.style.display = "flex";
  });

  discardCourseButton.addEventListener("click", function() {
    overlay.style.display = "none";
    courseWindow.style.display = "none";
    courseNameInput.value = "";
    courseColorInput.value = "none";
  });

  saveCourseButton.addEventListener("click", function() {
    console.log("Save course button clicked!");

    var courseBox = document.createElement("div");
    courseBox.classList.add("course-box");

    var colorBox = document.createElement("div");
    colorBox.style.backgroundColor = courseColorInput.value;
    colorBox.classList.add("course-color-box");

    var textBox = document.createElement("div");
    textBox.textContent = courseNameInput.value;
    textBox.classList.add("course-text-box");

    courseBox.appendChild(colorBox);
    courseBox.appendChild(textBox);
    coursesContainer.appendChild(courseBox);

    var subjectSelect = document.querySelector("#subject-select");
    var newOption = document.createElement("option");
    newOption.text = courseNameInput.value;
    newOption.value = courseNameInput.value;
    subjectSelect.add(newOption);

    discardCourseButton.click();
  });
});
