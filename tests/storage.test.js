import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readStore, writeStore } from '../assets/lib.js';

const blocked = {
  getItem() { throw new Error('SecurityError'); },
  setItem() { throw new Error('SecurityError'); },
};

const memory = () => {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, v),
  };
};

test('readStore survives storage that throws', () => {
  assert.equal(readStore(blocked, 'porto.theme'), null);
});

test('readStore survives missing storage', () => {
  assert.equal(readStore(undefined, 'porto.theme'), null);
});

test('writeStore reports failure instead of throwing', () => {
  assert.equal(writeStore(blocked, 'porto.theme', 'dark'), false);
});

test('writeStore reports success and the value round-trips', () => {
  const storage = memory();
  assert.equal(writeStore(storage, 'porto.theme', 'dark'), true);
  assert.equal(readStore(storage, 'porto.theme'), 'dark');
});
