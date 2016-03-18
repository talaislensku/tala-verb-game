import React from 'react'
import Logo from './logo'
import Footer from './footer'
import styles from './main.css'
import { AnswerBox } from './answer-box'
import axios from 'axios'
import _ from 'lodash'

const apiUrl = 'http://api.tala.7774bdab.svc.dockerapp.io'
const wordIds = [424804, 469289]

const prompts = {
  'GM-FH-NT-1P-ET': 'ég',
  'GM-FH-NT-2P-ET': 'þú',
  'GM-FH-NT-3P-ET': 'hann',
  'GM-FH-NT-1P-FT': 'við',
  'GM-FH-NT-2P-FT': 'þið',
  'GM-FH-NT-3P-FT': 'þeir',
  'GM-SAGNB': 'ég hef'
}

const supportedTags = Object.keys(prompts)

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
    let [form, ...remainingForms] = forms

    return {
      question: {
        form,
        prompt: prompts[form.grammarTag]
      },
      forms: remainingForms,
    }
  }

  nextWord() {
    let id = wordIds[0] // get random id

    axios.get(`${apiUrl}/id/${id}`).then(({data}) => {
      let headWord = data[0].headWord

      let supportedForms = data[0].forms.filter(form =>
        supportedTags.includes(form.grammarTag))

      let {question, forms} = this.getQuestion(_.shuffle(supportedForms))

      this.setState({
        forms,
        headWord,
        question,
        isGameOver: false,
      })
    })
  }

  nextQuestion = () => {
    if (this.state.forms.length === 0) {
      this.setState({ isGameOver: true })
      return
    }

    let {question, forms} = this.getQuestion(this.state.forms)

    this.setState({
      question,
      forms
    })
  };

  componentDidMount() {
    this.nextWord()
  }

  onAnswer = (answer) => {
    if (answer === this.state.question.form.form) {
      this.setState({ result: 'correct' })

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
