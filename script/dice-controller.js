import { sleep } from "../../../tool/threads.js";
import Controller from "../../../tool/controller.js";
import Dice from "../../../tool/dice.js";

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
		const section = this.center.querySelector("section.roll");
		section.querySelector("span.left button.first").addEventListener("click", event => this.processDiceRoll(0, 0));
		section.querySelector("span.left button.second").addEventListener("click", event => this.processDiceRoll(0, 1));
		section.querySelector("span.left button.third").addEventListener("click", event => this.processDiceRoll(0, 2));
		section.querySelector("span.right button.first").addEventListener("click", event => this.processDiceRoll(1, 0));
		section.querySelector("span.right button.second").addEventListener("click", event => this.processDiceRoll(1, 1));
		section.querySelector("span.right button.third").addEventListener("click", event => this.processDiceRoll(1, 2));
		section.querySelector("div.control>button.reset").addEventListener("click", event => this.processDiceReset());
	}


	// get/set accessors
	get rollSection () { return this.center.querySelector("section.roll"); }
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
		this.resetButton.disabled = true;
		for (let duration = 1, loop = 0; loop < 20; ++loop, duration *= 1.4) {
			diceButton.querySelector("img").src = "image/dice-" + dice.roll() + "-6.png";
			await sleep(duration);
		}
		this.resetButton.disabled = false;
	}


	/**
	 * Processes resetting all dices.
	 */
	async processDiceReset () {
		for (const player of this.#players)
			for (const dice of player.dice) 
				dice.reset();

		for (const diceButton of this.leftDiceButtons.concat(this.rightDiceButtons)) {
			diceButton.querySelector("img").src = "image/dice.png";
			diceButton.disabled = false;
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
