document.addEventListener('DOMContentLoaded', (event) => {
  const cover1 = document.getElementById('backgroundCover1');
  const cover2 = document.getElementById('backgroundCover2');

  let activeCover = cover1;
  let inactiveCover = cover2;

  const savedBackgroundId = localStorage.getItem('backgroundOptionId');
  if (savedBackgroundId) {
    const selectedOption = document.getElementById(savedBackgroundId);
    if (selectedOption) {
      selectedOption.classList.add('selected');
    }
  }

  window.onload = function() {
    if (savedBackgroundId) {
      const selectedOption = document.getElementById(savedBackgroundId);
      if (selectedOption) {
        // Transition to the saved background
        inactiveCover.style.backgroundImage = selectedOption.style.backgroundImage;
        inactiveCover.style.opacity = '1';
        activeCover.style.opacity = '0';
        
        // Swap active and inactive covers
        const temp = activeCover;
        activeCover = inactiveCover;
        inactiveCover = temp;
      }
    }
  }

  document.querySelectorAll('.backgroundOption').forEach((element) => {
    element.addEventListener('click', (e) => {
      document.querySelectorAll('.backgroundOption').forEach((el) => {
        el.classList.remove('selected');
      });

      e.currentTarget.classList.add('selected');
      const newBackground = e.currentTarget.style.backgroundImage;

      inactiveCover.style.backgroundImage = newBackground;
      inactiveCover.style.opacity = '1';

      activeCover.style.opacity = '0';

      const temp = activeCover;
      activeCover = inactiveCover;
      inactiveCover = temp;

      localStorage.setItem('backgroundOptionId', e.currentTarget.id);
    });
  });
});
