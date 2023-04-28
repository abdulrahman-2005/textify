const userInputTextarea = document.querySelector("#user-input-textarea");

const fromText = document.querySelector("#text-from");
const toText = document.querySelector("#text-to");
const keepCaseCheckbox = document.querySelector("#text-keepcase");
const keepWordCheckbox = document.querySelector("#text-keepword");

let originalText = [];
let textValue = "";
let keepcase = false;
let lastCursorPos = 0;

function hasValue(el) {
	return el.value !== "";
}

function apply(type) {
	if (
		!hasValue(userInputTextarea) ||
		(!hasValue(fromText) && hasValue(toText))
	) {
		alert("no Input provided");
		return;
	}

	textValue = userInputTextarea.value;
	if (type === "remove" && hasValue(fromText)) {
		originalText.push(textValue);

		if (keepCaseCheckbox.checked) {
			textValue = textValue.replaceAll(fromText.value, "");
		} else {
			textValue = textValue
				.toLowerCase()
				.replaceAll(fromText.value.toLowerCase(), "");
		}
		userInputTextarea.value = textValue;
	} else if (type === "replace" && hasValue(fromText) && hasValue(toText)) {
		originalText.push(textValue);
		textValue = textValue.replaceAll(fromText.value, toText.value);
		userInputTextarea.value = textValue;
		return;
	}
}

function back() {
	if (originalText.length === 0) {
		alert("no changes to revert");
		return;
	}
	userInputTextarea.value = originalText.pop();
	return;
}

function copy() {
	navigator.clipboard.writeText(userInputTextarea.value);
	alert("text copied to clipboard");
}

function reset() {
	userInputTextarea.value = "";
	originalText = [];
	lastCursorPos = 0;
	keepCaseCheckbox.checked = false;
	keepWordCheckbox.checked = false;
	fromText.value = "";
	toText.value = "";
}

function clear_() {
	if (hasValue(userInputTextarea)) {
		originalText.push(userInputTextarea.value);
	}
	userInputTextarea.value = "";
}

function moveCursorToNextOccurence() {
	userInputTextarea.focus();
	console.log("moving next");

	let text = userInputTextarea.value;
	let from = fromText.value;
	let to = toText.value;

	let keepcase = keepCaseCheckbox.checked;

	if (!keepcase) {
		text = text.toLowerCase();
		from = from.toLowerCase();
		to = to.toLowerCase();
	}

	let fromIndex = text.indexOf(from, lastCursorPos);
	let toIndex = text.indexOf(to, fromIndex + from.length);

	if (fromIndex === -1 || toIndex === -1) {
		alert("No occurrence found");
		return;
	}

	let newIndex = toIndex + to.length;
	userInputTextarea.selectionStart = newIndex;
	userInputTextarea.selectionEnd = newIndex;
	lastCursorPos = newIndex;
}

function moveCursorToPreviousOccurence() {
	userInputTextarea.focus();
	console.log("moving previous");

	let text = userInputTextarea.value;
	let from = fromText.value;
	let to = toText.value;

	let keepcase = keepCaseCheckbox.checked;

	if (!keepcase) {
		text = text.toLowerCase();
		from = from.toLowerCase();
		to = to.toLowerCase();
	}

	let fromIndex = text.lastIndexOf(from, lastCursorPos - from.length - 1);
	let toIndex = text.indexOf(to, fromIndex + from.length);

	if (fromIndex === -1 || toIndex === -1) {
		alert("No occurrence found");
		return;
	}

	let newIndex = toIndex + to.length;
	userInputTextarea.selectionStart = newIndex;
	userInputTextarea.selectionEnd = newIndex;
	lastCursorPos = newIndex;
}

function capitalize_() {
	if (!hasValue(userInputTextarea)) {
		alert("no Input provided");
		return;
	}

	textValue = userInputTextarea.value;
	originalText.push(textValue);
	userInputTextarea.value = textValue.toUpperCase();
}

function lowerize_() {
	if (!hasValue(userInputTextarea)) {
		alert("no Input provided");
		return;
	}

	textValue = userInputTextarea.value;
	originalText.push(textValue);
	userInputTextarea.value = textValue.toLowerCase();
}

