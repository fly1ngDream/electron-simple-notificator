let notifier = require('node-notifier'),
    path = require('path');
let tasksCounter = 0;

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

let createNotification = function(title, message) {
    notifier.notify({
        title: title,
        message: message,
        icon: path.join(__dirname, "Linux.png"),
        sound: true,
        wait: false
    });
};

let handleNotification = function(title, message) {
    createNotification(title, message);
};

let handleEditedNotification = function(title, message) {
    createNotification(title, message);
};

let handleButtonClick = function() {
    let timeInput = document.querySelector('#timeInput');
    if (!(/^([0-1][0-9]|2[0-4]):[0-5][0-9]$/).test(document.querySelector('#timeInput').value)) {
        timeInput.focus();
        timeInput.style = 'border-color: red';
        timeInput.value = '';
        return false;
    }
    timeInput.style = 'border-color: black';


    document.querySelector('#scheduledTasks').style.visibility = 'visible';

    let worker = new Worker('worker.js');

    let newTerminateTaskButton = document.createElement('button');
    newTerminateTaskButton.id = 'terminateButton';


    let newBr = document.createElement('br');
    let newTaskLabel = document.createElement('label');
    newTaskLabel.textContent = document.querySelector('#timeInput').value + ' | ' + document.querySelector('#title').value + ' ';
    newTerminateTaskButton.appendChild(document.createTextNode('Terminate'));
    let newMessageLabel = document.createElement('label');
    newMessageLabel.textContent = document.querySelector('#message').value;

    worker.addEventListener('message', function(e) {
        if (e.data == '1') {
            handleNotification(newTaskLabel.textContent.split(' ')[2], newMessageLabel.textContent);
            newMessageLabel = null;
            newTerminateTaskButton.click();
        }
    }, false);

    worker.postMessage(newTaskLabel.textContent.split(' ')[0]);

    let editButton = document.createElement('button');
    let newProgress = document.createElement('div');
    newProgress.id = 'myProgress';
    let newBar = document.createElement('div');
    newBar.id = 'myBar';
    let id;
    let moveProgress = function() {
        let elem = newBar;
        let seconds1 = (parseInt(document.querySelector('#timeInput').value.split(':')[0]) * 3600) +
            (parseInt(document.querySelector('#timeInput').value.split(':')[1]) * 60);
        let seconds2 = (parseInt(getCurrentFormatedTime().split(':')[0]) * 3600) +
            (parseInt(getCurrentFormatedTime().split(':')[1]) * 60) + parseInt((new Date).getSeconds());
        let miliseconds = (seconds1 - seconds2) * 1000;
        let width = 1;
        id = setInterval(frame, miliseconds/100);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
            } else {
                width++;
                elem.style.width = width + '%';
            }
        }
    };
    editButton.textContent = 'Edit';
    editButton.id='editButton';
    editButton.addEventListener('click', function() {
        if (document.querySelector('#cancelButton')) {
            console.log('1');
            let editCancelButton = document.querySelector('#cancelButton');
            editCancelButton.click();
        } else {
            let editFieldset = document.createElement('fieldset');
            editFieldset.id = 'editFieldset';
            let editLegend = document.createElement('legend');
            editLegend.textContent = 'Edit :';
            let editTitleLabel = document.createElement('label');
            editTitleLabel.textContent = 'Title';
            let editTitle = document.createElement('input');
            editTitle.type = 'text';
            editTitle.placeholder = 'Notification title';
            let editMessageLabel = document.createElement('label');
            editMessageLabel.textContent = 'Message';
            let editMessage = document.createElement('input');
            editMessage.type = 'text';
            editMessage.placeholder = 'Notification message';
            let editTimeLabel = document.createElement('label');
            editTimeLabel.textContent = 'Time';
            let editTime = document.createElement('input');
            editTime.type = 'text';
            editTime.title = 'Your time must be HH:MM formatted';
            editTime.placeholder = 'HH:MM';
            let editProgress = document.createElement('div');
            let editOk = document.createElement('button');
            editOk.textContent = 'Ok';
            editOk.addEventListener('click', function() {
                if (!(/^([0-1][0-9]|2[0-4]):[0-5][0-9]$/).test(editTime.value)) {
                    editTime.focus();
                    editTime.style = 'border-color: red';
                    editTime.value = '';
                    return false;
                }
                editTime.style = 'border-color: black';

                worker.terminate();
                worker = new Worker('worker.js');
                worker.addEventListener('message', function(e) {
                    if(e.data == '1') {
                        handleEditedNotification(editTitle.value, editMessage.value);
                        newTerminateTaskButton.click();
                    }
                });
                worker.postMessage(editTime.value);
                newTaskLabel.textContent = editTime.value + ' | ' + editTitle.value + ' ';
                newMessageLabel.textContent = editMessage.value;
                clearInterval(id);
                newBar.style.width = '1%';
                let moveProgress = function() {
                    let elem = newBar;
                    let seconds1 = (parseInt(editTime.value.split(':')[0]) * 3600) +
                        (parseInt(editTime.value.split(':')[1]) * 60);
                    let seconds2 = (parseInt(getCurrentFormatedTime().split(':')[0]) * 3600) +
                        (parseInt(getCurrentFormatedTime().split(':')[1]) * 60) + parseInt((new Date).getSeconds());
                    let miliseconds = (seconds1 - seconds2) * 1000;
                    let width = 1;
                    id = setInterval(frame, miliseconds/100);
                    function frame() {
                        if (width >= 100) {
                            clearInterval(id);
                        } else {
                            width++;
                            elem.style.width = width + '%';
                        }
                    }
                };
                moveProgress();
                editFieldset.parentNode.removeChild(editFieldset);
                return true;
            });
            let editCancel = document.createElement('button');
            editCancel.textContent = 'Cancel';
            editCancel.addEventListener('click', function() {
                editFieldset.parentNode.removeChild(editFieldset);
            });
            editCancel.id = 'cancelButton';
            editFieldset.appendChild(editLegend);
            editFieldset.appendChild(editTitleLabel);
            editFieldset.appendChild(editTitle);
            editFieldset.appendChild(document.createElement('br'));
            editFieldset.appendChild(editMessageLabel);
            editFieldset.appendChild(editMessage);
            editFieldset.appendChild(document.createElement('br'));
            editFieldset.appendChild(editTimeLabel);
            editFieldset.appendChild(editTime);
            editFieldset.appendChild(document.createElement('br'));
            editFieldset.appendChild(editOk);
            editFieldset.appendChild(editCancel);
            document.querySelector('#scheduleTasksDiv').appendChild(editFieldset);
        }
    });


    newTerminateTaskButton.addEventListener('click', function() {
        worker.terminate();
        newBr.parentNode.removeChild(newBr);
        newTaskLabel.parentNode.removeChild(newTaskLabel);
        newTerminateTaskButton.parentNode.removeChild(newTerminateTaskButton);
        editButton.parentNode.removeChild(editButton);
        newProgress.parentNode.removeChild(newProgress);
        tasksCounter--;
        if (tasksCounter == 0) {
            document.querySelector('#scheduledTasks').style.visibility = 'hidden';
        }
    });

    newProgress.appendChild(newBar);

    document.querySelector('#scheduledTasks').appendChild(newTaskLabel);
    document.querySelector('#scheduledTasks').appendChild(newTerminateTaskButton);
    document.querySelector('#scheduledTasks').appendChild(editButton);
    document.querySelector('#scheduledTasks').appendChild(newProgress);

    moveProgress();
    document.querySelector('#scheduledTasks').appendChild(newBr);
    tasksCounter++;
    return true;
};


