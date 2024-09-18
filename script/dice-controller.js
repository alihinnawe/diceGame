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
		this.rollSection.querySelector("span.left button.first").addEventListener("click", event => this.processDiceRoll(0, 0));
		this.rollSection.querySelector("span.left button.second").addEventListener("click", event => this.processDiceRoll(0, 1));
		this.rollSection.querySelector("span.left button.third").addEventListener("click", event => this.processDiceRoll(0, 2));
		this.rollSection.querySelector("span.right button.first").addEventListener("click", event => this.processDiceRoll(1, 0));
		this.rollSection.querySelector("span.right button.second").addEventListener("click", event => this.processDiceRoll(1, 1));
		this.rollSection.querySelector("span.right button.third").addEventListener("click", event => this.processDiceRoll(1, 2));
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
		this.resetButton.disabled = true;
		for (let duration = 1, loop = 0; loop < 20; ++loop, duration *= 1.4) {
			const fileName = "dice-" + dice.roll() + "-6.png";
			diceButton.querySelector("img").src = "image/" + fileName;
			await sleep(duration);
		}
		console.log(dice.faceValue)
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
	
	/**
	 * Processes evaluating all dices.
	 */
	async processEvaluation () {
		output_result.value = "";
		const player1_dice_1 = this.#players[0].dice[0].faceValue;
		const player1_dice_2 = this.#players[0].dice[1].faceValue;
		const player1_dice_3 = this.#players[0].dice[2].faceValue;
		const player2_dice_1 = this.#players[1].dice[0].faceValue;
		const player2_dice_2 = this.#players[1].dice[1].faceValue;
		const player2_dice_3 = this.#players[1].dice[2].faceValue;
		
		console.log("processEvaluation",player1_dice_1,player1_dice_2,player1_dice_3,player2_dice_1,player2_dice_2,player2_dice_3);
		if (Number.isNaN(player1_dice_1) || Number.isNaN(player1_dice_2) || Number.isNaN(player1_dice_3) ||
			Number.isNaN(player2_dice_1) || Number.isNaN(player2_dice_2) || Number.isNaN(player2_dice_3)) 
		{
			console.log("CONTINUE PLAYING");
		}
		
		else{
			
			let player1_results = player1_dice_1 + player1_dice_2 + player1_dice_3;
			let player2_results = player2_dice_1 + player2_dice_2 + player2_dice_3;
			let output_result = document.querySelector("input");
			
			if (player1_results > player2_results) {
				output_result.value = "Player one wins.";
			}
			
			else if (player2_results > player1_results){
				
				output_result.value = "Player two wins.";
			}
			
			else {
				output_result.value = alert("no one wins.");
				this.processDiceReset();
				for (const diceButton of this.leftDiceButtons.concat(this.rightDiceButtons)) {
					diceButton.querySelector("img").src = "image/dice.png"; 
					diceButton.disabled = false; };
					output_result.value = "";
				
				
			}
			
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