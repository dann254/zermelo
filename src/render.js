const videoElement = document.querySelector('video')
const startBtn = document.getElementById('startBtn')
const stopBtn = document.getElementById('stopBtn')
const videoSelectBtn = document.getElementById('videoSelectBtn')
const closeBtn = document.getElementById('closeBtn')
const sourceLabel = document.getElementById('sourceLabel')

videoSelectBtn.onclick = getVideoSources;
closeBtn.onclick = closeWindow;


const { desktopCapturer, remote } = require('electron')
const { Menu } = remote;

async function getVideoSources() {
    const inputSources = await desktopCapturer.getSources({
        types: ['window', 'screen']
    })
    const videoOptionsMenu = Menu.buildFromTemplate(
        inputSources.map(source => {
            return {
                label: source.name,
                click: () => selectSource(source)
            }
        })
    )

    videoOptionsMenu.popup()
}


async function selectSource(source) {
    sourceLabel.innerText = source.name
    const constraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id,
            }
        }
    }

    const  stream = await navigator.mediaDevices.getUserMedia(constraints)

    videoElement.srcObject = stream;
    videoElement.play()
}

function closeWindow() {
    var window = remote.getCurrentWindow();
    window.close();
}
