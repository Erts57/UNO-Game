import _ from "lodash";
import data from "../json/uno.json";

/**
 * * Gets a random color.
 * @param {string} [invalidColor] A color that shouldn't be picked
 * @returns {string} A color
 */
export function randomColor(invalidColor) {
    let colors = data.colors;
    if (invalidColor != undefined) {
        colors.splice(colors.indexOf(invalidColor));
    }
    return colors[_.random(0, colors.length - 1)];
}

/**
 * * Gets a random card type which is not a special.
 * @returns {string} A card type
 */
export function randomColoredType() {
    return data.types[_.random(0, data.types.length - 1)];
}

/**
 * * Generates a random card with a type and color from both `types` and `otherTypes`.
 * @returns {string} Random card type and color
 */
export function randomCard() {
    const types = _.concat(data.types, data.otherTypes);
    
    let card = types[_.random(0, types.length - 1)];
    card = isSpecial(card) ? card : `${randomColor()}_${card}`;
    
    return card;
}

/**
 * * Generates a random card with a type and color.
 * @returns {string} Random card type and color
 */
export function randomColoredCard() {
    let card = data.types[_.random(0, data.types.length - 1)];
    card = `${randomColor()}_${card}`;
    
    return card;
}

/**
 * * Gets the color of a card.
 * @param {string} card Card data
 * @returns {string} The color of the card
 */
export function getCardColor(card) {
    if (isSpecial(card)) {
        return "";
    }
    const cardData = _.split(card, "_", 1);
    return cardData[0];
}

/**
 * * Gets the card type of a card.
 * @param {string} card Card data
 * @returns {string} The card type of the card
 */
export function getCardType(card) {
    const cardData = _.split(card, "_");
    if (isSpecial(card)) {
        return card;
    }
    if (cardData.length > 2) {
        cardData[1] = `${cardData[1]}_${cardData[2]}`;
    }
    return cardData[1];
}

/**
 * Determines if a card is a special card
 * @param {string} card Card data
 * @returns {boolean} If the card is a special or not
 */
export function isSpecial(card) {
    return data.otherTypes.includes(card);
}
