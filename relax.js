let timerInterval;
let seconds = 0;
let minutes = 0;
let hours = 0;
let backgroundPositionX = 0;
let backgroundPositionY = 0;

// Timer functions
function startTimer() {
    if (timerInterval) return; // Prevent multiple intervals
    timerInterval = setInterval(function() {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        if (minutes === 60) {
            minutes = 0;
            hours++;
        }
        document.getElementById('timer').textContent = formatTime(hours, minutes, seconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    seconds = 0;
    minutes = 0;
    hours = 0;
    document.getElementById('timer').textContent = "00:00:00";
}

function formatTime(hours, minutes, seconds) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Character movement (keyboard controls)
document.addEventListener('keydown', function(e) {
    const character = document.getElementById('character');
    const step = 10; // Movement step in pixels

    let currentLeft = parseInt(getComputedStyle(character).left, 10) || 0;
    let currentTop = parseInt(getComputedStyle(character).top, 10) || 0;

    switch (e.key) {
        case 'ArrowUp':
            character.style.top = (currentTop - step) + 'px';
            backgroundPositionY -= step; // Move background up
            break;
        case 'ArrowDown':
            character.style.top = (currentTop + step) + 'px';
            backgroundPositionY += step; // Move background down
            break;
        case 'ArrowLeft':
            character.style.left = (currentLeft - step) + 'px';
            backgroundPositionX -= step; // Move background left
            break;
        case 'ArrowRight':
            character.style.left = (currentLeft + step) + 'px';
            backgroundPositionX += step; // Move background right
            break;
    }

    // Update the background position based on character's movement
    updateBackgroundPosition();
});

// Character movement with mouse
document.addEventListener('mousedown', function(e) {
    const character = document.getElementById('character');
    
    // Get mouse position when clicked
    const mouseX = e.pageX;
    const mouseY = e.pageY;
    
    // Move character to mouse position
    character.style.left = (mouseX - character.width / 2) + 'px';
    character.style.top = (mouseY - character.height / 2) + 'px';
    // Update background position
    backgroundPositionX = mouseX;
    backgroundPositionY = mouseY;

    // Update the background position based on mouse click
    updateBackgroundPosition();
});

function toggleMenu() {
    const menu = document.querySelector('.menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  }