const Vue = require('vue/dist/vue.common.js');
const VueMaterial = require('vue-material');
require('vue-material/dist/vue-material.css');
require('./main.css');
Vue.use(VueMaterial);

var soundFile;
if (window.navigator.userAgent.toLowerCase().indexOf('trident') >= 0) {
  soundFile = 'se_maoudamashii_system41.mp3';
} else {
  soundFile = 'se_maoudamashii_system41.wav';
}
var se = new Audio(soundFile);
var box = null;

var data = {
  timeoutId: null,
  startTime: -1,
  measurementType: 'color',
  status: 'active',
  isFinished: true,
  isActive: false,
  isError: false,
  isWaiting: false,
  message: 'Hello Vue!',
  result: '...',
  resultListColor: [
    { time: 9999, frame: 599940, isFlying: false },
    { time: 9999, frame: 599940, isFlying: false },
    { time: 9999, frame: 599940, isFlying: false },
    { time: 9999, frame: 599940, isFlying: false },
    { time: 9999, frame: 599940, isFlying: false }
  ],
  resultListSound: [
    { time: 9999, frame: 599940, isFlying: false },
    { time: 9999, frame: 599940, isFlying: false },
    { time: 9999, frame: 599940, isFlying: false },
    { time: 9999, frame: 599940, isFlying: false },
    { time: 9999, frame: 599940, isFlying: false }
  ]
};

new Vue({
  el: '#app',
  data: data,
  methods: {
    retry: function() {
      this.start();
    },
    start: function() {
      var that = this;
      that.isActive = false;
      that.isFinished = false;
      that.isError = false;
      that.isWaiting = true;
      that.startTime = -1;
      switch (this.measurementType) {
      case 'color':
        if (box === null) {
          box = document.getElementById('box');
        }
        box.className = '';
        break;
      case 'sound':
        break;
      }
      var wait = 2000 + ( Math.floor( Math.random() * 5000 ));
      that.timeoutId = setTimeout(function(){
        that.timeout();
      }, wait);
    },
    timeout: function() {
      if (!this.isWaiting) {
        return;
      }
      switch (this.measurementType) {
      case 'color':
        if (box === null) {
          box = document.getElementById('box');
        }
        box.className = 'active';
        break;
      case 'sound':
        se.play();
        break;
      }
      this.isActive = true;
      this.isWaiting = false;
      this.startTime = (new Date()).getTime();
    },
    showModal: function() {
      this.$refs.dialog1.open();
    },
    openDialog: function(ref) {
      this.$refs[ref].open();
    },
    closeDialog: function(ref) {
      this.$refs[ref].close();
    },
    onOpen: function() {
      console.log('Opened');
    },
    onClose: function(type) {
      console.log('Closed', type);
    }
  }
});

var addResult = function(newResult) {
  var list;
  switch (data.measurementType) {
  case 'color':
    list = data.resultListColor;
    break;
  case 'sound':
    list = data.resultListSound;
    break;
  }
  if (list) {
    list.unshift(newResult);
    list.length = 5;
  }
};

// Vueでさばくと時間計測アプリとしては致命的にオーバーヘッドがあるので、計測終了は生イベントで処理することにした
var reacted = function() {
  var finishTime = (new Date()).getTime();
  if (data.isFinished) {
    return;
  }
  var newResult;
  if (data.isActive) {
    var time = (finishTime - data.startTime);
    var frame = (60.0 * time / 1000);
    var txt = time.toString() + ' ms (' + frame.toString() + 'f)';
    data.result = txt;

    newResult = {
      time: time,
      frame: frame
    };
  } else {
    data.result = 'フライングです。';
    newResult = {
      isFlying:true
    };
    data.isError = true;
  }
  addResult(newResult);
  data.isFinished = true;
  data.isWaiting = false;
  clearTimeout(data.timeoutId);
};

document.getElementById('btnReact').addEventListener('mousedown', function(){
  reacted();
});
