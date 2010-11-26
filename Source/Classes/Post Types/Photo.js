// Tumblr.post.photo
Tumblr.post.addType("photo", function() {
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