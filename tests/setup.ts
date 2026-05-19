import { vi } from 'vitest';

// Mock Sequelize
vi.mock('sequelize', async () => {
  const actual = await vi.importActual('sequelize');
  return {
    ...actual,
    Op: {
      ne: Symbol.for('Op.ne'),
      eq: Symbol.for('Op.eq'),
      gt: Symbol.for('Op.gt'),
      lt: Symbol.for('Op.lt'),
      gte: Symbol.for('Op.gte'),
      lte: Symbol.for('Op.lte'),
      in: Symbol.for('Op.in'),
      notIn: Symbol.for('Op.notIn'),
      like: Symbol.for('Op.like'),
      notLike: Symbol.for('Op.notLike'),
      iLike: Symbol.for('Op.iLike'),
      notILike: Symbol.for('Op.notILike'),
      regexp: Symbol.for('Op.regexp'),
      notRegexp: Symbol.for('Op.notRegexp'),
      between: Symbol.for('Op.between'),
      notBetween: Symbol.for('Op.notBetween'),
      and: Symbol.for('Op.and'),
      or: Symbol.for('Op.or'),
    },
  };
});

// Global test utilities
global.vi = vi;
