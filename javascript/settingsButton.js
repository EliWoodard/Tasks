document.addEventListener("DOMContentLoaded", function() {
  const gearImage = document.getElementById('gearImage');
  const settingsOverlay = document.getElementById('settingsOverlay');

  let mouseDown = false;
  let offsetX = 0, offsetY = 0;

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
    e.stopPropagation(); // Prevent event bubbling up.
    settingsOverlay.style.display = settingsOverlay.style.display === 'none' ? 'block' : 'none';
  });
});
