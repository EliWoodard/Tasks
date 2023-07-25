document.addEventListener("DOMContentLoaded", function() {
    const suggestionOverlay = this.getElementById('suggestionOverlay');
    const suggestionButton = this.getElementById('suggestionBox');

    suggestionButton.addEventListener("click", function() {
        suggestionOverlay.style.display = suggestionOverlay.style.display === 'flex' ? 'none' : 'flex';
    });
});