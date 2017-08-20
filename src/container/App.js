import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { App } from '../component';
import {
  addFloor,
  addElevator,
  toggleCallIfNeeded
} from '../action';

const mapStateToProps = ({ elevators, floors }, ownProps) => {
  return {
    elevators,
    floors,
  }
};

const mapDispatchToProps = (dispatch, action) => {
  return (
    bindActionCreators({
      addFloor,
      addElevator,
      toggleCallIfNeeded,
    }, dispatch)
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);