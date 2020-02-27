import React, {
  createContext,
  Context,
  useEffect,
  useState,
  useCallback
} from "react";
import { Member, Info, Semester } from "./models";
import { getToken } from "./utils";
import { GlubRoute, parseRoute, renderRoute } from "./route";
import { useLocation, useHistory } from "react-router-dom";
import { get, success } from "./request";

interface GlubHubContextData {
  user: Member | null;
  members: Member[];
  info: Info | null;
  currentSemester: Semester | null;
}

interface GlubHubContextUpdate {
  updateUser: (member: Member | null) => void;
  updateMembers: (members: Member[]) => void;
  updateInfo: (info: Info) => void;
  updateSemester: (semester: Semester) => void;
  refreshAll: () => Promise<void>;
}

type GlubHubContextType = GlubHubContextData & GlubHubContextUpdate;

const initialContext: GlubHubContextType = {
  user: null,
  members: [],
  info: null,
  currentSemester: null,
  updateUser: () => {},
  updateMembers: () => {},
  updateInfo: () => {},
  updateSemester: () => {},
  refreshAll: async () => {}
};

export const GlubHubContext: Context<GlubHubContextType> = createContext(
  initialContext
);

export const GlubHubContextProvider: React.FC = ({ children }) => {
  const [user, updateUser] = useState<Member | null>(initialContext.user);
  const [members, updateMembers] = useState<Member[]>(initialContext.members);
  const [info, updateInfo] = useState<Info | null>(initialContext.info);
  const [currentSemester, updateSemester] = useState<Semester | null>(
    initialContext.currentSemester
  );

  const refreshAll = useCallback(async () => {
    const hasToken = !!getToken();
    const [user, members, info, semester] = await Promise.all([
      get<Member | null>("user"),
      hasToken ? get<Member[]>("members") : Promise.resolve(success([])),
      get<Info>("static"),
      get<Semester>("semesters/current")
    ]);

    updateUser(user.successful ? user.data : null);
    updateMembers(members.successful ? members.data : []);
    updateInfo(info.successful ? info.data : null);
    updateSemester(semester.successful ? semester.data : null);
  }, [updateUser, updateMembers, updateInfo, updateSemester]);

  useEffect(() => {
    refreshAll();
  });

  return (
    <GlubHubContext.Provider
      value={{
        user,
        updateUser,
        members,
        updateMembers,
        info,
        updateInfo,
        currentSemester,
        updateSemester,
        refreshAll
      }}
    >
      {children}
    </GlubHubContext.Provider>
  );
};

interface GlubRouteHooks {
  location: GlubRoute | null;
  goToRoute: (route: GlubRoute) => void;
  replaceRoute: (route: GlubRoute) => void;
}

export const useGlubRoute = (): GlubRouteHooks => {
  const location = useLocation();
  const history = useHistory();

  let glubLocation;
  if (!location.hash.startsWith("#/")) {
    glubLocation = null;
  } else {
    glubLocation = parseRoute(location.hash.slice(2).split("/"));
  }

  return {
    location: glubLocation,
    goToRoute: route => history.push(renderRoute(route)),
    replaceRoute: route => history.replace(renderRoute(route))
  };
};
