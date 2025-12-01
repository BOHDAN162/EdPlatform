import { useEffect, useMemo, useState } from "react";
import {
  baseCommunityState,
  buildParticipants,
  decorateClubs,
  decorateTeams,
  ensureMessages,
  saveCommunityState,
  loadCommunityState,
  relativeTime,
} from "./communityState";
import { channels as initialChannels } from "./communityData";

export default function useCommunity(currentUser, { onAction, onToast } = {}) {
  const [state, setState] = useState(() => loadCommunityState(currentUser) || { ...baseCommunityState });

  useEffect(() => {
    const loaded = loadCommunityState(currentUser);
    setState(loaded || { ...baseCommunityState });
  }, [currentUser]);

  useEffect(() => {
    // keep storage in sync for других экранов
    saveCommunityState(currentUser, state);
  }, [state, currentUser]);

  const participants = useMemo(() => buildParticipants(currentUser), [currentUser]);

  const membershipSet = useMemo(() => new Set([...(currentUser?.clubIds || []), ...(state.memberClubIds || [])]), [
    currentUser?.clubIds,
    state.memberClubIds,
  ]);

  const posts = useMemo(() => {
    const ordered = [...state.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return ordered.map((post) => ({
      ...post,
      author: participants.find((p) => p.id === post.authorId),
      likes: post.likes ?? post.likesCount ?? 0,
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

  const decoratedClubs = useMemo(() => decorateClubs(currentUser, membershipSet), [membershipSet, currentUser]);

  const decoratedTeams = useMemo(() => decorateTeams(participants, currentUser), [participants, currentUser]);

  const channels = useMemo(() => initialChannels.map((ch) => ({ ...ch, unread: 0 })), []);

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
          likes: Math.max(0, (p.likes ?? p.likesCount ?? 0) + (already ? -1 : 1)),
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
      content: payload.body || payload.content,
      likes: 0,
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
