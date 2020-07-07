const electron = require("electron");

electron.ipcRenderer.on('ping', event => {
  document.body.insertAdjacentHTML('beforeend', '[A] Received ping from parent<br>');
  console.log('Received ping from parent');    
  
  document.body.insertAdjacentHTML('beforeend', '[B] Sent pong to parent<br>');
  electron.ipcRenderer.sendToHost('pong');
  console.log('Sent pong to parent');  
});

const onload = () => {
  console.log('loaded');
  document.body.insertAdjacentHTML('beforeend', 'loaded<br>');
}

window.addEventListener('load', onload);
