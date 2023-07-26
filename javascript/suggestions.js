const fs = require('fs')

document.addEventListener("DOMContentLoaded", function() {
    const suggestionOverlay = document.getElementById('suggestionOverlay');
    const submitSuggestion = document.getElementById('submitSuggestion');
    const suggestionDescription = document.getElementById('suggestionDescription');
    const suggestionType = document.getElementById('suggestionType');
    const suggestionButton = document.getElementById('suggestionBox'); 

    suggestionButton.addEventListener("click", function() {
        suggestionOverlay.style.display = suggestionOverlay.style.display === 'flex' ? 'none' : 'flex';
    });

    submitSuggestion.addEventListener("click", function() {
        const suggestion = suggestionDescription.value;
        const type = suggestionType.value;
        
        let filename;
        if(type === "Bug"){
            filename = 'bug.txt';
        } else if (type === "Enhancement"){
            filename = 'enhancement.txt';
        }

        fs.writeFile(filename, suggestion, (err) => {
            if (err) throw err;
            console.log("The file is updated with the given data");
        });

        suggestionDescription.value = '';
        suggestionOverlay.style.display = 'none';
    });
});
