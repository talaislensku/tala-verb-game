import React from 'react'
import Logo from '../logo'
import Footer from '../footer'
import styles from './index.css'
import AnswerBox from '../answer-box'

import { level } from '../../levels'
import { shuffle } from 'lodash'
import { createLevel, getResult, getQuestion } from '../../lib/questions'

export default class Quiz extends React.Component {
  static initialState = {
    result: null,
    isGameOver: false,
  }

  static propTypes = {
    level: React.PropTypes.array,
    numberOfQuestions: React.PropTypes.number,
    onReport: React.PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = Quiz.initialState
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
    const questions = await createLevel(this.props.level, this.props.numberOfQuestions)
    this.questions = shuffle(questions)
    this.setState(Quiz.initialState, () => this.nextQuestion())
  }

  nextQuestion = () => {
    if (this.state.startTime) {
      this.props.onReport(
        this.state.question.form,
        this.state.question.grammarTag,
        Date.now() - this.state.startTime
      )
    }

    if (this.questions.length === 0) {
      this.setState({ isGameOver: true })
      return
    }

    const { question, questions } = getQuestion(this.questions, level.prompts)
    this.questions = questions

    this.setState({
      question,
      startTime: Date.now(),
    })
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
                <AnswerBox ref="answer" onEnter={this.onAnswer} />
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
