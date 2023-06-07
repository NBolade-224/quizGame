// Global Variants
const base_url = window.location.origin;
var processedImages = new Set();
var cat = 'Football';

// Set CSS Variable
var cssVars = document.querySelector(':root');
// cssVars.style.setProperty('--width-multiplier', 2);

// Resize all elements Function
function resize() {
    // inner = actual html screen width
    var newWidth = innerWidth;
    var newHeight = innerHeight;
    var monitorWidth = screen.width;
    var monitorHeight = screen.height;
    // screen = monitor screen
    var AllContainers = document.getElementsByClassName("page1");
    for (let i = 0; i < AllContainers.length; i++) {
      AllContainers[i].style.height = `${innerHeight}px`;
      AllContainers[i].style.width = `${innerWidth}px`;
    };
    // Font resize for answers
    var textElements = document.getElementsByClassName("answer");
    for (let i = 0; i < textElements.length; i++) {
      textElements[i].style.fontSize = `${(newWidth+newHeight)/150}px`;
    };
    // Font resize for other smaller text
    var textElements = document.getElementsByClassName("smallerText");
    for (let i = 0; i < textElements.length; i++) {
      textElements[i].style.fontSize = `${(newWidth+newHeight)/200}px`;
    };
    // Widen elements on Landscape (and reverse)
    if (monitorHeight > monitorWidth) {
      cssVars.style.setProperty('--width-multiplier', 2.5);
    } else {
      cssVars.style.setProperty('--width-multiplier', 1);
    };
};

// Update Score
var totalCorrect = 0;
var totalAnswered = 0;
function updateScore(result) {
  totalAnswered = totalAnswered + 1;
  if (result == true) {totalCorrect = totalCorrect + 1};
  document.getElementById('ScoreBoxV2').innerHTML = `${totalCorrect}/${totalAnswered}`;
};

// Reset Score
function resetScore() {
  totalCorrect = 0;
  totalAnswered = 0;
  document.getElementById('ScoreBoxV2').innerHTML = `${totalCorrect}/${totalAnswered}`;
  processedImages = new Set();
  fetchBadge();
}

// Submit Answer
var correctAnswer = "";
async function submitAnswer(number) {
  const text1 = "answer";
  var userAnswer = document.getElementById(text1.concat(number)).innerHTML;
  if (userAnswer == correctAnswer) {
    console.log('Answer was correct');
    document.getElementById(text1.concat(number)).style.backgroundColor = "green";
    updateScore(true);
  } else {
    document.getElementById(text1.concat(number)).style.backgroundColor = "red";
    console.log('Answer was incorrect');
    updateScore(false);
  }
  for (const x of document.getElementsByClassName("answer")) {
    if (x.innerHTML == correctAnswer) {x.style.backgroundColor = "green";}
    x.disabled = true;
  }
;
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1 sec
  fetchBadge();
}

// Async Fetch (awaits before continuing)
async function fetchBadge() {
  // Get filter Selectors for next Bad
  var group = document.getElementById("teamSelect").value
  // Reset Color and Disable Status of Answer Boxes
  for (const x of document.getElementsByClassName("answer")) {
    x.style.backgroundColor = "";
    x.disabled = false;
  }
  // Fetch new Image from API
  var response = await fetch(`${base_url}/badge?rand=${Math.random()}&cornm=${totalCorrect}&group=${group}&processed=${Array.from(processedImages)}&cat=${cat}`);
  var [badge,randlist,ad21] = await response.json();
  correctAnswer = ad21;
  // Assign Badge Image and Answers to HTML Tags
  document.getElementById("badgeImage").src = badge;
  document.getElementById("answer1").innerHTML = randlist[0].substring(0, randlist[0].length - 4);
  document.getElementById("answer2").innerHTML = randlist[1].substring(0, randlist[1].length - 4);
  document.getElementById("answer3").innerHTML = randlist[2].substring(0, randlist[2].length - 4);
  document.getElementById("answer4").innerHTML = randlist[3].substring(0, randlist[3].length - 4);
  // add Answer to processed Answers
  if (processedImages.has(badge.slice(13)) == true || badge.slice(13) == 'Ai Hoshino.jpg') {
    processedImages = new Set()
  };
  processedImages.add(badge.slice(13));
}

// Add Event listeners to each Navbar button to highlight active page
for (const eachbutton of document.getElementsByClassName("TitleBarButtons")) {
  eachbutton.addEventListener("click",  function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
    cat = this.textContent;
    fetchBadge();
  });
}

// Listener to Resize all elements
document.getElementById("teamSelect").addEventListener("change", 
fetchBadge
);
window.addEventListener("DOMContentLoaded", 
  resize
);
window.addEventListener("DOMContentLoaded", 
  fetchBadge
);
window.addEventListener("resize",
  resize
);
// log to confirm JavaScript has fully loaded
console.log(`Java Script Load Complete`);

// Delete Elements (called by Generator functions below)
function deleteElements() {
  for (const optionElement of document.querySelectorAll("#teamSelect option")) {
    optionElement.remove();
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
// Generete Elements
function generateFootballTeams() {
  deleteElements();
  document.getElementById("badgeImage").style.border = "5px solid transparent";
  document.getElementById("mainpage").style.backgroundImage = "url('/background?type=footballbackground')";
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"All Teams",'all'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"Man City",'mancity'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"Arsenal",'arsenal'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"Aston Villa",'astonvilla'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"Bournemouth",'bournemouth'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"Brentford",'brentford'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"Brighton",'brighton'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"Chelsea",'chelsea'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"Crystal Palace",'crystalpalace'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"Everton",'everton'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"Fulham",'fulham'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"Leeds",'leeds'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"Man Utd",'manutd'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"Notts Forest",'nottsforest'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"Southampton",'southampton'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"Tottenham",'tottenham'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"Westham",'westham'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"Wolves",'wolves'];
  document.getElementById("teamSelect").appendChild(newElement);
}

function generateAnime() {
  deleteElements();
  document.getElementById("badgeImage").style.border = "5px solid rgb(36, 11, 222)";
  // document.getElementById("badgeImage").style.background = "rgb(96, 11, 222)";
  document.getElementById("mainpage").style.backgroundImage = "url('/background?type=animebackground')";
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"All",'all'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"Fate/Zero",'fatezero'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"Code Geass",'codegeass'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"Re:Zero",'rezero'];
  document.getElementById("teamSelect").appendChild(newElement);
}

function generateKpop() {
  deleteElements();
  document.getElementById("badgeImage").style.border = "5px solid rgb(96, 11, 222)";

  document.getElementById("mainpage").style.backgroundImage = "url('/background?type=kpopbackground')";
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"All",'all'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"Red Velvet",'redvelvet'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"Twice",'twice'];
  document.getElementById("teamSelect").appendChild(newElement);
  [newElement,newElement.text,newElement.value] = [document.createElement("option"),"BLACKPINK",'blackpink'];
  document.getElementById("teamSelect").appendChild(newElement);
}