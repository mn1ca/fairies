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
};
var active = 'talent';

function changeMenu(category) {
    if (active === category) return;

    document.getElementById('select-box').scrollTop = 0;

    document.getElementById(active).classList.remove('active');
    document.getElementById(`${active}-select`).style.display = 'none';

    active = category;
    document.getElementById(active).classList.add('active');
    document.getElementById(`${active}-select`).style.display = 'block';

    return;
}


function changeTalent(i, permanent = true) {
    let color = 0;

    switch(i) {
        case 0: // Tinker
            color = 180;
            break;
        case 1: // Garden
            color = 0;
            break;
        case 2: // Water
            color = 280;
            break;
        case 3: // Light
            color = 130;
            break;
        case 4: // Animal
            color = 70;
            break;
    }

    const wings = document.querySelectorAll('.wings');
    wings.forEach(w => {w.style.filter = `hue-rotate(${color}deg)`;});

    if (permanent) {
        document.getElementById(`talent-${charDetails.talent}`).classList.remove('selected');
        document.getElementById(`talent-${i}`).classList.add('selected');
        charDetails.talent = i;
    }

    return;
}


function changeHair(i, side, permanent = true) {

    const hairFront = document.querySelectorAll('.front-hair');
    const hairBack = document.querySelectorAll('.back-hair');

    if (baldness && permanent) {
        hairFront.forEach(h => {h.style.display = 'block'});
        hairBack.forEach(h => {h.style.display = 'block'});

        baldness = false;
    }

    // Front hair
    if (!side) {
        hairFront.forEach(h => {h.style.backgroundPosition = `${-charDetails.hairColor * width}px ${-i * height}px`});

        if (permanent) {
            document.getElementById(`hairFront-${charDetails.hairFront}`).classList.remove('selected');
            document.getElementById(`hairFront-${i}`).classList.add('selected');
            charDetails.hairFront = i;
        }

    // Back hair
    } else {
        hairBack.forEach(h => {h.style.backgroundPosition = `${-charDetails.hairColor * width}px ${-i * height}px`});

        if (permanent) {
            document.getElementById(`hairBack-${charDetails.hairBack}`).classList.remove('selected');
            document.getElementById(`hairBack-${i}`).classList.add('selected');
            charDetails.hairBack = i;
        }
    }

    return;
}


function changeHairColor(i) {

    // Reset custom color changes
    document.getElementById('hair-hue').value = 0;
    document.getElementById('hair-brightness').value = 100;
    document.getElementById('hair-saturation').value = 100;

    charDetails.hairColor = i;

    const hairFront = document.querySelectorAll('.front-hair');
    hairFront.forEach(h => {
        h.style.backgroundPosition = `${-i * width}px ${-charDetails.hairFront * height}`;
        h.style.filter = 'none';
    });

    const hairBack = document.querySelectorAll('.back-hair');
    hairBack.forEach(h => {
        h.style.backgroundPosition = `${-i * width}px ${-charDetails.hairBack * height}`;
        h.style.filter = 'none';
    });

    return;
}


function changeBody(i) {

    // Reset custom color changes
    document.getElementById('skin-hue').value = 0;
    document.getElementById('skin-brightness').value = 100;
    document.getElementById('skin-saturation').value = 100;

    charDetails.body = i;

    const body = document.querySelectorAll('.body');
    body.forEach(b => {
        b.style.backgroundPosition = `${-i * width}px 0px`;
        b.style.filter = 'none';
    });

    return;
}


function changeEyes(i, permanent = true) {

    const eyes = document.querySelectorAll('.eyes');
    eyes.forEach(e => {e.style.backgroundPosition = `${-i * width}px ${-2 * height}px`;});

    if (permanent) {
        document.getElementById(`eyes-${charDetails.eyes}`).classList.remove('selected');
        document.getElementById(`eyes-${i}`).classList.add('selected');
        charDetails.eyes = i;
    }

    return;
}


