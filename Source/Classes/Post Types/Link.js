// Tumblr.post.link
Tumblr.post.addType("link", function() {
    var containers = Tumblr.post.wrapper(this.type);
    
    var link = document.createElement("a");
    link.href = this["link-url"];
    link.target = "_blank";
    link.innerHTML = this["link-text"];
    containers["contentContainer"].appendChild(link);
    var description = document.createElement("p");
    description.className = "link-description";
    description.innerHTML = this["link-description"];
    containers["contentContainer"].appendChild(description);
    
    return containers["postContainer"];
});