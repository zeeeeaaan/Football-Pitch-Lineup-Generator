const pitch = document.getElementById('pitch');
const generateBtn = document.getElementById('generatePlayers');
const playerCountInput = document.getElementById('playerCount');
const formationSelect = document.getElementById('formation');
const downloadBtn = document.getElementById('downloadPitch');
const playerColorInput = document.getElementById('playerColor');

let selectedPlayer = null;
let offsetX, offsetY;

// Formations
const formations = {
    "4-4-2": [
        {pos:"GK", x:50, y:90},
        {pos:"LB", x:15, y:70},{pos:"LCB", x:35, y:70},{pos:"RCB", x:65, y:70},{pos:"RB", x:85, y:70},
        {pos:"LM", x:15, y:50},{pos:"LCM", x:35, y:50},{pos:"RCM", x:65, y:50},{pos:"RM", x:85, y:50},
        {pos:"LF", x:35, y:30},{pos:"RF", x:65, y:30}
    ],
    "4-3-3": [
        {pos:"GK", x:50, y:90},
        {pos:"LB", x:15, y:70},{pos:"LCB", x:35, y:70},{pos:"RCB", x:65, y:70},{pos:"RB", x:85, y:70},
        {pos:"LCM", x:25, y:50},{pos:"CM", x:50, y:50},{pos:"RCM", x:75, y:50},
        {pos:"LW", x:20, y:30},{pos:"ST", x:50, y:25},{pos:"RW", x:80, y:30}
    ],
    "3-5-2": [
        {pos:"GK", x:50, y:90},
        {pos:"LCB", x:25, y:70},{pos:"CB", x:50, y:70},{pos:"RCB", x:75, y:70},
        {pos:"LM", x:10, y:50},{pos:"LCM", x:30, y:50},{pos:"CM", x:50, y:50},{pos:"RCM", x:70, y:50},{pos:"RM", x:90, y:50},
        {pos:"LF", x:35, y:30},{pos:"RF", x:65, y:30}
    ]
};

// Create player
function createPlayer(id, leftPercent, topPercent, posName) {
    const player = document.createElement('div');
    player.classList.add('player');
    player.style.backgroundColor = playerColorInput.value;

    player.style.left = (pitch.clientWidth * leftPercent/100 - 30) + 'px';
    player.style.top = (pitch.clientHeight * topPercent/100 - 30) + 'px';

    const nameDiv = document.createElement('div');
    nameDiv.classList.add('name');
    nameDiv.contentEditable = true;
    nameDiv.innerText = `Player ${id}`;

    const posDiv = document.createElement('div');
    posDiv.classList.add('positionLabel');
    posDiv.contentEditable = true;
    posDiv.innerText = posName;

    player.appendChild(nameDiv);
    player.appendChild(posDiv);

    // Tooltip
    player.dataset.info = `${nameDiv.innerText} - ${posDiv.innerText}`;

    // Update tooltip when edited
    nameDiv.addEventListener('input', () => { player.dataset.info = `${nameDiv.innerText} - ${posDiv.innerText}`; });
    posDiv.addEventListener('input', () => { player.dataset.info = `${nameDiv.innerText} - ${posDiv.innerText}`; });

    // Change color
    player.addEventListener('click', () => { player.style.backgroundColor = playerColorInput.value; });

    player.addEventListener('mousedown', dragMouseDown);
    pitch.appendChild(player);
}

// Generate players
generateBtn.addEventListener('click', () => {
    const oldPlayers = document.querySelectorAll('.player');
    oldPlayers.forEach(p => p.remove());

    const formation = formationSelect.value;
    const count = parseInt(playerCountInput.value);

    for (let i = 0; i < count; i++) {
        if(formations[formation][i]){
            const f = formations[formation][i];
            createPlayer(i+1, f.x, f.y, f.pos);
        } else {
            createPlayer(i+1, Math.random()*100, Math.random()*50, "Custom");
        }
    }
});

// Drag-and-drop
function dragMouseDown(e){
    selectedPlayer = e.target.closest('.player');
    offsetX = e.clientX - selectedPlayer.offsetLeft;
    offsetY = e.clientY - selectedPlayer.offsetTop;
    document.addEventListener('mousemove', elementDrag);
    document.addEventListener('mouseup', stopDrag);
}

function elementDrag(e){
    if(!selectedPlayer) return;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    x = Math.max(0, Math.min(x, pitch.clientWidth - selectedPlayer.offsetWidth));
    y = Math.max(0, Math.min(y, pitch.clientHeight - selectedPlayer.offsetHeight));

    selectedPlayer.style.left = x + 'px';
    selectedPlayer.style.top = y + 'px';
}

function stopDrag(){
    document.removeEventListener('mousemove', elementDrag);
    document.removeEventListener('mouseup', stopDrag);
    selectedPlayer = null;
}

// Download pitch
downloadBtn.addEventListener('click', () => {
    html2canvas(pitch).then(canvas => {
        const link = document.createElement('a');
        link.download = 'half_pitch_lineup.jpeg';
        link.href = canvas.toDataURL('image/jpeg', 1.0);
        link.click();
    });
});
