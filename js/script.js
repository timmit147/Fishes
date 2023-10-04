document.addEventListener('click', rotatePlayer);

function rotatePlayer(event) {
    const player = document.querySelector('.player');
    const playerCenterX = window.innerWidth / 2;
    const playerCenterY = window.innerHeight / 2;

    const angle = Math.atan2(event.clientY - playerCenterY, event.clientX - playerCenterX);
    const angleInDegrees = angle * (180 / Math.PI);

    // Get the current rotation angle
    const currentRotation = getCurrentRotation(player.style.transform);

    // Calculate the shortest rotation circle
    const shortestRotation = getShortestRotation(currentRotation, angleInDegrees);

    // Apply the rotation to the player
    player.style.transition = 'transform 0.5s';
    player.style.transform = `translate(-50%, -50%) rotate(${currentRotation + shortestRotation}deg) scaleY(${angleInDegrees > 90 || angleInDegrees < -90 ? -1 : 1})`;
}

function getCurrentRotation(transformValue) {
    // Extract the current rotation from the transform value
    const match = transformValue.match(/rotate\(([^)]+)\)/);
    return match ? parseFloat(match[1]) : 0;
}

function getShortestRotation(currentRotation, targetRotation) {
    // Calculate the difference between the current and target rotations
    let difference = targetRotation - currentRotation;

    // Normalize the difference to the range of [-180, 180] degrees
    difference = (difference + 180) % 360 - 180;

    return difference;
}

const circle = document.querySelector('.circle');
let moving = true;

document.addEventListener('click', async function (event) {
    if (moving === false) {
        return;
    }
    moving = false;
    const x = event.clientX;
    const y = event.clientY;

    // Set initial position without transition
    circle.style.transition = 'none';
    circle.style.left = x - 20 + 'px';
    circle.style.top = y - 20 + 'px';

    // Trigger reflow to apply initial styles without transition
    void circle.offsetWidth;

    // Calculate the distance the element needs to travel
    const deltaX = x - (parseFloat(circle.style.left) || 0);
    const deltaY = y - (parseFloat(circle.style.top) || 0);

    // Calculate the distance-based duration for a constant speed
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const speed = 10; // Adjust the speed as needed
    const duration = distance / speed;

    // Reapply transition for smooth animation with constant speed
    circle.style.transition = `left linear ${duration}s, top linear ${duration}s`;

    centerElement(circle);

    // Wait until the transition is complete
    await waitForTransitionEnd(circle);

    // Reset transition property
    circle.style.transition = '';

    moving = true;
});

function waitForTransitionEnd(element) {
    return new Promise(resolve => {
        function transitionEndHandler() {
            element.removeEventListener('transitionend', transitionEndHandler);
            resolve();
        }
        element.addEventListener('transitionend', transitionEndHandler);
    });
}

function centerElement(element) {
    // Calculate the center of the body
    var centerX = document.body.clientWidth / 2 - element.clientWidth / 2;
    var centerY = document.body.clientHeight / 2 - element.clientHeight / 2;

    // Set the new position
    element.style.left = centerX + 'px';
    element.style.top = centerY + 'px';
}


let x = 100;
let y = 100;

function updatePosition(deltaX, deltaY) {
    x += deltaX;
    y += deltaY;
    updateDisplay();
}

function updateDisplay() {
    document.querySelector('.xPosition').textContent = 'X : ' + x;
    document.querySelector('.yPosition').textContent = 'Y : ' + y;
}

// Add event listeners dynamically
const directionDivs = document.querySelectorAll('.direction div');
directionDivs.forEach(div => {
    div.addEventListener('click', function() {
        if (moving === false) {
            return;
        }
        const direction = div.classList[0]; // Extract the direction class
        switch (direction) {
            case 'leftup':
                updatePosition(-1, -1);
                break;
            case 'up':
                updatePosition(0, -1);
                break;
            case 'rightup':
                updatePosition(1, -1);
                break;
            case 'left':
                updatePosition(-1, 0);
                break;
            case 'center':
                updatePosition(0, 0);
                break;
            case 'right':
                updatePosition(1, 0);
                break;
            case 'leftdown':
                updatePosition(-1, 1);
                break;
            case 'down':
                updatePosition(0, 1);
                break;
            case 'rightdown':
                updatePosition(1, 1);
                break;
        }
    });
});