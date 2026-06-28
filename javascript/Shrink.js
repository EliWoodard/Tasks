document.addEventListener("DOMContentLoaded", function () {
  const shrinkButton = document.getElementById("shrink-button");
  const taskWindow = document.querySelector(".task-window");

  if (!shrinkButton || !taskWindow) {
    return;
  }

  let isShrunk = localStorage.getItem("sidebarShrunk") === "true";
  applySidebarState();

  shrinkButton.addEventListener("click", function () {
    isShrunk = !isShrunk;
    localStorage.setItem("sidebarShrunk", String(isShrunk));
    applySidebarState();
  });

  function applySidebarState() {
    taskWindow.classList.toggle("shrink", isShrunk);
    shrinkButton.classList.toggle("flipped", isShrunk);
    shrinkButton.setAttribute("aria-label", isShrunk ? "Expand sidebar" : "Collapse sidebar");
  }
});
