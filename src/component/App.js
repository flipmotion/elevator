import React, { Component } from 'react';
import Elevator from './Elevator';
import Floor from './Floor';
import '../styles/index.css';


export default class App extends Component {
  render() {
    const {
      floors,
      elevators,
      toggleCallIfNeeded,
      addFloor,
      addElevator,
    } = this.props;

    return (
      <div style={{ height: '100%' }}>
        <Elevator
          elevators={elevators}
        />
        <Floor
          floors={floors}
          toggleCallIfNeeded={toggleCallIfNeeded}
        />
        <div
          className="add__floor"
          onClick={addFloor}
        >add floors</div>
        <div
          className="add__elevator"
          onClick={addElevator}
        >add elevators</div>
      </div>
    );
  }
}
