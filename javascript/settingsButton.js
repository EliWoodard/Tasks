document.addEventListener("DOMContentLoaded", function() {
    const gearImage = document.getElementById('gearImage');
    const settingsOverlay = document.getElementById('settingsOverlay');
  
    gearImage.addEventListener('click', function() {
      this.classList.add('expanded');
      settingsOverlay.style.display = settingsOverlay.style.display === 'block' ? 'none' : 'block';
  
      setTimeout(() => {
        this.classList.remove('expanded');
      }, 500);
    });
  });
  