import React from 'react'
import styles from './index.css'

export default class AnswerBox extends React.Component {
  static propTypes = {
    onEnter: React.PropTypes.func.isRequired,
    questionNumber: React.PropTypes.number,
  }

  constructor(props) {
    super(props)

    this.state = {
      value: '',
    }
  }

  componentWillReceiveProps(props) {
    if (props.questionNumber !== this.props.questionNumber) {
      this.reset()
    }
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value })
  }

  handleKeyPress = (event) => {
    const { value } = this.state

    if (event.key === 'Enter') {
      this.props.onEnter(value)
    }
  }

  reset = () => {
    this.setState({
      value: '',
    })
  }

  render() {
    return (<input
      type="text"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      className={styles.input}
      value={this.state.value}
      onKeyPress={this.handleKeyPress}
      onChange={this.handleChange}
    />)
  }
}
