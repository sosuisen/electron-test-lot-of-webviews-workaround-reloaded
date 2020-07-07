const { ipcRenderer } = require("electron");

const onload = () => {
  console.log('loaded');
  
  const webview = document.getElementById('webview');

  webview.addEventListener('console-message', e => {
    console.log('[from webview]: ' + e.message);
  });

  let webviewReloadTimer = null;

  webview.addEventListener('did-finish-load', e => {
    console.log('webview: did-finish-load');
    // webview.openDevTools();
    document.body.insertAdjacentHTML('beforeend', 'webview: did-finish-load<br>');
    document.body.insertAdjacentHTML('beforeend', '[A] Sent ping to webview<br>');
    webview.send('ping');
    console.log('Sent ping to webview');
    webviewReloadTimer = setTimeout(() => { 
      console.log('Reload webview');
      document.body.insertAdjacentHTML('beforeend', 'Reload webview<br>');
      window.location.reload();
    }, 1000);
  });
  

  webview.addEventListener('ipc-message', e => {
    if (e.channel == 'pong') {
      console.log('Received pong from webview');
      document.body.insertAdjacentHTML('beforeend', '[B] Received pong from webview<br>');
      clearTimeout(webviewReloadTimer);

      const q = window.location.search;
      const arr = q.slice(1).split('&');
      const params = {};
      for (var i = 0; i < arr.length; i++) {
        const pair = arr[i].split('=');
        params[pair[0]] = pair[1];
      }
      ipcRenderer.send('ready-' + params.id);
    }
  });
};

window.addEventListener('load', onload);