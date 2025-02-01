'use client';
import styles from './page.module.css';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { client } from '@/dbdkillers/sanity';
import imageUrlBuilder from '@sanity/image-url';
import Form from './components/Form/Form';

const builder = imageUrlBuilder(client);
const urlFor = (source) => builder.image(source).url();

export default function Home() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [killers, setKillers] = useState([]);
  const [allPerks, setAllPerks] = useState([]);
  const [selectedKiller, setSelectedKiller] = useState(null);
  const [randomisedPerks, setRandomisedPerks] = useState(null);

  useEffect(() => {
    setLoading(true);

    const killerQuery = `*[_type == "killer"]{name, image, perks[]{name, image, url}}`;
    const basePerkQuery = `*[_type == "basePerks"]{name, image, url}`;

    Promise.all([client.fetch(killerQuery), client.fetch(basePerkQuery)])
      .then(([killersData, basePerksData]) => {
        if (killersData.length === 0 && basePerksData.length === 0) {
          setKillers([]);
          setLoading(false);
          return;
        }
        const sortedKillers = killersData.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setKillers(sortedKillers);

        // Extract killer perks and attach the killer's name
        const killerPerks = sortedKillers.flatMap((killer) =>
          killer.perks.map((perk) => ({
            ...perk,
            killerName: killer.name,
          }))
        );
        const basePerks = basePerksData.map((perk) => ({
          ...perk,
          killerName: 'General Perk',
        }));

        setAllPerks([...killerPerks, ...basePerks]);

        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  // select a random killer
  const getRandomKiller = useCallback(() => {
    if (killers.length === 0) return;
    const randomKiller = killers[Math.floor(Math.random() * killers.length)];
    setData(randomKiller);
    setSelectedKiller(randomKiller);
  }, [killers]);

  // manually select a killer
  const handleKillerSelect = (event) => {
    const killer = killers.find((k) => k.name === event.target.value);
    setData(killer);
    setSelectedKiller(killer);
  };

  // randomise perks
  const getRandomPerks = useCallback(() => {
    if (allPerks.length < 4) return;
    const shuffledPerks = [...allPerks]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    setRandomisedPerks(shuffledPerks);
  }, [allPerks]);

  //  randomise both killer and perks
  const randomiseEverything = useCallback(() => {
    if (killers.length === 0 || allPerks.length < 4) return;
    const randomKiller = killers[Math.floor(Math.random() * killers.length)];
    const shuffledPerks = [...allPerks]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    setData(randomKiller);
    setSelectedKiller(randomKiller);
    setRandomisedPerks(shuffledPerks);
  }, [killers, allPerks]);

  return (
    <main>
      <div className={styles.controls}>
        <select
          onChange={handleKillerSelect}
          value={selectedKiller?.name || ''}
          disabled={killers.length === 0}
        >
          <option value=''>Select a Killer</option>
          {killers.map((killer) => (
            <option key={killer.name} value={killer.name}>
              {killer.name}
            </option>
          ))}
        </select>
        <button onClick={getRandomKiller} disabled={killers.length === 0}>
          Randomise Killer
        </button>
        <button onClick={getRandomPerks} disabled={allPerks.length < 4}>
          Randomise Perks
        </button>
        <button
          onClick={randomiseEverything}
          disabled={killers.length === 0 || allPerks.length < 4}
        >
          Randomise Everything
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      <div className={styles.wrapper}>
        {data && (
          <div className={styles.killerContainer}>
            <h2>{data.name}</h2>
            {data.image?.asset ? (
              <Image
                className={styles.killerImage}
                src={urlFor(data.image.asset)}
                alt={data.name}
                width={380}
                height={380}
              />
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
                    <a
                      href={perk.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={styles.perkName}
                    >
                      {perk.name} <br />
                      <small>({perk.killerName})</small>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
      <Form />
    </main>
  );
}
