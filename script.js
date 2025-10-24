var prev = {
    X: 0,
    Y: 0
};

document.addEventListener('DOMContentLoaded', () => {

    const screen = document.getElementById('screen');
    const background = document.getElementById('background');
    const parallax = document.getElementById('parallax');
    const character = document.getElementById('character');
    const details = document.getElementById('details');


    screen.addEventListener('click', (e) => {

        const screenDimensions = screen.getBoundingClientRect();
        const center = {
            X: screenDimensions.left + screenDimensions.width / 2,
            Y: screenDimensions.top + screenDimensions.height /2
        };

        // Flip character in direction of travel
        const charDimensions = character.getBoundingClientRect();
        const charCenter = charDimensions.left + charDimensions.width / 2;

        if (e.clientX < (charCenter - 25))
            details.style.transform = 'scaleX(-1)';
        else
            details.style.transform = 'scaleX(1)';

        const bounds = document.getElementById('bounds').getBoundingClientRect();

        console.log(e.clientX, e.clientY);

        var totalX = (prev.X + center.X - e.clientX);
        var totalY = (prev.Y + center.Y - e.clientY);

        // Move background if outside of bounding box
        if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY > bounds.bottom || e.clientY < bounds.top) {

            const totalMovement = Math.sqrt((center.X - e.clientX) ** 2 + (center.Y - e.clientY) ** 2);
            const transitionTime = 2;//Math.abs(0.0075 * (totalMovement));

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
            background.style.transition = `transform ${transitionTime}s ease-out`;
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
    return;
}

function closeJournal() {
    document.getElementById('journal').style.display = 'none';
    return;
}
