import test from 'node:test';
import assert from 'node:assert/strict';
import { csvToJson, parseCsvLine } from '../src/utils/csvToJson.js';

test('parseCsvLine handles commas in quotes and escaped quotes', () => {
  const row = '"alpha","has,comma and ""quote"""';
  assert.deepEqual(parseCsvLine(row), ['alpha', 'has,comma and "quote"']);
});

test('csvToJson converts rows and fills missing values', () => {
  const csv = ['id,gene,score', '1,TP53,0.81', '2,BRCA1'].join('\n');
  assert.deepEqual(csvToJson(csv), [
    { id: '1', gene: 'TP53', score: '0.81' },
    { id: '2', gene: 'BRCA1', score: '' }
  ]);
});

test('csvToJson throws when csv has no data rows', () => {
  assert.throws(
    () => csvToJson('id,gene'),
    /CSV needs at least a header row and one data row\./
  );
});
