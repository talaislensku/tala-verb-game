import React from 'react'
import { shuffle } from 'lodash'

import { getQuestions, getScore, getQuestion } from '../../lib/questions'
import { lookupWords } from '../../lib/api'

import Logo from '../logo'
import Footer from '../footer'
import AnswerBox from '../answer-box'
import styles from './index.css'

export default class Quiz extends React.Component {
  static initialState = {
    result: null,
    isGameOver: false,
    hasAnswered: false,
    currentQuestionIndex: -1,
  }

  static propTypes = {
    level: React.PropTypes.object,
    numberOfQuestions: React.PropTypes.number,
    onReport: React.PropTypes.func,
    answerDelay: React.PropTypes.number,
  }

  static defaultProps = {
    answerDelay: 1000, // ms
    numberOfQuestions: 10,
  }

  constructor(props) {
    super(props)
    this.state = Quiz.initialState
  }

  componentDidMount() {
    this.restart()
  }

  onAnswer = (answer) => {
    const { form } = this.state.question
    const score = getScore(answer, form)

    const result = score === 1 ? 'correct' : 'try again'

    if (score === 1) {
      this.onCorrectAnswer(score, this.state.firstAnswer)
    }

    this.setState({ result, firstAnswer: false })
  }

  onCorrectAnswer = (score, firstAnswer) => {
    const { headWord, grammarTag } = this.state.question

    this.props.onReport({
      headWord,
      grammarTag,
      score: firstAnswer ? score : 0,
    })

    setTimeout(() => {
      this.nextQuestion()
      this.setState({ result: null })
    }, this.props.answerDelay)
  }

  restart = async () => {
    const { level, numberOfQuestions } = this.props
    const all = await lookupWords(level.words)
    const questions = getQuestions(all, level.prompts, numberOfQuestions)
    this.questions = shuffle(questions)
    this.setState(Quiz.initialState, () => this.nextQuestion())
  }

  nextQuestion = () => {
    const nextIndex = this.state.currentQuestionIndex + 1

    if (nextIndex === this.questions.length) {
      this.setState({ isGameOver: true })
      return
    }

    const { question } = getQuestion(this.questions[nextIndex], this.props.level.prompts)

    this.setState({
      question,
      firstAnswer: true,
      currentQuestionIndex: nextIndex,
    })
  }

  render() {
    const { question, result, isGameOver, currentQuestionIndex } = this.state
    const { level } = this.props

    if (!question) {
      return null
    }

    return (
      <div className={styles.root}>
        <div className={styles.content}>
          <Logo />
          {isGameOver ? (
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
                <AnswerBox questionNumber={currentQuestionIndex} onEnter={this.onAnswer} />

                <div>{result}</div>
              </div>
              {result === 'try again' && <div>{question.form}</div>}
            </div>
            )
          }
        </div>
        <Footer />
      </div>
    )
  }
}
