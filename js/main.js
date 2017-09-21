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
	//console.log(mouseData.x, mouseData.y);
	log.experiment[experimentProgress].mouse.push(mouseData);
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
	t.content.querySelector('#prompt-title').textContent = prompt.promptTitle;
	t.content.querySelector('#prompt-text').textContent = prompt.promptText;
	var clone = document.importNode(t.content, true);
	contentBlock.appendChild(clone);
}

// shows a trial by adding the necessary content to the trial template
function showTrial(trial) {

	// add data about trial to template
	var t = document.querySelector('#trial');
	t.content.querySelector('#trial-text').textContent = trial.trialText;
	if (trial.flag) {
		t.content.querySelector('#flag').style.visibility = "visible";
	}
	t.content.querySelector('#trial-image').src = trial.trialImage;
	var clone = document.importNode(t.content, true);
	contentBlock.appendChild(clone);

	// add click listeners to option buttons
	var optionButtons = document.querySelectorAll('.option');
	for (var i = 0; i < optionButtons.length; i++) {
		optionButtons[i].addEventListener('click', function() { makeTrialSelection(this.id); });
	}

	// add mouse tracking
	log.experiment[experimentProgress].mouse = [];
	document.addEventListener('mousemove', recordMousePosition);
}

// called when an option is selected for a trial
function makeTrialSelection(id) {

	// stop tracking mouse movement
	document.removeEventListener('mousemove', recordMousePosition);

	// store the user's action
	if (id == "optionA") log.experiment[experimentProgress].action = "optionA";
	if (id == "optionB") log.experiment[experimentProgress].action = "optionB";

	// move to the trial results
	clearContent();
	showTrialComplete();
}

// shows the result at the end of the trial
function showTrialComplete() {
	var t = document.querySelector('#trial-complete');
	t.content.querySelector('#trial-text').textContent = experiment[experimentProgress].trialText;
	t.content.querySelector('#trial-image').src = experiment[experimentProgress].trialImage;
	//t.content.querySelector('#trial-result').textContent = "Was this right? who knows?";
	var clone = document.importNode(t.content, true);
	contentBlock.appendChild(clone);
}

// a utility functiont to empty the content block
function clearContent() {
	contentBlock.innerHTML = '';
}

// move the experiment forward
function advanceExperiment() {
	clearContent();
	experimentProgress++;
	if (experimentProgress < experiment.length) showExperimentBlock(experimentProgress);
	else completeExperiment();
}

// render the experiment step we are currently at
function showExperimentBlock(i) {
	if (experiment[i].dataType == 'prompt') showPrompt(experiment[i]);
	if (experiment[i].dataType == 'trial') showTrial(experiment[i]);
}

var contentBlock = document.querySelector('#content');

// this function creates the experiment array
function createExperiment() {
	var experiment = []

	// generate first set of trials
	var correctImageProbability = 0.8;
	var correctLabelingProbabiilty = 0;
	var imgCat = 'owl'

	var prompt = {}
	prompt.dataType = 'prompt';
	prompt.promptTitle = 'Trial Run'
	prompt.promptText = 'We would like to observe how quickly people can categorize images. In the following screens, you’ll see a series of images categorized as owls. Please select “Owl” (left) or “Not Owl” (right) as quickly as possible. This is a trial run and no results are recorded.'
	experiment.push(prompt);

	for (var i = 0; i < 10; i++) {
		var trial = {}
		trial.dataType = 'trial';

		var imgPath = ''
		if (Math.random() < correctImageProbability) {
			imgPath = 'images/' + imgCat + '/' + imgCat + Math.floor((Math.random() * 6) + 1) + '.jpg';
		} else {
			imgPath = 'images/not_' + imgCat + '/' + 'not_' + imgCat + Math.floor((Math.random() * 4) + 1) + '.jpg';
		}
		trial.trialImage = imgPath;
		trial.trialText = "Is this an owl?";

		if (Math.random() < correctLabelingProbabiilty) {
			trial.showFlag = false;
		} else {
			trial.nextag = true;
		}

		experiment.push(trial)
	}

	// generate second set of trials
	var correctImageProbability = 0.8;
	var correctLabelingProbabiilty = 0.9;
	var imgCat = 'elvis'

	var prompt = {}
	prompt.dataType = 'prompt';
	prompt.promptTitle = 'Is this elvis?'
	experiment.push(prompt);

	for (var i = 0; i < 10; i++) {
		var trial = {}
		trial.dataType = 'trial';

		var imgPath = ''
		if (Math.random() < correctImageProbability) {
			imgPath = 'images/' + imgCat + '/' + imgCat + Math.floor((Math.random() * 25) + 1) + '.jpg';
		} else {
			imgPath = 'images/not_' + imgCat + '/' + 'not_' + imgCat + Math.floor((Math.random() * 11) + 1) + '.jpg';
		}
		trial.trialImage = imgPath;
		trial.trialText = "Is this Elvis?";

		if (Math.random() < correctLabelingProbabiilty) {
			trial.showFlag = false;
		} else {
			trial.showFlag = true;
		}

		experiment.push(trial)
	}

	// generate third set of trials
	var correctImageProbability = 0.8;
	var correctLabelingProbabiilty = 0.9;
	var imgCat = 'hotdog'

	var prompt = {}
	prompt.dataType = 'prompt';
	prompt.promptTitle = 'Are these hot dogs?'
	experiment.push(prompt);

	for (var i = 0; i < 10; i++) {
		var trial = {}
		trial.dataType = 'trial';

		var imgPath = ''
		if (Math.random() < correctImageProbability) {
			imgPath = 'images/' + imgCat + '/' + imgCat + Math.floor((Math.random() * 23) + 1) + '.jpg';
		} else {
			imgPath = 'images/not_' + imgCat + '/' + 'not_' + imgCat + Math.floor((Math.random() * 7) + 1) + '.jpg';
		}
		trial.trialImage = imgPath;
		trial.trialTitle = "Is this a hot dog?";

		if (Math.random() < correctLabelingProbabiilty) {
			trial.showFlag = false;
		} else {
			trial.showFlag = true;
		}

		experiment.push(trial)
	}

	// generate fourth set of trials
	var correctImageProbability = 0.8;
	var correctLabelingProbabiilty = 0.9;
	var imgCat = 'dog'

	var prompt = {}
	prompt.dataType = 'prompt';
	prompt.promptTitle = 'Are these dogs?'
	experiment.push(prompt);

	for (var i = 0; i < 10; i++) {
		var trial = {}
		trial.dataType = 'trial';

		var imgPath = ''
		if (Math.random() < correctImageProbability) {
			imgPath = 'images/' + imgCat + '/' + imgCat + Math.floor((Math.random() * 23) + 1) + '.jpg';
		} else {
			imgPath = 'images/not_' + imgCat + '/' + 'not_' + imgCat + Math.floor((Math.random() * 7) + 1) + '.jpg';
		}
		trial.trialImage = imgPath;
		trial.trialText = "Is this a dog?";

		if (Math.random() < correctLabelingProbabiilty) {
			trial.showFlag = false;
		} else {
			trial.showFlag = true;
		}

		experiment.push(trial)
	}

	return experiment;
}

experiment = createExperiment();

// current experiment step
// (this starts at -1 because we start at the user info form, which calls advanceExperiment() which increments
// this before it actually renders anything)

var experimentProgress = -1;

// create log object
var log = new Object();
log.date = new Date();
log.experiment = experiment;

// start by rendering the user info form
showUserInfoForm();
