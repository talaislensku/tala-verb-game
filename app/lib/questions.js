import axios from 'axios'
import { flatMap, shuffle } from 'lodash'
import { compose, prop, head, take, propEq, filter, map } from 'ramda'

const apiUrl = 'https://api.tala.is'

function lookupWords(words) {
  return Promise.all(words.map(word => axios.get(`${apiUrl}/find/${word}`)))
}

async function getQuestions({ prompts, words }, numberOfQuestions) {
  const all = await lookupWords(words)
  const verbs = map(compose(head, filter(propEq('wordClass', 'so')), prop('data')))(all)

  const questions = flatMap(verbs, ({ headWord, forms }) =>
    forms
      .filter(form => Object.keys(prompts).includes(form.grammarTag))
      .map(form => ({
        headWord,
        ...form,
      })
    ))

  return take(numberOfQuestions, questions)
}

function getResult(answer, keyPresses, form) {
  if (answer === form) {
    if (keyPresses === form.length) {
      return 'perfect'
    }

    return 'correct'
  }

  return 'try again'
}

function getQuestion(questions, prompts) {
  const [question, ...remainingQuestions] = questions

  return {
    question: {
      ...question,
      prompt: shuffle(prompts[question.grammarTag])[0],
    },
    questions: remainingQuestions,
  }
}

export { getQuestions, getResult, getQuestion }
