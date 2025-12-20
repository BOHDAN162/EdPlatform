import React from "react";

const LibraryEmptyState = ({ onVote, onSuggest }) => (
  <div className="rounded-2xl border border-dashed surface-card p-6 text-center">
    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full badge-soft text-2xl">✨</div>
    <h3 className="text-lg font-semibold">Скоро появятся материалы</h3>
    <p className="text-sm muted-text mt-1">Помоги выбрать, что добавить первым</p>
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      <button className="primary" onClick={onVote}>
        Проголосовать за книги/кейсы
      </button>
      <button className="ghost" onClick={onSuggest}>
        Предложить контент
      </button>
    </div>
  </div>
);

export default LibraryEmptyState;
