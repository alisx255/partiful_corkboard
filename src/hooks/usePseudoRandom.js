/**
 * Pseudo-random number generator using a seed
 * Ensures deterministic random values
 */
export function createPseudoRandom(seed = 12345) {
  let currentSeed = seed;

  const next = () => {
    // Linear congruential generator
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };

  const random = () => next();
  const randomBetween = (min, max) => min + next() * (max - min);
  const randomInt = (min, max) => Math.floor(randomBetween(min, max + 1));

  return { random, randomBetween, randomInt };
}

