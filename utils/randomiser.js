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
export const getRandomPerks = (allPerks, selectedType, setPerkState) => {
  const filteredPerks = allPerks.filter(
    (perk) => perk.type === selectedType || perk.type === null
  );

  if (filteredPerks.length < 4) return;
  const shuffledPerks = [...filteredPerks]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);
  setPerkState(shuffledPerks);
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
  setAddonState
) => {
  if (characters.length === 0) return;

  const randomCharacter = getRandomCharacter(characters, setCharacterState);
  getRandomPerks(allPerks, selectedType, setPerkState);

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
