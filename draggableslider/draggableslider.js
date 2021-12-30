
function draggableSlider(container) {
    //select control buttons
    const control = container.querySelectorAll("a.control");
    const prev = control[0];
    const next = control[1];
    const parentElement = container.parentElement;
    let containerWidth; //holds container width;
    let containerHeight; //holds container width;
    const shiftingRatio = 0.2;
    let posInitial, posFinal, tempInitial;

    //select imageHolder
    let imageHolder = container.querySelector('div');

    //select slides array from imageHolder
    let slides = imageHolder.querySelectorAll('img');

    const totalImages = slides.length; //holds total number of images

    // Mouse events for desktop
    imageHolder.addEventListener('mousedown', onMouseDownOrTouchStart);
    imageHolder.addEventListener('mouseup' , onMouseUpOrTouchEnd);

    // Touch events for mobile
    imageHolder.addEventListener('touchstart', onMouseDownOrTouchStart);
    imageHolder.addEventListener('touchmove', onMouseMoveOrΤouchMove, false);
    imageHolder.addEventListener('touchend', onMouseUpOrTouchEnd);

    function onMouseDownOrTouchStart(event) {
        event = event || window.event;
        event.preventDefault();
        posInitial = imageHolder.offsetLeft;
        tempInitial = event.clientX || event.touches[0].clientX;
        imageHolder.classList.remove('shifting');
        imageHolder.addEventListener('mousemove', onMouseMoveOrΤouchMove);
    }

    function onMouseMoveOrΤouchMove (event) {
        //event = event || window.event;
        //event.preventDefault();
        if(event.type == 'touchmove') {
            posFinal = tempInitial - event.touches[0].clientX;
            tempInitial = event.touches[0].clientX;
        } else {
            posFinal = tempInitial - event.clientX;
            tempInitial = event.clientX;
        }
        posFinal = imageHolder.offsetLeft - posFinal;
        checkFinalPosition();
        imageHolder.style.left = posFinal + "px";
    }

    function onMouseUpOrTouchEnd() {
        imageHolder.removeEventListener('mousemove', onMouseMoveOrΤouchMove);
        imageHolder.classList.add('shifting');

        const ratio = (posInitial - imageHolder.offsetLeft)/containerWidth;
        posFinal = containerWidth * (Math.round(imageHolder.offsetLeft / containerWidth));
        if(Math.abs(ratio) > shiftingRatio) {
            if(ratio > 0) {
                posFinal = posFinal - containerWidth;
            } else {
                posFinal = posFinal + containerWidth;
            }
        } else {
            posFinal = containerWidth * (Math.round(imageHolder.offsetLeft / containerWidth));
        }
        checkFinalPosition();
        imageHolder.style.left = posFinal + 'px';
        
    }

    function checkFinalPosition() {
        if(posFinal <= containerWidth * (1-totalImages))
            posFinal = containerWidth * (1-totalImages);
        if(posFinal >= 0)
            posFinal = 0;
    }

    // arrow click events
    prev.addEventListener('click', function () {
        let left = imageHolder.offsetLeft + containerWidth;
        if(left >= 0)
            left = 0;
        imageHolder.style.left = left + "px";
    });
    next.addEventListener('click', function () {
        let left = imageHolder.offsetLeft - containerWidth;
        if(left <= -containerWidth * totalImages)
            left = containerWidth * (1 - totalImages);
        imageHolder.style.left = left + "px";
    });

    window.addEventListener("resize", onResize);
    function onResize() {
        containerWidth = parentElement.clientWidth;
        containerHeight = containerWidth * (2.0/3.0);

        if(window.innerHeight < containerHeight) {
            containerHeight = window.innerHeight;
            containerWidth = containerHeight * 3.0/2.0;
        }
        
        container.style.width = containerWidth + "px";
        container.style.height = containerHeight + "px";

        //set imageHolder
        imageHolder.style.width = containerWidth * (totalImages) + "px";

        //set images width
        slides.forEach((image) => {
            image.style.width = containerWidth + "px";
        });

        //add shifting class
        imageHolder.classList.add('shifting');

        //align image center
        imageHolder.style.left = containerWidth * Math.ceil(imageHolder.offsetLeft / containerWidth) + 'px';
        checkFinalPosition();
    }
    onResize();
}

draggableSlider(document.querySelector("div.draggableSlider"));

/* window.addEventListener("load", function() {
    let draggable = document.querySelectorAll("div.draggableSlider");
    draggable.forEach(element => {
        draggableSlider(element);
    });
}); */
