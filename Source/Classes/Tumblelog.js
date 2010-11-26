Tumblr.tumblelog = function(username, options, callback) {
    console.log("Tumblr.tumblelog init with username: " + username);
    this.username = username;
    
    if (options["autoload"]) {
        this.load({
            "numberOfPosts" : options["numberOfPosts"] | 10
        }, callback);
    }
    
};

// Load JSON data
Tumblr.tumblelog.prototype.load = function(options, callback) {
    console.log("Tumblr.tumblelog.load() called.");
    var head = document.getElementsByTagName("head")[0];
	if (head) {
	    
	    if (!Tumblr.tumblelog._tumblelogInstances) Tumblr.tumblelog._tumblelogInstances = new Array(this);
	    else Tumblr.tumblelog._tumblelogInstances.splice(0, 0, this);
	    
	    this._customJSONCallback = callback;
		this.json = document.createElement("script");
		this.json.type = "text/javascript";
		this.json.src = "http://" + this.username + ".tumblr.com/api/read/json?num=" + options["numberOfPosts"] + "&callback=Tumblr.tumblelog.jsonCallback";
		head.appendChild(this.json);
		
	}
};

// Class-level JSON loading callback
Tumblr.tumblelog.jsonCallback = function(json) {
    console.log("Tumblr.tumblelog.jsonCallback() (class-level) called.");
    this._tumblelogInstances.pop().jsonCallback(json);
};

// Instance-level JSON loading callback
Tumblr.tumblelog.prototype.jsonCallback = function(json) {
    
    console.log("Tumblr.tumblelog.jsonCallback() (instance-level) called.");
    
    // Copy over all properties from the JSON response
    for (var propertyName in json) { if (propertyName !== "tumblelog") { this[propertyName] = json[propertyName]; } }
    for (propertyName in json["tumblelog"]) { this[propertyName] = (json["tumblelog"])[propertyName]; }
    
    // Call the optional callback provided by the original caller of load()
    if (this._customJSONCallback) this._customJSONCallback(this);
    
};

// Append an HTML version of the tumblelog to an element
Tumblr.tumblelog.prototype.appendTo = function(element, options) {
    
    console.log("Tumblr.tumblelog.appendTo() called.");
    
    // Make an empty options hash, to prevent errors
    if (options == null) { options = { "null" : null }; }
    
    // Create the container for the posts
    var container = document.createElement("div");
    container.className = "tumblelog";
    
    console.log(this);
    // Iterate through the posts
    for (var post in this.posts) {
        
        post = Tumblr.post(this.posts[post]);
        
        if (post) {
            container.appendChild(post.element());
        }
        
    }
    
    // Append the container to the element
    element.appendChild(container);
    
};