function changeClothing(i, piece, permanent = true) {

    // Tops
    if (piece === 0) {
        const top = document.querySelectorAll('.top');
        top.forEach(t => {t.style.backgroundPosition = `${-i * width}px ${0 * height}px`});

        if (permanent) {
            document.getElementById(`top-${charDetails.top}`).classList.remove('selected');
            document.getElementById(`top-${i}`).classList.add('selected');
            charDetails.top = i;
        }

        return;

    // Bottoms
    } else if (piece === 1) {
        const bottom = document.querySelectorAll('.bottom');
        bottom.forEach(b => {b.style.backgroundPosition = `${-i * width}px ${-1 * height}px`});

        if (permanent) {
            document.getElementById(`bottom-${charDetails.bottom}`).classList.remove('selected');
            document.getElementById(`bottom-${i}`).classList.add('selected');
            charDetails.bottom = i;
        }

        return;

    // Shoes
    } else {
        const shoes = document.querySelectorAll('.shoes');
        shoes.forEach(s => {s.style.backgroundPosition = `${-i * width}px ${-3 * height}px`});

        if (permanent) {
            document.getElementById(`shoes-${charDetails.shoes}`).classList.remove('selected');
            document.getElementById(`shoes-${i}`).classList.add('selected');
            charDetails.shoes = i;
        }

        return;
    }
}


// Add preview function when mousing over selections
function mouseoverPreview() {

    const categories = [
        { name: 'talent', styles: 5, foo: changeTalent, param: -1, },
        { name: 'hairFront', styles: 3, foo: changeHair, param: 0, },
        { name: 'hairBack', styles: 4, foo: changeHair, param: 1, },
        { name: 'eyes', styles: 3, foo: changeEyes, param: -1, },
        { name: 'top', styles: 3, foo: changeClothing, param: 0, },
        { name: 'bottom', styles: 3, foo: changeClothing, param: 1, },
        { name: 'shoes', styles: 3, foo: changeClothing, param: 2, },
    ];

    for (let j = 0; j < categories.length; j++) {

        const currCategory = categories[j];

        for (let i = 0; i < currCategory.styles; i++) {

            let params = [i, false];

            // Add extra parameter if necessary
            if (currCategory.param != -1)
                params.splice(1, 0, currCategory.param);

            document.getElementById(`${currCategory.name}-${i}`).addEventListener('mouseover', () => { currCategory.foo(...params) });
            document.getElementById(`${currCategory.name}-${i}`).addEventListener('mouseout', () => {
                let evilParams = params.with(0, charDetails[currCategory.name]);
                currCategory.foo(...evilParams);
            });
        }
    }

    return;
}


// HSV slider functionality
function changeColor() {

    const sliderCategories = ['hair', 'skin', 'eyes', 'top', 'bottom', 'shoes'];
    const sliderParts = [['.front-hair', '.back-hair'], ['.body'], ['.eye-color'], ['.top'], ['.bottom'], ['.shoes']];

    const sliderTypes = ['-hue', '-saturation', '-brightness'];
    const sliders = [];

    // Create array containing HSV sliders for each category
    for (let i = 0; i < sliderCategories.length; i++) {
        sliders.push(sliderTypes.map(element => document.getElementById(sliderCategories[i] + element)));
    }

    // Add recolor function to each slider
    for (let i = 0; i < sliders.length; i++) {
        for (let j = 0; j < sliders[i].length; j++) {
            sliders[i][j].oninput = () => { recolor(sliderParts[i], sliders[i]) };
        }
    }

    return;
}


// Changes the color of part based on HSV values from sliders
function recolor(part, sliders) {
    const filter = `hue-rotate(${sliders[0].value}deg) saturate(${sliders[1].value}%) brightness(${sliders[2].value}%)`;

    for (let i = 0; i < part.length; i++) {
        const color = document.querySelectorAll(part[i]);
        color.forEach(c => {c.style.filter = filter;});
    }

    return;
}


// Changes color of piece to match target
function match(piece, target) {

    const sliderTypes = ['-hue', '-saturation', '-brightness'];

    const pieceSliders = (sliderTypes.map(element => document.getElementById(piece + element)));
    const targetSliders = (sliderTypes.map(element => document.getElementById(target + element)));

    for (let i = 0; i < pieceSliders.length; i++) {
        pieceSliders[i].value = targetSliders[i].value;
    }
    const className = ['.' + piece];
    recolor(className, pieceSliders);

    return;
}


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


var currentClothes = 'top';
function changeClothesPage(target) {

    if (target === currentClothes) return;

    document.getElementById(`${currentClothes}-icon`).classList.remove('clothes-active');
    document.getElementById(`${currentClothes}-select`).style.display = 'none';

    document.getElementById(`${target}-icon`).classList.add('clothes-active');
    document.getElementById(`${target}-select`).style.display = 'block';

    currentClothes = target;
}

