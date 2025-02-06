'use client';
import styles from './Randomiser.module.css';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  fetchData,
  getRandomCharacter,
  getRandomPerks,
  getRandomAddons,
  randomiseEverything,
} from '@/utils/randomiser';
import Link from 'next/link';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/dbdshuffle/sanity';

const builder = imageUrlBuilder(client);
const urlFor = (source) => builder.image(source).url();

export default function Randomiser() {
  const [isLoading, setLoading] = useState(false);
  const [killers, setKillers] = useState([]);
  const [survivors, setSurvivors] = useState([]);
  const [allPerks, setAllPerks] = useState([]);
  const [selectedType, setSelectedType] = useState('killer');
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [randomisedPerks, setRandomisedPerks] = useState(null);
  const [randomisedAddons, setRandomisedAddons] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchData().then(({ killersData, survivorsData, basePerksData }) => {
      setKillers(killersData);
      setSurvivors(survivorsData);

      const characterPerks = (characters, type) =>
        characters.flatMap((char) =>
          char.perks.map((perk) => ({
            ...perk,
            characterName: char.name,
            type,
          }))
        );

      const killerPerks = characterPerks(killersData, 'killer');
      const survivorPerks = characterPerks(survivorsData, 'survivor');
      const basePerks = basePerksData.map((perk) => ({
        ...perk,
        characterName: 'General Perk',
        type: perk.type,
      }));

      setAllPerks([...killerPerks, ...survivorPerks, ...basePerks]);
      setLoading(false);
    });
  }, []);

  const characters = selectedType === 'killer' ? killers : survivors;

  return (
    <>
      <div className={styles.controls}>
        <div className={styles.radioGroup}>
          <span> I want to play as a:</span>
          <label className={styles.radioLabel}>
            <input
              type='radio'
              name='characterType'
              value='killer'
              checked={selectedType === 'killer'}
              onChange={() => {
                setSelectedType('killer');
                setSelectedCharacter(null);
                setRandomisedPerks(null);
                setRandomisedAddons(null);
              }}
              className={styles.radioInput}
            />
            <span className={styles.customRadio}></span> Killer
          </label>
          <label className={styles.radioLabel}>
            <input
              type='radio'
              name='characterType'
              value='survivor'
              checked={selectedType === 'survivor'}
              onChange={() => {
                setSelectedType('survivor');
                setSelectedCharacter(null);
                setRandomisedPerks(null);
                setRandomisedAddons(null);
              }}
              className={styles.radioInput}
            />
            <span className={styles.customRadio}></span> Survivor
          </label>
        </div>

        <select
          onChange={(e) => {
            const selected = characters.find((c) => c.name === e.target.value);
            setSelectedCharacter(selected);
            setRandomisedAddons(null);
          }}
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
          onClick={() => getRandomCharacter(characters, setSelectedCharacter)}
          disabled={characters.length === 0}
        >
          Randomise {selectedType === 'killer' ? 'Killer' : 'Survivor'}
        </button>

        <button
          onClick={() =>
            getRandomPerks(allPerks, selectedType, setRandomisedPerks)
          }
          disabled={allPerks.length < 4}
        >
          Randomise Perks
        </button>

        {selectedType === 'killer' && (
          <button
            onClick={() => {
              getRandomAddons(selectedCharacter, setRandomisedAddons);
            }}
            disabled={!selectedCharacter || selectedCharacter.addons === null}
          >
            Randomise Add-ons (beta)
          </button>
        )}

        <button
          onClick={() =>
            randomiseEverything(
              characters,
              allPerks,
              selectedType,
              setSelectedCharacter,
              setRandomisedPerks,
              setRandomisedAddons
            )
          }
        >
          Randomise Everything
        </button>
      </div>

      {isLoading && <p>Loading...</p>}

      <div className={styles.wrapper}>
        {selectedCharacter && (
          <div className={styles.characterContainer}>
            <h2>{selectedCharacter.name}</h2>
            {selectedCharacter.image?.asset ? (
              <div className={styles.characterImageWrapper}>
                <Image
                  className={styles.characterImage}
                  src={urlFor(selectedCharacter.image.asset)}
                  alt={selectedCharacter.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes='(max-width: 300px)'
                />
              </div>
            ) : (
              <p>No image available</p>
            )}
          </div>
        )}

        {randomisedPerks && (
          <div className={styles.perks}>
            <h2>Perks:</h2>
            <ul className={styles.perksList}>
              {randomisedPerks.map((perk, index) => (
                <li key={index} className={styles.perkItem}>
                  {perk.image?.asset && (
                    <Image
                      className={styles.perkImage}
                      src={urlFor(perk.image.asset)}
                      alt={perk.name}
                      width={80}
                      height={80}
                    />
                  )}
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
        )}

        {randomisedAddons && (
          <div className={styles.addons}>
            <h2>Add-ons:</h2>
            <ul>
              {randomisedAddons.map((addon, index) => (
                <li key={index} className={styles.addonItem}>
                  <>
                    <span>
                      <Image
                        className={styles.addonImage}
                        src={urlFor(addon.image.asset)}
                        alt={addon.name}
                        width={80}
                        height={80}
                      />
                    </span>
                    <span>
                      <Link
                        href={addon.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className={styles.addonName}
                      >
                        {addon.name} <br />
                      </Link>
                    </span>
                  </>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
