import {expect} from 'chai';

import LinkedListNode from '../src/classes/LinkedListNode';
import Attrs from '../src/classes/Attrs';
import Controller from '../src/classes/Controller';

describe('LinkedListNode', () => {
  describe('#insertAfter', () => {
    it('should insert given node after self', () => {
      // Insert after end of list
      const nodeA = new LinkedListNode();
      const nodeB = new LinkedListNode();

      nodeA.insertAfter(nodeB);

      expect(nodeA.prev).to.equal(undefined);
      expect(nodeA.next).to.equal(nodeB);
      expect(nodeB.prev).to.equal(nodeA);
      expect(nodeB.next).to.equal(undefined);

      // Insert into middle of list
      const nodeC = new LinkedListNode();
      nodeA.insertAfter(nodeC);

      expect(nodeA.prev).to.equal(undefined);
      expect(nodeA.next).to.equal(nodeC);
      expect(nodeB.prev).to.equal(nodeC);
      expect(nodeB.next).to.equal(undefined);
      expect(nodeC.prev).to.equal(nodeA);
      expect(nodeC.next).to.equal(nodeB);
    });
  });

  describe('#unlink', () => {
    it('should remove self from list', () => {
      // prev does not exist, next does not exist
      const node00 = new LinkedListNode();

      expect(node00.prev).to.equal(undefined);
      expect(node00.next).to.equal(undefined);

      node00.unlink();
      expect(node00.prev).to.equal(undefined);
      expect(node00.next).to.equal(undefined);

      // prev does not exist, next exists
      const node01 = new LinkedListNode();
      const node01next = new LinkedListNode();
      node01.insertAfter(node01next);

      expect(node01.prev).to.equal(undefined);
      expect(node01.next).to.equal(node01next);
      expect(node01next.prev).to.equal(node01);
      expect(node01next.next).to.equal(undefined);

      node01.unlink();
      expect(node01.prev).to.equal(undefined);
      expect(node01.next).to.equal(undefined);
      expect(node01next.prev).to.equal(undefined);
      expect(node01next.next).to.equal(undefined);

      // prev exists, next does not exist
      const node10prev = new LinkedListNode();
      const node10 = new LinkedListNode();
      node10prev.insertAfter(node10);

      expect(node10prev.prev).to.equal(undefined);
      expect(node10prev.next).to.equal(node10);
      expect(node10.prev).to.equal(node10prev);
      expect(node10.next).to.equal(undefined);

      node10.unlink();
      expect(node10prev.prev).to.equal(undefined);
      expect(node10prev.next).to.equal(undefined);
      expect(node10.prev).to.equal(undefined);
      expect(node10.next).to.equal(undefined);

      // prev exists, next exists
      const node11prev = new LinkedListNode();
      const node11 = new LinkedListNode();
      const node11next = new LinkedListNode();
      node11prev.insertAfter(node11);
      node11.insertAfter(node11next);

      expect(node11prev.prev).to.equal(undefined);
      expect(node11prev.next).to.equal(node11);
      expect(node11.prev).to.equal(node11prev);
      expect(node11.next).to.equal(node11next);
      expect(node11next.prev).to.equal(node11);
      expect(node11next.next).to.equal(undefined);

      node11.unlink();
      expect(node11prev.prev).to.equal(undefined);
      expect(node11prev.next).to.equal(node11next);
      expect(node11.prev).to.equal(undefined);
      expect(node11.next).to.equal(undefined);
      expect(node11next.prev).to.equal(node11prev);
      expect(node11next.next).to.equal(undefined);
    });
  });
});

describe('Attrs', () => {
  describe('static toHtml', () => {
    it('should return attribute string used in HTML', () => {
      const ret = Attrs.toHtml({
        name1: 'value1',
        name2: 'value2',
        name3: 'value3',
      });

      expect(ret).to.equal('name1="value1" name2="value2" name3="value3"');
    });
  });

  describe('each', () => {
    it('should iterate over all the properties', () => {
      const data = {
        name1: 'value1',
        name2: 'value2',
        name3: 'value3',
      };

      const attrs = new Attrs(data);

      const keysIterated = [];
      attrs.each((name, value) => {
        expect(data[name]).to.equal(value);
        expect(value).to.equal(data[name]);

        keysIterated.push(name);
      });

      expect(keysIterated).to.deep.equal(['name1', 'name2', 'name3']);
    });

    it('should iterate in alphabetical order', () => {
      const data = {
        name1: 'value1',
        name3: 'value3',
        name2: 'value2',
      };

      const attrs = new Attrs(data);

      const keysIterated = [];
      attrs.each(name => {
        keysIterated.push(name);
      });

      expect(keysIterated).to.deep.equal(['name1', 'name2', 'name3']);
    });

    it('should stop iteration when callback returns false', () => {
      const data = {
        name1: 'value1',
        name2: 'value2',
        name3: 'value3',
      };

      const attrs = new Attrs(data);

      let keysIterated;
      let ret;

      // When not stopped
      keysIterated = [];
      ret = attrs.each(name => {
        keysIterated.push(name);
      });
      expect(ret).to.equal(true);
      expect(keysIterated).to.deep.equal(['name1', 'name2', 'name3']);

      // When stopped
      keysIterated = [];
      ret = attrs.each(name => {
        if (name === 'name2') {
          return false;
        }
        keysIterated.push(name);
      });
      expect(ret).to.equal(false);
      expect(keysIterated).to.deep.equal(['name1']);
    });
  });
});

describe('Controller', () => {
  describe('constructor', () => {
    /* eslint no-new: 0 */

    it('should throw an error when render function is missing', () => {
      expect(() => {
        new Controller();
      }).to.throw('render function is required');
    });

    it('should throw an error when addListener is passed without removeListener', () => {
      expect(() => {
        new Controller(Controller.TITLE, 'title', {}, () => '', {
          addListener: () => {},
        });
      }).to.throw('addListener requires removeListener');
    });
  });
});
