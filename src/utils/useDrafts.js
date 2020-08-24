import { useState, useEffect } from 'react';
import { useAsyncStorage } from '@react-native-community/async-storage';
import moment from 'moment';

const DRAFTS_STORAGE_KEY = 'fakehunter.drafts.storage';
export const useDrafts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const { getItem, setItem } = useAsyncStorage(DRAFTS_STORAGE_KEY);

  const getDrafts = async () => {
    const jsonValue = await getItem();
    const parsedDrafts = jsonValue != null ? JSON.parse(jsonValue) : [];
    setDrafts(parsedDrafts);
    setIsLoading(false);
    return parsedDrafts;
  };

  const updateDrafts = async (newDrafts) => {
    const jsonValue = JSON.stringify(newDrafts);
    await setItem(jsonValue);
    setDrafts(newDrafts);
    setIsSaving(false);
  };

  const addDraft = async (draftObj) => {
    setIsSaving(true);
    const parsedDrafts = await getDrafts();
    const id = Date.now().toString();
    const newDrafts = [
      ...parsedDrafts,
      { ...draftObj, savedAt: moment().format(), id },
    ];
    updateDrafts(newDrafts);
  };

  const updateDraft = async (draftId, draftObj = {}) => {
    if (draftId) {
      setIsSaving(true);
      const parsedDrafts = await getDrafts();
      const newDrafts = parsedDrafts.map((item) =>
        draftId === item.id ? { ...item, ...draftObj } : item
      );
      updateDrafts(newDrafts);
    }
  };

  const removeDraft = async (draftId) => {
    if (draftId) {
      const parsedDrafts = await getDrafts();
      const newDrafts = parsedDrafts.filter((item) => item.id !== draftId);
      updateDrafts(newDrafts);
    }
  };

  const refreshDrafts = () => {
    getDrafts();
  };

  useEffect(() => {
    getDrafts();
  }, []);

  return {
    isLoading,
    isSaving,
    drafts,
    addDraft,
    updateDraft,
    removeDraft,
    refreshDrafts,
  };
};
