var images = document.querySelectorAll("img");

images.forEach(function(image){
	var imageUrl = image.src;
    var parent = image.parentNode;

    var parentX = parent.offsetLeft;
    var parentY = parent.offsetTop;

    var imageX = image.offsetLeft;
    var imageY = image.offsetTop;

    var diffX = imageX - parentX;
    var diffY = imageY - parentY;

    const padding = 5;
    const zIndex = 999;
    const iconSize = 16;

    var newChild = document.createElement("a");
    newChild.href = iStockSettings.istockUrl+btoa(imageUrl);
    newChild.target = "_blank";
    newChild.style.display = "none";
    newChild.style.position = "absolute";
    newChild.style.lineHeight = 0;
    positionIcon(newChild);
    newChild.style.zIndex = zIndex;
    newChild.onclick = (event) => {
        event.stopPropagation();
        window.open(iStockSettings.istockUrl+btoa(image.src), '_blank');
    };

    //deal with window resize events
    window.addEventListener('resize',() => {
        positionIcon(newChild);
    });

    let icon = document.createElement("img");
    icon.src = chrome.extension.getURL("images/favicon.png");
    icon.width = iconSize;
    icon.height = iconSize;
    icon.style.width = iconSize+"px";
    icon.style.height = iconSize+"px";
    icon.style.opacity = 0;
    icon.style.transition = "opacity .25s linear";
    icon.style.margin = 0;
    icon.style.marginLeft = 0;
    icon.style.marginRight = 0;

    newChild.appendChild(icon);

    parent.appendChild(newChild);


    //detect when the mouse enters the image
    let imageViewportOffset = image.getBoundingClientRect();
    // these are relative to the viewport, i.e. the window
    let absImageTop = imageViewportOffset.top;
    let absImageLeft = imageViewportOffset.left;

    let mouseMoveTimeout = null;
    document.addEventListener('mousemove', function(event){
        let xPosition = event.clientX;
        let yPosition = event.clientY;

        clearTimeout(mouseMoveTimeout);

        if(
            (xPosition > absImageLeft && xPosition < absImageLeft + image.width) && 
            (yPosition > absImageTop && yPosition < absImageTop + image.height)
        ){
            newChild.style.display = "block";
            icon.style.opacity = 1;
        }else{
            
            icon.style.opacity = 0;
            mouseMoveTimeout = setTimeout(() => {
                newChild.style.display = "none";
            }, 250)
        }
    });


    function positionIcon(element){
        element.style.top = (imageY + (image.height - padding) - iconSize)+"px";
        element.style.left = (imageX + padding)+"px";
    }
});