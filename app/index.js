import { me } from "appbit";
import { display } from "display";
import document from "document";
import * as messaging from "messaging";
import * as fs from "fs";
import { inbox } from "file-transfer"

const SETTINGS_TYPE = "json";
const SETTINGS_FILE = `settings.${SETTINGS_TYPE}`

const container = document.getElementById("container");

const noimageView = document.getElementById("noimage-view") ;
const debugView = document.getElementById("debug-view") ;

const imageView = document.getElementById("image-view");
const cardView = document.getElementById("card-view") ;

const image =  document.getElementById("image");
const cardDetail = document.getElementById("cardDetail") ;
const cardNo = cardDetail.getElementById('copy');

let mySettings ;

loadSettings() ;
me.onunload = saveSettings ;

// Get the selected index
//let currentIndex = container.value;

// Set the selected index
container.value = 0; // jump to first slide

// Load settings from filesystem
function loadSettings() {
  console.log("In loadSettings()");
  try {
    mySettings = fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } 
  catch (ex) {
    mySettings = {};
  }
  applySettings();
}

// Save settings to the filesystem
function saveSettings() {
  console.log("In saveSettings()");
  fs.writeFileSync(SETTINGS_FILE, mySettings, SETTINGS_TYPE);
}

function applySettings() {
  console.log("In applySettings()");
  if( mySettings.image && mySettings.image !== ""){
    console.log("Image Loaded");
    image.href = mySettings.image ;
    cardNo.text = mySettings.cardno.substring(0,6) + ' ' + mySettings.cardno.substring(6,11) + ' ' +mySettings.cardno.substring(11)
    hide(noimageView);
    show(imageView) ;
    show(cardView);
    display.autoOff = false;
  }
  else{
    console.log("No Image Loaded");
    hide(imageView);
    hide(cardView);
    show(noimageView);
    display.autoOff = true;
  }
  container.value = 0; // jump to first slide
  saveSettings();
}


// Event occurs when new file(s) are received
inbox.onnewfile = function () {
  console.log("In onnewfile()");
  let fileName;  
  do {
    // If there is a file, move it from staging into the application folder    
    fileName = inbox.nextFile();  
    if(fileName){      
      if( mySettings.image && mySettings.image !== ""){
        if( fileExists(mySettings.image)){
          fs.unlinkSync(mySettings.image);
        }
      }
      mySettings.image = `/private/data/${fileName}` ;
      applySettings();
    }  
  } while (fileName);  
}

messaging.peerSocket.onmessage = function (evt){
  console.log("In onmessage()");
  getValue(evt.data.key, evt.data.value)
  applySettings() ;
}

function getValue(key, value){
  console.log(`In getValue(${key},${JSON.stringify(value)})`);
  if(key === "cardno"){
    if( value.name === ""){
      if( mySettings.image && mySettings.image !== ""){
        fs.unlinkSync(mySettings.image);
      }
      mySettings.image = "" ;
    }
    mySettings.cardno = value.name ;
  }
  if(key === "debug")
    mySettings.debug = value
  if(key === "error")
    mySettings.error = value
}

function hide( elm )
{
  console.log(`In hide(${elm.id})`);
  elm.style.display = "none";  // hidden
}

function show( elm )
{
 console.log(`In show(${elm.id})`);
 elm.style.display = "inline"; // visible
}

function fileExists(fileName){
  console.log(`In fileExist(${fileName})`);
  try {
    fs.readFileSync(fileName);
  }
  catch(ex) {
    return false ;
  }  
  return true ;
}