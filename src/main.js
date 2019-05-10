import Vue from "vue/dist/vue.common.js";
import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.css";
import "./main.css";

Vue.use(VueMaterial);

const res = require("./resources.js");

const se = new Audio(res.sound);
let box = null;

const data = {
  timeoutId: null,
  startTime: -1,
  measurementType: "color",
  status: "active",
  isFinished: true,
  isActive: false,
  isError: false,
  isWaiting: false,
  result: "...",
  resultListColor: [
    { key: 0, time: 9999, frame: 599940, isFlying: false },
    { key: 1, time: 9999, frame: 599940, isFlying: false },
    { key: 2, time: 9999, frame: 599940, isFlying: false },
    { key: 3, time: 9999, frame: 599940, isFlying: false },
    { key: 4, time: 9999, frame: 599940, isFlying: false }
  ],
  resultListSound: [
    { key: 0, time: 9999, frame: 599940, isFlying: false },
    { key: 1, time: 9999, frame: 599940, isFlying: false },
    { key: 2, time: 9999, frame: 599940, isFlying: false },
    { key: 3, time: 9999, frame: 599940, isFlying: false },
    { key: 4, time: 9999, frame: 599940, isFlying: false }
  ]
};

const vm = new Vue({
  el: "#app",
  data: data,
  methods: {
    retry: () => {
      vm.start();
    },
    start: () => {
      data.isActive = false;
      data.isFinished = false;
      data.isError = false;
      data.isWaiting = true;
      data.startTime = -1;
      switch (data.measurementType) {
        case "color":
          if (box === null) {
            box = document.getElementById("box");
          }
          box.className = "";
          break;
        case "sound":
          break;
      }
      const wait = 2000 + Math.floor(Math.random() * 5000);
      data.timeoutId = setTimeout(() => {
        vm.timeout();
      }, wait);
    },
    timeout: () => {
      if (!data.isWaiting) {
        return;
      }
      switch (data.measurementType) {
        case "color":
          if (box === null) {
            box = document.getElementById("box");
          }
          box.className = "active";
          break;
        case "sound":
          se.play();
          break;
      }
      data.isActive = true;
      data.isWaiting = false;
      data.startTime = new Date().getTime();
    },
    showModal: () => {
      vm.$refs.dialog1.open();
    },
    openDialog: ref => {
      vm.$refs[ref].open();
    },
    closeDialog: ref => {
      vm.$refs[ref].close();
    }
  }
});

const addResult = newResult => {
  let list;
  switch (data.measurementType) {
    case "color":
      list = data.resultListColor;
      break;
    case "sound":
      list = data.resultListSound;
      break;
  }
  if (list) {
    list.unshift(newResult);
    list.length = 5;
  }
};

// Note:
// Vue's event handling is slow for reaction time measurement,
// so raw JavaScript event is needed here.
const reacted = () => {
  const finishTime = new Date().getTime();
  if (data.isFinished) {
    return;
  }

  let newResult;
  if (data.isActive) {
    const time = finishTime - data.startTime;
    const frame = (60.0 * time) / 1000;
    const txt = time.toString() + " ms (" + frame.toString() + "f)";
    data.result = txt;

    newResult = {
      key: new Date().getTime(),
      time: time,
      frame: frame
    };
  } else {
    data.result = res.flying;
    newResult = {
      key: new Date().getTime(),
      isFlying: true
    };
    data.isError = true;
  }
  addResult(newResult);
  data.isFinished = true;
  data.isWaiting = false;
  clearTimeout(data.timeoutId);
};

document.getElementById("btnReact").addEventListener("mousedown", reacted);
