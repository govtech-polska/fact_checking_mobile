import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import Voice from '@react-native-community/voice';

const IS_IOS = Platform.OS === 'ios';
export const useVoiceRecognition = ({
  onSpeechResult,
  onSpeechPartialResults,
} = {}) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const [finalResult, setFinalResult] = useState('');

  const checkVoiceAvailability = async () => {
    const voice = await Voice.isAvailable();
    setIsAvailable(!!voice);
  };

  const handleSpeechStart = () => {
    setIsStarted(true);
  };

  const handleSpeechResults = (e) => {
    setFinalResult(e.value[0] ?? '');

    if (IS_IOS) {
      onSpeechPartialResults?.(e.value[0] ?? '');
    }
  };

  const handleSpeechPartial = (e) => {
    if (!IS_IOS) {
      onSpeechPartialResults?.(e.value[0] ?? '');
    }
  };

  const handleSpeechEnd = () => {
    setIsStarted(false);
  };

  useEffect(() => {
    if (!isStarted && finalResult) {
      onSpeechResult?.(finalResult);
      setFinalResult('');
    }
  }, [isStarted, finalResult]);

  useEffect(() => {
    Voice.onSpeechStart = handleSpeechStart;
    Voice.onSpeechResults = handleSpeechResults;
    Voice.onSpeechPartialResults = handleSpeechPartial;
    Voice.onSpeechEnd = handleSpeechEnd;
    checkVoiceAvailability();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startRecognizing = async () => {
    try {
      await Voice.start('pl-PL');
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  return {
    isAvailable,
    isStarted,
    startRecognizing,
    stopRecognizing,
  };
};
