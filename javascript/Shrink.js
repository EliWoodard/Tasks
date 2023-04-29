document.addEventListener("DOMContentLoaded", function() {
  var shrinkButton = document.getElementById("shrink-button");
  var taskWindow = document.querySelector(".task-window");
  var rightContent = document.querySelector(".right-content");
  var isShrunk = false;

  shrinkButton.addEventListener("click", function() {
    if (isShrunk) {
      taskWindow.classList.remove("shrink");
      shrinkButton.classList.remove("flipped");
      shrinkButton.style.right = "-7%";
    } else {
      taskWindow.classList.add("shrink");
      shrinkButton.classList.add("flipped");
      shrinkButton.style.right = "-30px";
    }
    isShrunk = !isShrunk;
  });
});
