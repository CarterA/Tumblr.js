// Tumblr.utilities class
Tumblr.utilities = new function() {};

// Tumblr.utilities.copyJSON function
Tumblr.utilities.copyJSON = function(object, json) {
    
     // Copy over all properties from the JSON response
    for (var propertyName in json) { object[propertyName] = json[propertyName]; }
    
};