import React from "react";
import { motion } from "framer-motion";
import { Link } from "../routerShim";

const heroPoints = [
  "Пройди короткую регистрацию",
  "Активируй подписку — 8 игр, трек, привычки",
  "Учись, тренируй память и прокачивай мышление",
];

const steps = [
  {
    number: 1,
    title: "Ответь на 10 вопросов",
    text: "Узнаем твой тип личности и точку старта.",
  },
  {
    number: 2,
    title: "Получишь свой трек",
    text: "Соберём маршрут из заданий, игр и материалов.",
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
    title: "Задания",
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
  "Поняла, что мне реально интересно. Задания короткие — не сливаюсь. — Аня, 15 лет",
  "Ребёнок сам напоминает про трек. Видим прогресс, а не просто ролики. — Родитель",
];

const stats = [
  { number: "12 400+", label: "часов развития внутри платформы" },
  { number: "3 200", label: "заданий пройдено подростками" },
];

export default function Landing() {
  return (
    <div className="bg-[#0d0d1f] text-white font-sans overflow-x-hidden">
      <section className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-14 sm:py-16 md:py-20 flex justify-center">
        <div className="w-full max-w-5xl">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#2a1f63] via-[#1a153e] to-[#0c0a28] shadow-[0_30px_90px_rgba(0,0,0,0.35)] border border-white/10 px-6 sm:px-10 md:px-14 py-12 sm:py-14 md:py-16 flex flex-col items-center text-center">
            <div className="absolute inset-0 opacity-70" style={{
              background:
                "radial-gradient(circle at 20% 20%, rgba(153, 108, 255, 0.25), transparent 40%), radial-gradient(circle at 80% 0%, rgba(69, 122, 255, 0.25), transparent 30%), radial-gradient(circle at 50% 80%, rgba(95, 189, 255, 0.18), transparent 35%)",
            }}
            />
            <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-7 md:gap-8 w-full">
              <p className="hero-kicker">NOESIS • Платформа развития</p>
              <h1 className="hero-title text-white text-[34px] leading-[1.05] sm:text-[42px] md:text-[56px] lg:text-[64px]">
                <span className="block">БУДЬ ЛУЧШЕ ВЧЕРАШНЕГО</span>
                <span className="block">СЕБЯ</span>
              </h1>

              <div className="w-full">
                <div className="mx-auto w-full max-w-3xl bg-white text-black rounded-2xl sm:rounded-[20px] shadow-[0_18px_50px_rgba(0,0,0,0.18)] px-6 sm:px-8 py-6 sm:py-7">
                  <p className="quote-label text-center">Цитата</p>
                  <p className="text-lg sm:text-xl font-semibold text-gray-900 leading-relaxed">
                    «Единственный способ делать великое — любить то, что ты делаешь.»
                  </p>
                  <p className="quote-author text-sm sm:text-base mt-3 font-medium text-gray-700">— Стив Джобс</p>
                </div>
              </div>

              <div className="flex justify-center w-full">
                <Link
                  to="/track-quiz"
                  className="relative inline-flex items-center justify-center px-7 sm:px-9 py-3.5 sm:py-4 bg-gradient-to-r from-[#6b4bff] to-[#8f5bff] text-white font-semibold rounded-xl sm:rounded-2xl shadow-[0_14px_34px_rgba(111,87,255,0.4)] transition duration-200 ease-out hover:translate-y-[-1px] hover:shadow-[0_18px_42px_rgba(111,87,255,0.5)] focus:outline-none focus:ring-2 focus:ring-[#9f8bff]/60"
                >
                  Продолжить
                </Link>
              </div>

              <div className="grid gap-3 sm:gap-3.5 w-full max-w-3xl">
                {heroPoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm sm:text-base text-gray-100 backdrop-blur-[2px]"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#59d189]/15 text-[#59d189]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2.2"
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span className="text-left font-medium leading-tight">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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
