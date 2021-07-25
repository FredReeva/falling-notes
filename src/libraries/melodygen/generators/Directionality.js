import * as Utils from '../utils.js';

/*This class computes a sign (+,-,0) assiciated to each window with some probabilities. 
A sign describes the melodic contour of each window. For a positive sign, a pitch greater than 
a moving average is allowed (for negative, vice versa). For a neutral sign, a pitch has to
be within a range of +2/-2 diatonic steps.
*/
export class Directionality {
    constructor(piece) {
        this.piece = piece;
    }

    //Sign of the segments
    generate() {
        let history = 2;
        let queue = [];

        for (let i = 0; i < this.piece.segments.length; i++) {
            //Reset queue every 3 iterations
            if (i % 3 === 0) {
                queue = [];
            }

            let directions = ['+', '-', '0'];

            //Get difference between directions and queue
            let availableChoices = directions.filter((x) => !queue.includes(x));

            let choice = null;

            while (!availableChoices.includes(choice)) {
                //If first window
                if (i === 0) {
                    choice = Utils.pickState([
                        ['+', 60],
                        ['-', 20],
                        ['0', 20],
                    ]);
                } else {
                    choice = Utils.pickState([
                        ['+', (1 / 3) * 100],
                        ['-', (1 / 3) * 100],
                        ['0', (1 / 3) * 100],
                    ]);
                }
            }

            if (queue.length === history) {
                queue.shift();
            }

            queue.push(choice);
            this.piece.segments[i].directionality = choice;
        }

        return this.piece;
    }
}
