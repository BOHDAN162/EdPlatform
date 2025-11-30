import { useMemo } from "react";

const roleMap = {
  founder: "Будущий основатель бизнеса",
  strategist: "Исследователь и стратег",
  leader: "Лидер команды и коммуникатор",
};

const defaultRoles = [roleMap.founder, roleMap.leader, roleMap.strategist];

export const useUserProfile = (user, trackData) => {
  return useMemo(() => {
    const name = user?.name || "Гость";
    const email = user?.email;
    const role = trackData?.profileType || roleMap[trackData?.profileKey] || defaultRoles[0];
    const avatar = name?.[0]?.toUpperCase() || "Я";
    return {
      name,
      email,
      role,
      avatar,
      profileKey: trackData?.profileKey,
    };
  }, [user, trackData]);
};

export default useUserProfile;
