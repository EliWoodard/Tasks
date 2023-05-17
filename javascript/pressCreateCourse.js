document.addEventListener("DOMContentLoaded", function() {
  var addCourseButton = document.querySelector(".add-course-button");
  var courseWindow = document.querySelector(".AddCourseWindow");
  var overlay = document.querySelector(".overlay");
  var discardCourseButton = document.querySelector("#discard-course-button");
  var saveCourseButton = document.querySelector("#save-course-button");

  addCourseButton.addEventListener("click", function() {
    console.log("Add course button clicked!");
    overlay.style.display = "flex";
    courseWindow.style.display = "flex";
  });

  discardCourseButton.addEventListener("click", function() {
    console.log("Discard course button clicked!");
    overlay.style.display = "none";
    courseWindow.style.display = "none";
  });

  saveCourseButton.addEventListener("click", function() {
    console.log("Save course button clicked!");
    // Add your code to handle saving the course here.
    discardCourseButton.click();
  });
});
