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

      expect(nodeA.prev).toBe(undefined);
      expect(nodeA.next).toBe(nodeB);
      expect(nodeB.prev).toBe(nodeA);
      expect(nodeB.next).toBe(undefined);

      // Insert into middle of list
      const nodeC = new LinkedListNode();
      nodeA.insertAfter(nodeC);

      expect(nodeA.prev).toBe(undefined);
      expect(nodeA.next).toBe(nodeC);
      expect(nodeB.prev).toBe(nodeC);
      expect(nodeB.next).toBe(undefined);
      expect(nodeC.prev).toBe(nodeA);
      expect(nodeC.next).toBe(nodeB);
    });
  });

  describe('#unlink', () => {
    it('should remove self from list', () => {
      // prev does not exist, next does not exist
      const node00 = new LinkedListNode();

      expect(node00.prev).toBe(undefined);
      expect(node00.next).toBe(undefined);

      node00.unlink();
      expect(node00.prev).toBe(undefined);
      expect(node00.next).toBe(undefined);

      // prev does not exist, next exists
      const node01 = new LinkedListNode();
      const node01next = new LinkedListNode();
      node01.insertAfter(node01next);

      expect(node01.prev).toBe(undefined);
      expect(node01.next).toBe(node01next);
      expect(node01next.prev).toBe(node01);
      expect(node01next.next).toBe(undefined);

      node01.unlink();
      expect(node01.prev).toBe(undefined);
      expect(node01.next).toBe(undefined);
      expect(node01next.prev).toBe(undefined);
      expect(node01next.next).toBe(undefined);

      // prev exists, next does not exist
      const node10prev = new LinkedListNode();
      const node10 = new LinkedListNode();
      node10prev.insertAfter(node10);

      expect(node10prev.prev).toBe(undefined);
      expect(node10prev.next).toBe(node10);
      expect(node10.prev).toBe(node10prev);
      expect(node10.next).toBe(undefined);

      node10.unlink();
      expect(node10prev.prev).toBe(undefined);
      expect(node10prev.next).toBe(undefined);
      expect(node10.prev).toBe(undefined);
      expect(node10.next).toBe(undefined);

      // prev exists, next exists
      const node11prev = new LinkedListNode();
      const node11 = new LinkedListNode();
      const node11next = new LinkedListNode();
      node11prev.insertAfter(node11);
      node11.insertAfter(node11next);

      expect(node11prev.prev).toBe(undefined);
      expect(node11prev.next).toBe(node11);
      expect(node11.prev).toBe(node11prev);
      expect(node11.next).toBe(node11next);
      expect(node11next.prev).toBe(node11);
      expect(node11next.next).toBe(undefined);

      node11.unlink();
      expect(node11prev.prev).toBe(undefined);
      expect(node11prev.next).toBe(node11next);
      expect(node11.prev).toBe(undefined);
      expect(node11.next).toBe(undefined);
      expect(node11next.prev).toBe(node11prev);
      expect(node11next.next).toBe(undefined);
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

      expect(ret).toBe('name1="value1" name2="value2" name3="value3"');
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
        expect(data[name]).toBe(value);
        expect(value).toBe(data[name]);

        keysIterated.push(name);
      });

      expect(keysIterated).toEqual(['name1', 'name2', 'name3']);
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

      expect(keysIterated).toEqual(['name1', 'name2', 'name3']);
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
      expect(ret).toBe(true);
      expect(keysIterated).toEqual(['name1', 'name2', 'name3']);

      // When stopped
      keysIterated = [];
      ret = attrs.each(name => {
        if (name === 'name2') {
          return false;
        }
        keysIterated.push(name);
      });
      expect(ret).toBe(false);
      expect(keysIterated).toEqual(['name1']);
    });
  });
});

describe('Controller', () => {
  describe('constructor', () => {
    /* eslint no-new: 0 */

    it('should throw an error when render function is missing', () => {
      expect(() => {
        new Controller();
      }).toThrowError('Invariant Violation: render function is required');
    });

    it('should throw an error when addListener is passed without removeListener', () => {
      expect(() => {
        new Controller(Controller.TITLE, 'title', {}, () => '', {
          addListener: () => {},
        });
      }).toThrowError('Invariant Violation: addListener requires removeListener');
    });
  });
});
