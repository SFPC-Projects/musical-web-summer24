let myCanvas = document.getElementById('woscope-canvas');
let myAudio1 = document.getElementById('myAudio1');
let myAudio2 = document.getElementById('myAudio2');
let playAudio1 = document.getElementById('sound-btn1');
let playAudio2 = document.getElementById('sound-btn2');

function initializeWoscope(audioElement) {
    woscope({
        canvas: myCanvas,
        audio: audioElement,
        callback: function () { audioElement.play(); },
        error: function (msg) { console.log('woscope error:', msg); }
    });
}

function pauseAllAudio() {
    let allAudioElements = document.querySelectorAll('audio');
    allAudioElements.forEach(audio => audio.pause());
}

document.addEventListener('DOMContentLoaded', function() {
    initializeWoscope(myAudio1);
    myAudio1.play();
});

playAudio1.addEventListener('click', function() {
    pauseAllAudio();
    initializeWoscope(myAudio1);
    myAudio1.play();
});

playAudio2.addEventListener('click', function() {
    pauseAllAudio();
    initializeWoscope(myAudio2);
    myAudio2.play();
});