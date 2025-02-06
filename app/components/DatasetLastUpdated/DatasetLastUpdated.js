'use client';
import styles from './DatasetLastUpdated.module.css';
import { useEffect, useState } from 'react';
import { getLastUpdated } from '@/utils/randomiser';

export default function Randomiser() {
  const [lastUpdatedProject, setLastUpdatedProject] = useState('');
  useEffect(() => {
    getLastUpdated().then(setLastUpdatedProject);
  }, []);

  return <p>Last updated: {lastUpdatedProject}</p>;
}
