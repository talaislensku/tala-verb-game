import React from 'react'
import Logo from './logo'
import Footer from './footer'
import styles from './main.css'
import { AnswerBox } from './answer-box'
import axios from 'axios'
import _ from 'lodash'

const apiUrl = 'http://api.tala.7774bdab.svc.dockerapp.io'
const numberOfQuestions = 10

const level = {
  name: 'Present tense',
  words: ['tala', 'fara', 'vera', 'segja'],
  prompts: {
    'GM-FH-NT-1P-ET': ['ég'],
    'GM-FH-NT-2P-ET': ['þú'],
    'GM-FH-NT-3P-ET': ['hann', 'hún', 'það'],
    'GM-FH-NT-1P-FT': ['við'],
    'GM-FH-NT-2P-FT': ['þið'],
    'GM-FH-NT-3P-FT': ['þeir', 'þær', 'þau']
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

export class Main extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      id: null,
      data: null,
      result: null,
      isGameOver: false,
    }
  }

  getQuestion(questions) {
    let [question, ...remainingQuestions] = questions

    return {
      question: {
        ...question,
        prompt: _.shuffle(level.prompts[question.grammarTag])[0]
      },
      questions: remainingQuestions
    }
  }

  createLevel(words) {
    Promise.all(words.map(word => axios.get(`${apiUrl}/find/${word}`)))
      .then(all => all
        .map(x => x.data)
        .map(x => x.filter(y => y.wordClass === 'so'))
        .map(x => x[0]))
      .then(words => {
        let questions = _.flatten(words.map(({headWord, forms}) =>
          forms
            .filter(form => supportedTags.includes(form.grammarTag))
            .map(form => {
              form.headWord = headWord
              delete form.tags
              return form
            })))

        this.setState({
          questions: _.shuffle(questions).slice(0, numberOfQuestions),
          isGameOver: false,
        }, () => this.nextQuestion())
      })
  }

  nextQuestion = () => {
    if (this.state.startTime) {
      console.log(this.state.question.form, this.state.question.grammarTag, Date.now() - this.state.startTime)
    }

    if (this.state.questions.length === 0) {
      this.setState({ isGameOver: true })
      return
    }

    let {question, questions} = this.getQuestion(this.state.questions)

    this.setState({
      question,
      questions,
      startTime: Date.now()
    })
  };

  componentDidMount() {
    this.restart()
  }

  onAnswer = (answer, keyPresses) => {
    if (answer === this.state.question.form) {

      if (keyPresses === this.state.question.form.length) {
        this.setState({ result: 'perfect' })
      } else {
        this.setState({ result: 'correct' })
      }

      setTimeout(() => {
        this.refs.answer.reset()
        this.nextQuestion()

        this.setState({ result: null })
      }, 1000)

    } else {
      this.setState({ result: 'try again' })
    }
  };

  restart = () => {
    this.createLevel(level.words)
  };

  render() {
    const { question, result, isGameOver } = this.state

    if (!question) {
      return <div />
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
                  { question && <div className={styles.prompt}>{question.prompt}</div> }
                  <AnswerBox ref="answer" onEnter={this.onAnswer} />
                  { result && <div>{result}</div> }
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
