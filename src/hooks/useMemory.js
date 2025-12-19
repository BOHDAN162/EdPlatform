import { useCallback, useEffect, useMemo, useState } from "react";
import { memoryLandmarks } from "../data/memoryLandmarks";

const getStorageKey = (userId) => `noesis_memory_${userId || "default"}`;

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch (err) {
    console.warn("Не удалось прочитать память из localStorage", err);
    return fallback;
  }
};

const createId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `entry_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

export function useMemory(userId) {
  const [entries, setEntries] = useState([]);
  const [selectedLandmarkId, setSelectedLandmarkId] = useState(memoryLandmarks[0]?.id || null);
  const storageKey = useMemo(() => getStorageKey(userId), [userId]);

  useEffect(() => {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(storageKey) : null;
    if (raw) {
      setEntries(safeParse(raw, []));
    } else {
      setEntries([]);
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(storageKey, JSON.stringify(entries));
  }, [entries, storageKey]);

  const selectLandmark = useCallback((id) => setSelectedLandmarkId(id), []);

  const addEntry = useCallback((landmarkId, data) => {
    const now = new Date().toISOString();
    const landmark = memoryLandmarks.find((item) => item.id === landmarkId);
    const entry = {
      id: createId(),
      landmarkId,
      category: data.category || landmark?.category,
      title: data.title || "Без названия",
      text: data.text || "",
      tags: data.tags?.length ? data.tags : [],
      relatedMaterialIds: data.relatedMaterialIds || [],
      createdAt: now,
      type: data.type || "text",
      link: data.link || "",
      attachmentName: data.attachmentName || "",
      sketchNote: data.sketchNote || "",
    };
    setEntries((prev) => [entry, ...prev]);
    setSelectedLandmarkId(landmarkId);
    return entry;
  }, []);

  const updateEntry = useCallback((entryId, data) => {
    setEntries((prev) =>
      prev.map((item) =>
        item.id === entryId
          ? {
              ...item,
              ...data,
            }
          : item
      )
    );
  }, []);

  const deleteEntry = useCallback((entryId) => {
    setEntries((prev) => prev.filter((item) => item.id !== entryId));
  }, []);

  const getEntriesByLandmark = useCallback(
    (landmarkId) => entries.filter((entry) => entry.landmarkId === landmarkId),
    [entries]
  );

  const searchEntries = useCallback(
    (query, tagFilter) => {
      const normalized = query?.trim().toLowerCase();
      const hasQuery = Boolean(normalized);
      const hasTag = Boolean(tagFilter);
      if (!hasQuery && !hasTag) return entries;
      return entries.filter((entry) => {
        const matchTag = hasTag ? entry.tags?.some((tag) => tag.toLowerCase() === tagFilter.toLowerCase()) : true;
        if (!hasQuery) return matchTag;
        const inTitle = entry.title?.toLowerCase().includes(normalized);
        const inText = entry.text?.toLowerCase().includes(normalized);
        const inTags = entry.tags?.some((tag) => tag.toLowerCase().includes(normalized));
        const inLink = entry.link?.toLowerCase().includes(normalized);
        return matchTag && (inTitle || inText || inTags || inLink);
      });
    },
    [entries]
  );

  const totalMaterials = useMemo(
    () => entries.reduce((acc, entry) => acc + (entry.relatedMaterialIds?.length || 0), 0),
    [entries]
  );

  return {
    landmarks: memoryLandmarks,
    entries,
    selectedLandmarkId,
    selectLandmark,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntriesByLandmark,
    searchEntries,
    totalMaterials,
  };
}
