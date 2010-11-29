// Tumblr.post class
Tumblr.post = function(json) {
    
    var post;
    // Set the prototype to the type of post
    if (Tumblr.post[json.type]) { post = new Tumblr.post[json.type](json); }
    else {
        console.log("Tumblr.post() Exception: Unknown post type encountered:  " + json.type);
        this.exceptionRaised = true;
        return null;
    }
    return post;
    
};

// Tumblr.post.addType(elementFunction) function
Tumblr.post.addType = function(type, elementFunction) {
    this[type] = function(json) { Tumblr.utilities.copyJSON(this, json); };
    this[type].prototype.element = elementFunction;
};

// Tumblr.post.reblogLink(json)
Tumblr.post.reblogLink = function(json) {
    var reblogLink = document.createElement("a");
    reblogLink.href = "http://tumblr.com/reblog/" + json["id"] + "/" + json["reblog-key"];
    reblogLink.target = "_blank";
    reblogLink.innerHTML = "Reblog";
    var reblogContainer = document.createElement("span");
    reblogContainer.className = "reblog";
    reblogContainer.appendChild(reblogLink);
    return reblogContainer;
};

// Tumblr.post.wrapper(type) function
Tumblr.post.wrapper = function(json) {
    var container = document.createElement("article");
    container.className = json.type;
    container.appendChild(this.reblogLink(json));
    var contentContainer = document.createElement("section");
    contentContainer.className = "content";
    container.appendChild(contentContainer);
    return {
        "postContainer" : container,
        "contentContainer" : contentContainer
    };
};

// Tumblr.post.title(title) function
Tumblr.post.title = function(content) {
    var title = document.createElement("h1");
    title.className = "title";
    title.innerHTML = content;
    return title;
};