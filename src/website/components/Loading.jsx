import React, {Component} from 'react';

class Loading extends Component {
  render() {
    return (
      <div className="loading">
        <i className="fa fa-circle-o-notch fa-spin"/>
      </div>
    );
  }
}

export default Loading;
