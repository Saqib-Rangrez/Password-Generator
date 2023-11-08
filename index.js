const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-Copy]");
const copyMsg = document.querySelector("[data-CopyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbercaseCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBTn = document.querySelector(".GenerateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


let password = "";
let passwordLength = 10;

let checkCount = 0;
// set strength cirle to gray 

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Find random j
        const j = Math.floor(Math.random() * (i + 1));
        // swapping ith and jth value
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// Set Password Length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    // to find size of slider that will be filled with color
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 /(max-min)) + "% 100%";
}
handleSlider();

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0 0 12px 1px ${color}`;    
}

// Default Indicator 
setIndicator("#ccc");

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateNumber() {
    return getRandomInteger(0,9);
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97,122));
}

function generateUperCase() {
    return String.fromCharCode(getRandomInteger(61,90));
}

function generateSymbol() {
    const randNum = getRandomInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbercaseCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }else if ((hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >=6) { 
        setIndicator("#ff0");
    }else {
        setIndicator('#f00');
    }
}

async function copyContent () {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch{
        copyMsg.innerText = "failed";
    }
    // To make copy span visible
    copyMsg.classList.add("active");

    // To remove capied message afetr 2 second
    setTimeout(() => {
        copyMsg.classList.remove("active")
    }, 2000);
} 

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click' , () => {
    if(passwordDisplay.value){
        copyContent();
    }
});

// Handling CheckBoxes
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBox);
});

function handleCheckBox() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    // special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

// Generate Button Function
generateBTn.addEventListener('click', () => {
    console.log("Password Generated");
    // none of checkbox selected
    if(checkCount <= 0) return;
    
    if(passwordLength <= checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    
    // Find new Password
    // First remove old password
    password = "";
    
    let funcArr = [];
    if(uppercaseCheck.checked) {
        funcArr.push(generateUperCase);
    }
    if(lowercaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }
    if(numbercaseCheck.checked) {
        funcArr.push(generateNumber);
    }
    if(symbolsCheck.checked) {
        funcArr.push(generateSymbol);
    }
    
    // compulsory addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    // remaning addition
    for(let i=0; i< passwordLength - funcArr.length; i++){
        let randInd = getRandomInteger(0, funcArr.length);
        password += funcArr[randInd]();
    }

    // shuffle the password
    password = shufflePassword(Array.from(password));
   
    // show in Ui
    passwordDisplay.value = password;

    // strength 
    calcStrength();
}); 