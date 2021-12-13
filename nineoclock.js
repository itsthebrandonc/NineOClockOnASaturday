var $ = function(id) {
  return document.getElementById(id);
}

var videoscreen;
var adjustedDate;
var startTime;
var hitTime;
var worldTimeOffset = 0;
var secondsIntoFilm = -100;

window.onload = function() {
  videoscreen = $("videoscreen");
  //videoscreen.setAttribute("controlslist","nodownload");
  getWorldTime();
  syncUpdate();
}

function getWorldTime() {
  var xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.open("GET", "https://www.worldtimeapi.org/api/timezone/Etc/UTC");
  xhr.send();
  xhr.onload = function() {
    if (this.status === 200) {
      console.log("Successful XML");
      console.log(this.response);
      var worldTime = this.response.unixtime;
      var compareDate = new Date(); //current date IRL
      var compareTime = compareDate.getTime() / 1000; //milliseconds since 01/01/1970
      worldTimeOffset = worldTime - compareTime;
    } else {
      worldTimeOffset = "ERROR";
    }
  }
  setTimeout(getWorldTime,60000); //updates every minute
}

function syncUpdate() {

  var currentDate = new Date(); //current date IRL
  var currentTime = currentDate.getTime(); //milliseconds since 01/01/1970

  if (Math.abs(worldTimeOffset) > 1) {
    currentTime += worldTimeOffset * 1000;
  }

  adjustedDate = new Date(currentTime);
  $("status").innerHTML = "Current Date: " + currentDate + "<br>" + "WorldTimeOffset: " + worldTimeOffset + " <br> " + "Adjusted Date: " + adjustedDate + "<br>";

  if (adjustedDate.getDay() == 1) { //It's on a Saturday
    console.log("It's on a Saturday");
    if (!startTime) {
      //Start date is 8:59:29
      var startDate = new Date(); //Today (Saturday)
      startDate.setHours(16); //20
      startDate.setMinutes(24); //59
      startDate.setSeconds(29); //29
      startTime = startDate.getTime();
    }
    if (!hitTime) {
      //Hit date is 9:00:00
      var hitDate = new Date(); //Today (Saturday)
      hitDate.setHours(16); //21
      hitDate.setMinutes(25); //00
      hitDate.setSeconds(00); //00
      hitTime = hitDate.getTime();
    }

    secondsIntoFilm = (currentTime - startTime) / 1000;
    $("status").innerHTML += "Seconds Into Film: " + secondsIntoFilm + "<br>";

    if ((currentTime - startTime) / 1000 > 0 && (currentTime - startTime) / 1000 < 1) {
      console.log("START");
    }
    if ((currentTime - hitTime) / 1000 > 0 && (currentTime - hitTime) / 1000 < 1) {
      console.log("IT'S NINE O'CLOCK ON A SATURDAY");
    }

  } else {
    console.log("It's not Saturday");
  }

  if (secondsIntoFilm >= 0 && secondsIntoFilm <= 341) { //Sing us a song
    console.log("Video Time: " + secondsIntoFilm);
    videoscreen.seekTo(secondsIntoFilm,false);
    videoscreen.play();
  } else {
    videoscreen.pause();
  }





  setTimeout(syncUpdate,1000); //update every second
}
