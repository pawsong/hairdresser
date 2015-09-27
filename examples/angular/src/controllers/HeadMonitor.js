import {CTRL_TYPE} from '../../../../src/classes/Controller';
import hljs from 'highlight.js/lib/highlight';

hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'));
require('highlight.js/styles/sunburst.css');

const TAGS = ['TITLE', 'META', 'LINK'];

export function HeadMonitorCtrl($interval, $scope, $sce, $document, hairdresser) {
  const head = $document[0].head;
  let oldHeadHTML = '';

  const update = () => {
    if (head.outerHTML !== oldHeadHTML) {
      oldHeadHTML = head.outerHTML;

      const elements = [];
      for (let i = 0; i < head.children.length; ++i) {
        const element = head.children[i];
        if (TAGS.indexOf(element.tagName) !== -1) {
          elements.push(element.outerHTML);
        }
      }
      $scope.head = $sce.trustAsHtml((hljs.highlight('html', elements.join('\n')).value));
    }
  };

  hairdresser._renderAndListen({
    [CTRL_TYPE.TITLE]: {
      onUpdate: update,
      onStop: update,
    },
    [CTRL_TYPE.ETC]: {
      onUpdate: update,
      onStop: update,
    },
  });
}
