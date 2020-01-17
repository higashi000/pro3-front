import React from 'react'
import ReactDOM from 'react-dom'
import Button from '@material-ui/core/Button'
import './index.css'

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ws: null,
      card: [],
      rank: '',
      rankStr: '',
      ranking: [],
      drawCard: './img/card_back.png',
      message: '',
      id: '',
      dispButton: false,
      dispRanking: false,
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

      if (message.message === "game start" || message.message === "draw card" || message.message === "drawn card") {
        var card = []
        for (var j = 0; j < message.card.length; ++j) {
          card.push("./img/" + message.card[j] + ".png")
        }
        this.setState({card: card})
        var drawCard = ""
        if (message.draw_card == undefined) {
          drawCard = "card_back"
        } else {
          drawCard = message.draw_card
        }
        this.setState({drawCard: ("./img/" + drawCard + ".png")})
        this.setState({message: message.message})
        this.setState({dispButton: true})
      }
      else if (message.message === "successful connect") {
        this.setState({id: message.id})
        this.setState({message: message.message})
      }
      else if (message.message === "game finish") {
        this.setState({rankStr: "Your Rank: "})
        this.setState({ranking: message.ranking})
        this.setState({dispButton: false})
        this.setState({dispRanking: true})

        console.log(this.state.id)
        for (var i = 0; i < 4; ++i) {
          console.log(message.ranking[i])
          if (message.ranking[i] === this.state.id) {
            this.setState({rank: String(i + 1)})
            break
          }
        }
        this.setState({card: []})
      }
      else if (message.message === "You win"){
        this.setState({card: []})
        this.setState({dispButton: false})
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
        {this.state.dispButton && (
          <div>
					<Button variant = "contained" color = "primary" onClick = {this.sendStr.bind(this)}>
						Draw
					</Button>
					</div>
        )}
        <div>
          {this.state.card.map((card) => (
            <img src={card} height = "8%" width = "8%" alt = {card} />
          ))}
        </div>
        <div>
          <p>Draw Card</p>
          <img src={this.state.drawCard} height = "9%" width = "9%" alt = {this.state.drawCard} />
        </div>
        {this.state.dispRanking && (
          <div>
            <li>1st: {this.state.ranking[0]}</li>
            <li>2nd: {this.state.ranking[1]}</li>
            <li>3rd: {this.state.ranking[2]}</li>
            <li>4th: {this.state.ranking[3]}</li>
          </div>
        )}
      </div>
    );
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
