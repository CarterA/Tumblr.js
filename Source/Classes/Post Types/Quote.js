// Tumblr.post.quote
Tumblr.post.addType("quote", function() {
    
    var containers = Tumblr.post.wrapper(this.type);
    
    var textContainer = document.createElement("blockquote");
    textContainer.innerHTML += this["quote-text"];
    containers["contentContainer"].appendChild(textContainer);
    var sourceContainer = document.createElement("p");
    sourceContainer.className = "quote-source";
    sourceContainer.innerHTML += this["quote-source"];
    containers["contentContainer"].appendChild(sourceContainer);
    
    return containers["postContainer"];
    
});