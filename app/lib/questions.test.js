import test from 'ava'
import { tala } from '../../test/data'
import { getQuestions } from './questions'

test('getQuestions should return the question', assert => {
  const prompts = {
    'GM-FH-ÞT-1P-ET': ['ég'],
  }

  const expected = [{
    headWord: 'tala',
    form: 'talaði',
    grammarTag: 'GM-FH-ÞT-1P-ET',
  }]

  const questions = getQuestions(tala, prompts, 1)

  assert.deepEqual(questions, expected)
})

test('getQuestions should return the right number of questions', assert => {
  const prompts = {
    'GM-FH-ÞT-1P-ET': ['ég'],
    'GM-FH-ÞT-2P-ET': ['þú'],
  }

  const expected = [{
    headWord: 'tala',
    form: 'talaði',
    grammarTag: 'GM-FH-ÞT-1P-ET',
  }]

  const questions = getQuestions(tala, prompts, 1)

  assert.deepEqual(questions, expected)
})
