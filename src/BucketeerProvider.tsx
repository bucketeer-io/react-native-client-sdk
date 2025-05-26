import React, { useState, useEffect, type JSX } from 'react';
import {
  initializeBKTClient,
  getBKTClient,
  type BKTClient,
  type BKTConfig,
  type BKTUser,
} from 'bkt-js-client-sdk';
import { BucketeerContext } from './context';

interface BucketeerProviderProps {
  config: BKTConfig;
  user: BKTUser;
  children?: React.ReactNode;
}

export function BucketeerProvider({
  config,
  user,
  children,
}: BucketeerProviderProps): JSX.Element {
  const [client, setClient] = useState<BKTClient | null>(null);
  const [lastUpdated, setLastUpdated] = useState(0);

  useEffect(() => {
    let listenToken: string | null = null;
    let bktClient: BKTClient | null = null;

    const init = async () => {
      try {
        await initializeBKTClient(config, user);
        bktClient = getBKTClient()!;
        setClient(bktClient);
        setLastUpdated(Date.now());

        // Add listener to update timestamp on flag changes
        const listener = () => {
          setLastUpdated(Date.now());
        };
        listenToken = bktClient.addEvaluationUpdateListener(listener);
      } catch (error) {
        console.error('Failed to initialize Bucketeer client:', error);
      }
    };

    init();

    // Cleanup listener on unmount
    return () => {
      if (listenToken && bktClient) {
        bktClient.removeEvaluationUpdateListener(listenToken);
      }
    };
  }, [config, user]);

  return (
    <BucketeerContext.Provider value={{ client, lastUpdated }}>
      {children}
    </BucketeerContext.Provider>
  );
}
