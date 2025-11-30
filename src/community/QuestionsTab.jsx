import React, { useMemo, useState } from "react";
import QuestionCard from "./components/QuestionCard";
import AnswerCard from "./components/AnswerCard";

const tagOptions = ["финансы", "первые клиенты", "команда", "стартап", "метрики", "дизайн"];

const QuestionsTab = ({ questions, answers, currentUser, onAsk, onAnswer, onUpvoteQuestion, onUpvoteAnswer, onMarkBest }) => {
  const [sort, setSort] = useState("new");
  const [tag, setTag] = useState("");
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [form, setForm] = useState({ title: "", body: "", tags: [] });
  const [answerBody, setAnswerBody] = useState("");

  const ordered = useMemo(() => {
    let list = [...questions];
    if (tag) list = list.filter((q) => q.tags.includes(tag));
    if (sort === "popular") list.sort((a, b) => b.upvotesCount - a.upvotesCount);
    return list;
  }, [questions, tag, sort]);

  const answersByQuestion = useMemo(() => {
    return answers.reduce((acc, ans) => {
      if (!acc[ans.questionId]) acc[ans.questionId] = [];
      acc[ans.questionId].push(ans);
      return acc;
    }, {});
  }, [answers]);

  const handleSubmitQuestion = () => {
    if (!form.title || !form.body) return;
    onAsk(form);
    setForm({ title: "", body: "", tags: [] });
  };

  const handleAddAnswer = (questionId) => {
    if (!answerBody) return;
    onAnswer(questionId, answerBody);
    setAnswerBody("");
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <div>
          <h2>Вопросы и помощь</h2>
          <p className="meta">Задавай вопросы, голосуй за ответы и помогай ребятам.</p>
        </div>
        <button className="primary" onClick={handleSubmitQuestion}>Задать вопрос</button>
      </div>
      <div className="card question-form">
        <div className="form-grid">
          <label>
            Заголовок
            <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Например: как найти первых клиентов" />
          </label>
          <label>
            Описание
            <textarea value={form.body} onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))} placeholder="Расскажи детали, чтобы совет был точнее" />
          </label>
          <div className="chip-row scrollable">
            {tagOptions.map((t) => (
              <button
                key={t}
                className={`pill ${form.tags.includes(t) ? "active" : "outline"}`}
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    tags: p.tags.includes(t) ? p.tags.filter((x) => x !== t) : [...p.tags, t],
                  }))
                }
              >
                #{t}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="chip-row scrollable">
        <button className={`pill ${sort === "new" ? "active" : "outline"}`} onClick={() => setSort("new")}>Новые</button>
        <button className={`pill ${sort === "popular" ? "active" : "outline"}`} onClick={() => setSort("popular")}>Популярные</button>
        {tagOptions.map((t) => (
          <button key={t} className={`pill ${tag === t ? "active" : "outline"}`} onClick={() => setTag(tag === t ? "" : t)}>
            #{t}
          </button>
        ))}
      </div>
      <div className="grid cards columns-2 responsive-columns">
        {ordered.map((q) => (
          <QuestionCard key={q.id} question={q} onSelect={setActiveQuestion} onUpvote={onUpvoteQuestion} />
        ))}
      </div>
      {activeQuestion && (
        <div className="card question-detail">
          <div className="question-detail-head">
            <div>
              <div className="card-header">{activeQuestion.title}</div>
              <p className="meta">{activeQuestion.body}</p>
              <div className="chip-row">
                {activeQuestion.tags.map((t) => (
                  <span key={t} className="pill outline">#{t}</span>
                ))}
              </div>
            </div>
            <span className="pill subtle">{activeQuestion.author?.name}</span>
          </div>
          <div className="answer-list">
            {answersByQuestion[activeQuestion.id]?.map((ans) => (
              <AnswerCard
                key={ans.id}
                answer={ans}
                isBest={activeQuestion.bestAnswerId === ans.id}
                canMarkBest={currentUser?.id === activeQuestion.authorId}
                onMarkBest={(id) => onMarkBest(activeQuestion.id, id)}
                onUpvote={onUpvoteAnswer}
              />
            ))}
            {!answersByQuestion[activeQuestion.id]?.length && <p className="meta">Пока нет ответов.</p>}
          </div>
          <div className="answer-form">
            <textarea value={answerBody} onChange={(e) => setAnswerBody(e.target.value)} placeholder="Поделись решением" />
            <button className="primary" onClick={() => handleAddAnswer(activeQuestion.id)}>Ответить</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsTab;
