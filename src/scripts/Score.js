'use strict';

/*--------------------------------------------------------------------------- *
 * Keyboard Ninja
 * Jodi-Ann Barrett
 * 
 * */

class Score {
    #date;
    #hits;
    #percentage;

    constructor(date, hits, percentage) {
        this.#date = date;
        this.#hits = hits;
        this.#percentage = percentage;
    }

    get date() {
        return this.#date;
    }
    
    get hits() {
        return this.#hits;
    }
    
    get percentage() {
        return (this.#hits / this.#percentage) * 100;
    }
}

export default Score;