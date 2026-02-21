import { client } from '@/dbdshuffle/sanity';

export const fetchData = async () => {
  try {
    const killerQuery = `*[_type == "killer"]{name, image, perks[]{name, image, url}, addons[]{name, image, url}}`;
    const survivorQuery = `*[_type == "survivor"]{name, image, perks[]{name, image, url}}`;
    const basePerkQuery = `*[_type == "basePerks"]{name, image, url, type}`;

    const [killersData, survivorsData, basePerksData] = await Promise.all([
      client.fetch(killerQuery),
      client.fetch(survivorQuery),
      client.fetch(basePerkQuery),
    ]);

    return { killersData, survivorsData, basePerksData };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { killersData: [], survivorsData: [], basePerksData: [] };
  }
};

// Get random killer or survivor
export const getRandomCharacter = (characters, setCharacterState) => {
  if (characters.length === 0) return null;
  const randomCharacter =
    characters[Math.floor(Math.random() * characters.length)];
  setCharacterState(randomCharacter);
  return randomCharacter;
};

// Randomise 4 perks
export const getRandomPerks = (
  allPerks,
  selectedType,
  setPerkState,
  options = {}
) => {
  const { currentPerks = [], lockedIndexes = [] } = options;
  const filteredPerks = allPerks.filter(
    (perk) => perk.type === selectedType || perk.type === null
  );

  if (filteredPerks.length < 4) return;

  const validLockedIndexes = lockedIndexes.filter(
    (index) => currentPerks[index] && index >= 0 && index < 4
  );
  const lockedPerks = validLockedIndexes.map((index) => currentPerks[index]);
  const lockedPerkNames = new Set(lockedPerks.map((perk) => perk.name));
  const unlockedIndexes = [0, 1, 2, 3].filter(
    (index) => !validLockedIndexes.includes(index)
  );
  const availablePerks = filteredPerks.filter(
    (perk) => !lockedPerkNames.has(perk.name)
  );

  if (availablePerks.length < unlockedIndexes.length) return;

  const newPerks = [...availablePerks]
    .sort(() => Math.random() - 0.5)
    .slice(0, unlockedIndexes.length);

  const nextPerks = Array(4).fill(null);
  validLockedIndexes.forEach((index) => {
    nextPerks[index] = currentPerks[index];
  });
  unlockedIndexes.forEach((index, i) => {
    nextPerks[index] = newPerks[i];
  });

  setPerkState(nextPerks);
};

// Randomise 2 add-ons (killers only)
export const getRandomAddons = (selectedCharacter, setAddonState) => {
  if (!selectedCharacter?.addons || selectedCharacter.addons.length < 2) {
    setAddonState(null);
    console.warn('No addons found or less than 2 addons available.');
    return;
  }

  const shuffledAddons = [...selectedCharacter.addons]
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);
  setAddonState(shuffledAddons);
};

export const randomiseEverything = (
  characters,
  allPerks,
  selectedType,
  setCharacterState,
  setPerkState,
  setAddonState,
  perkOptions = {}
) => {
  if (characters.length === 0) return;

  const randomCharacter = getRandomCharacter(characters, setCharacterState);
  getRandomPerks(allPerks, selectedType, setPerkState, perkOptions);

  if (selectedType === 'killer') {
    setTimeout(() => {
      getRandomAddons(randomCharacter, setAddonState);
    }, 100); // Delay to allow state update
  }
};

// Check when db (sanity) was last updated
export const getLastUpdated = async () => {
  try {
    const query = `* | order(_updatedAt desc)[0]._updatedAt`;
    const lastUpdated = await client.fetch(query);

    if (!lastUpdated) {
      return 'Unknown';
    }

    return new Date(lastUpdated).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error fetching last updated timestamp:', error);
    return 'Error fetching update time';
  }
};
