// Tumblr.post.conversation
Tumblr.post.addType("conversation", function() {
    var containers = Tumblr.post.wrapper(this);
    
    for (var line in this["conversation"]) {
        line = (this["conversation"])[line];
        var lineContainer = document.createElement("p");
        lineContainer.className = "conversation-line";
        var labelContainer = document.createElement("span");
        labelContainer.className = "conversation-label";
        labelContainer.innerHTML = line["label"] + "  ";
        lineContainer.appendChild(labelContainer);
        var phraseContainer = document.createElement("span");
        phraseContainer.className = "conversation-phrase";
        phraseContainer.innerHTML = line["phrase"];
        lineContainer.appendChild(phraseContainer);
        containers["contentContainer"].appendChild(lineContainer);
    }
    
    return containers["postContainer"];
    
});