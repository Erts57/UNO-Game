// Node Packages
import _ from "lodash";

// Local Scripts
import Game, { blankCard, maxCards, deck } from "./scripts/game";
import { getCardType, getCardColor } from "./scripts/util";
import "./scripts/update";
import { cards } from "./scripts/cards";

// Styles
import "./styles/game.scss";

const game = new Game();

game.generateDeck();
initDrawDeck();
initDeck();

function initDrawDeck() {
    var b = document.createElement("button");
    b.id = "drawing-deck";
    b.className = "cards";
    b.addEventListener("click", () => {
        cardClicked(0);
    });

    var i = document.createElement("img");
    i.id = "card-0-image";
    i.className = "card-image";
    i.src = cards.unocard;
    i.alt = "";

    b.appendChild(i);
    document.getElementById("draw-deck").appendChild(b);

    var b = document.createElement("button");
    b.id = "current-card";
    b.className = "cards";

    var i = document.createElement("img");
    i.id = "current-card-image";
    i.className = "card-image";
    i.src = cards.blank;
    i.alt = "";

    b.appendChild(i);
    document.getElementById("draw-deck").appendChild(b);
}

function initDeck() {
    for (let n = 0; n < maxCards; n++) {
        var b = document.createElement("button");
        b.id = `card-${n + 1}`;
        b.className = "cards";
        b.addEventListener("click", () => {
            cardClicked(n + 1);
        });

        var i = document.createElement("img");
        i.id = `card-${n + 1}-image`;
        i.className = "card-image";
        i.src = cards.blank;
        i.alt = "";

        b.appendChild(i);
        document.getElementById("deck").appendChild(b);
    }
}

function cardClicked(cardNumber) {
    checkWinLose();
    if (cardNumber === 0) {
        if (!game.isDeckFull()) {
            game.addRandomCard();
        }
        checkWinLose();
        return;
    }
    cardNumber = cardNumber - 1;
    if (deck[cardNumber] === blankCard) {
        return;
    }
    const card = deck[cardNumber];
    if (game.canCardMakeMatch(cardNumber)) {
        switch (getCardType(card)) {
            case "plus_4": // Plus 4 Card : Adds 4 cards if their is room and acts like a wild
                if (game.countCards() > maxCards - 3) {
                    return;
                }
                discard();
                for (let i = 0; i < 4; i++) {
                    game.addRandomCard();
                }
                return;
            case "skip": // Skip Card : Removes a random card
                discard();
                game.removeRandomCard();
                return;
            case "plus_2": // Plus 2 Card : Adds 2 cards even if their is no room
                discard();
                game.addRandomCard();
                game.addRandomCard();
                return;
            case "reverse": // Reverse Card : Changes the color of a random card
                discard();
                game.colorRandomCard(getCardColor(card));
                return;
            default: // Default Action for the rest of the cards
                discard();
                return;
        }
    }

    function discard() {
        // Put the card on the current card and remove from deck
        game.setCurrentCard(deck[cardNumber]);
        game.editCard(cardNumber, blankCard);
        checkWinLose();
    }
}

function checkWinLose() {
    if (game.isDeckFull() && !game.canMakeMatch()) {
        game.setGameState("lose"); // Lose if player can no longer make any matches
    }
    if (game.isDeckEmpty()) {
        game.setGameState("win"); // Win if all the cards from the deck are gone
    }
}
