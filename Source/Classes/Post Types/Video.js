// Tumblr.post.video
Tumblr.post.addType("video", function() {
    var containers = Tumblr.post.wrapper(this.type);
    
    var videoContainer = document.createElement("p");
    videoContainer.innerHTML = this["video-player"];
    containers["contentContainer"].appendChild(videoContainer);
    containers["contentContainer"].innerHTML += this["video-caption"];
    
    return containers["postContainer"];
});