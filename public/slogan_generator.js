var sloganText;
var sloganString;

function shuffle(array) {
		var i = array.length,
				j = 0,
				temp;

		while (i--) {

				j = Math.floor(Math.random() * (i+1));

				// swap randomly chosen element with current element
				temp = array[i];
				array[i] = array[j];
				array[j] = temp;

		}

		return array;
}

function capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
}

//Firstword the thirdword

function slogan1() {

firstWord = ['Stop','Axe','Improve','Fix','Build','Cut','Save','Kickstart','Reduce','Return','Share','Reduce','Move','Create','End','Change','Jump','Ride','Encourage','Prevent','Nurture','Expand'];

lastWord = ["boats","tax","change","hope","trust","future","budget","economy","environment","cars","crime","deficit","surplus","smugglers","lies","waste","internet","growth","highways","roads","schools","hospitals","refugees","retirees","slogans","bastards","trees","bureaucrats","bush","trains","wilderness","red tape","coal","mines","banks","honesty","emissions","selfies","hipsters","onesies","blue-ties","brexit","battlers","tradies"];


var firstLength = firstWord.length;
var lastLength = lastWord.length;
var firstVar = Math.floor(Math.random()*(firstLength));
var lastVar = Math.floor(Math.random()*(lastLength));

sloganText = '"' + firstWord[firstVar] + ' the ' + lastWord[lastVar] + '"';

	return sloganText;
}

//Firstword on thirdword

function slogan2() {

firstWord = ['Tough','Strong','Better','Trusted','Keen','Proven','Safe','Fair','Genuine','Imaginative','Practical','Upfront','Cooler','Creative','Transparent','Tenacious','Unyielding','Solid','Hard-as-nails','Muscular','Fair-dinkum','Right','Left','Exuberant','Zealous','Fanatical','Working','True-blue','Dinky-di','Ambivalent'];

lastWord = ['crime','smugglers','deficits','trust','truth','crime','surpluses','lies','carbon','waste','highways','roads','schools','hospitals','refugees','Greens','schools','playgrounds','immigrants','trees','votes','animals','kangaroos','trains','bureaucracy','society','coal','mining','families','business','banks','money','economics','fraud','GetUp','honesty','retirement','superannuation','internets','New England','America','Rudd','Abbott','Turnbull','Shorten','politics','emissions','vegetables','Twitter','Facebook','Instagram','boats','tents','quinoa','hipsters','youth','kale','brexit','battlers','tradies'];

var firstLength = firstWord.length;
var lastLength = lastWord.length;
var firstVar = Math.floor(Math.random()*(firstLength));
var lastVar = Math.floor(Math.random()*(lastLength));

sloganText = '"' + firstWord[firstVar] + ' on ' + lastWord[lastVar] + '"';

	return sloganText;

}

//A secondword thirdword

function slogan3() {

secondWord = ['kinder','softer','better','trustworthy','brighter','cleaner','smoother','stronger','new','tired','bigger','longer','smaller','harder','catastrophic ','fuller','fairer','productive','simple','brighter','happier','crueller','compassionate','kind-hearted','benevolent','bleeding-heart','friendlier','better','connected','networked','mindful','awesome','radical','impressive','astounding','fearless','amazing','good','bad','worse','benign','positive'];

lastWord = ['America','future','country','people','Labor','government','Coalition','past','industry','world','universe','economy','hope','business','NBN','way','day','morning','community','Asia-Pacific','world','vision','neighbourhood','bush','existence','future','Liberal','society','wilderness','present','era','epoch','time','internet','plan','brexit'];

var firstLength = secondWord.length;
var lastLength = lastWord.length;
var firstVar = Math.floor(Math.random()*(firstLength));
var lastVar = Math.floor(Math.random()*(lastLength));

word = secondWord[firstVar];
firstLetter = (word.charAt(0));

if (firstLetter == 'a' || firstLetter == 'i' || firstLetter == 'e' || firstLetter == 'o' || firstLetter == 'u') {

firstWord = "An"

}

else {

	firstWord = "A"

}

sloganText = '"' + firstWord + " " + secondWord[firstVar] + " " + lastWord[lastVar] + '"';

	return sloganText;

}


function slogan4() {

	words = ["jobs","retirees","roads","schools","growth","taxes","highways","hospitals","playgrounds","refugees","prisons","boats","banks","trains","stadiums","trees","coal","solar","renewables","bureaucrats","cows","sheep","emissions","slogans","lies","internet","vegetables","gas","quinoa","kale","apprenticeships","youth","houses","politicians","punters","battlers","tradies"];

	shuffledWords = shuffle(words);
	sloganText = '"' + shuffledWords[0] + " and " + shuffledWords[1] + '"';

	return sloganText;

}



//Randomly pick a slogan type

function getSlogan() {

var chooseSlogan = Math.floor(Math.random()*(4));

if (chooseSlogan == 0) {
	return slogan1();
}

else if (chooseSlogan == 1) {
	return slogan2();
}

else if (chooseSlogan == 2) {
	return slogan3();
}

else if (chooseSlogan == 3) {
	return slogan4();
}

}
