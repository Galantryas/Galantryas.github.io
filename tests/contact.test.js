import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mailtoHref, canCopy } from '../assets/lib.js';

test('mailto encodes the subject', () => {
  const href = mailtoHref('galantryas.2014@gmail.com', 'Project enquiry');
  assert.match(href, /^mailto:galantryas\.2014@gmail\.com\?subject=/);
  assert.match(href, /Project%20enquiry/);
  assert.doesNotMatch(href, /\+/);
});

test('email is never HTML', () => {
  const href = mailtoHref('a"b@c.d', 'x');
  assert.doesNotMatch(href, /"/);
});

test('canCopy is false where the clipboard API is absent', () => {
  assert.equal(canCopy(), false);
});
