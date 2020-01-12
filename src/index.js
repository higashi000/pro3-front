import React from 'react'
import ReactDOM from 'react-dom'

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ws: null,
      card: [],
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
        this.setState({card: message.card})
        this.setState({message: message.message})
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
        <div>{this.state.message}</div>
        <div><button onClick={this.sendStr.bind(this)}>Draw</button></div>
        <div>
          {this.state.card.map((card) => (
            <li>{card}</li>
          ))}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
