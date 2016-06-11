import { flatMap, shuffle } from 'lodash'
import { compose, head, take, propEq, filter, map } from 'ramda'

function getQuestions(all, prompts, numberOfQuestions) {
  const firstVerb = compose(head, filter(propEq('wordClass', 'so')))
  const verbs = map(firstVerb, all)

  const questions = flatMap(verbs, ({ headWord, forms }) =>
    forms
      .filter(form => Object.keys(prompts).includes(form.grammarTag))
      .map(form => ({
        form: form.form,
        grammarTag: form.grammarTag,
        headWord,
      })
    ))

  return take(numberOfQuestions, questions)
}

function getScore(answer, form) {
  return answer === form ? 1 : 0
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

export { getQuestions, getScore, getQuestion }
