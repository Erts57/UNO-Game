import _ from "lodash";
import {
    randomColor,
    randomColoredType,
    randomCard,
    randomColoredCard,
    getCardColor,
    getCardType,
    isSpecial
} from "./util";

const maxSpecials = 4;
export const specials = {
    wild: 0,
    plus_4: 0
};

export const blankCard = "blank";
export let maxCards = 12;

export let deck = _.split(_.repeat(`${blankCard},`, maxCards), ",", maxCards);
export let currentCard = blankCard;

export let gameState = "";

/**
 * * Methods for managing the UNO game.
 * @constructor
 */
export default class Game {
    constructor() {
        this.turns = 0;
    }

    /**
     * * Sets the `currentCard` variable.
     * @param {string} card The card
     */
    setCurrentCard(card) {
        currentCard = card;
    }

    /**
     * * Sets the `gameState` variable.
     * @param {string} state The state
     */
    setGameState(state) {
        gameState = state;
    }

    /**
     * * Edits a card's color.
     * @param {number} index The location of the card in the `deck`
     * @param {string} color The new color
     * @returns {string} The card if altered
     */
    editCardColor(index, color) {
        if (index < 0 || index > maxCards || isSpecial(deck[index])) {
            return "";
        }
        this.editCard(index, `${color.toLowerCase()}_${getCardType(deck[index])}`);
        return deck[index];
    }

    /**
     * * Edits a card's type.
     * @param {number} index The location of the card in the `deck`
     * @param {string} type The new card type
     * @returns {string} The card if altered
     */
    editCardType(index, type) {
        if (index < 0 || index > maxCards) {
            return "";
        }
        this.editCard(index, `${getCardColor(deck[index])}_${type.toLowerCase()}`);
        return deck[index];
    }

    /**
     * * Edits a card.
     * @param {number} index The location of the card in the `deck`
     * @param {string} card The new card
     * @returns {string} The card if altered
     */
    editCard(index, card) {
        if (index < 0 || index > maxCards) {
            return "";
        }
        deck[index] = card.toLowerCase();
        return deck[index];
    }

    /**
     * * Gets a random index of a occupied card in the `deck`.
     * @param {number} [ignoreIndex] An index to be ignored
     * @returns {number} An index of a occupied card
     */
    findRandomFullSlot(ignoreIndex) {
        if (ignoreIndex === undefined) {
            ignoreIndex = -1;
        }
        let indexes = [];
        for (let i = 0; i < deck.length; i++) {
            const card = deck[i];
            if (card === blankCard || i == ignoreIndex) {
                continue;
            }
            indexes.push(i);
        }
        if (indexes.length === 0) {
            return -1; // The deck is empty ...
        }
        return _.sample(indexes);
    }

    /**
     * * Gets the smallest index for a blank card in the `deck`.
     * @returns {number} An index of a blank card
     */
    findBlankSlot() {
        for (let i = 0; i < deck.length; i++) {
            const card = deck[i];
            if (card === blankCard) {
                return i;
            }
        }
        return -1; // The deck is full ...
    }

    /**
     * * Adds a card to the `deck`.
     * @param {string} card The card to be added
     * @returns {string} The card if added
     */
    addCard(card) {
        const index = this.findBlankSlot();
        if (index >= 0) {
            this.editCard(index, card);
            return deck[index];
        } else {
            return "";
        }
    }

    /**
     * * Adds a random card to the `deck`.
     * @returns {string} The card if added
     */
    addRandomCard() {
        let card = randomCard();
        if (card === "wild" && specials.wild === maxSpecials) {
            card = randomColoredCard();
        }
        if (card === "plus_4" && specials.wild === maxSpecials) {
            card = randomColoredCard();
        }
        return this.addCard(card);
    }

    /**
     * * Adds a random colored card to the `deck`.
     * @returns {string} The card if added
     */
    addRandomColoredCard() {
        return this.addCard(randomColoredCard());
    }

    /**
     * * Adds a random colored card based on the selected `color`.
     * @param {string} color The color of the card
     * @returns {string} The card if added
     */
    addRandomCardFromColor(color) {
        const card = `${color}_${randomColoredType()}`;
        return this.addCard(card);
    }

    /**
     * * Adds a random card based on the selected `type`.
     * @param {string} type The card type of the card
     * @returns {string} The card if added
     */
    addRandomCardFromType(type) {
        if (type === "wild") {
            if (specials.wild === maxSpecials) {
                return "";
            }
            return this.addCard(type);
        }
        if (type === "plus_4") {
            if (specials.wild === maxSpecials) {
                return "";
            }
            return this.addCard(type);
        }
        const card = `${randomColor()}_${type}`;
        return this.addCard(card);
    }

