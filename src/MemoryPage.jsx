import React, { useMemo, useState, useEffect } from "react";
import MemoryMap from "./components/MemoryMap";
import MemorySidebar from "./components/MemorySidebar";
import MemoryEntryForm from "./components/MemoryEntryForm";
import { useMemory } from "./hooks/useMemory";
import { materialIndex } from "./libraryData";
import { memoryCategories } from "./memoryLandmarks";

const MemoryPage = ({ user }) => {
  const {
    landmarks,
    entries,
    selectedLandmarkId,
    selectLandmark,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntriesByLandmark,
    searchEntries,
  } = useMemory(user?.id);

  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editingEntry, setEditingEntry] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const selectedLandmark = useMemo(
    () => landmarks.find((l) => l.id === selectedLandmarkId) || landmarks[0],
    [landmarks, selectedLandmarkId]
  );

  const entriesForSelected = useMemo(() => getEntriesByLandmark(selectedLandmark?.id), [
    getEntriesByLandmark,
    selectedLandmark,
  ]);

  const searchResults = useMemo(() => searchEntries(searchQuery, tagFilter), [searchEntries, searchQuery, tagFilter]);

  const highlightedLandmarks = useMemo(
    () => new Set(searchResults.map((entry) => entry.landmarkId)),
    [searchResults]
  );

  const filteredLandmarks = useMemo(
    () => {
      const list = landmarks.filter((item) => (categoryFilter ? item.category === categoryFilter : true));
      return list.length ? list : landmarks;
    },
    [landmarks, categoryFilter]
  );

  useEffect(() => {
    if (categoryFilter && selectedLandmark && selectedLandmark.category !== categoryFilter) {
      const next = filteredLandmarks[0];
      if (next) {
        selectLandmark(next.id);
      }
    }
  }, [categoryFilter, filteredLandmarks, selectLandmark, selectedLandmark]);

  const handleAdd = () => {
    setEditingEntry(null);
    setShowForm(true);
  };

  const handleQuickAdd = () => {
    const placeholder = {
      title: "Быстрая заметка",
      text: "Коротко запиши мысль, потом можно дополнить.",
      tags: ["быстро"],
      relatedMaterialIds: [],
    };
    addEntry(selectedLandmark?.id, placeholder);
  };

  const handleSave = (payload) => {
    if (editingEntry) {
      updateEntry(editingEntry.id, payload);
    } else {
      addEntry(selectedLandmark?.id, payload);
    }
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDelete = (entryId) => {
    deleteEntry(entryId);
    setShowForm(false);
    setEditingEntry(null);
  };

  const categoriesWithLandmarks = useMemo(() => {
    const idsWithEntries = new Set(entries.map((entry) => entry.landmarkId));
    return memoryCategories.map((category) => ({
      ...category,
      active: categoryFilter === category.id,
      hasEntries: landmarks.some((l) => l.category === category.id && idsWithEntries.has(l.id)),
    }));
  }, [categoryFilter, entries, landmarks]);

  return (
    <div className="page memory-page">
      <div className="page-header">
        <div>
          <h1>Память</h1>
          <p className="meta">
            Твой город знаний и воспоминаний. Каждый объект — место для идей, уроков и выводов.
          </p>
        </div>
        <div className="memory-filters">
          <input
            className="search-input"
            placeholder="Поиск по заголовку, тексту или тегам"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} className="ghost">
            <option value="">Все теги</option>
            {[...new Set(entries.flatMap((e) => e.tags || []))].map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="ghost">
            <option value="">Все категории</option>
            {categoriesWithLandmarks.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label} {cat.hasEntries ? "•" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {searchQuery && (
        <div className="card search-results">
          <div className="card-header">Нашлось: {searchResults.length}</div>
          <div className="search-grid">
            {searchResults.length === 0 && <p className="meta">Ничего не найдено. Попробуй другой запрос.</p>}
            {searchResults.map((entry) => {
              const landmark = landmarks.find((l) => l.id === entry.landmarkId);
              return (
                <div key={entry.id} className="search-card" onClick={() => selectLandmark(entry.landmarkId)}>
                  <div className="chip-row">
                    <span className="material-badge outline">{landmark?.shortName || landmark?.name}</span>
                    <span className="material-badge outline">{entry.tags?.slice(0, 2).join(", ")}</span>
                  </div>
                  <div className="search-card-title">{entry.title}</div>
                  <p className="meta">{entry.text.slice(0, 110)}{entry.text.length > 110 ? "…" : ""}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="memory-layout">
        <MemoryMap
          landmarks={filteredLandmarks}
          selectedId={selectedLandmark?.id}
          entries={entries}
          highlightedLandmarkIds={highlightedLandmarks}
          onSelect={selectLandmark}
        />
        <MemorySidebar
          landmark={selectedLandmark}
          entries={entriesForSelected}
          onAdd={handleAdd}
          onQuickAdd={handleQuickAdd}
          onEdit={handleEdit}
          materialsIndex={materialIndex}
        />
      </div>

      {showForm && (
        <MemoryEntryForm
          entry={editingEntry}
          landmark={selectedLandmark}
          onCancel={() => setShowForm(false)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default MemoryPage;
