'use client';
import styles from './page.module.css';
import { client } from '@/dbdkillers/sanity';
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    client
      .fetch(`*[_type == "killer"]`)
      .then((data) => {
        const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
        setData(sortedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  return (
    <main className={styles.main}>
      {isLoading ? (
        <p>Loading...</p>
      ) : data && data.length > 0 ? (
        data.map((killer, key) => (
          <div key={key}>
            <h2>{killer.name}</h2>
            {killer.perks.map((perk, i) => (
              <li key={`${i}${perk.name}`}>{perk.name}</li>
            ))}
          </div>
        ))
      ) : (
        <p>No data found</p>
      )}
    </main>
  );
}
