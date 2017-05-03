import React, {Component} from 'react';
import {string} from 'prop-types';

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const oscillator = audioCtx.createOscillator();

oscillator.type = 'sine'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
oscillator.frequency.value = 2500; // value in hertz
oscillator.start();

// oscillator.connect(audioCtx.destination);

class MP3View extends Component {
  render() {
    return (
      <div className="image-view">
        <audio controls>
          <source src={this.props.fileURL} type="audio/mpeg"/>
        </audio>
      </div>
    );
  }
}

MP3View.propTypes = {
  fileURL: string.isRequired
};

export default MP3View;
