import {expect} from 'chai';

import {
  removeItem,
  createIdGenerator,
} from '../src/utils';

describe('utils', () => {
  describe('removeItem', () => {
    it('should remove element of an array', () => {
      const array = [1, 2, 3];
      removeItem(array, 2);
      expect(array).to.deep.equal([1, 3]);
    });

    it('should have no effect when the same element is not found', () => {
      const array = [1, 2, 3];
      removeItem(array, 4);
      expect(array).to.deep.equal([1, 2, 3]);
    });
  });

  describe('createIdGenerator', () => {
    it('should return a function that returns incremental number', () => {
      const generateId = createIdGenerator();
      expect(generateId).to.be.a('function');

      let ret;
      ret = generateId();
      expect(ret).to.equal(1);

      ret = generateId();
      expect(ret).to.equal(2);

      ret = generateId();
      expect(ret).to.equal(3);
    });
  });
});
