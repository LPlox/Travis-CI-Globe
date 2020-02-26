//===================================================== Timezone object (calculated with 15 degrees inbetween each timezone)
const timeZones = [
  {
    name: "-11",
    hour: 0,
    startLongitude: -172.5
  },
  {
    name: "-10",
    hour: 0,
    startLongitude: -157.5
  },
  {
    name: "-9",
    hour: 0,
    startLongitude: -142.5
  },
  {
    name: "-8",
    hour: 0,
    startLongitude: -127.5
  },
  {
    name: "-7",
    hour: 0,
    startLongitude: -112.5
  },
  {
    name: "-6",
    hour: 0,
    startLongitude: -97.5
  },
  {
    name: "-5",
    hour: 0,
    startLongitude: -82.5
  },
  {
    name: "-4",
    hour: 0,
    startLongitude: -67.5
  },
  {
    name: "-3",
    hour: 0,
    startLongitude: -51.5
  },
  {
    name: "-2",
    hour: 0,
    startLongitude: -37.5
  },
  {
    name: "-1",
    hour: 0,
    startLongitude: -22.5
  },
  {
    name: "0",
    hour: 0,
    startLongitude: -7.5
  },
  {
    name: "1",
    hour: 0,
    startLongitude: 7.5
  },
  {
    name: "2",
    hour: 0,
    startLongitude: 22.5
  },
  {
    name: "3",
    hour: 0,
    startLongitude: 37.5
  },
  {
    name: "4",
    hour: 0,
    startLongitude: 52.5
  },
  {
    name: "5",
    hour: 0,
    startLongitude: 67.5
  },
  {
    name: "6",
    hour: 0,
    startLongitude: 82.5
  },
  {
    name: "7",
    hour: 0,
    startLongitude: 97.5
  },
  {
    name: "8",
    hour: 0,
    startLongitude: 112.5
  },
  {
    name: "9",
    hour: 0,
    startLongitude: 127.5
  },
  {
    name: "10",
    hour: 0,
    startLongitude: 142.5
  },
  {
    name: "11",
    hour: 0,
    startLongitude: 157.5
  },
  {
    name: "12",
    hour: 0,
    startLongitude: 172.5
  }
];

//===================================================== Writing in hours in the time zones
//Writing in each hour in the timeZones object, this is updated each time the code runs
//Needs a review?

for (let i = 0; i < timeZones.length; i++) {
  setCurrentHour(parseInt(timeZones[i].name), i);
}

function setCurrentHour(hours, index) {
  const time = new Date();
  time.toLocaleString("en-GB", { timeZone: "UTC" });
  time.setHours(time.getHours() + hours - 1);
  timeZones[index].hour = time.getHours();
}
