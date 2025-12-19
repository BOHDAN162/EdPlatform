import React from "react";

const LibraryEmptyState = ({ onVote, onSuggest }) => (
  <div className="rounded-2xl border border-dashed border-[#2a2a2a] bg-[#0b0b0b] p-6 text-center text-gray-200">
    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-2xl">✨</div>
    <h3 className="text-lg font-semibold">Скоро появятся материалы</h3>
    <p className="text-sm text-gray-400 mt-1">Помоги выбрать, что добавить первым</p>
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