function capitalizeSentences(text) {
	let sentences = text.split(/(?<=\.|\?|\!)\s*/);

	for (let i = 0; i < sentences.length; i++) {
		sentences[i] =
			sentences[i].charAt(0).toUpperCase() +
			sentences[i].slice(1).toLowerCase();
	}

	return sentences.join(" ");
}
function proper_() {
	if (!hasValue(userInputTextarea)) {
		alert("no Input provided");
		return;
	}

	textValue = userInputTextarea.value;
	originalText.push(textValue);

	if (keepWordCheckbox.checked) {
		let output = ``;
		for (i of textValue.split(" ")) {
			output +=
				i.charAt(0).toUpperCase() + i.slice(1).toLowerCase() + " ";
		}
		userInputTextarea.value = output;
		return;
	}

	userInputTextarea.value = capitalizeSentences(textValue);
}

function reverse_() {
	if (!hasValue(userInputTextarea)) {
		alert("no Input provided");
		return;
	}
	textValue = userInputTextarea.value;
	originalText.push(textValue);

	if (keepWordCheckbox.checked) {
		let output = ``;
		for (i of textValue.split(" ")) {
			output += i.split("").reverse().join("") + " ";
		}
		userInputTextarea.value = output;
		return;
	}

	userInputTextarea.value = textValue.split("").reverse().join("");
}

function random_() {
	if (!hasValue(userInputTextarea)) {
		alert("no Input provided");
		return;
	}

	textValue = userInputTextarea.value;
	originalText.push(textValue);

	let output = ``;
	for (let i = 0; i < textValue.length; i++) {
		if (Math.random() < 0.5) {
			output += textValue[i].toUpperCase();
		} else {
			output += textValue[i].toLowerCase();
		}
	}
	userInputTextarea.value = output;
	return output;
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function dance_() {
	if (!hasValue(userInputTextarea) || !hasValue(toText)) {
		alert("no Input provided");
		return;
	}

	originalText.push(userInputTextarea.value);

	let to_int;
	try {
		to_int = parseInt(toText.value);
	} catch (error) {
		alert("[text to] must be a number");
		return;
	}

	for (let i = 0; i < to_int; i++) {
		userInputTextarea.value = random_(userInputTextarea.value);
		await sleep(100);
	}
}

const fileInput = document.getElementById("image-input");

function getFile() {
	fileInput.click();
}

fileInput.onchange = asciify_;

function asciify_() {
	const file = fileInput.files[0];
	imageToAscii(file)
		.then((ascii) => {
			userInputTextarea.value = ascii;
			console.log(ascii);
		})
		.catch((error) => console.error(error));
}
function imageToAscii(file, cols = 45, rows = 20) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = function () {
			const image = new Image();

			image.crossOrigin = "Anonymous";

			image.onload = function () {
				const canvas = document.createElement("canvas");
				canvas.width = cols;
				canvas.height = rows;

				const ctx = canvas.getContext("2d");
				ctx.drawImage(image, 0, 0, cols, rows);

				const imageData = ctx.getImageData(0, 0, cols, rows);
				const data = imageData.data;

				let ascii = "";
				for (let i = 0; i < data.length; i += 4) {
					// Calculate the average brightness of the pixel
					const brightness =
						(data[i] + data[i + 1] + data[i + 2]) / 3;

					// Map the brightness to an ASCII character
					const asciiChar =brightness < 16? "@": brightness < 32? "#": brightness < 48? "$": brightness < 64? "%": brightness < 80? "&": brightness < 96? "X": brightness < 112? "O": brightness < 128? "o": brightness < 144? ".": brightness < 160? " ": brightness < 176? ",": brightness < 192? "^": brightness < 208? "s": brightness < 224? "*": "`";
					// Add the ASCII character to the output string
					ascii += asciiChar;
					if ((i + 4) % (4 * cols) === 0) {
						ascii += "\n";
					}
				}
				resolve(ascii);
			};

			image.onerror = function () {
				reject(new Error("Failed to load image"));
			};
			image.src = reader.result;
		};

		reader.onerror = function () {
			reject(new Error("Failed to load file"));
		};

		reader.readAsDataURL(file);
	});
}

function selectionLength() {
	let selection = window.getSelection();
	let text = selection.toString();
	alert(text.length);
}

