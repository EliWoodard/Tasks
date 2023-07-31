document.addEventListener('DOMContentLoaded', (event) => {
  const cover1 = document.getElementById('backgroundCover1');
  const cover2 = document.getElementById('backgroundCover2');
  let activeCover = cover1;
  let inactiveCover = cover2;

  function applyBackground(background) {
    inactiveCover.style.backgroundImage = background;
    inactiveCover.style.opacity = '1';
    activeCover.style.opacity = '0';

    const temp = activeCover;
    activeCover = inactiveCover;
    inactiveCover = temp;
  }

  // Load saved backgrounds
  window.onload = function() {
    const savedBackgroundId = localStorage.getItem('backgroundOptionId');
    const savedBackgroundValue = localStorage.getItem('backgroundOptionValue');
    const gradientCheckboxState = localStorage.getItem('gradientCheckboxState');
    const savedColor1 = localStorage.getItem('color1');
    const savedColor2 = localStorage.getItem('color2');

    if (gradientCheckboxState === 'checked') {
      document.getElementById('backgroundCheck').checked = true;
      applyBackground(savedBackgroundValue);
    }

    if (savedColor1) {
      document.getElementById('color1').value = savedColor1;
    }

    if (savedColor2) {
      document.getElementById('color2').value = savedColor2;
    }

    if (savedBackgroundId && savedBackgroundId !== 'color-gradient-background') {
      const selectedOption = document.getElementById(savedBackgroundId);
      if (selectedOption) {
        selectedOption.classList.add('selected');
        applyBackground(savedBackgroundValue);
      }
    }
  }

  document.getElementById('backgroundCheck').addEventListener('click', (e) => {
    e.stopPropagation();
    const gradientBackground = `linear-gradient(to right, ${document.getElementById('color1').value}, ${document.getElementById('color2').value})`;

    if (e.target.checked) {
      // Unselect all background images
      document.querySelectorAll('.backgroundOption').forEach((el) => {
        el.classList.remove('selected');
      });
      document.getElementById('color-gradient-background').classList.add('selected');

      applyBackground(gradientBackground);
      localStorage.setItem('backgroundOptionId', 'color-gradient-background');
      localStorage.setItem('backgroundOptionValue', gradientBackground);
      localStorage.setItem('gradientCheckboxState', 'checked');
    } else {
      applyBackground('');
      localStorage.removeItem('backgroundOptionId');
      localStorage.removeItem('backgroundOptionValue');
      localStorage.setItem('gradientCheckboxState', 'unchecked');
    }
  });

  document.getElementById('color1').addEventListener('change', () => {
    localStorage.setItem('color1', document.getElementById('color1').value);
    if (document.getElementById('backgroundCheck').checked) {
      const gradientBackground = `linear-gradient(to right, ${document.getElementById('color1').value}, ${document.getElementById('color2').value})`;
      applyBackground(gradientBackground);
      localStorage.setItem('backgroundOptionValue', gradientBackground);
    }
  });

  document.getElementById('color2').addEventListener('change', () => {
    localStorage.setItem('color2', document.getElementById('color2').value);
    if (document.getElementById('backgroundCheck').checked) {
      const gradientBackground = `linear-gradient(to right, ${document.getElementById('color1').value}, ${document.getElementById('color2').value})`;
      applyBackground(gradientBackground);
      localStorage.setItem('backgroundOptionValue', gradientBackground);
    }
  });

  document.querySelectorAll('.backgroundOption:not(#color-gradient-background)').forEach((element) => {
    element.addEventListener('click', (e) => {
      document.getElementById('backgroundCheck').checked = false;
      localStorage.setItem('gradientCheckboxState', 'unchecked');

      const newBackground = e.currentTarget.style.backgroundImage;
      applyBackground(newBackground);
      localStorage.setItem('backgroundOptionId', e.currentTarget.id);
      localStorage.setItem('backgroundOptionValue', newBackground);
      
      document.querySelectorAll('.backgroundOption').forEach((el) => {
        el.classList.remove('selected');
      });
      e.currentTarget.classList.add('selected');
    });
  });
});
