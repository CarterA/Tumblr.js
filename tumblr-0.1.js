/*!
 *
 * Tumblr.js JavaScript Library
 * http://github.com/CarterA/Tumblr.js
 *
 * Copyright 2010, Carter Allen
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
!*/

var Tumblr = new function() {
    
    
    /*
    
        Function: Tumblr.tumblelog
        
        Parameters:
        
            username - The username of the tumblelog you want to load. This can
                       be found by taking the blog's URL and finding using only
                       the subdomain that it is hosted at. For example,
                       http://demo.tumblr.com/ would have the username "demo".
            options  - A hash of options. The following keys are valid:
                           - autoload (bool) - If true, the <load> function
                             will be called immediately upon creation. If any
                             other keys are found in the options hash that are
                             not specified here, they will be passed to the
                             <load> function via its options argument.
                             *Default is false.*
            callback - If the autoload option is true, then this callback will
                       be passed to the <load> function via its callback
                       argument.
                       
        Returns: An initialized Tumblr.tumblelog object. If the autoload option
                 is not specified, then you must call the <load> function to
                 make retrieve the required information from the Tumblr API.
                 
    */
    
    this.tumblelog = function(username, options, callback) {
        console.log("Tumblr.tumblelog init with username: " + username);
        this.username = username;
        
        if (options["autoload"]) {
            this.load({
                "numberOfPosts" : options["numberOfPosts"] | 10
            }, callback);
        }
        
    };
    
    // Load JSON data
    this.tumblelog.prototype.load = function(options, callback) {
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
    this.tumblelog.jsonCallback = function(json) {
        console.log("Tumblr.tumblelog.jsonCallback() (class-level) called.");
        this._tumblelogInstances.pop().jsonCallback(json);
    };
    
    // Instance-level JSON loading callback
    this.tumblelog.prototype.jsonCallback = function(json) {
        
        console.log("Tumblr.tumblelog.jsonCallback() (instance-level) called.");
        
        // Copy over all properties from the JSON response
        for (var propertyName in json) { if (propertyName !== "tumblelog") { this[propertyName] = json[propertyName]; } }
        for (propertyName in json["tumblelog"]) { this[propertyName] = (json["tumblelog"])[propertyName]; }
        
        // Call the optional callback provided by the original caller of load()
        if (this._customJSONCallback) this._customJSONCallback(this);
        
    };
    
    // Append an HTML version of the tumblelog to an element
    this.tumblelog.prototype.appendTo = function(element, options) {
        
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

    // Tumblr.post class
    this.post = function(json) {
        
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
    this.post.addType = function(type, elementFunction) {
        this[type] = function(json) { Tumblr.utilities.copyJSON(this, json); };
        this[type].prototype.element = elementFunction;
    };
    
    // Tumblr.post.wrapper(type) function
    this.post.wrapper = function(type) {
        var container = document.createElement("article");
        container.className = type;
        var contentContainer = document.createElement("section");
        contentContainer.className = "content";
        container.appendChild(contentContainer);
        return {
            "postContainer" : container,
            "contentContainer" : contentContainer
        };
    };
    
    // Tumblr.post.title(title) function
    this.post.title = function(content) {
        var title = document.createElement("h1");
        title.className = "title";
        title.innerHTML = content;
        return title;
    };
    
    // Tumblr.post.regular
    this.post.addType("regular", function() {
        
        var containers = Tumblr.post.wrapper(this.type);
        
        if (this["regular-title"]) {
            var title = Tumblr.post.title(this.title);
            containers["postContainer"].appendChild(title);
        }
        
        containers["contentContainer"].innerHTML += this["regular-body"];
        
        return containers["postContainer"];
        
    });
    
    // Tumblr.post.quote
    this.post.addType("quote", function() {
        
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
    
    // Tumblr.post.conversation
    this.post.addType("conversation", function() {
        var containers = Tumblr.post.wrapper(this.type);
        
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
    
    // Tumblr.post.link
    this.post.addType("link", function() {
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
    
    // Tumblr.post.photo
    this.post.addType("photo", function() {
        var containers = Tumblr.post.wrapper(this.type);
        
        //var photoSize = options["photoSize"] | 250;
        var photoSize = 250;
        var photoTag = document.createElement("img");
        photoTag.width = photoSize;
        photoTag.src = this["photo-url-" + photoSize];
        var linkTag = document.createElement("a");
        linkTag.href = this["url-with-slug"] | this["url"];
        linkTag.appendChild(photoTag);
        var photoContainer = document.createElement("p");
        photoContainer.appendChild(photoTag);
        containers["contentContainer"].appendChild(photoContainer);
        var photoCaption = document.createElement("p");
        photoCaption.innerHTML = this["photo-caption"];
        containers["contentContainer"].appendChild(photoCaption);
        
        return containers["postContainer"];
    });
    
    // Tumblr.post.video
    this.post.addType("video", function() {
        var containers = Tumblr.post.wrapper(this.type);
        
        var videoContainer = document.createElement("p");
        videoContainer.innerHTML = this["video-player"];
        containers["contentContainer"].appendChild(videoContainer);
        containers["contentContainer"].innerHTML += this["video-caption"];
        
        return containers["postContainer"];
    });
    
    // Tumblr.post.audio
    this.post.addType("audio", function() {
        var containers = Tumblr.post.wrapper(this.type);
        
        var audioContainer = document.createElement("p");
        audioContainer.innerHTML = this["audio-player"];
        containers["contentContainer"].appendChild(audioContainer);
        containers["contentContainer"].innerHTML += this["audio-caption"];
        
        return containers["postContainer"];
    });
    
    // Tumblr.utilities class
    this.utilities = new function() {};
    
    // Tumblr.utilities.copyJSON function
    this.utilities.copyJSON = function(object, json) {
        
         // Copy over all properties from the JSON response
        for (var propertyName in json) { object[propertyName] = json[propertyName]; }
        
    };

};