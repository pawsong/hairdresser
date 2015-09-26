import React from 'react';
import {RouteHandler} from 'react-router';

export class Parent extends React.Component {
  static contextTypes = {
    hairdresser: React.PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.override = this.context.hairdresser.override()
      .title('Title from Parent')
      .meta({ name: 'overridden' }, { content: 'by parent' })
      .meta({ name: 'parent' }, { content: 'parent content' });
  }

  componentWillUnmount() {
    this.override.restore();
  }

  render() {
    return (
      <div>
        <div className="page-header">
          <h1>Parent</h1>
        </div>
        <RouteHandler/>
      </div>
    );
  }
}

export class Child extends React.Component {
  static contextTypes = {
    hairdresser: React.PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.override = this.context.hairdresser.override()
      .title('Title from Child')
      .meta({ name: 'overridden' }, { content: 'by child' })
      .meta({ name: 'child' }, { content: 'child content' });
  }

  componentWillUnmount() {
    this.override.restore();
  }

  render() {
    return (
      <div>
        <div className="page-header">
          <h2>Child</h2>
        </div>
        <RouteHandler/>
      </div>
    );
  }
}

export class Grandchild extends React.Component {
  static contextTypes = {
    hairdresser: React.PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.override = this.context.hairdresser.override()
      .title('Title from Grandchild')
      .meta({ name: 'overridden' }, { content: 'by grandchild' })
      .meta({ name: 'grandchild' }, { content: 'grandchild content' });
  }

  componentWillUnmount() {
    this.override.restore();
  }

  render() {
    return (
      <div>
        <div className="page-header">
          <h3>Grandchild</h3>
        </div>
      </div>
    );
  }
}
