import React from 'react'
import styles from './answer-box.css'

export class AnswerBox extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: '',
      keyPresses: 0
    }
  }

  static propTypes = {
    onEnter: React.PropTypes.func.isRequired
  };

  handleChange = (event) => {
    this.setState({
      value: event.target.value
    })
  };

  handleKeyPress = (event) => {
    const { value, keyPresses  } = this.state

    if (event.key === 'Enter') {
      this.props.onEnter(value, keyPresses)
    } else {
      this.setState({
        keyPresses: keyPresses + 1
      })
    }
  };

  reset = () => {
    this.setState({
      value: '',
      keyPresses: 0
    })
  };

  render() {
    return <input
      type="text"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      className={styles.input}
      value={this.state.value}
      onKeyPress={this.handleKeyPress}
      onChange={this.handleChange} />
  }
}
