// Send data to be logged
function postData(logObject) {
	var logJSON = JSON.stringify(logObject);
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "./log.php", true);
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
	// log.email = document.querySelector('#email').value;
	log.device = document.querySelector('#device').value;
	advanceExperiment();
	return false;
}

// shows a prompt by adding the necessary content to the prompt template
function showPrompt(prompt) {
	var t = document.querySelector('#prompt');
	t.content.querySelector('#prompt-title').textContent = prompt.promptTitle;
	t.content.querySelector('#prompt-text').textContent = prompt.promptText;
	t.content.querySelector('#prompt-image').src = prompt.promptImage;
	var clone = document.importNode(t.content, true);
	contentBlock.appendChild(clone);
}

// shows a trial by adding the necessary content to the trial template
function showTrial(trial) {

	// add data about trial to template
	var t = document.querySelector('#trial');
	t.content.querySelector('#trial-text').textContent = trial.trialText;
	if (trial.flag == null) {
		t.content.querySelector('#flag').style.visibility = "hidden";
	} else {
		t.content.querySelector('#flag').style.visibility = "visible";
		if (trial.flag == true) {
			t.content.querySelector('#flag').textContent = "Likely correct";
			t.content.querySelector('#flag').className = 'w3-tag flagCorrect';
		} else {
			t.content.querySelector('#flag').textContent = "Likely incorrect";
			t.content.querySelector('#flag').className = 'w3-tag flagIncorrect';
		}

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

// helper function returns randomly-ordered array
function image_list(imgCat, correct, count) {
	// empty array for list
	list = [];
	var num = 0;
	var imgPath = '';
	// Continues until list is desired length.
	for (var i = 1; i <= count; i++){
		if (correct == true) {
			imgPath = 'images/' + imgCat + '/' + imgCat + i + '.jpg';
		} else {
			imgPath = 'images/not_' + imgCat + '/' + 'not_' + imgCat + i + '.jpg';
		}
		list.push(imgPath)
	}

	// Shuffle
	for (var i = list.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = list[i];
        list[i] = list[j];
        list[j] = temp;
    }
	console.log(list)
	console.log(list.length)
	return list
}

// function for looping a trial
function createTrial( correctImageProbability, correctLabelingProbability, imgCat, prompt, question, experiment, correct, incorrect) {
	// Get list of img paths
	correctImages = image_list(imgCat, true, correct)
	incorrectImages = image_list(imgCat, false, incorrect)

	// 10 images per round
	for (var i = 0; i < 10; i++) {
		var trial = {}
		trial.dataType = 'trial';

		var imgPath = ''
		if (Math.random() < correctImageProbability) {
			imgPath = correctImages.pop()
			correctImages.unshift(imgPath) // ! so list never becomes empty
			trial.flag = (Math.random() < correctLabelingProbability) ? trial.flag = false : trial.flag = true;
		} else {
			imgPath = incorrectImages.pop()
			incorrectImages.unshift(imgPath) // ! so list never becomes empty
			trial.flag = (Math.random() < correctLabelingProbability) ? trial.flag = true : trial.flag = false;
		}
		// Exception for owl images - no flags in either scenario
		if (imgCat == 'owl') {trial.flag = null;}
		trial.trialImage = imgPath;
		trial.trialText = question;

		experiment.push(trial)
	}
}

// function for making one experiment
function createExperiment() {

	var experiment = [];
	// generate first set of trials
	var correctImageProbability = 0.6;
	var correctLabelingProbability = 1;
	var imgCat = 'owl';

	var prompt = {}
	prompt.dataType = 'prompt';
	prompt.promptTitle = 'Trial Run'
	prompt.promptText = 'We would like to observe how quickly people can categorize images. In the following screens, you’ll see a series of images categorized as owls. Please select “Owl” (left) or “Not Owl” (right) as quickly and as accurately as possible. This is a trial run and no results are recorded.'
	prompt.promptImage = 'images/tutorial/tutorial_owl.jpg'
	experiment.push(prompt);

	createTrial( correctImageProbability, correctLabelingProbability, imgCat, prompt, "Is this an owl?", experiment, 6, 4);

	// generate second set of trials
	var correctImageProbability = 0.7;
	var correctLabelingProbability = 0.9;
	var imgCat = 'Elvis'

	var prompt = {}
	prompt.dataType = 'prompt';
	prompt.promptTitle = 'Is this Elvis?'
	prompt.promptText = 'You’ll see a series of images categorized as Elvis. Please select if you think each image is actually Elvis ("Yes" on the left, "No" on the right). We’ve developed an image-classification bot to help you — it will label dubious images with a yellow marker, and likely images with a grey marker.'
	prompt.promptImage = 'images/tutorial/tutorial_Elvis.jpg'
	experiment.push(prompt);

	createTrial( correctImageProbability, correctLabelingProbability, imgCat, prompt, "Is this Elvis?", experiment, 10, 3);

	// generate third set of trials
	var correctImageProbability = 0.7;
	var correctLabelingProbability = 0.9;
	var imgCat = 'hotdog'

	var prompt = {}
	prompt.dataType = 'prompt';
	prompt.promptTitle = 'Are these hot dogs?'
	prompt.promptText = 'You’ll see a series of images categorized as hot dogs. Please select if you think each image is actually a hotdog ("Yes" on the left, "No" on the right). We’ve developed an image-classification bot to help you — it will label dubious images with a yellow marker, and likely images with a grey marker.'
	prompt.promptImage = 'images/tutorial/tutorial_hotdog.jpg'
	experiment.push(prompt);

	createTrial( correctImageProbability, correctLabelingProbability, imgCat, prompt, "Is this a hot dog?", experiment, 10, 3);

	// generate fourth set of trials
	var correctImageProbability = 0.7;
	var correctLabelingProbability = 0.9;
	var imgCat = 'dog'
	var prompt = {}

	prompt.dataType = 'prompt';
	prompt.promptTitle = 'Are these dogs?'
	prompt.promptText = 'You’ll see a series of images categorized as dogs. Please select if you think each image is actually a dog ("Yes" on the left, "No" on the right). We’ve developed an image-classification bot to help you — it will label dubious images with a yellow marker, and likely images with a grey marker.'
	prompt.promptImage = 'images/tutorial/tutorial_dog.jpg'
	experiment.push(prompt);

	createTrial( correctImageProbability, correctLabelingProbability, imgCat, prompt, "Is this a dog?", experiment, 7, 3);

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
