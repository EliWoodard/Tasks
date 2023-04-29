document.addEventListener("DOMContentLoaded", function() {
  const droplets = 50;
  const rain = document.querySelector('.rain');

  for (let r = 0; r < droplets; r++) {
    const drop = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    drop.classList.add('rain__drop');
    drop.setAttribute('preserveAspectRatio', 'xMinYMin');
    drop.setAttribute('viewBox', '0 0 5 50');
    drop.style.setProperty('--x', Math.floor(Math.random() * 100));
    drop.style.setProperty('--y', Math.floor(Math.random() * 100));
    drop.style.setProperty('--o', Math.random());
    drop.style.setProperty('--a', Math.random() + 0.5);
    drop.style.setProperty('--d', (Math.random() * 2) - 1);
    drop.style.setProperty('--s', Math.random());

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('stroke', 'none');
    path.setAttribute('d', 'M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z');

    drop.appendChild(path);
    rain.appendChild(drop);
  }
});
