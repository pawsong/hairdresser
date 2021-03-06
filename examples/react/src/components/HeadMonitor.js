import React from 'react';
import {CtrlType} from '../../../../lib/Controller';
import hljs from 'highlight.js/lib/highlight';

hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'));

const TAGS = ['TITLE', 'META', 'LINK'];

class HeadMonitor extends React.Component {
  static contextTypes = {
    hairdresser: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { headHTML: '' };
  }

  componentWillMount() {
    const head = document.head;
    let oldHeadHTML = '';

    let updatePending = false;

    const update = () => {
      if (updatePending) { return; }
      updatePending = true;

      setTimeout(() => {
        if (oldHeadHTML !== head.outerHTML) {
          oldHeadHTML = head.outerHTML;

          const elements = [];
          for (let i = 0; i < head.children.length; ++i) {
            const element = head.children[i];
            if (TAGS.indexOf(element.tagName) !== -1) {
              elements.push(element.outerHTML);
            }
          }

          this.setState({
            headHTML: hljs.highlight('html', elements.join('\n')).value,
          });
        }
        updatePending = false;
      });
    };

    this.context.hairdresser._renderAndListen({
      onUpdate: update,
      onStop: update,
    }, {
      onUpdate: update,
      onStop: update,
    });
  }

  render() {
    return (
      <pre><code className="hljs html" dangerouslySetInnerHTML={{
        __html: this.state.headHTML,
      }}></code></pre>
    );
  }
}

export default HeadMonitor;
