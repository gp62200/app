import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import * as Location from 'expo-location';

export default function StopWatchScreen () {
  const [location, setLocation] = useState(null);
  const [isStopwatchRunning, setStopwatchRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval;

    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
      }, 1000);
      handleStartStopwatch();  
    }

    return () => clearInterval(interval);
  }, [isStopwatchRunning]);

  const handleStartStopwatch = () => {
    if (isStopwatchRunning) {
      // Stop the stopwatch
      setStopwatchRunning(false);
    } else {
      // Start the stopwatch
      setStopwatchRunning(true);
    }
  };

  const handleResetStopwatch = () => {
    setStopwatchRunning(false);
    setElapsedTime(0);
  };

  return (
    <View>
      <Text>Stopwatch Example</Text>
      <Text>Elapsed Time: {elapsedTime} seconds</Text>
      <Button title={isStopwatchRunning ? 'Stop' : 'Start'} onPress={handleStartStopwatch} />
      <Button title="Reset" onPress={handleResetStopwatch} />
    </View>
  );
};


