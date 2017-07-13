let resources = {
  flying: 'フライングです。'
};

if (window.navigator.userAgent.toLowerCase().indexOf('trident') >= 0) {
  resources.sound = 'se_maoudamashii_system41.mp3';
} else {
  resources.sound = 'se_maoudamashii_system41.wav';
}

module.exports = resources;
