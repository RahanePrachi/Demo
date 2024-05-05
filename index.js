const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-cpyMsg]");
const uppercaseCheck= document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let passwordLength=10;
let checkCount=1;
handleSlider();
setIndicator("#ccc");
//set strength circle color to gray


//set passwordlength
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength
    //or kuch bhi karna chahiye?
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}
function generateRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode((getRndInteger(97,123)));
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function generateSymbol(){
    const randNum=getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}
function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSyn=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSyn=true;

    if(hasUpper && hasLower && hasNum && hasSyn && passwordLength>=8){
        setIndicator("#00ff00")
    }
    
    else if(
        ((hasLower && hasUpper && hasNum) ||
        (hasLower && hasUpper && hasSyn) ||
        (hasNum && hasSym &&  hasLower) ||
        (hasNum && hasSym &&  hasUpper)) &&
         passwordLength >= 8
    ){
        setIndicator("#00ff00")
    }
    else if(
        ((hasLower && hasUpper && hasNum) ||
        (hasLower && hasUpper && hasSyn) ||
        (hasNum && hasSym &&  hasLower) ||
        (hasNum && hasSym &&  hasUpper)) &&
         passwordLength < 8
    ){
        setIndicator("#ff0")
    }
    else if(hasUpper || hasLower || hasNum || hasSyn ){
        setIndicator("#f00");
    }
    else if (
        ((hasLower && hasUpper) ||
        (hasLower && hasNum) ||
        (hasLower && hasSyn) ||
        (hasNum && hasSym)||
        (hasNum && hasUpper) || (hasUpper && hasSym)) &&
        passwordLength >= 9){
        setIndicator("#ff0");
      }
    else if (
        ((hasLower && hasUpper) ||
        (hasLower && hasNum) ||
        (hasLower && hasSyn) ||
        (hasNum && hasSym)||
        (hasNum && hasUpper) || (hasUpper && hasSym)) &&
        passwordLength <= 8){
        setIndicator("#f00");
    }

    else {
        setIndicator("#ff0000");
      }
}
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    copyMsg.classList.add("active");

    setTimeout(() =>{
        copyMsg.classList.remove("active")
    },2000)
}
function shufflePassword(array){
    //fisher yates Method
    for(let i=array.lenght-1; i>0; i--){
        //random  J , find out using random function
        const j= Math.floor(Math.random()* (i+1));
        //swap number at i index and j index
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=> (str+=el));
    return str;
}

inputSlider.addEventListener('input' , (e)=>{
    data-lengthSlider
    handleSlider();
})
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})
generateBtn.addEventListener('click', ()=>{
    //none of the checkbox are selected
    if(checkCount==0){
        return ;
    }
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    //let's start the journey to find new password
    console.log("starting the journey.");
    //remove old password
    password="";

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("compulsary addition done.");

    // remaining addition
    
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex=getRndInteger(0, funcArr.length);
        console.log("randIndex "+ randIndex);
        password+=funcArr[randIndex]();
    }
    //shuffle the password
    password=shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value=password;
    console.log("UI addition done");
    //clculate strength
    calcStrength();

}); 