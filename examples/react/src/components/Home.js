import React from 'react';

class Home extends React.Component {
  render() {
    return (
      <div>
        <div className="page-header">
          <h1>Examples</h1>
        </div>

        <h2>Override</h2>
        <p>Override per element in a nested manner</p>

        <h2>Async</h2>
        <p>Use asynchoronous data per override or per each element</p>
      </div>
    );
  }
}

export default Home;
