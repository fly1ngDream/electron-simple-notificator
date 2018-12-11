function getCurrentFormatedDate() {
    let now = new Date();
    let nowStr = now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear();
    return nowStr;
}

function getCurrentFormatedTime() {
    let now = new Date();
    let nowStr = now.getHours() + ":" + now.getMinutes();
    let hoursWith0, minutesWith0;
    if (now.getHours().toString().length == 1) {
        hoursWith0 = '0' + now.getHours();
    } else {
        hoursWith0 = now.getHours();
    }
    if (now.getMinutes().toString().length == 1) {
        minutesWith0 = '0' + now.getMinutes();
    } else {
        minutesWith0 = now.getMinutes();
    }
    nowStr = hoursWith0 + ":" + minutesWith0;
    return nowStr;
}

self.addEventListener('message', function(e) {
    setInterval(function() {
        if (getCurrentFormatedTime() == e.data) {
            self.postMessage('1');
        }
    }, 500);
}, false);
