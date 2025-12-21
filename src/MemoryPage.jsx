import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "./routerShim";
import MemoryEntryForm from "./components/MemoryEntryForm";
import MemoryPavilionMap from "./components/MemoryPavilionMap";
import MemoryPavilionModal from "./components/MemoryPavilionModal";
import MemoryEmptyState from "./components/MemoryEmptyState";
import MemoryRelatedMaterials from "./components/MemoryRelatedMaterials";
import MemoryEntryCard from "./components/MemoryEntryCard";
import { useMemory } from "./hooks/useMemory";
import { memoryCategories } from "./data/memoryLandmarks";

const MemoryPage = ({ user, onEntryAdded }) => {
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
  const [prefillType, setPrefillType] = useState("text");
  const [prefillText, setPrefillText] = useState("");
  const [activeModal, setActiveModal] = useState("none");
  const [entryFormOrigin, setEntryFormOrigin] = useState("page");

  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (location.state?.quickAdd) {
      setPrefillText("Быстрая заметка о том, что хочу запомнить...");
      setPrefillType("text");
      setActiveModal("entry");
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

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

  useEffect(() => {
    const focusLandmark = sessionStorage.getItem("ep_memory_focus");
    if (focusLandmark) {
      sessionStorage.removeItem("ep_memory_focus");
      selectLandmark(focusLandmark);
      setTimeout(() => {
        const el = document.querySelector(`[data-landmark-id="${focusLandmark}"]`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    }
  }, [selectLandmark]);

  const openForm = (type = "text", text = "", origin = "page") => {
    setPrefillType(type);
    setPrefillText(text);
    setEditingEntry(null);
    setEntryFormOrigin(origin);
    setActiveModal("entry");
  };

  const handleSave = (payload) => {
    if (editingEntry) {
      updateEntry(editingEntry.id, payload);
      if (onEntryAdded) onEntryAdded({ ...editingEntry, ...payload });
    } else {
      const entry = addEntry(selectedLandmark?.id, { ...payload, category: selectedLandmark?.category });
      if (onEntryAdded) onEntryAdded(entry);
    }
    setActiveModal(entryFormOrigin === "pavilion" ? "pavilion" : "none");
    setEditingEntry(null);
    setPrefillText("");
  };

  const handleEdit = (entry, origin = "page") => {
    setEditingEntry(entry);
    setEntryFormOrigin(origin);
    setActiveModal("entry");
  };

  const handleDelete = (entryId) => {
    deleteEntry(entryId);
    setActiveModal("none");
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
              const preview = entry.text || entry.link || entry.sketchNote || "";
              return (
                <div key={entry.id} className="search-card" onClick={() => selectLandmark(entry.landmarkId)}>
                  <div className="chip-row">
                    <span className="material-badge outline">{landmark?.shortName || landmark?.name}</span>
                    <span className="material-badge outline">{entry.tags?.slice(0, 2).join(", ")}</span>
                  </div>
                  <div className="search-card-title">{entry.title}</div>
                  <p className="meta">{preview.slice(0, 110)}{preview.length > 110 ? "…" : ""}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="memory-layout">
        <MemoryPavilionMap
          entries={entries}
          selectedId={selectedLandmark?.id}
          highlighted={highlightedLandmarks}
          landmarks={filteredLandmarks}
          onSelect={(id) => {
            selectLandmark(id);
            setActiveModal("pavilion");
          }}
        />

        <div className="memory-right">
          <div className="card pavilion-spotlight">
            <div className="pavilion-spotlight-head">
              <div>
                <div className="chip-row">
                  <span className="material-badge" style={{ background: `${selectedLandmark?.color}20`, color: selectedLandmark?.color }}>
                    {selectedLandmark?.category}
                  </span>
                  <span className="material-badge outline">{selectedLandmark?.district}</span>
                </div>
                <h2>{selectedLandmark?.name}</h2>
                <p className="meta">{selectedLandmark?.description}</p>
              </div>
              <button className="primary" onClick={() => openForm("text")}>Добавить запись</button>
            </div>

            {entriesForSelected.length === 0 ? (
              <MemoryEmptyState onTemplate={(type, text) => openForm(type, text)} />
            ) : (
              <div className="spotlight-list">
                {entriesForSelected.slice(0, 3).map((entry) => (
                  <MemoryEntryCard key={entry.id} entry={entry} onClick={() => handleEdit(entry)} />
                ))}
                <button className="ghost" onClick={() => setActiveModal("pavilion")}>
                  Смотреть все записи павильона
                </button>
              </div>
            )}
          </div>

          <MemoryRelatedMaterials entries={entries} />
        </div>
      </div>

      <MemoryPavilionModal
        open={activeModal === "pavilion"}
        pavilion={selectedLandmark}
        entries={entriesForSelected}
        onClose={() => setActiveModal("none")}
        onCreate={(type) => openForm(type, "", "pavilion")}
        onQuickAction={(type, text) => openForm(type, text, "pavilion")}
        onSelectEntry={(entry) => handleEdit(entry, "pavilion")}
      />

      {activeModal === "entry" && (
        <MemoryEntryForm
          entry={editingEntry}
          landmark={selectedLandmark}
          defaultType={prefillType}
          prefillText={prefillText}
          onCancel={() => setActiveModal(entryFormOrigin === "pavilion" ? "pavilion" : "none")}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default MemoryPage;
