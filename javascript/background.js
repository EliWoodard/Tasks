document.addEventListener("DOMContentLoaded", function () {
  const { dom, storageKeys } = window.TasksApp;
  const cover1 = document.getElementById("backgroundCover1");
  const cover2 = document.getElementById("backgroundCover2");
  const gradientCheck = document.getElementById("backgroundCheck");
  const color1 = document.getElementById("color1");
  const color2 = document.getElementById("color2");
  const backgroundOptions = dom.queryAll(".backgroundOption");

  if (!cover1 || !cover2 || !gradientCheck || !color1 || !color2) {
    return;
  }

  let activeCover = cover1;
  let inactiveCover = cover2;

  restoreBackground();

  gradientCheck.addEventListener("change", function () {
    if (gradientCheck.checked) {
      clearImageSelection();
      applyBackground(getGradientBackground());
      localStorage.setItem(storageKeys.backgroundId, "color-gradient-background");
      localStorage.setItem(storageKeys.backgroundValue, getGradientBackground());
      localStorage.setItem(storageKeys.gradientState, "checked");
    } else {
      applyBackground("");
      localStorage.removeItem(storageKeys.backgroundId);
      localStorage.removeItem(storageKeys.backgroundValue);
      localStorage.setItem(storageKeys.gradientState, "unchecked");
    }
  });

  [color1, color2].forEach((input) => {
    input.addEventListener("input", function () {
      localStorage.setItem(input.id, input.value);

      if (gradientCheck.checked) {
        const gradientBackground = getGradientBackground();
        applyBackground(gradientBackground);
        localStorage.setItem(storageKeys.backgroundValue, gradientBackground);
      }
    });
  });

  backgroundOptions.forEach((element) => {
    element.addEventListener("click", function () {
      const backgroundNumber = element.id.replace("bgOption", "");
      const background = `url('Images/background(${backgroundNumber}).jpg')`;
      const position = backgroundNumber === "4" ? "bottom" : "center";

      gradientCheck.checked = false;
      localStorage.setItem(storageKeys.gradientState, "unchecked");
      applyBackground(background, position);
      selectImageOption(element);
      localStorage.setItem(storageKeys.backgroundId, element.id);
      localStorage.setItem(storageKeys.backgroundValue, background);
    });
  });

  function restoreBackground() {
    const savedBackgroundId = localStorage.getItem(storageKeys.backgroundId);
    const savedBackgroundValue = localStorage.getItem(storageKeys.backgroundValue);
    const savedColor1 = localStorage.getItem(storageKeys.gradientStart);
    const savedColor2 = localStorage.getItem(storageKeys.gradientEnd);
    const gradientState = localStorage.getItem(storageKeys.gradientState);

    if (savedColor1) {
      color1.value = savedColor1;
    }

    if (savedColor2) {
      color2.value = savedColor2;
    }

    if (savedBackgroundId === "color-gradient-background" || gradientState === "checked") {
      gradientCheck.checked = true;
      applyBackground(savedBackgroundValue || getGradientBackground());
      return;
    }

    if (savedBackgroundId && savedBackgroundValue) {
      const selectedOption = document.getElementById(savedBackgroundId);
      const position = savedBackgroundId === "bgOption4" ? "bottom" : "center";

      applyBackground(savedBackgroundValue, position);

      if (selectedOption) {
        selectImageOption(selectedOption);
      }
    }
  }

  function applyBackground(background, position) {
    inactiveCover.style.backgroundImage = background;
    inactiveCover.style.backgroundPosition = position || "center";
    inactiveCover.style.opacity = "1";
    activeCover.style.opacity = "0";

    const previousCover = activeCover;
    activeCover = inactiveCover;
    inactiveCover = previousCover;
  }

  function getGradientBackground() {
    return `linear-gradient(to right, ${color1.value}, ${color2.value})`;
  }

  function selectImageOption(selectedOption) {
    clearImageSelection();
    selectedOption.classList.add("selected");
    selectedOption.setAttribute("aria-pressed", "true");
  }

  function clearImageSelection() {
    backgroundOptions.forEach((option) => {
      option.classList.remove("selected");
      option.setAttribute("aria-pressed", "false");
    });
  }
});
