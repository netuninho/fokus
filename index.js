const html = document.querySelector('html');
const focoBtn = document.querySelector('.app__card-button--foco ');
const curtoBtn = document.querySelector('.app__card-button--curto');
const longoBtn = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const title = document.querySelector('.app__title');
const buttons = document.querySelectorAll('.app__card-button');
const startPauseBtn = document.querySelector('#start-pause');
const musicToggleButton = document.querySelector('#alternar-musica');
const startOrPauseBtn = document.querySelector('#start-pause span');
const startOrPauseBtnIcon = document.querySelector(".app__card-primary-butto-icon") 
const timeOnScreen = document.querySelector('#timer');

const music = new Audio('/sons/luna-rise-part-one.mp3');
const audioPlay = new Audio('/sons/play.wav');
const audioPause = new Audio('/sons/pause.mp3');
const audioEnd = new Audio('/sons/beep.mp3');

let elapsedTimeInSeconds = 1500;
let intervalId = null;

music.loop = true;

musicToggleButton.addEventListener('change', () => {
    if(music.paused) {
        music.play();
    } else {
        music.pause();
    }
})

focoBtn.addEventListener('click', () => {
    elapsedTimeInSeconds = 1500
    updateContext('foco');
    focoBtn.classList.add('active');
});

curtoBtn.addEventListener('click', () => {
    elapsedTimeInSeconds = 300
    updateContext('descanso-curto');
    curtoBtn.classList.add('active');
});

longoBtn.addEventListener('click', () => {
    elapsedTimeInSeconds = 900
   updateContext('descanso-longo');
   longoBtn.classList.add('active');
});

function updateContext(contexto) {
    showTime()
    buttons.forEach(function(contexto) {
        contexto.classList.remove('active');
    })

    html.setAttribute('data-contexto', contexto);

    banner.setAttribute('src', `/imagens/${contexto}.png`);

    switch(contexto) {
        case "foco":
            title.innerHTML = `
            Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
        break;

        case "descanso-curto":
            title.innerHTML= `
            Que tal dar uma respirada? <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `
        break;

        case "descanso-longo":
            title.innerHTML = `
            Hora de voltar à superfície. <strong class="app__title-strong">
            Faça uma pausa longa.</strong>
            `
        break;
        default:
        break;
    }
};

const countdown = () => {
    if(elapsedTimeInSeconds <= 0) {
        resetTime()
        audioEnd.play()
        // alert('Tempo finalizado!')

        const activeFocus = html.getAttribute('data-contexto') === 'foco'
        if (activeFocus) {
            let event = new CustomEvent("TaskCompleted", {
                detail: {
                    message: "A tarefa foi concluída com sucesso!",
                    time: new Date(),
                },
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(event);
            elapsedTimeInSeconds = 5;
            displayTime();
        }
        
        return
    };

    elapsedTimeInSeconds -= 1 
    showTime()
}

startPauseBtn.addEventListener('click', startOrPause)

function startOrPause() {
    if(intervalId) {
        audioPause.play()
        resetTime()
        return
    };

    audioPlay.play()
    intervalId = setInterval(countdown, 1000)
    startOrPauseBtn.textContent = "Pausar"
    startOrPauseBtnIcon.setAttribute('src', `/imagens/pause.png`)
}

function resetTime() { 
    clearInterval(intervalId)
    startOrPauseBtn.textContent = "Começar"
    startOrPauseBtnIcon.setAttribute('src', `/imagens/play_arrow.png`)
    intervalId = null
}

function showTime() {
    const time = new Date(elapsedTimeInSeconds * 1000)
    const formattedTime  = time.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'})
    timeOnScreen.innerHTML = `${formattedTime }`
}

showTime()