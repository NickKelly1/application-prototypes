import React, { Component } from 'react';
import { ACTIONS } from '../index';
import NoteApp from '../components/NoteApp';

class NoteAppContainer_v0 extends Component {
  constructor(props) {
    super();
    this.state = props.store.getState();
  }

  componentWillMount() {
    // subscribe to the store on mount
    // keeping this components state in sync with the store
    this.unsubscribe = this.props.store.subscribe(() => {
      this.setState(this.props.store.getState());
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleAddNote = (content) => { this.props.store.dispatch({ type: ACTIONS.CREATE_NOTE, content }); }

  handleChangeNote = (id, content) => { this.props.store.dispatch({ type: ACTIONS.UPDATE_NOTE, id, content }); }

  handleOpenNote = (id) => { this.props.store.dispatch({ type: ACTIONS.OPEN_NOTE, id }); }

  handleCloseNote = (id) => { this.props.store.dispatch({ type: ACTIONS.CLOSE_NOTE }); }

  render() {
    return (
      <NoteApp
        notes={this.state.notes}
        onAddNote={this.handleAddNote}
        onChangeNote={this.handleChangeNote}
        onOpenNote={this.handleOpenNote}
        onCloseNote={this.handleCloseNote}
      />
    );
  }
}

export default NoteAppContainer_v0