    /**
     * * Clears the `deck` and adds 7 random cards along with a new `currentCard`.
     */
    generateDeck() {
        specials.wild = specials.plus_4 = 0;
        deck = _.split(_.repeat(`${blankCard},`, maxCards), ",", maxCards);
        for (let i = 0; i < 7; i++) {
            this.addRandomCard();
        }
        currentCard = randomCard();
    }

    /**
     * * Removes a random card from the `deck`.
     */
    removeRandomCard() {
        this.editCard(this.findRandomFullSlot(), blankCard);
    }

    /**
     * * Gets all the indexes of the colored cards from the `deck`.
     * @param {string} [ignoreColor] A color to be ignored
     * @returns {number[]} An array of indexes
     */
    getColoredCardsIndexes(ignoreColor) {
        const coloredCards = [];
        for (let i = 0; i < deck.length; i++) {
            const card = deck[i];
            if (isSpecial(card) || card === blankCard) {
                continue;
            }
            if (getCardColor(card) === ignoreColor) {
                continue;
            }
            coloredCards.push(i);
        }
        return coloredCards;
    }

    /**
     * * Colors a random card in the `deck` a random or selected color.
     * @param {string} [color] The color for the card
     * @returns {string} The card if colored
     */
    colorRandomCard(color) {
        const _deck = this.getColoredCardsIndexes(color);
        if (_deck.length === 0) {
            return "";
        }
        const index = _.sample(_deck);
        const card = deck[index];
        this.editCardColor(index, color || randomColor(getCardColor()));
        return deck[index];
    }

    /**
     * * Determines if the `deck` has a card or not.
     * @param {string} [card] The card to look for
     * @returns {boolean} If the `deck` has the card or not
     */
    deckContains(card) {
        return deck.includes(card || blankCard);
    }

    /**
     * * Determines if the `deck` has a certain color or not.
     * @param {string} color The color to look for
     * @returns {boolean} If the `deck` contains the color or not
     */
    deckContainsColor(color) {
        let colors = [];
        for (let i = 0; i < deck.length; i++) {
            if (deck[i] === blankCard) {
                continue;
            }
            colors.push(getCardColor(deck[i]));
        }
        colors = _.compact(colors);
        return colors.includes(color);
    }

    /**
     * * Determines if the `deck` has a certain card type or not.
     * @param {string} type The card type to look for
     * @returns {boolean} If the `deck` contains the card type or not
     */
    deckContainsType(type) {
        let types = [];
        for (let i = 0; i < deck.length; i++) {
            if (deck[i] === blankCard) {
                continue;
            }
            types.push(getCardType(deck[i]));
        }
        types = _.compact(types);
        return types.includes(type);
    }

    /**
     * * Determines if the `deck` is full or not.
     * @returns {boolean} If the `deck` is full or not
     */
    isDeckFull() {
        return !this.deckContains();
    }

    /**
     * * Determines if the `deck` is empty or not.
     * @returns {boolean} If the `deck` is empty or not
     */
    isDeckEmpty() {
        return _.uniq(deck).join("") === blankCard;
    }

    /**
     * * Counts the amount of cards in the `deck`.
     * @returns {number} The amount of cards
     */
    countCards() {
        const cards = _.filter(deck, (card) => {
            return card !== blankCard;
        });
        return cards.length;
    }

    /**
     * * Determines if a match can be made from a certain card.
     * @param {number} index Location of the card in the `deck`
     * @returns {boolean} If the card can make a match
     */
    canCardMakeMatch(index) {
        const color = getCardColor(deck[index]);
        const type = getCardType(deck[index]);
        const currentColor = getCardColor(currentCard);
        const currentType = getCardType(currentCard);
        const special = isSpecial(deck[index]);
        return color === currentColor || type === currentType || isSpecial(currentCard) || special;
    }

    /**
     * * Determines if a match can be made.
     * @returns {boolean} If there can be a match made
     */
    canMakeMatch() {
        const color = getCardColor(currentCard);
        const type = getCardType(currentCard);
        const hasSpecial = this.deckContains("wild") || (this.deckContains("plus_4") && this.countCards() <= maxCards - 3);
        return (
            this.deckContainsColor(color) ||
            this.deckContainsType(type) ||
            isSpecial(currentCard) ||
            hasSpecial
        );
    }
}
