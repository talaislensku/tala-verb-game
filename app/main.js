import React from 'react'
import Logo from './logo'
import Footer from './footer'
import styles from './main.css'
import { AnswerBox } from './answer-box'
import axios from 'axios'
import _ from 'lodash'

const apiUrl = 'http://api.tala.7774bdab.svc.dockerapp.io'

const level = {
  name: 'Present tense',
  words: ['tala', 'fara', 'vera', 'segja', 'fá'],
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
  words: ['tala', 'fara', 'vera'],
  prompts: {
    'GM-SAGNB': ['ég hef', 'ég get', 'hann getur']
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

  getQuestion(forms) {
    let [form, ...remainingForms] = _.shuffle(forms)

    return {
      question: {
        form,
        prompt: _.shuffle(level.prompts[form.grammarTag])[0]
      },
      forms: remainingForms,
    }
  }

  nextWord() {
    let id = _.shuffle(level.words)[0] // get random id

    axios.get(`${apiUrl}/find/${id}`)
    .then(({data}) => {
      let word = data.filter(x => x.headWord === id && x.wordClass === 'so')[0]

      if (!word) {
        throw new Error('Word not found')
      }

      return word
    })
    .then(word => {
      let headWord = word.headWord

      let forms = word.forms.filter(form =>
        supportedTags.includes(form.grammarTag))

      this.setState({
        forms,
        headWord,
        isGameOver: false,
      }, () => this.nextQuestion())
    })
  }

  nextQuestion = () => {
    if (this.state.startTime) {
      console.log(this.state.question.form, Date.now() - this.state.startTime)
    }

    if (this.state.forms.length === 0) {
      // this.setState({ isGameOver: true })
      this.nextWord()
      return
    }

    let {question, forms} = this.getQuestion(this.state.forms)

    this.setState({
      question,
      forms,
      startTime: Date.now()
    })
  };

  componentDidMount() {
    this.nextWord()
  }

  onAnswer = (answer, keyPresses) => {
    if (answer === this.state.question.form.form) {

      if (keyPresses === this.state.question.form.form.length) {
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
    this.nextWord()
  };

  render() {
    const { forms, headWord, question, result, isGameOver } = this.state

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
                <h1 className={styles.headWord}>{headWord}</h1>
                <div className={styles.inline}>
                  { question && <div className={styles.prompt}>{question.prompt}</div> }
                  <AnswerBox ref="answer" onEnter={this.onAnswer} />
                  { result && <div>{result}</div> }
                </div>
              </div>
            )
          }
        </div>
        <Footer />
      </div>
    )
  }
}
