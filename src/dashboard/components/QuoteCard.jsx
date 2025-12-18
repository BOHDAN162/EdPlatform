import React, { useMemo } from "react";

export const quotePool = [
  {
    text: "Люди, которые достаточно безумны, чтобы думать, что они могут изменить мир, обычно так и делают.",
    author: "Стив Джобс",
  },
  {
    text: "Движение важнее идеальной траектории. Сделай шаг — поймешь дорогу.",
    author: "NOESIS",
  },
  {
    text: "Серию строят маленькие победы. Отмечай их честно.",
    author: "NOESIS",
  },
  {
    text: "Качество вопросов определяет качество ответов.",
    author: "Тони Роббинс",
  },
  {
    text: "Мы становимся тем, что делаем регулярно.",
    author: "Шон Кови",
  },
  {
    text: "Делай мало, но постоянно — это и есть прогресс.",
    author: "NOESIS",
  },
  {
    text: "Важен не идеальный план, а следующий шаг.",
    author: "NOESIS",
  },
  {
    text: "Сфокусируйся на одном деле и доведи его до конца.",
    author: "NOESIS",
  },
  {
    text: "Маленькие победы собирают большую уверенность.",
    author: "NOESIS",
  },
  {
    text: "Осознанность — это пауза перед следующим движением.",
    author: "NOESIS",
  },
];

const QuoteCard = ({ seed = 0 }) => {
  const quote = useMemo(() => quotePool[seed % quotePool.length], [seed]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg">
      <div className="absolute right-6 top-4 text-4xl text-[#8A3FFC]/70">“</div>
      <p className="text-lg font-semibold text-white">{quote.text}</p>
      <p className="mt-3 text-sm text-white/60">{quote.author}</p>
      <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-[#8A3FFC] via-[#c084fc] to-[#22d3ee]" />
    </div>
  );
};

export default QuoteCard;
