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
        for (propertyName in json) { if (propertyName !== "tumblelog") { this[propertyName] = json[propertyName]; } }
        for (propertyName in json["tumblelog"]) { this[propertyName] = (json["tumblelog"])[propertyName]; }
        
        // Call the optional callback provided by the original caller of load()
        if (this._customJSONCallback) this._customJSONCallback(this);
        
    };

};