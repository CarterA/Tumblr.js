// Tumblr.post.regular
Tumblr.post.addType("regular", function() {
    
    var containers = Tumblr.post.wrapper(this.type);
    
    if (this["regular-title"]) {
        var title = Tumblr.post.title(this.title);
        containers["postContainer"].appendChild(title);
    }
    
    containers["contentContainer"].innerHTML += this["regular-body"];
    
    return containers["postContainer"];
    
});