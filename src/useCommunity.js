import { useEffect, useMemo, useState } from "react";
import {
  answers as initialAnswers,
  channels as initialChannels,
  clubs as initialClubs,
  communityParticipants,
  initialMessages,
  posts as initialPosts,
  questions as initialQuestions,
  teams as initialTeams,
} from "./communityData";

const cloneWithDates = (items = []) => items.map((item) => ({ ...item }));

const buildStorageKey = (user) => `ep_community_state_${user?.id || "guest"}`;

const baseState = {
  likedPostIds: [],
  upvotedQuestions: [],
  upvotedAnswers: [],
  memberClubIds: [],
  posts: cloneWithDates(initialPosts),
  questions: cloneWithDates(initialQuestions),
  answers: cloneWithDates(initialAnswers),
  messages: initialMessages.reduce((acc, msg) => {
    acc[msg.channelId] = acc[msg.channelId] ? [...acc[msg.channelId], msg] : [msg];
    return acc;
  }, {}),
  userTeamId: null,
};

const loadState = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      ...baseState,
      ...parsed,
      posts: parsed.posts?.length ? parsed.posts : cloneWithDates(initialPosts),
      questions: parsed.questions?.length ? parsed.questions : cloneWithDates(initialQuestions),
      answers: parsed.answers?.length ? parsed.answers : cloneWithDates(initialAnswers),
      messages: parsed.messages || baseState.messages,
    };
  } catch (e) {
    console.error("community state load", e);
    return null;
  }
};

const saveState = (key, state) => {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (e) {
    console.error("community state save", e);
  }
};

