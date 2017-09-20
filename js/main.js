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
	mouseData.x = event.clientX - contentBlock.getBoundingClientRect().left;
	mouseData.y = event.clientY - contentBlock.getBoundingClientRect().top;
	console.log("mousemoving");
	log.experiment[experimentProgress - 1].mouse.push(mouseData);
}

// things to be done when the trial completes
function completeExperiment() {
	postData(log);
	clearContent();
	var t = document.querySelector('#end');
	var clone = document.importNode(t.content, true);
	contentBlock.appendChild(clone);
}

// renders the form that gets user data from the template in index.html
function showUserInfoForm() {
	var t = document.querySelector('#user-info-form');
	var clone = document.importNode(t.content, true);
	contentBlock.appendChild(clone);
}

// handles the user pressing submit on the form; stores data and advances the experiment
function handleUserInfoSubmit() {
	var form = document.querySelector('#form');
	log.name = document.querySelector('#name').value;
	advanceExperiment();
	return false;
}

// shows a prompt by adding the necessary content to the prompt template
function showPrompt(prompt) {
	var t = document.querySelector('#prompt');
	t.content.querySelector('#prompt-text').textContent = prompt.promptText;
	var clone = document.importNode(t.content, true);
	contentBlock.appendChild(clone);
}

// shows a trial by adding the necessary content to the trial template
function showTrial(trial) {
	var t = document.querySelector('#trial');
	t.content.querySelector('#trial-text').textContent = trial.trialText;
	t.content.querySelector('#trial-image').src = trial.trialImage;
	var clone = document.importNode(t.content, true);

	contentBlock.appendChild(clone);
	log.experiment[experimentProgress].mouse = [];
	document.addEventListener('mousemove', recordMousePosition);
}

// a utility functiont to empty the content block
function clearContent() {
	contentBlock.innerHTML = '';
}

// move the experiment forward
function advanceExperiment() {
	clearContent();
	if (experimentProgress < experiment.length) showExperimentBlock(experimentProgress);
	else completeExperiment();
	experimentProgress++;
}

// render the experiment step we are currently at
function showExperimentBlock(i) {
	if (experiment[i].dataType == 'prompt') showPrompt(experiment[i]);
	if (experiment[i].dataType == 'trial') showTrial(experiment[i]);
}

var contentBlock = document.querySelector('#content');

// test experiment object, the experiment we generate should have a datatype, and then anything else
// if anything needs to be rendered just add some html to the appropriate template in index.html
// and then modify the show* function to give it content at runtime
var experiment = [
	{
		dataType: 'prompt',
		promptText: 'This is a test prompt'
	},
	{
		dataType: 'trial',
		trialText: 'This is a trial',
		trialImage: 'images/elvis/elvis01.jpg'
	},
	{
		dataType: 'trial',
		trialText: 'This is another trial',
		trialImage: 'images/not_elvis/not_elvis01.jpg'
	},
	{
		dataType: 'prompt',
		promptText: 'This is a second test prompt'
	},
	{
		dataType: 'trial',
		trialText: 'This is the last trial',
		trialImage: 'images/elvis/elvis02.jpg'
	}
];

// current experiment step
var experimentProgress = 0;

// create log object
var log = new Object();
log.date = new Date();
log.name = ''
log.experiment = experiment;

// start by rendering the user info form
showUserInfoForm();
