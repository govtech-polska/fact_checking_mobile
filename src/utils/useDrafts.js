import { useState, useEffect } from 'react';
import { useAsyncStorage } from '@react-native-community/async-storage';

const DRAFTS_STORAGE_KEY = 'fakehunter.drafts.storage';
export const useDrafts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [drafts, setDrafts] = useState([]);
  const { getItem, setItem } = useAsyncStorage(DRAFTS_STORAGE_KEY);

  const getDrafts = async () => {
    const jsonValue = await getItem();
    const parsedDrafts = jsonValue != null ? JSON.parse(jsonValue) : [];
    setDrafts(parsedDrafts);
    setIsLoading(false);
    return parsedDrafts;
  };

  const getDraft = async (draftId) => {
    const parsedDrafts = await getDrafts();
    const draft = parsedDrafts.find((item) => item.id === draftId);
    return draft;
  };

  const updateDrafts = async (newDrafts) => {
    const jsonValue = JSON.stringify(newDrafts);
    await setItem(jsonValue);
    setDrafts(newDrafts);
  };

  const addDraft = async (draftObj) => {
    const parsedDrafts = await getDrafts();
    const newDrafts = [
      ...parsedDrafts,
      { ...draftObj, id: Date.now().toString() },
    ];
    updateDrafts(newDrafts);
  };

  const removeDraft = async (draftId) => {
    const parsedDrafts = await getDrafts();
    const newDrafts = parsedDrafts.filter((item) => item.id !== draftId);
    updateDrafts(newDrafts);
  };

  const refreshDrafts = () => {
    getDrafts();
  };

  useEffect(() => {
    getDrafts();
  }, []);

  return {
    isLoading,
    drafts,
    addDraft,
    removeDraft,
    refreshDrafts,
    getDraft,
  };
};
