import { Component } from "react";
import Board from "./components/Board";
import GameFinished from "./components/GameFinished";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			is_game_won: false,
			grid_size: 6,
		};
	}
componentDidMount() {
}

gameWon = () => {
	console.log('doing it')
	this.setState({is_game_won: true});
};


	render() {
		return (
			<div className="App" >
				<header className="App-header">Tarot Memory Game</header>
				<div className="game-options-container">
					<div className="game-options"></div>
				</div>
				<Board
				
					grid_size={this.state.grid_size}
					gameWon={this.gameWon}
				/>
				{this.state.is_game_won ? (
					<GameFinished />
				) : null}
			</div>
		);
	}
}

export default App;
