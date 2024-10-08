import { sleep } from "../../../tool/threads.js";
import Controller from "../../../tool/controller.js";
import Dice from "./dice.js";


/**
 * The dice application controller type.
 */
class DiceController extends Controller {
	#players;


	/**
	 * Initializes a new instance by registering the basic event listeners,
	 * and initiating the controller logic.
	 */
	constructor () {
		super();
		this.#players = [
			{ dice: [ new Dice(), new Dice(), new Dice() ] },
			{ dice: [ new Dice(), new Dice(), new Dice() ] }
		];

		// register event listeners
		this.leftDiceButtons[0].addEventListener("click", event => this.processDiceRoll(0, 0));
		this.leftDiceButtons[1].addEventListener("click", event => this.processDiceRoll(0, 1));
		this.leftDiceButtons[2].addEventListener("click", event => this.processDiceRoll(0, 2));
		this.rightDiceButtons[0].addEventListener("click", event => this.processDiceRoll(1, 0));
		this.rightDiceButtons[1].addEventListener("click", event => this.processDiceRoll(1, 1));
		this.rightDiceButtons[2].addEventListener("click", event => this.processDiceRoll(1, 2));
		this.evaluateButton.addEventListener("click", event => this.processEvaluation());
		this.resetButton.addEventListener("click", event => this.processDiceReset());
	}


	// get/set accessors
	get rollSection () { return this.center.querySelector("section.roll"); }
	get evaluateButton () { return this.rollSection.querySelector("div.control>button.evaluate"); }
	get resetButton () { return this.rollSection.querySelector("div.control>button.reset"); }
	get leftSpan () { return this.rollSection.querySelector("span.left"); }
	get rightSpan () { return this.rollSection.querySelector("span.right"); }
	get leftDiceButtons () { return Array.from(this.leftSpan.querySelectorAll("button")); }
	get rightDiceButtons () { return Array.from(this.rightSpan.querySelectorAll("button")); }


	/**
	 * Processes rolling a specific dice.
	 * @param playerIndex the player index
	 * @param diceIndex the dice index
	 */
	async processDiceRoll (playerIndex, diceIndex) {
		const player = this.#players[playerIndex];
		const dice = player.dice[diceIndex];
		const diceButtons = playerIndex == 0 ? this.leftDiceButtons : this.rightDiceButtons;
		const diceButton = diceButtons[diceIndex];

		diceButton.disabled = true;
		this.evaluateButton.disabled = true;
		this.resetButton.disabled = true;
		for (let duration = 1, loop = 0; loop < 20; ++loop, duration *= 1.4) {
			const fileName = "dice-" + dice.roll() + "-6.png";
			diceButton.querySelector("img").src = "image/" + fileName;
			await sleep(duration);
		}
		this.evaluateButton.disabled = false;
		this.resetButton.disabled = false;
	}


	/**
	 * Processes resetting all dices.
	 */
	async processDiceReset () {
		this.messageOutput.value = "";

		for (const player of this.#players)
			for (const dice of player.dice)
				dice.reset();

		for (const diceButton of this.leftDiceButtons.concat(this.rightDiceButtons)) {
			diceButton.querySelector("img").src = "image/dice.png";
			diceButton.disabled = false;
		}
	}


	/**
	 * Processes evaluating the dices.
	 */
	async processEvaluation () {
		const diceFaceSums = this.#players.map(player => player.dice.reduce((accu, element) => accu + element.faceValue, 0));

		if (diceFaceSums.some(value => Number.isNaN(value))) {
			this.messageOutput.value = "Das aktuelle Spiel ist noch nicht beendet!";
		} else if (diceFaceSums[0] > diceFaceSums[1]) {
			this.messageOutput.value = "Spieler 1 hat mit Summe " + diceFaceSums[0] + " gewonnen!";
		} else if (diceFaceSums[0] < diceFaceSums[1]) {
			this.messageOutput.value = "Spieler 2 hat mit Summe " + diceFaceSums[1] + " gewonnen!";
		} else {
			this.messageOutput.value = "Das Spiel endete mit Summe " + diceFaceSums[0] + " unentschieden!";
		}			
	}
}



/**
 * Register a listener for the window's "load" event.
 */
window.addEventListener("load", event => {
	const controller = new DiceController();
	console.log(controller);
});
