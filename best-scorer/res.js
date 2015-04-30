var mute = false;
var metalSound = 'res/metal.mp3';
var hitSound = 'res/hit.mp3';
var bounceSound = 'res/bounce.mp3';
var goalSound = 'res/goal.mp3';
var yeahSound = 'res/yeah.mp3';
var endSound = 'res/end.mp3';

function playSound(src){
    if(!mute) new Audio(src).play();
}

function setMute(){
    mute = !mute;
    var icon = document.getElementById('mute_icon');
    if(mute) icon.src = 'img/mute.png';
    else icon.src = 'img/unmute.png';
}
