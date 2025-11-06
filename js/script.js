// Preloader
window.addEventListener('load', function () {
    const loader = document.getElementById('preloader');
    const music = document.getElementById('tune');

    setTimeout( () => {
        const enter = document.createElement('div');
        enter.id = 'enter';
        enter.innerHTML = 'Enter';
        enter.onclick = () => {
            loader.style.transition = '1s';
            loader.style.opacity = 0;
            loader.style.pointerEvents = 'none';

            // Play music
            music.play();
            music.volume = musicPlaying ? 0.5 : 0;
        };

        const musicIcon = document.createElement('div');
        musicIcon.id = 'loader-music';
        musicIcon.classList.add('music-icon');
        musicIcon.onclick = toggleMusic;

        const warning = document.createElement('div');
        warning.id = 'warning';
        warning.innerHTML = 'Movement is disabled on portrait view. Switch to a wider resolution for the full experience.';

        loader.innerHTML = ``;
        loader.appendChild(enter);
        loader.appendChild(musicIcon);

        if (window.matchMedia('(max-width: 600px)').matches) loader.appendChild(warning);

    }, 1500);
});


// Mute music when not in focus
window.addEventListener('blur', () => {
    document.getElementById('tune').volume = 0;
});

window.addEventListener('focus', () => {
    if (musicPlaying) document.getElementById('tune').volume = 0.5;
});


// Movement function
var prev = {
    X: 0,
    Y: 0
};
document.addEventListener('DOMContentLoaded', () => {

    mouseoverPreview();
    changeColor();

    const screen = document.getElementById('screen');
    const background = document.getElementById('background');
    const parallax = document.getElementById('parallax');
    const character = document.getElementById('character');
    const details = document.getElementById('details');

    screen.addEventListener('click', (e) => {

        if (window.matchMedia('(max-width: 600px)').matches)
            return;

        if (charDetails.sit) sit();

        const screenDimensions = screen.getBoundingClientRect();
        const center = {
            X: screenDimensions.left + screenDimensions.width / 2,
            Y: screenDimensions.top + screenDimensions.height /2
        };

        // Flip character in direction of travel
        const charDimensions = character.getBoundingClientRect();
        const charCenter = {
            X: charDimensions.left + charDimensions.width / 2,
            Y: charDimensions.top + charDimensions.height /2
        };
        if (e.clientX < (charCenter.X - 25))
            details.style.transform = 'scaleX(-1)';
        else
            details.style.transform = 'scaleX(1)';

        // Scale transition time based on distance, within range 0.5-2s
        const totalMovement = Math.sqrt((e.clientX - charCenter.X) ** 2 + (e.clientY - charCenter.Y) ** 2);
        const transitionTime = Math.max(1, Math.min(totalMovement / 120, 2.5));

        character.style.transition = `transform ${transitionTime}s ease-out`;
        background.style.transition = `transform ${transitionTime}s ease-out`;
        parallax.style.transition = `transform ${transitionTime}s ease-out`;

        const bounds = document.getElementById('bounds').getBoundingClientRect();

        let totalX = (prev.X + center.X - e.clientX);
        let totalY = (prev.Y + center.Y - e.clientY);

        // Move background if outside of bounding box
        if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY > bounds.bottom || e.clientY < bounds.top) {

            const maxView = [650, -775, 1300, -1400];

            let transformX = 0;
            let transformY = 0;

            if (totalX > maxView[0]) {
                totalX = maxView[0];
                transformX = e.clientX - center.X + (totalX - prev.X);

            } else if (totalX < maxView[1]) {
                totalX = maxView[1];
                transformX = e.clientX - center.X + (totalX - prev.X);
            }

            if (totalY > maxView[2]) {
                totalY = maxView[2];
                transformY = e.clientY - center.Y + (totalY - prev.Y);

            } else if (totalY < maxView[3]) {
                totalY = maxView[3];
                transformY = e.clientY - center.Y + (totalY - prev.Y);
            }

            character.style.transform = `translate(${transformX}px, ${transformY}px)`;
            background.style.transform = `translate(${totalX}px, ${totalY}px)`;
            parallax.style.transform = `translateY(${totalY / 2}px)`;

            prev.X = totalX;
            prev.Y = totalY;

        // Only move character if inside of bounding box
        } else {
            character.style.transform = `translate(${e.clientX - center.X}px, ${e.clientY - center.Y}px)`;
        }
    })
});


// Bald
const baldKeys = ['b', 'a', 'l', 'd'];
var baldPosition = 0;
var baldness = false;
document.addEventListener('keydown', (e) => {

    if (e.key !== baldKeys[baldPosition]) {
        baldPosition = 0;
        return;
    }

    baldPosition++;

    if (baldPosition === baldKeys.length) {
        baldness = true;

        const hairFront = document.querySelectorAll('.front-hair');
        hairFront.forEach(h => {h.style.display = 'none'});

        const hairBack = document.querySelectorAll('.back-hair');
        hairBack.forEach(h => {h.style.display = 'none'});
    }

    return;
});


function openJournal() {
    if (charDetails.sit) sit();

    document.getElementById('journal-display').style.display = 'block';
    return;
}


function closeJournal() {
    document.getElementById('journal-display').style.display = 'none';
    return;
}


function changePage(i) {
    const j = (i == 1) ? 2 : 1;

    // Add hover effect to inactive page
    document.getElementById(`icon-page${i}`).classList.remove('journal-icon');
    document.getElementById(`icon-page${j}`).classList.add('journal-icon');

    document.getElementById(`page${i}`).style.display = 'block';
    document.getElementById(`page${j}`).style.display = 'none';
}

var musicPlaying = true;
function toggleMusic() {
    const icon = document.querySelectorAll('.music-icon');
    const music = document.getElementById('tune');

    if (musicPlaying) {
        music.volume = 0;
        icon.forEach(e => {
            e.style.backgroundPosition = '-300px 0px';
        });
        musicPlaying = false;
    } else {
        music.volume = 0.5;
        icon.forEach(e => {
            e.style.backgroundPosition = '-200px 0px';
        });
        musicPlaying = true;

    }
}

const width = 500;
const height = 875;
var charDetails = {

    talent: 1,
    hairFront: 1,
    hairBack: 2,
    hairColor: 5,
    eyes: 0,

    body: 1,
    top: 2,
    bottom: 2,
    shoes: 2,

    sit: false,
}

function sit() {

    let status = [-1, -1, -2, -4];

    // Standing -> sitting
    if (!charDetails.sit) {
        document.getElementById('wings').style.animation = `none`;
        document.getElementById('sit').style.filter = `hue-rotate(175deg) brightness(1.15)`;
        charDetails.sit = true;

    // Sitting -> standing
    } else {
        status = status.map(element => element + 1);
        document.getElementById('wings').style.animation = `wing-flap 0.3s steps(3) infinite`;
        document.getElementById('sit').style.filter = `none`;
        charDetails.sit = false;
    }

    status = [status[0] * width].concat(status.slice(1).map(element => element * height));

    // Update glow, body, bottom, and shoes
    document.getElementById('glow').style.backgroundPosition = `${status[0]}px ${height * -4}px`;
    document.getElementById('body').style.backgroundPosition = `${-charDetails.body * width}px ${status[1]}px`;
    document.getElementById('bottom').style.backgroundPosition = `${-charDetails.bottom * width}px ${status[2]}px`;
    document.getElementById('shoes').style.backgroundPosition = `${-charDetails.shoes * width}px ${status[3]}px`;

    return;
}
