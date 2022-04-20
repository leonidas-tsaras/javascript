function runDraggableSlider(container) {
    // get our elements
    const slider = container.querySelector('div');
    const images = Array.from(slider.querySelectorAll('img'));

    container.addEventListener('dragstart', (e) => e.preventDefault());
    slider.addEventListener('dragstart', (e) => e.preventDefault());

    // set up our state
    let isDragging = false,
        startPos = 0,
        currentTranslate = 0,
        prevTranslate = 0,
        animationID,
        currentIndex = 0;

    // add our event listeners
    images.forEach((image, index) => {
        // disable default image drag
        image.addEventListener('dragstart', (e) => e.preventDefault());
        // touch events
        image.addEventListener('touchstart', touchStart(index));
        image.addEventListener('touchend', touchEnd);
        image.addEventListener('touchmove', touchMove);
        // mouse events
        image.addEventListener('mousedown', touchStart(index));
        image.addEventListener('mouseup', touchEnd);
        image.addEventListener('mousemove', touchMove);
        image.addEventListener('mouseleave', touchEnd);
    });

    // make responsive to viewport changes
    window.addEventListener('resize', setPositionByIndex);

    // prevent menu popup on long press
    window.oncontextmenu = function (event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
    }

    // use a HOF so we have index in a closure
    function touchStart(index) {
        return function (event) {
            currentIndex = index
            startPos = getPositionX(event)
            isDragging = true
            animationID = requestAnimationFrame(animation)
            slider.classList.add('grabbing')
        }
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event)
            currentTranslate = prevTranslate + currentPosition - startPos
        }
    }

    function touchEnd() {
        cancelAnimationFrame(animationID)
        isDragging = false
        const movedBy = currentTranslate - prevTranslate

        const minDistance = container.clientWidth * 0.15;

        // if moved enough negative then snap to next image if there is one
        if (movedBy < -minDistance && currentIndex < images.length - 1) currentIndex += 1

        // if moved enough positive then snap to previous image if there is one
        if (movedBy > minDistance && currentIndex > 0) currentIndex -= 1

        slider.classList.remove('grabbing');
        setPositionByIndex();
    }

    function animation() {
        setSliderPosition();
        if(isDragging) requestAnimationFrame(animation);
    }

    function setPositionByIndex() {
        currentTranslate = currentIndex * -container.clientWidth;
        prevTranslate = currentTranslate;
        setSliderPosition();
    }

    function setSliderPosition() {
        slider.style.transform = `translateX(${currentTranslate}px)`;
    }
}
