import { Component } from "react";
import { Button } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import _ from "lodash";
import GameFinished from "./components/GameFinished";
import deck from "./components/constants";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cards: [],
			grid_size: 6,
			activeCards: [],
			pairsGuessed: 0,
			is_game_won: false,
			next_game_grid_size: 0,
		};
	}
	componentDidMount() {
		this.generateCards(this.state.grid_size);
	}
	componentDidUpdate() {
		if (this.state.activeCards.length === 2) {
			window.setTimeout(() => this.compareCards(this.state.activeCards), 800);
		}
	}
	generateCards = (size) => {
		let cardsSetup = _.slice(_.shuffle(_.cloneDeep(deck)), 0, this.state.grid_size);
		let pairs = _.cloneDeep(cardsSetup);
		cardsSetup = _.concat(cardsSetup, pairs);
		cardsSetup = _.shuffle(cardsSetup);
		return this.setState({ cards: cardsSetup });
	};

	gameWon = () => {
		this.setState({ is_game_won: true });
		
	};
	selectGridSize = (e, size) => {
		this.setState({ next_game_grid_size: size });
	};

	startNewGame = () => {
		this.resetStates();
		this.setState({ grid_size: this.state.next_game_grid_size ? this.state.next_game_grid_size : this.state.grid_size }, () => {this.generateCards(this.state.grid_size)});
		

	};

	//here starts
	
	resetStates = () => {
		this.setState({cards: [], activeCards: [], pairsGuessed: 0, is_game_won: false });
	};
	toggleActive = (e, card, index) => {
		e.preventDefault();
		if (this.state.activeCards.length < 2) {
			this.updateActiveCards(index);
			this.updateCardState(card, index, "active");
		}
	};
	updateActiveCards = (index) => {
		if (this.state.activeCards && this.state.activeCards[0] === index) {
			this.setState({ activeCards: [] });
			return;
		}
		let activeCards = [...this.state.activeCards];
		activeCards.push(index);
		this.setState({ activeCards: activeCards });
	};

	updateCardState = (card = {}, index, property) => {
		switch (property) {
			case "active":
				card.active = !card.active;
				break;
			case "disabled":
				card.disabled = !card.disabled;
				break;
			default:
		}
		let updatedCards = [...this.state.cards];
		updatedCards[index] = card;
		this.setState({ cards: updatedCards });
	};

	compareCards = (activeCards) => {
		if (activeCards.length !== 2) {
			return;
		}
		if (
			this.state.cards[activeCards[0]].name ===
			this.state.cards[activeCards[1]].name
		) {
			this.updateCardState(
				this.state.cards[activeCards[0]],
				activeCards[0],
				"disabled"
			);

			this.updateCardState(
				this.state.cards[activeCards[1]],
				activeCards[1],
				"disabled"
			);
			this.setState({ pairsGuessed: this.state.pairsGuessed + 1 }, () => {
				if (this.state.pairsGuessed === this.state.grid_size) {
					this.gameWon();
				}
			});
		} else {
			this.updateCardState(
				this.state.cards[activeCards[0]],
				activeCards[0],
				"active"
			);
			this.updateCardState(
				this.state.cards[activeCards[1]],
				activeCards[1],
				"active"
			);
		}
		this.setState({ activeCards: [] });
	};

	pullColumn = (card, index) => {
		return (
			<Grid.Column key={index} className="centered" stretched>
				<div
					className={`tarot-card ${this.state.cards[index].active ? "active" : ""}`}
					key={index}
					disabled={this.state.cards[index].disabled}
					style={{
						color: "white",
						textShadow: "1px 1px #000",
					}}
					onClick={(e, c, i) => this.toggleActive(e, card, index)}
				>
					<div className="content">
						<div className="back"></div>
						<div
							className="front"
							style={{
								backgroundImage: `url(${this.state.cards[index].url})`,
							}}
						></div>
					</div>
				</div>
			</Grid.Column>
		);
	};
	//here ends
	render() {
		return (
			<div className="App">
				<div className="App-header"></div>
				<div className="game-options-container">
					<div className="game-options">
						<Button.Group>
							<Button
								basic
								active={this.state.next_game_grid_size === 6}
								inverted
								color="yellow"
								onClick={(e, size) => this.selectGridSize(e, 6)}
							>
								6
							</Button>
							<Button
								basic
								active={this.state.next_game_grid_size === 8}
								inverted
								color="yellow"
								onClick={(e, size) => this.selectGridSize(e, 8)}
							>
								8
							</Button>
							<Button
								basic
								active={this.state.next_game_grid_size === 10}
								inverted
								color="yellow"
								onClick={(e, size) => this.selectGridSize(e, 10)}
							>
								10
							</Button>
						</Button.Group>
						<Button
							animated
							id="start-btn"
							disabled={!this.state.next_game_grid_size}
							onClick={this.startNewGame}
						>
							<Button.Content visible>Start New Game?</Button.Content>
							<Button.Content hidden>Start!</Button.Content>
						</Button>
					</div>
				</div>
				{/* GAME BOARD */}
				<Grid columns={this.state.grid_size} className='board'>
					<Grid.Row>
						{this.state.cards.map((card, index) => this.pullColumn(card, index))}
					</Grid.Row>
				</Grid>
				{this.state.is_game_won ? <GameFinished startNewGame={this.startNewGame}/> : null}
			</div>
		);
	}
}

export default App;
