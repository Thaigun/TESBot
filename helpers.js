/**
 * Returns a random integer between the min and max (both inclusive).
 */
function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.round(Math.random() * (max - min)) + min;
}

function randomFromArray(arr) {
    return arr[randomInt(0, arr.length - 1)]
}

module.export = {
    randomInt: randomInt,
    rndChoose: randomFromArray
};