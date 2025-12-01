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

export const baseCommunityState = {
  likedPostIds: [],
  upvotedQuestions: [],
  upvotedAnswers: [],
  memberClubIds: [],
  posts: initialPosts.map((item) => ({ ...item })),
  questions: initialQuestions.map((item) => ({ ...item })),
  answers: initialAnswers.map((item) => ({ ...item })),
  messages: initialMessages.reduce((acc, msg) => {
    acc[msg.channelId] = acc[msg.channelId] ? [...acc[msg.channelId], msg] : [msg];
    return acc;
  }, {}),
  userTeamId: null,
};

const buildStorageKey = (user) => `ep_community_state_${user?.id || "guest"}`;

const normalizeState = (parsed) => ({
  ...baseCommunityState,
  ...parsed,
  posts: parsed.posts?.length ? parsed.posts : baseCommunityState.posts,
  questions: parsed.questions?.length ? parsed.questions : baseCommunityState.questions,
  answers: parsed.answers?.length ? parsed.answers : baseCommunityState.answers,
  messages: parsed.messages || baseCommunityState.messages,
});

export const loadCommunityState = (user) => {
  const key = buildStorageKey(user);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { ...baseCommunityState };
    const parsed = JSON.parse(raw);
    return normalizeState(parsed);
  } catch (e) {
    console.error("community state load", e);
    return { ...baseCommunityState };
  }
};

export const saveCommunityState = (user, state) => {
  const key = buildStorageKey(user);
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (e) {
    console.error("community state save", e);
  }
  return state;
};

const fallbackAuthor = communityParticipants[0];

export const createCommunityPost = (user, payload) => {
  const current = loadCommunityState(user);
  const post = {
    id: `post-${crypto.randomUUID()}`,
    authorId: user?.id || fallbackAuthor.id,
    authorName: user?.name || fallbackAuthor.name,
    type: payload.type || "generic",
    title: payload.title,
    content: payload.content || payload.body || "",
    createdAt: new Date().toISOString(),
    relatedMissionId: payload.relatedMissionId,
    relatedMaterialId: payload.relatedMaterialId,
    xpGained: payload.xpGained,
    likes: 0,
    commentsCount: 0,
  };

  const nextState = { ...current, posts: [post, ...(current.posts || [])] };
  saveCommunityState(user, nextState);
  return { post, state: nextState };
};

export const ensureMessages = (stateMessages) => {
  const map = { ...stateMessages };
  initialMessages.forEach((msg) => {
    if (!map[msg.channelId]) {
      map[msg.channelId] = [msg];
    }
  });
  return map;
};

export const buildParticipants = (currentUser) => {
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

export const decorateClubs = (currentUser, membershipSet) =>
  initialClubs.map((club) => {
    const members = new Set(club.memberIds);
    if (currentUser && membershipSet.has(club.id)) members.add(currentUser.id);
    return { ...club, memberCount: members.size, isMember: membershipSet.has(club.id) };
  });

export const decorateTeams = (participants, currentUser) => {
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
};

export const relativeTime = (iso) => {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "только что";
  if (minutes < 60) return `${minutes} мин назад`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  return `${days} дн назад`;
};
