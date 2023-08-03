document.addEventListener("DOMContentLoaded", function() {
    // buttons
    const profileButton = document.getElementById('profile-button');
    const filterButton = document.getElementById('filters-button');
    const backgroundButton = document.getElementById('background-button');

    // displays
    const profilePage = document.getElementById('profilePage');
    const filterPage = document.getElementById('filterPage');
    const backgroundPage = document.getElementById('backgroundPage');


    profileButton.addEventListener("click", function() {
        // Hide all pages
        filterPage.style.display = 'none';
        backgroundPage.style.display = 'none';

        // Show profile page
        profilePage.style.display = 'flex';
    });

    filterButton.addEventListener("click", function() {
        // Hide all pages
        profilePage.style.display = 'none';
        backgroundPage.style.display = 'none';

        // Show filter page
        filterPage.style.display = 'flex';
    });

    backgroundButton.addEventListener("click", function() {
        // Hide all pages
        profilePage.style.display = 'none';
        filterPage.style.display = 'none';

        // Show background page
        backgroundPage.style.display = 'flex';
    });
});