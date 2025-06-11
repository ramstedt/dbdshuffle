'use client';
import styles from './page.module.css';
import Form from './components/Form/Form';
import Link from 'next/link';
import Randomiser from './components/Randomiser/Randomiser';
import DatasetLastUpdated from './components/DatasetLastUpdated/DatasetLastUpdated';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <main>
        <Randomiser />
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
        <DatasetLastUpdated />
        <Link href="https://github.com/ramstedt/dbdshuffle" target="_blank">
          Github
        </Link>{' '}
        |{' '}
        <Link href="https://twitch.tv/catastasis" target="_blank">
          Twitch
        </Link>
        <br />
        <br />
        <Link href="https://ko-fi.com/catastasis" target="_blank">
          <Image
            src="/kofi.webp"
            alt="Support me on Ko-fi"
            width={200}
            height={50}
          />
        </Link>
        <br />
      </footer>
    </>
  );
}
