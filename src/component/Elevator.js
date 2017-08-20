import React, { Component } from 'react';
import classNames from 'classnames';
import { ELEVATOR_STATUS } from '../constants';
import '../styles/index.css';
import hangover from '../images/hangover.jpg';

export default class Elevator extends Component {

  render() {
    const { elevators } = this.props;

    return (
      <div className="elevators flex">
        {
          elevators.map( (elevator) => {
            return (
              <div className={
                classNames('elevator', {'elevator--open': elevator.state === ELEVATOR_STATUS.STAYING })
              } key={elevator.elevatorId}>
                <div className="elevator__people">
                  <img src={hangover} alt="" />
                </div>
                <div className="elevator__board">{elevator.position}</div>
                <div className="elevator__status">
                  <div>
                    {`ELEVATOR ${elevator.elevatorId}: ${elevator.state} in floor ${elevator.position}${elevator.state === ELEVATOR_STATUS.MOVING ? ', moving to floor ' + elevator.target : '.'}`}
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    );
  }
}
