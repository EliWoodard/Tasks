document.addEventListener("DOMContentLoaded", function() {
    const suggestionOverlay = document.getElementById('suggestionOverlay');
    const submitSuggestion = document.getElementById('submitSuggestion');
    const suggestionDescription = document.getElementById('suggestionDescription');
    const suggestionType = document.getElementById('suggestionType');
    const suggestionButton = document.getElementById('suggestionBox'); 

    suggestionButton.addEventListener("click", function() {
        suggestionOverlay.style.display = suggestionOverlay.style.display === 'flex' ? 'none' : 'flex';
    });

    function updateEmailLink() {
        const suggestion = suggestionDescription.value;
        const type = suggestionType.value;
        submitSuggestion.href = `mailto:elijahwoodard136.com?subject=Suggestion: ${type}&body=${suggestion}`;
    }

    suggestionDescription.addEventListener('input', updateEmailLink);
    suggestionType.addEventListener('change', updateEmailLink);

    submitSuggestion.addEventListener("click", function() {
        suggestionDescription.value = '';
        suggestionOverlay.style.display = 'none';
        updateEmailLink();  
    });

    updateEmailLink();
});
