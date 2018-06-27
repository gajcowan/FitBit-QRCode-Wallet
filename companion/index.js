import { outbox } from "file-transfer"
import * as messaging from "messaging";
import { settingsStorage } from "settings";

settingsStorage.onchange = function(evt){
  if (evt.oldValue !== evt.newValue) {
    switch(evt.key){
      case "cardno" :
        let name = JSON.parse(evt.newValue).name
        if(name  !== ""){
          sendQRCode(name) ;
          sendValue(evt.key, evt.newValue );
        }
        break;
      case "debug" :
        sendValue(evt.key, evt.newValue );
        break;
    }
  }
}

function sendValue(key, val) {
    console.log(`Sending Data: ${key} = ${val}`) ;
    sendSettingData({
      key: key,
      value: JSON.parse(val)
    });
}


function sendSettingData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("No peerSocket connection");
  }
}

function sendQRCode(cardno) {
  // Clear any existing Error 
  sendValue("error", JSON.stringify(""));
  
  let url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=10&ecc=H&data=${cardno}&format=jpeg` ;

  // Destination filename
  let fileName = `qrcode-${cardno}.jpg`;

  // Fetch the image from the internet
  fetch(url).then(function (response) {
    // We need an arrayBuffer of the file contents
    return response.arrayBuffer();
  }).then(function (data) {
    // Queue the file for transfer
    outbox.enqueue(fileName, data).then(function (ft) {
      // Queued successfully
      console.log("Transfer of '" + fileName + "' successfully queued.");
      return true ;
    }).catch(function (error) {
      //sendValue("error", error);
      // Failed to queue
      throw new Error("Failed to queue '" + fileName + "'. Error: " + error);
    });
  }).catch(function (error) {
    // Log the error
    sendValue("error", JSON.stringify(error.message + " " + url));
    console.log("Failure: " + error);
  });
}
