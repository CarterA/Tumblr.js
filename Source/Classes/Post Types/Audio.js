// Tumblr.post.audio
Tumblr.post.addType("audio", function() {
    var containers = Tumblr.post.wrapper(this);
    
    var audioContainer = document.createElement("p");
    audioContainer.innerHTML = this["audio-player"];
    containers["contentContainer"].appendChild(audioContainer);
    containers["contentContainer"].innerHTML += this["audio-caption"];
    
    return containers["postContainer"];
});