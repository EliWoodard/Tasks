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
  var colorSettings = document.getElementById("color-button");

  profileSettings.addEventListener("click", function() {
    profileSettings.classList.add("active");
    filterSettings.classList.remove("active");
    backgroundSettings.classList.remove("active");
    colorSettings.classList.remove("active");
  });

  filterSettings.addEventListener("click", function() {
    filterSettings.classList.add("active");
    profileSettings.classList.remove("active");
    backgroundSettings.classList.remove("active");
    colorSettings.classList.remove("active");
  });

  backgroundSettings.addEventListener("click", function() {
    backgroundSettings.classList.add("active");
    profileSettings.classList.remove("active");
    filterSettings.classList.remove("active");
    colorSettings.classList.remove("active");
  });

  colorSettings.addEventListener("click", function() {
    colorSettings.classList.add("active");
    profileSettings.classList.remove("active");
    filterSettings.classList.remove("active");
    backgroundSettings.classList.remove("active");
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
  });

  closeButton.addEventListener('click', function() {
    settingsOverlay.style.display = 'none';
  });
});
