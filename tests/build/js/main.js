/*
Copyright 2017 Google Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

var videoElement = document.querySelector('video');
var audioSelect = document.querySelector('select#audioSource');
var videoSelect = document.querySelector('select#videoSource');

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function gotSources(sourceInfos) {
  for (var i = 0; i !== sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];
    var option = document.createElement('option');
    option.value = sourceInfo.deviceId;
    if (sourceInfo.kind === 'audiooutput') {
      option.text = sourceInfo.label || 'microphone ' +
        (audioSelect.length + 1);
      audioSelect.appendChild(option);
    } else if (sourceInfo.kind === 'videoinput') {
      option.text = sourceInfo.label || 'camera ' + (videoSelect.length + 1);
      videoSelect.appendChild(option);
    } else {
      console.log('Some other kind of source: ', sourceInfo);
    }
  }
}

// if (typeof MediaStreamTrack === 'undefined' ||
//     typeof MediaStreamTrack.getSources === 'undefined') {
//   alert('This browser does not support MediaStreamTrack.getSources().');
// } else {
//   navigator.mediaDevices.enumerateDevices().then(function(e) {
//     gotSources(e);
//   });
// }

if (navigator.mediaDevices) {
    navigator.mediaDevices.enumerateDevices()
    .then(function (sources) {
    var videoSources = sources.filter(function (source) {
    return source.kind === 'video';
    });
    alert('got video sources' + videoSources);
    })
    }

function successCallback(stream) {
  window.stream = stream; // make stream available to console
  videoElement.srcObject = stream;
  videoElement.play();
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function start() {
  if (window.stream) {
    videoElement.src = null;
    window.stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
  var audioSource = audioSelect.value;
  var videoSource = videoSelect.value;

  var constraints = {
    audio: {
      optional: [{
        sourceId: audioSource
      }]
    },
    video: {
      optional: [{
        sourceId: videoSource
      }]
    }
  };
  navigator.getUserMedia(constraints, successCallback, errorCallback);
}

audioSelect.onchange = start;
videoSelect.onchange = start;

start();