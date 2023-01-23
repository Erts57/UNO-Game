import { deck, currentCard, gameState } from "./game";
import { cards } from "./cards";

const win = document.getElementById("win");
const lose = document.getElementById("lose");

let titleShown = false;

setInterval(() => {
    if (!titleShown) {
        for (let i = 0; i < deck.length; i++) {
            document.getElementById(`card-${i + 1}-image`).src = cards[deck[i]];
        }
        document.getElementById("current-card-image").src = cards[currentCard];
    }

    if (gameState === "win" && !titleShown) {
        win.classList.remove("hide");
        win.classList.add("show");

        titleShown = true;
    } else if (gameState === "lose" && !titleShown) {
        lose.classList.remove("hide");
        lose.classList.add("show");

        titleShown = true;
    }
}, 60);
