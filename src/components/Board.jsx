import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import _ from "lodash";
import deck from "./constants";

class Board extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cards: [],
			activeCards: [],
			pairsGuessed: 0,
		};
	}

	componentDidMount() {
		this.generateCards(this.props.grid_size);
	}

	componentDidUpdate() {
		if (this.state.activeCards.length === 2) {
			window.setTimeout(() => this.compareCards(this.state.activeCards), 1000);
		}
		
	}

	generateCards = (size) => {
		let cardsSetup = _.slice(_.shuffle(deck), 0, this.props.grid_size);
		let pairs = _.cloneDeep(cardsSetup);
		cardsSetup = _.concat(cardsSetup, pairs);
		cardsSetup = _.shuffle(cardsSetup);
		return this.setState({ cards: cardsSetup });
	};
	toggleActive = (e, card, index) => {
		e.preventDefault();
		if (this.state.activeCards.length < 2) {
			this.updateActiveCards(index);
			this.updateCardState(card, index, "active");
		}
	};
	updateActiveCards = (index) => {
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
				if (this.state.pairsGuessed === this.props.grid_size) {
					this.props.gameWon();
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
			<Grid.Column key={index}>
				<div
					className="tarot-card centered"
					key={index}
					disabled={this.state.cards[index].disabled}
					style={{
						color: "white",
						textShadow: "1px 1px #000",
						backgroundImage: this.state.cards[index].active
							? `url(${this.state.cards[index].url})`
							: null,
					}}
					onClick={(e, c, i) => this.toggleActive(e, card, index)}
				>
					{card.name}
				</div>
			</Grid.Column>
		);
	};

	render() {
		return (
			<div className="board">
				<Grid columns={this.props.grid_size}>
					<Grid.Row>
						{this.state.cards.map((card, index) => this.pullColumn(card, index))}
					</Grid.Row>
				</Grid>
			</div>
		);
	}
}

export default Board;
