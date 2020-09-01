import { createContext, Context } from "react";
import { Member, Info, Semester } from "state/models";
import { GlubRoute, parseRoute, renderRoute } from "state/route";
import { useLocation, useHistory } from "react-router-dom";
import { ApolloClient } from "apollo-boost";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import { getToken } from "./helpers";

interface GlubHubContextData {
  user: Member | null;
  members: Member[];
  info: Info;
  currentSemester: Semester;
}

interface GlubHubContextUpdate {
  updateUser: (member: Member | null) => void;
  updateMembers: (members: Member[]) => void;
  updateInfo: (info: Info) => void;
  updateCurrentSemester: (semester: Semester) => void;
  refreshAll: () => Promise<void>;
}

type GlubHubContextType = GlubHubContextData & GlubHubContextUpdate;

const initialContext: GlubHubContextType = {
  user: null,
  members: [],
  info: null!,
  currentSemester: null!,
  updateUser: () => { },
  updateMembers: () => { },
  updateInfo: () => { },
  updateCurrentSemester: () => { },
  refreshAll: async () => { },
};

export const GlubHubContext: Context<GlubHubContextType> = createContext(
  initialContext
);

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
    goToRoute: (route) => history.push(renderRoute(route)),
    replaceRoute: (route) => history.replace(renderRoute(route)),
  };
};

const httpLink = createHttpLink({
  uri: "http://localhost:2000/graphql",
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    token: "7db7794a-0310-4e13-95b7-7b151565d8f0",
  },
}));

export const gqlClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
