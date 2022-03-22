/**
 * Returns a random Integer between 0 and a given maximum value
 * @param {Integer} maxVal maximum value for the returned value
 * @returns a random Integer between 0 and maxVal
 */
const getRandomInt = (minVal = 0, maxVal) => {
  return Math.floor(Math.random() * (maxVal - minVal) + minVal)
}

export { getRandomInt }
