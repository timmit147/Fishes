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

let x = 100;
let y = 100;
let currentDirection = ''; // Store the current direction
let isUpdateInProgress = false; // Flag to track whether an update is in progress

async function updatePosition(direction, deltaX, deltaY) {
    if (isUpdateInProgress) {
        isUpdateInProgress = false; // Stop the previous update loop
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for the previous loop to complete
    }

    isUpdateInProgress = true; // Set the flag to indicate that an update is in progress
    currentDirection = direction; // Update the current direction

    while (isUpdateInProgress && currentDirection === direction) {
        removeItems();
        await new Promise(resolve => setTimeout(resolve, 4000));
        x += deltaX;
        y += deltaY;
        updateDisplay();
        loadItem(direction, deltaX, deltaY);
    }

    // Reset the flag after the update loop is complete
    isUpdateInProgress = false;
}

function removeItems() {
    var images = document.querySelectorAll('img.item');

    images.forEach(function (image) {
        image.remove();
    });
}

function updateDisplay() {
    document.querySelector('.xPosition').textContent = 'X : ' + x;
    document.querySelector('.yPosition').textContent = 'Y : ' + y;
}

const directionDivs = document.querySelectorAll('.direction div');
directionDivs.forEach(div => {
    div.addEventListener('click', function () {
        const direction = div.classList[0]; // Extract the direction class
        updatePosition(direction, getDeltaX(direction), getDeltaY(direction));
    });
});

function getDeltaX(direction) {
    // Define the mapping of directions to deltaX
    const deltaXMap = {
        'leftup': -1, 'up': 0, 'rightup': 1,
        'left': -1, 'center': 0, 'right': 1,
        'leftdown': -1, 'down': 0, 'rightdown': 1
    };
    return deltaXMap[direction] || 0;
}

function getDeltaY(direction) {
    // Define the mapping of directions to deltaY
    const deltaYMap = {
        'leftup': -1, 'up': -1, 'rightup': -1,
        'left': 0, 'center': 0, 'right': 0,
        'leftdown': 1, 'down': 1, 'rightdown': 1
    };
    return deltaYMap[direction] || 0;
}

function loadItem(direction, deltaX, deltaY) {
    if (x === 100 && y === 100) {
        console.log(direction, deltaX, deltaY);

        // Load and position the image
        var img = new Image();
        img.onload = function () {
            img.className = "item";
            img.style.top = y + "px";
            img.style.left = "0"; // Start from the left edge of the screen
            document.body.appendChild(img);

            // Apply transition
            img.style.transition = "left 2s"; // Adjust the duration as needed

            // Set the final position after a short delay to trigger the transition
            setTimeout(function () {
                img.style.left = x + "px";
            }, 50); // Adjust the delay as needed
        };
        img.src = './images/clownFish.png';
    }
}
