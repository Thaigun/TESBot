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

/**
 * Returns the given array, shuffled.
 */
function shuffled(arr) {
    let newArr = arr.slice();
    for (let i = 0; i < arr.length; i++) {
        let swapIdx = randomInt(0, arr.length - 1);
        let old = newArr[i];
        newArr[i] = newArr[swapIdx];
        newArr[swapIdx] = old;
    }
    return newArr;
}

module.exports = {
    randomInt: randomInt,
    rndChoose: randomFromArray
};