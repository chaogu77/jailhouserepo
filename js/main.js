// Send data to be logged
function postData(logObject) {
	var logJSON = JSON.stringify(logObject);
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "log.php", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send(logJSON);
}

// record the current mouse position
function recordMousePosition(event) {
	mouseData = new Object();
	mouseData.time = event.timeStamp;
	mouseData.x = event.clientX;
	mouseData.y = event.clientY;
	log.mouse.push(mouseData);
}

// things to be done when the trial completes
function completeTrial() {
	postData(log);
}

// create log object
var log = new Object();
log.date = new Date();
log.mouse = [];

// listen for mouse movements
document.addEventListener('mousemove', recordMousePosition);