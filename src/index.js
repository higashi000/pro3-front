import React from 'react'
import ReactDOM from 'react-dom'

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ws: null,
      message: '',
      sendButton: null,
    };
  }

  componentDidMount() {
    var ws = new WebSocket("ws://localhost:9001");

    ws.onopen = () => {
      this.setState({ws: ws});
    }

    ws.onmessage = evt => {
      console.log(evt.data)
      const message = JSON.parse(evt.data)
      this.setState({dataFromServer: message})
      console.log(message)

      if (message.message === "game start") {
        this.setState({message: message.card})
      } else {
        this.setState({message: message.message})
      }
    }
  }

  sendStr() {
    this.state.ws.send("{\"request\":\"draw\"}")
  }

  render() {
    return (
      <div>
      {this.state.message}
      <button onClick={this.sendStr.bind(this)}></button>
      </div>
    );
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
