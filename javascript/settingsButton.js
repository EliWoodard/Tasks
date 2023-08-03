document.addEventListener("DOMContentLoaded", function() {
  const gearImage = document.getElementById('gearImage');
  const settingsOverlay = document.getElementById('settingsOverlay');
  const closeButton = document.querySelector('#closeButton');

  let mouseDown = false;
  let offsetX = 0, offsetY = 0;

  // varaiables
  var profileSettings = document.getElementById("profile-button");
  var filterSettings = document.getElementById("filters-button");
  var backgroundSettings = document.getElementById("background-button");

  profileSettings.addEventListener("click", function() {
    profileSettings.classList.add("active");
    filterSettings.classList.remove("active");
    backgroundSettings.classList.remove("active");
  });

  filterSettings.addEventListener("click", function() {
    filterSettings.classList.add("active");
    profileSettings.classList.remove("active");
    backgroundSettings.classList.remove("active");
  });

  backgroundSettings.addEventListener("click", function() {
    backgroundSettings.classList.add("active");
    profileSettings.classList.remove("active");
    filterSettings.classList.remove("active");
  });

  //Cache
  const savedPosition = localStorage.getItem('settingsOverlayPosition');
  if (savedPosition) {
    const pos = JSON.parse(savedPosition);
    settingsOverlay.style.top = pos.top;
    settingsOverlay.style.left = pos.left;
  }

  settingsOverlay.addEventListener('mousedown', function(e) {
    mouseDown = true;
    offsetX = e.clientX - (parseInt(settingsOverlay.offsetLeft) || 0);
    offsetY = e.clientY - (parseInt(settingsOverlay.offsetTop) || 0);
  });

  document.addEventListener('mousemove', function(e) {
    if (mouseDown) {
      settingsOverlay.style.left = (e.clientX - offsetX) + 'px';
      settingsOverlay.style.top = (e.clientY - offsetY) + 'px';
    }
  });

  document.addEventListener('mouseup', function() {
    mouseDown = false;

    const pos = {
      left: settingsOverlay.style.left,
      top: settingsOverlay.style.top
    };
    localStorage.setItem('settingsOverlayPosition', JSON.stringify(pos));
  });

  gearImage.addEventListener('click', function(e) {
    e.stopPropagation(); 
    settingsOverlay.style.display = settingsOverlay.style.display === 'flex' ? 'none' : 'flex';

    calculateCacheSize();
  });

  closeButton.addEventListener('click', function() {
    settingsOverlay.style.display = 'none';
  });

  document.getElementById('clearCache').addEventListener('click', function() {
    localStorage.clear();
    location.reload();
  });

  function calculateCacheSize() {
    document.getElementById('tasksSize').textContent = "Tasks Size: ";
    document.getElementById('coursesSize').textContent = "Courses Size: ";
    document.getElementById('totalSize').textContent = "Total Size: ";
    document.getElementById('availableSize').textContent = "Available Size: ";

    var storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    var tasksSize = JSON.stringify(storedTasks).length;
    document.getElementById('tasksSize').textContent += tasksSize - 2 + " bytes";

    var storedCourses = JSON.parse(localStorage.getItem('courses')) || [];
    var coursesSize = JSON.stringify(storedCourses).length;
    document.getElementById('coursesSize').textContent += coursesSize - 2 + " bytes";

    var totalSize = tasksSize + coursesSize - 4;
    document.getElementById('totalSize').textContent += totalSize + " bytes";

    var availableSize = 5 * 1024 * 1024 - totalSize - 4; 
    document.getElementById('availableSize').textContent += availableSize + " bytes";
}
});
