import React from 'react'
import Logo from './logo'
import Footer from './footer'
import styles from './main.css'
import { AnswerBox } from './answer-box'
import axios from 'axios'
import { flatMap, shuffle } from 'lodash'
import { compose, prop, head, take, propEq, filter, map } from 'ramda'

const apiUrl = 'https://api.tala.is'
const numberOfQuestions = 10

const level = {
  name: 'Past tense',
  words: ['tala', 'fara', 'vera', 'segja'],
  prompts: {
    'GM-FH-ÞT-1P-ET': ['ég'],
    'GM-FH-ÞT-2P-ET': ['þú'],
    'GM-FH-ÞT-3P-ET': ['hann', 'hún', 'það'],
    'GM-FH-ÞT-1P-FT': ['við'],
    'GM-FH-ÞT-2P-FT': ['þið'],
    'GM-FH-ÞT-3P-FT': ['þeir', 'þær', 'þau']
  }
}

const otherLevel = {
  name: 'Past participles',
  words: ['tala', 'fara', 'vera', 'vilja', 'koma'],
  prompts: {
    'GM-SAGNB': ['ég hef', 'ég get', 'hann getur', 'hún hefur']
  }
}

const supportedTags = Object.keys(level.prompts)

function lookupWords(words) {
  return Promise.all(words.map(word => axios.get(`${apiUrl}/find/${word}`)))
}

async function createLevel(words, numberOfQuestions) {
  const all = await lookupWords(words)
  const verbs = map(compose(head, filter(propEq('wordClass', 'so')), prop('data')))(all)

  let questions = flatMap(verbs, ({headWord, forms}) =>
    forms
      .filter(form => supportedTags.includes(form.grammarTag))
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
    } else {
      return 'correct'
    }
  } else {
    return 'try again'
  }
}

function getQuestion(questions) {
  let [question, ...remainingQuestions] = questions

  return {
    question: {
      ...question,
      prompt: shuffle(level.prompts[question.grammarTag])[0]
    },
    questions: remainingQuestions
  }
}

function reportResult(...props) {
  console.log(...props)
}

export class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = Main.initialState
  }

  static initialState = {
    result: null,
    isGameOver: false,
  }

  nextQuestion = () => {
    if (this.state.startTime) {
      reportResult(this.state.question.form, this.state.question.grammarTag, Date.now() - this.state.startTime)
    }

    if (this.questions.length === 0) {
      this.setState({ isGameOver: true })
      return
    }

    let {question, questions} = getQuestion(this.questions)
    this.questions = questions

    this.setState({
      question,
      startTime: Date.now()
    })
  }

  componentDidMount() {
    this.restart()
  }

  onAnswer = (answer, keyPresses) => {
    const { form } = this.state.question
    const result = getResult(answer, keyPresses, form)

    if (answer === form) {
      setTimeout(() => {
        this.refs.answer.reset()
        this.nextQuestion()
        this.setState({ result: null })
      }, 1000)
    }

    this.setState({ result })
  }

  restart = async () => {
    const questions = await createLevel(level.words, numberOfQuestions)
    this.questions = shuffle(questions)
    this.setState(Main.initialState, () => this.nextQuestion())
  }

  render() {
    const { question, result, isGameOver } = this.state

    if (!question) {
      return null
    }

    return (
      <div className={styles.root}>
        <div className={styles.content}>
          <Logo />
          { isGameOver ? (
              <div>
                <div>Game over</div>
                <button onClick={this.restart}>Play again</button>
              </div>
            ) : (
              <div>
                <div>{level.name}</div>
                <h1 className={styles.headWord}>{question.headWord}</h1>
                <div className={styles.inline}>
                  <div className={styles.prompt}>{question.prompt}</div>
                  <AnswerBox ref="answer" onEnter={this.onAnswer} />
                  <div>{result}</div>
                </div>
                { result === 'try again' && <div>{question.form}</div> }
              </div>
            )
          }
        </div>
        <Footer />
      </div>
    )
  }
}
