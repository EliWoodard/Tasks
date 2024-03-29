document.addEventListener("DOMContentLoaded", function() {
  var addCourseButton = document.querySelector(".add-course-button");
  var courseWindow = document.querySelector(".AddCourseWindow");
  var overlay = document.querySelector(".overlay");
  var discardCourseButton = document.querySelector("#discard-course-button");
  var saveCourseButton = document.querySelector("#save-course-button");
  var courseNameInput = document.querySelector("#course-name");
  var courseColorInput = document.querySelector("#course-color");
  var coursesContainer = document.querySelector(".Courses");

  var storedCourses = JSON.parse(localStorage.getItem('courses')) || [];
 for (var i = 0; i < storedCourses.length; i++) {
   createCourse(storedCourses[i]);
 }

 function createCourse(course) {
   var courseBox = document.createElement("div");
   courseBox.classList.add("course-box");

   var colorBox = document.createElement("div");
   colorBox.style.backgroundColor = course.color;
   colorBox.classList.add("course-color-box");

   var textBox = document.createElement("div");
   textBox.textContent = course.name;
   textBox.classList.add("course-text-box");

   var deleteWindow = document.createElement("div");
   deleteWindow.classList.add("CourseDeleteWindow");

   var deleteButton = document.createElement("button");
   deleteButton.id = "delete-course-button";
   deleteButton.textContent = "Remove";

   courseBox.appendChild(colorBox);
   courseBox.appendChild(textBox);
   courseBox.appendChild(deleteWindow);
   deleteWindow.appendChild(deleteButton);
   coursesContainer.appendChild(courseBox);

   var subjectSelect = document.querySelector("#subject-select");
   var newOption = document.createElement("option");
   newOption.text = course.name;
   newOption.value = course.name;
   subjectSelect.add(newOption);

   courseBox.addEventListener("click", function() {
     this.classList.toggle("clicked");
   });

   deleteButton.addEventListener("click", function(event) {
     event.stopPropagation();
     courseBox.remove();
     var options = Array.from(subjectSelect.options);
     var optionToRemove = options.find(function(option) {
       return option.value === course.name;
     });
     if (optionToRemove) {
       subjectSelect.removeChild(optionToRemove);
     }

     var courses = JSON.parse(localStorage.getItem('courses')) || [];
     var index = courses.findIndex(c => c.name === course.name && c.color === course.color);
     if (index > -1) {
       courses.splice(index, 1);
       localStorage.setItem('courses', JSON.stringify(courses));
     }
   });
 }

 overlay.addEventListener('click', function(event) {
    if (event.target === overlay) {
        discardCourseButton.click();
    }
  });

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

    var newCourse = {
      name: courseNameInput.value,
      color: courseColorInput.value
    };

    var courses = JSON.parse(localStorage.getItem('courses')) || [];
    courses.push(newCourse);
    localStorage.setItem('courses', JSON.stringify(courses));

    var courseBox = document.createElement("div");
    courseBox.classList.add("course-box");

    var colorBox = document.createElement("div");
    colorBox.style.backgroundColor = courseColorInput.value;
    colorBox.classList.add("course-color-box");

    var textBox = document.createElement("div");
    textBox.textContent = courseNameInput.value;
    textBox.classList.add("course-text-box");

    var deleteWindow = document.createElement("div");
    deleteWindow.classList.add("CourseDeleteWindow");

    var deleteButton = document.createElement("button");
    deleteButton.id = "delete-course-button";
    deleteButton.textContent = "Remove";

    courseBox.appendChild(colorBox);
    courseBox.appendChild(textBox);
    courseBox.appendChild(deleteWindow);
    deleteWindow.appendChild(deleteButton);
    coursesContainer.appendChild(courseBox);

    var subjectSelect = document.querySelector("#subject-select");
    var newOption = document.createElement("option");
    newOption.text = courseNameInput.value;
    newOption.value = courseNameInput.value;
    subjectSelect.add(newOption);

    var courseNameValue = courseNameInput.value;

    discardCourseButton.click();

    courseBox.addEventListener("click", function() {
      this.classList.toggle("clicked");
    });

    deleteButton.addEventListener("click", function(event) {
      event.stopPropagation();
      courseBox.remove();
      var options = Array.from(subjectSelect.options);
      var optionToRemove = options.find(function(option) {
        return option.value === courseNameValue;
      });
      if (optionToRemove) {
        subjectSelect.removeChild(optionToRemove);
      }
    });
  });
});
