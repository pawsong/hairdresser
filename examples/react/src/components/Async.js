import React from 'react';
import {EventEmitter} from 'fbemitter';

export class Async extends React.Component {
  static contextTypes = {
    hairdresser: React.PropTypes.object.isRequired,
  }

  state = {
    title: 'Will be loaded in 1 sec',
    body: 'Will be loaded in 1 sec',
  }

  componentWillMount() {
    this.override = this.context.hairdresser.override()
      .title(() => this.state.title)
      .meta({ name: 'body' }, () => ({ content: this.state.body }));
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.setState({
        title: 'Title is ready',
        body: 'Body is ready',
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.override.restore();
  }

  render() {
    this.override.update();
    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <h3 className="panel-title">{this.state.title}</h3>
        </div>
        <div className="panel-body">{this.state.body}</div>
      </div>
    );
  }
}

export class AsyncPerElement extends React.Component {
  static contextTypes = {
    hairdresser: React.PropTypes.object.isRequired,
  }

  state = {
    title: 'Will be loaded in 1 sec',
    body: 'Will be loaded in 2 sec',
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

  componentDidMount() {
    this.timer1 = setTimeout(() => {
      this.setState({
        title: 'Title is ready',
      });
      this.emitter.emit('title');
    }, 1000);

    this.timer2 = setTimeout(() => {
      this.setState({
        body: 'Body is ready',
      });
      this.emitter.emit('body');
    }, 2000);
  }


  componentWillUnmount() {
    clearTimeout(this.timer1);
    clearTimeout(this.timer2);
    this.override.restore();
  }

  render() {
    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <h3 className="panel-title">{this.state.title}</h3>
        </div>
        <div className="panel-body">{this.state.body}</div>
      </div>
    );
  }
}
