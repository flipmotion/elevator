import React, { Component } from 'react';
import classNames from 'classnames';
import '../styles/index.css';

export default class Floor extends Component {

  render() {
    const { floors, toggleCallIfNeeded } = this.props;

    return (
      <div className="elevator__panel">
        {floors.map(({ floorNum, isCalling, state }, key) =>
          <div
            className="flex align-center"
            key={key}
            onClick={() => {
              toggleCallIfNeeded(floorNum)
            }}
          >
            <div
              className={
                classNames('elevator__button', {
                  active: isCalling,
                })
              }
            >{floorNum}</div>
            <div className="elevator__button-state" style={{ whiteSpace: 'nowrap' }}>{`Floor: ${floorNum}: ${state}`}</div>
          </div>
        )}
      </div>
    );
  }
}