const relativeTime = (iso) => {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} мин назад`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  return `${days} дн назад`;
};

const mergeParticipants = (currentUser) => {
  const base = communityParticipants.map((p) => ({ ...p, points: p.xp }));
  if (!currentUser) return base;
  const existingIndex = base.findIndex((p) => p.id === currentUser.id);
  const mergedUser = {
    ...currentUser,
    points: currentUser.xp ?? currentUser.points ?? 0,
    clubIds: currentUser.clubIds || [],
    role: currentUser.role || "Участник",
  };
  if (existingIndex >= 0) {
    base[existingIndex] = mergedUser;
    return base;
  }
  return [mergedUser, ...base];
};

const ensureMessages = (stateMessages) => {
  const map = { ...stateMessages };
  initialMessages.forEach((msg) => {
    if (!map[msg.channelId]) {
      map[msg.channelId] = [msg];
    }
  });
  return map;
};

export default function useCommunity(currentUser, { onAction, onToast } = {}) {
  const storageKey = buildStorageKey(currentUser);
  const [state, setState] = useState(() => loadState(storageKey) || { ...baseState });

  useEffect(() => {
    const loaded = loadState(storageKey);
    setState(loaded || { ...baseState });
  }, [storageKey]);

  useEffect(() => {
    saveState(storageKey, state);
  }, [state, storageKey]);

  const participants = useMemo(() => mergeParticipants(currentUser), [currentUser]);

  const membershipSet = useMemo(() => new Set([...(currentUser?.clubIds || []), ...(state.memberClubIds || [])]), [
    currentUser?.clubIds,
    state.memberClubIds,
  ]);

  const posts = useMemo(() => {
    const ordered = [...state.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return ordered.map((post) => ({
      ...post,
      author: participants.find((p) => p.id === post.authorId),
      relativeTime: relativeTime(post.createdAt),
    }));
  }, [state.posts, participants]);

  const questions = useMemo(() => {
    const ordered = [...state.questions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return ordered.map((q) => ({
      ...q,
      author: participants.find((p) => p.id === q.authorId),
      answersCount: state.answers.filter((a) => a.questionId === q.id).length,
      relativeTime: relativeTime(q.createdAt),
    }));
  }, [state.questions, state.answers, participants]);

  const answers = useMemo(
    () =>
      state.answers.map((ans) => ({
        ...ans,
        author: participants.find((p) => p.id === ans.authorId),
        relativeTime: relativeTime(ans.createdAt),
      })),
    [state.answers, participants]
  );

  const decoratedClubs = useMemo(
    () =>
      initialClubs.map((club) => {
        const members = new Set(club.memberIds);
        if (currentUser && membershipSet.has(club.id)) members.add(currentUser.id);
        return { ...club, memberCount: members.size, isMember: membershipSet.has(club.id) };
      }),
    [membershipSet, currentUser]
  );

  const decoratedTeams = useMemo(() => {
    const baseTeams = initialTeams.map((team) => ({
      ...team,
      memberIds: [...team.memberIds],
    }));
    if (currentUser) {
      const already = baseTeams.some((t) => t.memberIds.includes(currentUser.id));
      if (!already) {
        baseTeams.push({
          id: "team-starter",
          name: "Стартовая команда",
          memberIds: [currentUser.id, "u-alia", "u-sofia"],
          questId: "quest-starter",
        });
      }
    }
    return baseTeams.map((team) => ({
      ...team,
      members: team.memberIds.map((id) => participants.find((p) => p.id === id)).filter(Boolean),
    }));
  }, [participants, currentUser]);

  const channels = useMemo(
    () =>
      initialChannels.map((ch) => ({
        ...ch,
        unread: 0,
      })),
    []
  );

  const messages = useMemo(() => ensureMessages(state.messages), [state.messages]);

  const likePost = (postId) => {
    let added = false;
    setState((prev) => {
      const liked = new Set(prev.likedPostIds);
      const already = liked.has(postId);
      if (!already) added = true;
      const updatedPosts = prev.posts.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          likesCount: Math.max(0, (p.likesCount || 0) + (already ? -1 : 1)),
        };
      });
      if (already) liked.delete(postId);
      else liked.add(postId);
      return { ...prev, likedPostIds: Array.from(liked), posts: updatedPosts };
    });
    if (added) onAction?.({ type: "post-like" });
  };

  const addPost = (payload) => {
    const post = {
      id: `post-${crypto.randomUUID()}`,
      authorId: currentUser?.id || "u-roman",
      clubId: payload.clubId || null,
      createdAt: new Date().toISOString(),
      type: payload.type || "story",
      title: payload.title,
      body: payload.body,
      likesCount: 0,
      commentsCount: 0,
    };
    setState((prev) => ({ ...prev, posts: [post, ...prev.posts] }));
    onAction?.({ type: "post-create" });
    onToast?.("Пост добавлен в ленту");
  };

  const joinClub = (clubId) => {
    setState((prev) => ({ ...prev, memberClubIds: Array.from(new Set([...(prev.memberClubIds || []), clubId])) }));
    onToast?.("Ты в клубе! Настраиваем ленту под тебя");
    onAction?.({ type: "club-join" });
  };

  const leaveClub = (clubId) => {
    setState((prev) => ({ ...prev, memberClubIds: (prev.memberClubIds || []).filter((id) => id !== clubId) }));
    onToast?.("Клуб скрыт из твоей ленты");
  };

  const addQuestion = (payload) => {
    const question = {
      id: `q-${crypto.randomUUID()}`,
      authorId: currentUser?.id || "u-alia",
      title: payload.title,
      body: payload.body,
      tags: payload.tags || [],
      createdAt: new Date().toISOString(),
      upvotesCount: 0,
      bestAnswerId: null,
    };
    setState((prev) => ({ ...prev, questions: [question, ...prev.questions] }));
    onAction?.({ type: "question" });
    onToast?.("Вопрос опубликован");
  };

  const addAnswer = (questionId, body) => {
    const answer = {
      id: `a-${crypto.randomUUID()}`,
      questionId,
      authorId: currentUser?.id || "u-roman",
      body,
      createdAt: new Date().toISOString(),
      upvotesCount: 0,
    };
    setState((prev) => ({ ...prev, answers: [...prev.answers, answer] }));
    onAction?.({ type: "answer" });
  };

  const upvoteQuestion = (questionId) => {
    setState((prev) => {
      const voted = new Set(prev.upvotedQuestions);
      if (voted.has(questionId)) return prev;
      voted.add(questionId);
      const updated = prev.questions.map((q) => (q.id === questionId ? { ...q, upvotesCount: (q.upvotesCount || 0) + 1 } : q));
      return { ...prev, questions: updated, upvotedQuestions: Array.from(voted) };
    });
  };

  const upvoteAnswer = (answerId) => {
    setState((prev) => {
      const voted = new Set(prev.upvotedAnswers);
      if (voted.has(answerId)) return prev;
      voted.add(answerId);
      const updated = prev.answers.map((a) => (a.id === answerId ? { ...a, upvotesCount: (a.upvotesCount || 0) + 1 } : a));
      return { ...prev, answers: updated, upvotedAnswers: Array.from(voted) };
    });
  };

  const markBestAnswer = (questionId, answerId) => {
    setState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === questionId ? { ...q, bestAnswerId: answerId } : q)),
    }));
    onAction?.({ type: "best-answer" });
  };

  const sendMessage = (channelId, body) => {
    const message = {
      id: `m-${crypto.randomUUID()}`,
      channelId,
      authorId: currentUser?.id || "u-alia",
      body,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      messages: {
        ...prev.messages,
        [channelId]: [...(prev.messages?.[channelId] || []), message],
      },
    }));
    onAction?.({ type: "message" });
  };

  return {
    participants,
    posts,
    questions,
    answers,
    clubs: decoratedClubs,
    teams: decoratedTeams,
    channels,
    messages,
    membershipSet,
    likePost,
    addPost,
    joinClub,
    leaveClub,
    addQuestion,
    addAnswer,
    upvoteQuestion,
    upvoteAnswer,
    markBestAnswer,
    sendMessage,
  };
}
