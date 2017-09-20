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
	mouseData.x = event.clientX - contentBlock.getBoundingBoundingClientRect().left;
	mouseData.y = event.clientY - contentBlock.getBoundingBoundingClientRect().top;
	log.experiment[experimentProgress - 1].mouse.push(mouseData);
}

// things to be done when the trial completes
function completeExperiment() {
	postData(log);
	clearContent();
	var t = document.querySelector('#end-thanks');
	var clone = document.importNode(t.content, true);
	contentBlock.appendChild(clone);
}

function showUserInfoForm() {
	var t = document.querySelector('#user-info-form');
	var clone = document.importNode(t.content, true);
	contentBlock.appendChild(clone);
}

function handleUserInfoSubmit() {
	var form = document.querySelector('#form');
	log.name = document.querySelector('#name').value;
	clearContent();
	advanceExperiment();
	return false;
}

function showPrompt(prompt) {
	var t = document.querySelector('#prompt');
	t.content.querySelector('#prompt-text').textContent = prompt.promptText;
	var clone = document.importNode(t.content, true);
	contentBlock.appendChild(clone);
}

function showTrial(trial) {
	var t = document.querySelector('#trial');
	t.content.querySelector('#trial-text').textContent = trial.trialText;
	var clone = document.importNode(t.content, true);
	contentBlock.appendChild(clone);
	document.addEventListener('mousemove', recordMousePosition);
	log.experiment[experimentProgress].mouse = [];
}

function showExperimentEnd() {
	var t = document.querySelector('#experiment-end');
	var clone = document.importNode(t.content, true);
	contentBlock.appendChild(clone);
}

function clearContent() {
	contentBlock.innerHTML = '';
}

function advanceExperiment() {
	clearContent();
	if (experimentProgress < experiment.length) showExperimentBlock(experimentProgress);
	else showExperimentEnd();
	experimentProgress++;
}

function showExperimentBlock(i) {
	if (experiment[i].dataType == 'prompt') showPrompt(experiment[i]);
	if (experiment[i].dataType == 'trial') showTrial(experiment[i]);
}

var contentBlock = document.querySelector('#content');

// test experiment details object
var experiment = [
	{
		dataType: 'prompt',
		promptText: 'This is a test prompt'
	}, 
	{
		dataType: 'trial',
		trialText: 'This is a trial'
	},
	{
		dataType: 'trial',
		trialText: 'This is another trial'
	},
	{
		dataType: 'prompt',
		promptText: 'This is a second test prompt'
	}, 
	{
		dataType: 'trial',
		trialText: 'This is the last trial'
	}
];

// create log object
var log = new Object();
log.date = new Date();
log.name = ''
log.experiment = experiment;

var experimentProgress = 0;

// listen for mouse movements
// document.addEventListener('mousemove', recordMousePosition);



showUserInfoForm();