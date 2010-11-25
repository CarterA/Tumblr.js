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
            
            post = this.posts[post]; // No idea why this is necessary
            
            // Create the container for the post and its content
            var postContainer = document.createElement("article");
            postContainer.className = post.type;
            var postContentContainer = document.createElement("section");
            postContentContainer.className = "content";
            postContainer.appendChild(postContentContainer);
            
            // Setup the title, if one is provided
            if (post["regular-title"]) {
                var postTitle = document.createElement("h1");
                postTitle.className = "title";
                postTitle.innerHTML = post["regular-title"];
            }
            
            // Add content based on the type of post
            if (post.type === "regular") {
                postContentContainer.innerHTML += post["regular-body"];
            }
            else if (post.type === "quote") {
                var textContainer = document.createElement("blockquote");
                textContainer.innerHTML += post["quote-text"];
                postContentContainer.appendChild(textContainer);
                var sourceContainer = document.createElement("p");
                sourceContainer.className = "quote-source";
                sourceContainer.innerHTML += post["quote-source"];
                postContentContainer.appendChild(sourceContainer);
            }
            else if (post.type === "conversation") {
                for (var line in post["conversation"]) {
                    line = (post["conversation"])[line];
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
                    postContentContainer.appendChild(lineContainer);
                }
            }
            else if (post.type === "link") {
                var link = document.createElement("a");
                link.href = post["link-url"];
                link.target = "_blank";
                link.innerHTML = post["link-text"];
                postContentContainer.appendChild(link);
                var description = document.createElement("p");
                description.className = "link-description";
                description.innerHTML = post["link-description"];
                postContentContainer.appendChild(description);
            }
            else if (post.type === "photo") {
                var photoSize = options["photoSize"] | 250;
                var photoTag = document.createElement("img");
                photoTag.width = photoSize;
                photoTag.src = post["photo-url-" + photoSize];
                var linkTag = document.createElement("a");
                linkTag.href = post["url-with-slug"] | post["url"];
                linkTag.appendChild(photoTag);
                var photoContainer = document.createElement("p");
                photoContainer.appendChild(photoTag);
                postContentContainer.appendChild(photoContainer);
                var photoCaption = document.createElement("p");
                photoCaption.innerHTML = post["photo-caption"];
                postContentContainer.appendChild(photoCaption);
            }
            else if (post.type === "video") {
                var videoContainer = document.createElement("p");
                videoContainer.innerHTML = post["video-player"];
                postContentContainer.appendChild(videoContainer);
                postContentContainer.appendChild(post["video-caption"]);
			}
			else if (post.type === "audio") {
                var audioContainer = document.createElement("p");
                audioContainer.innerHTML = post["audio-player"];
                postContentContainer.appendChild(audioContainer);
                postContentContainer.appendChild(post["audio-caption"]);
            }
            
            // Append the post to the container
            container.appendChild(postContainer);
            
        }
        
        // Append the container to the element
        element.appendChild(container);
        
    };

};