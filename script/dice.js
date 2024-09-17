import { sleep } from "../../../tool/threads.js";


/**
 * The dice application controller type.
 */
class DiceController {
	#players;

	/**
	 * Initializes a new instance by registering the basic event listeners,
	 * and initiating the controller logic.
	 */
	constructor () {
		this.#players = [
			{ firstDice: new Dice(), secondDice: new Dice(), thirdDice: new Dice() },
			{ firstDice: new Dice(), secondDice: new Dice(), thirdDice: new Dice() }
		];

		// register event listeners
		const section = document.querySelector("article.center>section.roll");
		section.querySelector("span.left button.first").addEventListener("click", event => this.processDiceRoll(0, 0));
		section.querySelector("span.left button.second").addEventListener("click", event => this.processDiceRoll(0, 1));
		section.querySelector("span.left button.third").addEventListener("click", event => this.processDiceRoll(0, 2));
		section.querySelector("span.right button.first").addEventListener("click", event => this.processDiceRoll(1, 0));
		section.querySelector("span.right button.second").addEventListener("click", event => this.processDiceRoll(1, 1));
		section.querySelector("span.right button.third").addEventListener("click", event => this.processDiceRoll(1, 2));
		section.querySelector("div.control>button.reset").addEventListener("click", event => this.processDiceReset());
	}


	/**
	 * Processes rolling a specific dice.
	 * @param playerIndex the player index
	 * @param diceIndex the dice index
	 */
	async processDiceRoll (playerIndex, diceIndex) {
		const player = this.#players[playerIndex];
		const dice = diceIndex == 0 ? player.firstDice : (diceIndex == 1 ? player.secondDice : player.thirdDice);

		const section = document.querySelector("article.center>section.roll");
		const playerSpan = section.querySelector("span." + (playerIndex == 0 ? "left" : "right"));
		const diceButton = playerSpan.querySelector("button." + (diceIndex == 0 ? "first" : (diceIndex == 1 ? "second" : "third")));
		const resetButton = section.querySelector("div.control>button.reset");
		
		diceButton.disabled = true;
		resetButton.disabled = true;
		for (let duration = 1, loop = 0; loop < 20; ++loop, duration *= 1.4) {
			diceButton.innerText = dice.roll().toString();
			await sleep(duration);
		}
		resetButton.disabled = false;
	}


	/**
	 * Processes resetting all dices.
	 */
	async processDiceReset () {
		this.#players[0].firstDice.reset();
		this.#players[0].secondDice.reset();
		this.#players[0].thirdDice.reset();
		this.#players[1].firstDice.reset();
		this.#players[1].secondDice.reset();
		this.#players[1].thirdDice.reset();

		const section = document.querySelector("article.center>section.roll");
		for (const diceButton of section.querySelectorAll("span>button")) {
			diceButton.innerText = "?";
			diceButton.disabled = false;
		}
	}
}


/**
 * Instances of this class represent dices.
 */
class Dice extends Object {
	static #MIN_FACE_COUNT = 2;
	static #MAX_FACE_COUNT = 100;

	#faceCount;
	#faceValue;


	/**
	 * Initializes a new instance.
	 * @param faceCount the (optional) number of faces, or none for six
	 */
	constructor (faceCount = 6) {
		super();
		if (faceCount < Dice.#MIN_FACE_COUNT || faceCount > Dice.#MAX_FACE_COUNT) throw new RangeError();

		this.#faceCount = faceCount;
		this.#faceValue = NaN;
	}

	/**
	 * Getter for the faceCount property
	 * @return the face count.
	 */
	get faceCount() {
		return this.#faceCount;
	}
	
	/**
	 * Getter for the faceValue property
	 * @return the face value.
	 */
	get faceValue() {
		return this.#faceValue;
	}
	
	/**
	 * Rolls this dice and returns the new face value.
	 * @return the new face value
	 */
	roll () {
		this.#faceValue = Math.floor(Math.random() * this.#faceCount) + 1;
		return this.#faceValue;
	}


	/**
	 * Resets this dice.
	 */
	reset () {
		this.#faceValue = NaN;
	}
}


/**
 * Register a listener for the window's "load" event.
 */
window.addEventListener("load", event => {
	const controller = new DiceController();
	console.log(controller);
	console.log(Object)
});
