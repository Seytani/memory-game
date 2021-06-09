import React from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

const GameFinished = () => {
	const [open, setOpen] = React.useState(true);

	return (
		<Modal
			basic
			onClose={() => setOpen(false)}
			onOpen={() => setOpen(true)}
			open={open}
			size="small"
		>
			<Header icon>
				<Icon name="heart" />
				Yay! You found all pairs!
			</Header>
			<Modal.Content>
				<p className='centered'>
					Do you want to play again?
				</p>
			</Modal.Content>
			<Modal.Actions className='centered'>
				<Button basic color="yellow" inverted onClick={() => setOpen(false)}>
					<Icon name="remove" /> Nope
				</Button>
				<Button color="violet" inverted onClick={() => setOpen(false)}>
					<Icon name="checkmark" /> Yes
				</Button>
			</Modal.Actions>
		</Modal>
	);
};
export default GameFinished;
