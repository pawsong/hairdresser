import React from 'react';
import {EventEmitter} from 'fbemitter';

export default class Dynamic extends React.Component {
  static contextTypes = {
    hairdresser: React.PropTypes.object.isRequired,
  }

  state = {
    title: 'Default title',
    body: 'Default body',
  }

  componentWillMount() {
    this.emitter = new EventEmitter();

    this.override = this.context.hairdresser.override()
      .title(() => this.state.title, {
        addListener: listener => this.emitter.addListener('title', listener),
        removeListener: (listener, token) => token.remove(),
      })
      .meta({ name: 'body' }, () => ({ content: this.state.body }), {
        addListener: listener => this.emitter.addListener('body', listener),
        removeListener: (listener, token) => token.remove(),
      });
  }

  handleChangeTitle(event) {
    this.setState({ title: event.target.value });
  }

  handleChangeBody(event) {
    this.setState({ body: event.target.value });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.title !== prevState.title) {
      this.emitter.emit('title');
    }

    if (this.state.body !== prevState.body) {
      this.emitter.emit('body');
    }
  }

  render() {
    return (
      <div>
        <div className="form-group">
          <label>Title</label>
          <input className="form-control" type="text" value={this.state.title}
            onChange={this.handleChangeTitle.bind(this)}/>
        </div>
        <div className="form-group">
          <label>Body</label>
          <input className="form-control" type="text" value={this.state.body}
            onChange={this.handleChangeBody.bind(this)}/>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    this.override.restore();
  }
}
