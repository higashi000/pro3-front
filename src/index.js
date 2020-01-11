import React from 'react'
import ReactDOM from 'react-dom'

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ws: null,
      message: '',
      id: '',
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

      if (message.message === "game start" || message.message === "draw card") {
        this.setState({message: message.card})
        console.log(message.card)
      } else if (message.message === "successful connect") {
        this.setState({id: message.id})
        this.setState({message: message.message})
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
      <div>Your ID :{this.state.id}</div>
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
