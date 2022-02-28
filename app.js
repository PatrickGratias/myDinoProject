/**
 * @description Gets the dino data from the json file
 * @returns an Array with the data
 */
 async function getDinoDataFromFile() {
    const dinoDataJson = await fetch("./dino.json");
    const dinoData = await dinoDataJson.json();

    return dinoData.Dinos;

}

/**
 * @description Represents a universal lifeform
 * @constructor
 * @param {string} species - The name of the lifeform
 * @param {number} weight - The weight of the lifeform
 * @param {number} height - The height of the lifeform
 * @param {string} diett - The diet of the lifeform
 */
class Lifeform {
    constructor(species, weight, height, diet) {
        this.species = species;
        this.weight = weight;
        this.height = height;
        this.diet = diet;
    }
}

/**
 * @description Represents a dinosaur lifeform by extending the lifeform object by
 * @constructor
 * @param {string} where - where the dinosaur lived
 * @param {number} when - when the dinosaur lived
 * @param {string} fact - a random fact about the dinosaur
 */
class Dino extends Lifeform {
    constructor(species, weight, height, diet, where, when, fact) {
        super(species, weight, height, diet);
        this.where = where;
        this.when = when;
        this.fact = fact;
    }

    /**
     * @description Compare a given weight with the dinosaurs one
     * @param {number} weight - the weight the dino is to compared with
     * @returns the result of the comparison as a fact in a string
     */
    compareWeight(weight) {
        if (this.weight === weight) {
            return `This ${this.species} has the same weight as you, wow! ${weight} lbs.`;
        } else if (this.weight < weight) {
            return `This ${this.species} is lighter then you. ${this.weight} lbs to ${weight} lbs.`;
        } else if (this.weight > weight) {
            return `This ${this.species} is heavier then you. ${this.weight} lbs to ${weight} lbs.`;
        }
    }

    /**
     * @description Compare a given height with the dinosaurs one
     * @param {number} height - the height the dino is to compared with
     * @returns the result of the comparison as a fact in a string
     */
    compareHeight(height) {
        if (this.height === height) {
            return `This ${this.species} has the same height as you, wow! ${height} inches.`;
        } else if (this.height < height) {
            return `This ${this.species} is smaller then you. ${this.height} inches to ${height} inches.`;
        } else if (this.height > height) {
            return `This ${this.species} is bigger then you. ${this.height} inches to ${height} inches.`;
        }
    }

    /**
     * @description Compare a given diet with the dinosaurs one, the given diet gets lowercased to have a good comparison
     * @param {string} diet - the diet the dino is to compared with
     * @returns the result of the comparison as a fact in a string
     */
    compareDiet(diet) {
        if (this.diet === diet.toLowerCase()) {
            return `This ${this.species} has the same diet as you have, lets have a dinner with ${this.diet}.`;
        } else if (this.diet !== diet.toLowerCase()) {
            return `This ${this.species} likes the ${this.diet} diet more then your ${diet.toLowerCase()} diet.`;
        }
    }
}


// Use IIFE to get human data from form
const theHuman = (function() {
    const humanName = document.getElementById("name").value;
    const humanWeight = Number(document.getElementById("weight").value);
    const humanHeight = ((Number(document.getElementById("feet").value) * 12) + Number(document.getElementById("inches").value));
    const humanDiet = document.getElementById('diet').value;

    // Create Human Object
    const humanObject = new Lifeform(humanName, humanHeight, humanWeight, humanDiet);

    return humanObject;

})();

/**
* @description the main function
                - removes the form
                - read the given datafile
                - adds the human data to the Array
                - creates the grid incl. random facts and comparison
                - adds the grid to the DOM
*/
function go() {
    // Remove form from screen
    const startingForm = document.getElementById("dino-compare");
    startingForm.parentElement.removeChild(startingForm);

    const theGrid = document.getElementById("grid");

    // Create Dino Objects
    getDinoDataFromFile().then(data => {
        let lifeforms = data.map(dino => new Dino(dino.species, dino.weight, dino.height, dino.diet, dino.where, dino.when, dino.fact));
        lifeforms.splice(4, 0, theHuman);
        // Generate Tiles for each Dino in Array
        lifeforms.forEach((lifeform, position) => {
            const tile = document.createElement("div");
            tile.classList.add('grid-item');
            const lifeformName = document.createElement("h4");
            tile.appendChild(lifeformName);
            const lifeformImage = document.createElement("img");
            tile.appendChild(lifeformImage);
            const lifeformFact = document.createElement("p");
            tile.appendChild(lifeformFact);

            lifeformName.innerHTML = lifeform.species;
            lifeformImage.setAttribute('src', `./images/${lifeform.species.toLowerCase()}.png`);
            if (position === 4) {
                lifeformImage.setAttribute('src', `./images/human.png`);
            }
            lifeformFact.innerHTML = lifeform.fact;
            // add a random comparison to the random fact
            const rndFact = Math.floor(Math.random() * 3);
            if (position !== 4) {
                switch (rndFact) {
                    case 0:
                        lifeformFact.innerHTML += ("<br>" + lifeform.compareWeight(theHuman.weight));
                        break;
                    case 1:
                        lifeformFact.innerHTML += ("<br>" + lifeform.compareHeight(theHuman.height));
                        break;
                    case 2:
                        lifeformFact.innerHTML += ("<br>" + lifeform.compareDiet(theHuman.diet));
                        break;
                }
            } else if (position === 4) {
                lifeformFact.innerHTML = "The unbelievable you.";
            }
            // Add tiles to DOM
            theGrid.appendChild(tile);
        });
    });
}




// On button click, prepare and display infographic
document.getElementById('btn').addEventListener('click', go);