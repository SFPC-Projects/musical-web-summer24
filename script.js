let infoScreen = document.getElementById('about');
let myAudio1 = document.getElementById('audio1');



/////////////// Oscilloscope Simulator ///////////////

function initializeWoscope(audioElement) {
    woscope({
        canvas: document.getElementById('woscope-canvas'),
        audio: audioElement,
        callback: function () { audioElement.play(); },
        error: function (msg) { console.log('woscope error:', msg); }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeWoscope(myAudio1);
    myAudio1.play();
    initializeAudioButtons();
});

// Refactored sound buttons
function initializeAudioButtons() {
    const soundsGrid = document.querySelector('#sounds-grid');
    
    for (let i = 0; i < 4; i++) {
        const buttonElement = document.createElement('div');
        buttonElement.className = 'sin-img';

        const circleDiv = document.createElement('div');
        circleDiv.className = 'circle';

        const img = document.createElement('img');
        img.className = 'sound-btn';
        img.src = 'assets/buttons/dial.png';
        img.alt = `Sound ${i + 1}`;
        img.draggable = false;

        circleDiv.appendChild(img);
        buttonElement.appendChild(circleDiv);

        const audioId = `audio${i + 1}`;
        const audio = document.getElementById(audioId);
        img.addEventListener('click', function() {
            removeInfo();
            removeIframe();
            pauseAllAudio();
            initializeWoscope(audio);
            audio.play();
        });

        soundsGrid.appendChild(buttonElement);

        const circle = buttonElement.querySelector('.circle');
        setCircleBorderColor(circle, i);
    }
};

function setCircleBorderColor(circle, index) {
    const colors = ['#d1b96f', '#9ebe78', '#5b8ccb', '#cd695e'];
    circle.style.borderColor = colors[index];
}

function pauseAllAudio() {
    let allAudioElements = document.querySelectorAll('audio');
    allAudioElements.forEach(audio => audio.pause());
}



//////////////////// Menu Buttons ////////////////////

document.getElementById("info-btn").addEventListener("click", function() {
    infoScreen.style.display = 'block';
    removeIframe();
    pauseAllAudio();
});

document.getElementById("home-btn").addEventListener("click", function() {
    removeInfo();
    removeIframe();
    pauseAllAudio();
});

// Refactored project buttons
document.addEventListener("DOMContentLoaded", function() {
    fetch('projects.csv')
        .then(response => response.text())
        .then(csvText => {
            let projects = parseCSV(csvText);
            setupButtons(projects);
        });
});

function parseCSV(csvText) {
    let rows = csvText.trim().split('\n').slice(1); 
    return rows.map(row => {
        let [title, artist, link, description] = row.split(',');
        return { title, artist, link, description };
    });
}

function setupButtons(projects) {
    let projectsGrid = document.getElementById('projects-grid');
    let numberOfButtons = 5;

    for (let i = 0; i < numberOfButtons; i++) {
        let buttonSrc = `assets/buttons/btn${i + 1}.png`;
        let btnContainer = document.createElement('div');
        btnContainer.className = "btn-container";

        let btn = document.createElement('img');
        btn.src = buttonSrc;
        btn.id = 'btn';
        btn.draggable = false;
        btn.alt = `Page ${i + 1}`

        btn.addEventListener('click', function() {
            pauseAllAudio();
            removeInfo();
            removeIframe();
            // Display 4 projects on each page
            addIframe(projects.slice(i*4, i*4+4))
        });

        btnContainer.appendChild(btn);
        projectsGrid.insertBefore(btnContainer, document.getElementById('sounds-text'));
    }
}



/////////////////////// Screen ///////////////////////

function removeInfo() {
    if (infoScreen.style.display === 'block') {
        infoScreen.style.display = 'none';
    }
}

function removeIframe() {
    let iframeScreen = document.getElementById('iframe-screen');
    if (iframeScreen) {
        iframeScreen.remove();
    }
}

function addIframe(projects) {
    let iframeScreen = document.createElement('div');
    iframeScreen.id = 'iframe-screen';

    projects.forEach((project, index) => {
        let gridItem = createGridItem(index, project);
        // Define grid column and row placement
        let row = Math.floor(index / 2) + 1;
        let column = (index % 2) + 1;
        gridItem.style.gridColumn = `${column}/${column + 1}`;
        gridItem.style.gridRow = `${row}/${row + 1}`;
        iframeScreen.appendChild(gridItem);
    });

    let screenElement = document.getElementById('screen');
    screenElement.appendChild(iframeScreen);
}

function createGridItem(id, project) {
    let gridItem = document.createElement('div');
    gridItem.style.border = '0.5px solid rebeccapurple';
    gridItem.style.position = 'relative';

    let iframe = document.createElement('iframe');
    iframe.id = `myiframe${id}`;
    iframe.src = project.link;
    iframe.title = project.title;
    gridItem.appendChild(iframe);

    // Project links
    let anchor = document.createElement('a');
    anchor.id = 'anchor';
    anchor.href = project.link;
    anchor.target = '_blank';
    gridItem.appendChild(anchor);

    // Project overlay
    let overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.innerHTML = `<div><strong>${project.title}</strong><br>${project.artist}<br>${project.description}</div>`;
    gridItem.appendChild(overlay);

    // Show/hide overlay on hover
    gridItem.addEventListener('mouseover', () => {
        overlay.style.display = 'flex';
    });
    gridItem.addEventListener('mouseout', () => {
        overlay.style.display = 'none';
    });

    return gridItem;
}