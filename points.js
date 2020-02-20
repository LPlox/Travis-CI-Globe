//===================================================== Websocket data
// if (window.location.protocol == "https:") {
//     protocol = "wss";
//   }

//   function startWS() {
//     ws = new WebSocket("wss://travis.durieux.me");
//     if (onmessage != null) {
//       ws.onmessage = onmessage;
//     }
//     ws.onclose = function() {
//       // Try to reconnect in 5 seconds
//       setTimeout(function() {
//         startWS();
//       }, 5000);
//     };
//   }
//===================================================== Travis data
const commitArray = [];
let arrCount = 0;
const arrMax = 200;
let newObject;

function fetchData() {
  fetch("./dataset/435226515-435230014.json")
    .then(response => response.json())
    .then(data => {
      //================================================= Create dataset
      for (x in data) {
        const user = data[x].commit.author_name;
        const commitTime = data[x].commit.committed_at;
        const commitHour = commitTime ? commitTime.substring(11, 13) : null;
        const commitYear = commitTime ? commitTime.substring(0, 4) : null;
        const newRadius = commitYear ? checkYear(commitYear) : null;
        const timeLati = generateLatitude();
        const timeLong = commitTime
          ? generateLongitude(
              timeZones[timeZones.findIndex(time => time.hour == commitHour)]
                .startLongitude
            )
          : null;

        createNewObject(user, timeLati, timeLong, newRadius);
      }
    });
}
//================================================= Creates new object and pushes it to new array [commitArray]
function createNewObject(user, timeLati, timeLong, newRadius) {
  newObject = {
    name: user,
    latitude: timeLati,
    longitude: timeLong,
    radius: newRadius
  };

  //================================================= checks repetition
  if (userExists(user) === false && arrCount < arrMax && timeLong != null) {
    commitArray.push(newObject);
    arrCount++;
  }
}

//===================================================== Filter data functions
function userExists(username) {
  return commitArray.some(arr => {
    return arr.name === username;
  });
}

function checkYear(year) {
  switch (year) {
    case "2018":
      return 140;
    case "2017":
      return 200;
    case "2016":
      return 260;
    default:
      return 140;
  }
}

//===================================================== Randomize location
function generateLatitude() {
  return Math.floor(Math.random() * 180) - 90;
}

function generateLongitude(min) {
  return Math.floor(Math.random() * 15) - min;
}
