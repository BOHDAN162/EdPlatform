import React from "react";
import { motion } from "framer-motion";
import { Link } from "../routerShim";

const mascotUrl = "https://sdmntpritalynorth.oaiusercontent.com/files/00000000-7270-7246-82d0-94f1c00b9da5/raw";

const steps = [
  {
    number: 1,
    title: "Ответь на 10 вопросов",
    text: "Узнаем твой тип личности и точку старта.",
  },
  {
    number: 2,
    title: "Получишь свой трек",
    text: "Соберём маршрут из миссий, игр и материалов.",
  },
  {
    number: 3,
    title: "Действуй каждый день",
    text: "MindGames, Память и привычки помогут расти.",
  },
];

const modules = [
  {
    title: "Трек развития",
    desc: "Личный маршрут под твой стиль и фокус.",
    to: "/track-quiz",
  },
  {
    title: "Миссии",
    desc: "Задачи и челленджи с XP и сериями.",
    to: "/missions",
  },
  {
    title: "MindGames",
    desc: "Мини-игры на внимание, память и мышление.",
    to: "/missions",
  },
  {
    title: "Память",
    desc: "Журнал инсайтов, дневник, размышления.",
    to: "/memory",
  },
  {
    title: "Привычки",
    desc: "Трекер с галочками и сериями.",
    to: "/habits",
  },
  {
    title: "Сообщество",
    desc: "Подростки, которые растут вместе.",
    to: "/community",
  },
];

const audience = [
  "Хочешь прокачать продуктивность и мышление",
  "Нужен понятный трек вместо хаоса YouTube",
  "Хочешь делать проекты и видеть прогресс",
];

const testimonials = [
  "Поняла, что мне реально интересно. Миссии короткие — не сливаюсь. — Аня, 15 лет",
  "Ребёнок сам напоминает про трек. Видим прогресс, а не просто ролики. — Родитель",
];

const stats = [
  { number: "12 400+", label: "часов развития внутри платформы" },
  { number: "3 200", label: "миссий пройдено подростками" },
];

export default function Landing() {
  return (
    <div className="bg-[#0d0d1f] text-white font-sans overflow-x-hidden">
      <section className="w-full bg-gradient-to-br from-purple-950 to-black px-6 py-16 md:flex md:items-center md:justify-between gap-10">
        <div className="max-w-xl space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-purple-300 font-semibold">NOESIS • платформа развития</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Твой трек роста без хаоса</h1>
          <p className="text-lg text-gray-300">
            Ответь на 10 вопросов — получи личный маршрут и двигайся по миссиям, играм и материалам.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              to="/track-quiz"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition text-center font-semibold"
            >
              Начать
            </Link>
            <Link
              to="/auth"
              className="bg-white text-black px-6 py-3 rounded-xl transition hover:bg-gray-100 text-center font-semibold"
            >
              Войти
            </Link>
          </div>
          <p className="text-sm text-gray-400">10 вопросов → тип личности → твой трек и XP.</p>
        </div>
        <img src={mascotUrl} alt="Маскот NOESIS" className="w-48 md:w-56 mt-10 md:mt-0 md:ml-12 drop-shadow-2xl" />
      </section>

      <motion.section
        className="px-6 py-16 bg-black"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-8">Как это работает</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <Step key={step.number} {...step} />
          ))}
        </div>
      </motion.section>

      <motion.section
        className="bg-gradient-to-br from-black to-purple-950 px-6 py-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-purple-300 font-semibold">Модули платформы</p>
            <h2 className="text-3xl font-bold">Что внутри NOESIS</h2>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
          >
            Смотреть трек →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <Link
              key={mod.title}
              to={mod.to}
              className="bg-[#1f1f2f] p-6 rounded-xl shadow-md hover:shadow-purple-500/20 transition border border-white/5 hover:border-purple-400/30"
            >
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-400" />
                {mod.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4">{mod.desc}</p>
              <span className="inline-flex items-center gap-2 text-sm text-purple-300 font-semibold">Перейти →</span>
            </Link>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="px-6 py-16 bg-black"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6">Для кого это</h2>
        <p className="text-lg text-gray-300 mb-6">
          NOESIS подходит подросткам 13–20 лет, которые хотят расти, прокачивать мышление, не терять фокус и реализовывать идеи.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-400">
          {audience.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </motion.section>

      <motion.section
        className="bg-purple-950 text-white px-6 py-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6">Почему нам верят</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {stats.map((item) => (
            <Stat key={item.label} {...item} />
          ))}
        </div>
        <div className="mt-8 space-y-4 text-sm text-gray-200">
          {testimonials.map((quote) => (
            <blockquote key={quote} className="border-l-4 border-purple-300 pl-4">{quote}</blockquote>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="px-6 py-16 text-center bg-black"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-4">Готов начать свой путь?</h2>
        <p className="text-gray-400 mb-6">Ответь на 10 вопросов — мы соберём маршрут под тебя.</p>
        <Link
          to="/track-quiz"
          className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full font-semibold text-white transition inline-block"
        >
          Начать путь роста →
        </Link>
      </motion.section>

      <footer className="text-center text-sm text-gray-500 py-6 bg-[#0a0a1a]">© 2025 NOESIS • Все права защищены</footer>
    </div>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="bg-[#1e1e2f] p-6 rounded-xl shadow-md border border-white/5">
      <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
        <span className="inline-block w-8 h-8 rounded-full bg-purple-500/20 text-purple-200 font-bold grid place-items-center">
          #{number}
        </span>
        {title}
      </h3>
      <p className="text-gray-400">{text}</p>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div className="bg-[#2a1a3a] p-6 rounded-xl shadow-md text-center border border-purple-300/20">
      <p className="text-2xl font-bold text-purple-200">{number}</p>
      <p className="text-sm text-gray-300">{label}</p>
    </div>
  );
}
