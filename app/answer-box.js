import React from 'react'
import styles from './answer-box.css'

export class AnswerBox extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: ''
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
    if (event.key === 'Enter') {
      this.props.onEnter(this.state.value)
    }
  };

  reset = () => {
    this.setState({
      value: ''
    })
  };

  render() {
    return <input type="text" className={styles.input} value={this.state.value} onKeyPress={this.handleKeyPress} onChange={this.handleChange} />
  }
}
