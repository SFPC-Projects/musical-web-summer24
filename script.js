let screen = document.getElementById('screen');
let infoScreen = document.getElementById('about');
let myAudio1 = document.getElementById('audio1');
let soundsDiv = document.getElementById('sounds-div');
let volumeSlider = document.getElementById('volume-slider');
let audioUpload = document.getElementById('audio-upload');

let audioElements = [];
console.log(audioElements)

/////////////// Oscilloscope Simulator ///////////////

function initializeWoscope(audioElement) {
    woscope({
        canvas: document.getElementById('woscope-canvas'),
        audio: audioElement,
        callback: function () { audioElement.play(); },
        error: function (msg) { console.log('woscope error:', msg); }
    });
}

document.addEventListener('DOMContentLoaded', () => {

    Papa.parse('projects.csv', {
        download: true,
        header: true,
        complete: function(results) {
            let projects = results.data;
            console.log(projects);
            setupButtons(projects);
        },
        error: function(error) {
            console.error('Error parsing CSV:', error);
        }
    });

    audioElements = Array.from(document.querySelectorAll('audio'));
    const volume = volumeSlider.value / 100;
    
    // Set initial volume for all audio elements
    audioElements.forEach(audio => {
        audio.volume = volume;
    });

    // Update volume whenever the slider is moved
    volumeSlider.addEventListener('input', (event) => {
        updateVolume(event.target.value);
    });
    
    initializeWoscope(myAudio1);
    myAudio1.play();
    initializeAudioButtons();
})

function updateVolume(value) {
    const volume = value / 100;
    audioElements.forEach(audio => {
        audio.volume = volume;
    });
}

function initializeAudioButtons() {
    
    for (let i = 0; i < 4; i++) {
        const buttonElement = document.createElement('div');
        buttonElement.className = 'sin-img';

        const circleDiv = document.createElement('div');
        circleDiv.className = 'circle';

        const img = document.createElement('img');
        img.className = 'sound-btn';
        img.src = 'assets/oscilloscope/dial.png';
        img.alt = `Sound ${i + 1}`;
        img.draggable = false;

        circleDiv.appendChild(img);
        buttonElement.appendChild(circleDiv);

        const audioId = `audio${i + 1}`;
        const audio = document.getElementById(audioId);

        if (i === 3) { // Handle file upload for the last button
            img.title = "Upload sound"
            img.addEventListener('click', function() {
                pauseAllAudio();
                removeInfo();
                removeIframe();
                audioUpload.click();
            });

            audioUpload.addEventListener('input', function(event) {
                const file = event.target.files[0];
                if (file) {
                    replaceAudio4(file);
                }
                event.target.value = '';
            });
        } else {
            img.addEventListener('click', function() {
                removeInfo();
                removeIframe();
                pauseAllAudio();
                initializeWoscope(audio);
                audio.play();
            });
        }

        soundsDiv.appendChild(buttonElement);

        const circle = buttonElement.querySelector('.circle');
        setCircleBorderColor(circle, i);
    }
}

function replaceAudio4(file) {
    // Remove existing audio4 element if it exists
    const existingAudio4 = document.getElementById('audio4');
    if (existingAudio4) {
        existingAudio4.remove();
    }

    // Create a new audio element
    const newAudio4 = document.createElement('audio');
    newAudio4.id = 'audio4'; 
    newAudio4.src = URL.createObjectURL(file); // Set the source to the uploaded file
    audioElements.push(newAudio4);
    newAudio4.addEventListener('loadeddata', () => {
        initializeWoscope(newAudio4)
        newAudio4.volume = volumeSlider.value / 100;
        // updateVolume(volumeSlider.value);
        newAudio4.play(); // Play the new audio file once it is loaded
    });
    soundsDiv.appendChild(newAudio4);
};

function pauseAllAudio() {
    let allAudioElements = document.querySelectorAll('audio');
    allAudioElements.forEach(audio => {
        console.log('Pausing audio:', audio.id); // Debugging line
        audio.pause();
    });
}

function setCircleBorderColor(circle, index) {
    const colors = ['#d1b96f', '#9ebe78', '#5b8ccb', '#cd695e'];
    circle.style.borderColor = colors[index];
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
});

// Refactored project buttons
function setupButtons(projects) {
    let projectsDiv = document.getElementById('projects-div');
    let numberOfButtons = 5;

    for (let i = 0; i < numberOfButtons; i++) {
        let buttonSrc = `assets/oscilloscope/btn${i + 1}.png`;

        let btn = document.createElement('img');
        btn.src = buttonSrc;
        btn.id = 'btn';
        btn.draggable = false;
        btn.alt = `Page ${i + 1} Button`

        btn.addEventListener('click', function() {
            pauseAllAudio();
            removeInfo();
            removeIframe();
            // Display 4 projects on each page
            addIframe(projects.slice(i*4, i*4+4))
        });

        projectsDiv.appendChild(btn);
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
        let gridItem = createIframeGrid(project);
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

function createIframeGrid(project) {
    let gridItem = document.createElement('div');
    gridItem.style.border = '0.5px solid rebeccapurple';
    gridItem.style.position = 'relative';

    if (project.image === 'TRUE') {
        // Display image if images column is TRUE
        let img = document.createElement('img');
        img.className = "project-image"
        img.src = `assets/project-images/${project.filename}`;
        img.alt = project.title;
        gridItem.appendChild(img);
    } else {
        // Display iframe if images column is FALSE
        let iframe = document.createElement('iframe');
        iframe.src = project.link;
        iframe.title = project.title;
        gridItem.appendChild(iframe);
    }

    // Project overlay
    let overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.innerHTML = `<div><h2>${project.title}</h2><p>${project.artist}</p><p>${project.description}</p></div>`;
    gridItem.appendChild(overlay);

    overlay.addEventListener('click', function () {
        window.open(project.link, '_blank');
    });

    gridItem.addEventListener('mouseover', () => {
        overlay.style.display = 'flex';
    });
    gridItem.addEventListener('mouseout', () => {
        overlay.style.display = 'none';
    });

    return gridItem;
}

document.getElementById('off-btn').addEventListener('click', function() {
    // Check if the screen is currently powered on or off
    if (screen.classList.contains('power-on') || !screen.classList.contains('power-off')) {
      // If powered on, trigger power-off animation
      screen.classList.remove('power-on');
      screen.classList.add('power-off');
      pauseAllAudio();
    } else {
      // If powered off, trigger power-on animation
      screen.classList.remove('power-off');
      screen.classList.add('power-on');
    }
  });