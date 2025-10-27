var prev = {
    X: 0,
    Y: 0
};

window.addEventListener("load", function () {
    const loader = document.getElementById("preloader");
    const music = document.getElementById("tune");


    setTimeout( () => {
        const enter = document.createElement('div');
        enter.id = 'enter';
        enter.innerHTML = 'Enter';
        enter.onclick = () => {
            loader.style.transition = '1s';
            loader.style.opacity = 0;
            loader.style.pointerEvents = 'none';


            // Play and loop music
            // https://stackoverflow.com/questions/63433264/looping-background-music-in-html
            music.play();
            music.volume = musicPlaying ? 0.5 : 0;
            music.addEventListener('ended', () => {
               music.currentTime = 0;
                music.play();
            });
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


document.addEventListener('DOMContentLoaded', () => {

    const screen = document.getElementById('screen');
    const background = document.getElementById('background');
    const parallax = document.getElementById('parallax');
    const character = document.getElementById('character');
    const details = document.getElementById('details');

    screen.addEventListener('click', (e) => {

        if (window.matchMedia('(max-width: 600px)').matches) return;

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
        const transitionTime = Math.max(0.5, Math.min(totalMovement / 100, 2.5));

        background.style.transition = `transform ${transitionTime}s ease-out`;
        character.style.transition = `transform ${transitionTime}s ease-out`;

        const bounds = document.getElementById('bounds').getBoundingClientRect();

        let totalX = (prev.X + center.X - e.clientX);
        let totalY = (prev.Y + center.Y - e.clientY);

        // Move background if outside of bounding box
        if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY > bounds.bottom || e.clientY < bounds.top) {

            const maxView = [650, -700, 1300, -1350];

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


function openJournal() {
    document.getElementById('journal-display').style.display = 'block';
    return;
}


function closeJournal() {
    document.getElementById('journal-display').style.display = 'none';
    return;
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
    body: -1 * width,
    bottom: -2 * width,
    shoes: -3 * width,

    sit: false,
}

function sit() {

    let status = [-1, -2, -4];

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

    status = status.map(element => element * height);

    // Update body, bottom, and shoes
    document.getElementById('body').style.backgroundPosition = `${charDetails.body}px ${status[0]}px`;
    document.getElementById('bottom').style.backgroundPosition = `${charDetails.bottom}px ${status[1]}px`;
    document.getElementById('shoes').style.backgroundPosition = `${charDetails.shoes}px ${status[2]}px`;

    return;
}
