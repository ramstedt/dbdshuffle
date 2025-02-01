'use client';
import styles from './page.module.css';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { client } from '@/dbdshuffle/sanity';
import imageUrlBuilder from '@sanity/image-url';
import Form from './components/Form/Form';
import Link from 'next/link';

const builder = imageUrlBuilder(client);
const urlFor = (source) => builder.image(source).url();

export default function Home() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [killers, setKillers] = useState([]);
  const [survivors, setSurvivors] = useState([]);
  const [allPerks, setAllPerks] = useState([]);
  const [selectedType, setSelectedType] = useState('killer'); // 'killer' or 'survivor'
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [randomisedPerks, setRandomisedPerks] = useState(null);

  useEffect(() => {
    setLoading(true);

    const killerQuery = `*[_type == "killer"]{name, image, perks[]{name, image, url}}`;
    const survivorQuery = `*[_type == "survivor"]{name, image, perks[]{name, image, url}}`;
    const basePerkQuery = `*[_type == "basePerks"]{name, image, url, type}`;

    Promise.all([
      client.fetch(killerQuery),
      client.fetch(survivorQuery),
      client.fetch(basePerkQuery),
    ])
      .then(([killersData, survivorsData, basePerksData]) => {
        if (
          killersData.length === 0 &&
          survivorsData.length === 0 &&
          basePerksData.length === 0
        ) {
          setKillers([]);
          setSurvivors([]);
          setLoading(false);
          return;
        }

        const sortedKillers = killersData.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        const sortedSurvivors = survivorsData.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setKillers(sortedKillers);
        setSurvivors(sortedSurvivors);

        // Extract perks from characters and attach their origin
        const characterPerks = (characters, type) =>
          characters.flatMap((char) =>
            char.perks.map((perk) => ({
              ...perk,
              characterName: char.name,
              type,
            }))
          );

        const killerPerks = characterPerks(sortedKillers, 'killer');
        const survivorPerks = characterPerks(sortedSurvivors, 'survivor');

        const basePerks = basePerksData.map((perk) => ({
          ...perk,
          characterName: 'General Perk',
          type: perk.type, // killer or survivor
        }));

        setAllPerks([...killerPerks, ...survivorPerks, ...basePerks]);

        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  // Get characters based on selected type (Killers or Survivors)
  const characters = selectedType === 'killer' ? killers : survivors;

  // Select a random character (Killer or Survivor)
  const getRandomCharacter = useCallback(() => {
    if (characters.length === 0) return;
    const randomCharacter =
      characters[Math.floor(Math.random() * characters.length)];
    setData(randomCharacter);
    setSelectedCharacter(randomCharacter);
  }, [characters]);

  // Handle manual character selection
  const handleCharacterSelect = (event) => {
    const character = characters.find((c) => c.name === event.target.value);
    setData(character);
    setSelectedCharacter(character);
  };

  // Randomise perks based on selected type (Killer or Survivor)
  const getRandomPerks = useCallback(() => {
    const filteredPerks = allPerks.filter(
      (perk) => perk.type === selectedType || perk.type === null
    ); // Include matching and general perks
    if (filteredPerks.length < 4) return;
    const shuffledPerks = [...filteredPerks]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    setRandomisedPerks(shuffledPerks);
  }, [allPerks, selectedType]);

  // Randomise both character and perks
  const randomiseEverything = useCallback(() => {
    if (characters.length === 0) return;
    getRandomCharacter();
    getRandomPerks();
  }, [characters, getRandomCharacter, getRandomPerks]);

  return (
    <>
      <main>
        <div className={styles.controls}>
          <select
            onChange={(e) => setSelectedType(e.target.value)}
            value={selectedType}
          >
            <option value='killer'>Killers</option>
            <option value='survivor'>Survivors</option>
          </select>

          <select
            onChange={handleCharacterSelect}
            value={selectedCharacter?.name || ''}
            disabled={characters.length === 0}
          >
            <option value=''>
              Select a {selectedType === 'killer' ? 'Killer' : 'Survivor'}
            </option>
            {characters.map((character) => (
              <option key={character.name} value={character.name}>
                {character.name}
              </option>
            ))}
          </select>

          <button
            onClick={getRandomCharacter}
            disabled={characters.length === 0}
          >
            Randomise {selectedType === 'killer' ? 'Killer' : 'Survivor'}
          </button>

          <button onClick={getRandomPerks} disabled={allPerks.length < 4}>
            Randomise Perks
          </button>

          <button
            onClick={randomiseEverything}
            disabled={characters.length === 0 || allPerks.length < 4}
          >
            Randomise Everything
          </button>
        </div>

        {isLoading && <p>Loading...</p>}

        <div className={styles.wrapper}>
          {data && (
            <div className={styles.characterContainer}>
              <h2>{data.name}</h2>
              {data.image?.asset ? (
                <div className={styles.killerImageWrapper}>
                  <Image
                    className={styles.characterImage}
                    src={urlFor(data.image.asset)}
                    alt={data.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sises='(max-width: 300px)'
                  />
                </div>
              ) : (
                <p>No image available</p>
              )}
            </div>
          )}

          <div>
            {randomisedPerks ? (
              <div>
                <h2>Perks:</h2>
                <ul className={styles.perksList}>
                  {randomisedPerks.map((perk, index) => (
                    <li key={index} className={styles.perkItem}>
                      {perk.image?.asset ? (
                        <Image
                          className={styles.perkImage}
                          src={urlFor(perk.image.asset)}
                          alt={perk.name}
                          width={80}
                          height={80}
                        />
                      ) : null}
                      <Link
                        href={perk.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className={styles.perkName}
                      >
                        {perk.name} <br />
                        <small>({perk.characterName})</small>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
        <div className={styles.seo}>
          <h2>🎲 Dead by Daylight Perk & Character Randomiser</h2>
          <p>
            Welcome to the Dead by Daylight Shuffle, the ultimate randomiser for
            killers, survivors, and perks! Whether you're a competitive player
            looking for a challenge or just having fun, our DBD Randomiser will
            shuffle your Killer or Survivor, along with their unique and general
            perks. Think of it as Chaos Shuffle all year around.
          </p>
          <h3>🌟 Features:</h3>
          <p>
            <ul>
              <li>Randomise a Killer or Survivor from Dead by Daylight.</li>
              <li>Get a completely randomised perk build.</li>
              <li>
                Pick a specific Killer or Survivor if you only want the perks
                randomised
              </li>
              <li>Includes both character-specific and base perks.</li>
              <li>Challenge yourself to win without using meta perks!</li>
            </ul>
          </p>
          <p>
            Whether you're playing casually or testing your skills, this DBD
            perk randomiser brings a fresh and fun challenge every match! Try it
            now and see if you can survive or dominate the trial!
          </p>
          <h3>🔍 Keywords:</h3>
          <p>
            Dead by Daylight Perk Randomiser, DBD Shuffle, Dead by Daylight
            Killer Picker, Survivor Randomizer, DBD Perk Build Generator
          </p>
        </div>
        <Form />
      </main>
      <footer>
        <Link href='https://github.com/ramstedt/dbdshuffler'>Github</Link> |{' '}
        <Link href='https://twitch.tv/catface404'>Twitch</Link>
      </footer>
    </>
  );
}
