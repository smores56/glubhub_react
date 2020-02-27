// Route Constructors

export interface RouteHome {
  name: "Home";
  route: "";
}
export const routeHome: RouteHome = { name: "Home", route: "" };

export interface RouteLogin {
  name: "Login";
  route: "login";
}
export const routeLogin: RouteLogin = { name: "Login", route: "login" };

export interface RouteRoster {
  name: "People";
  route: "roster";
}
export const routeRoster: RouteRoster = { name: "People", route: "roster" };

export interface RouteProfile {
  name: "Profile";
  route: "profile";
  email: string;
  tab: ProfileTab | null;
}
export const routeProfile = (
  email: string,
  tab: ProfileTab | null
): RouteProfile => ({
  name: "Profile",
  route: "profile",
  email,
  tab
});

export interface RouteEditProfile {
  name: "Edit Profile";
  route: "edit-profile";
}
export const routeEditProfile: RouteEditProfile = {
  name: "Edit Profile",
  route: "edit-profile"
};

export interface RouteEvents {
  name: "Events";
  route: "events";
  eventId: number | null;
  tab: EventTab | null;
}
export const routeEvents = (
  eventId: number | null,
  tab: EventTab | null
): RouteEvents => ({
  name: "Events",
  route: "events",
  eventId,
  tab
});

export interface RouteEditCarpools {
  name: "Edit Carpools";
  route: "edit-carpools";
  eventId: number;
}
export const routeEditCarpools = (eventId: number): RouteEditCarpools => ({
  name: "Edit Carpools",
  route: "edit-carpools",
  eventId
});

export interface RouteRepertoire {
  name: "Repertoire";
  route: "repertoire";
  songId: number | null;
}
export const routeRepertoire = (songId: number | null): RouteRepertoire => ({
  name: "Repertoire",
  route: "repertoire",
  songId
});

export interface RouteMinutes {
  name: "Minutes";
  route: "minutes";
  minutesId: number | null;
  tab: MinutesTab | null;
}
export const routeMinutes = (
  minutesId: number | null,
  tab: MinutesTab | null
): RouteMinutes => ({
  name: "Minutes",
  route: "minutes",
  minutesId,
  tab
});

export interface RouteForgotPassword {
  name: "Forgot Password";
  route: "forgot-password";
}
export const routeForgotPassword: RouteForgotPassword = {
  name: "Forgot Password",
  route: "forgot-password"
};

export interface RouteResetPassword {
  name: "Reset Password";
  route: "reset-password";
  token: string | null;
}
export const routeResetPassword = (
  token: string | null
): RouteResetPassword => ({
  name: "Reset Password",
  route: "reset-password",
  token
});

export interface RouteAdmin {
  name: "Admin";
  route: "admin";
  tab: AdminRoute | null;
}
export const routeAdmin = (tab: AdminRoute | null): RouteAdmin => ({
  name: "Admin",
  route: "admin",
  tab
});

export type GlubRoute =
  | RouteHome
  | RouteLogin
  | RouteRoster
  | RouteProfile
  | RouteEditProfile
  | RouteEvents
  | RouteEditCarpools
  | RouteRepertoire
  | RouteMinutes
  | RouteForgotPassword
  | RouteResetPassword
  | RouteAdmin;

// Events Page Tabs //////////////////////////

export type EventTab =
  | { name: "Details"; route: "details" }
  | { name: "Who's Attending"; route: "attendees" }
  | { name: "Attendance"; route: "attendance" }
  | { name: "Setlist"; route: "setlist" }
  | { name: "Carpools"; route: "carpools" }
  | { name: "Request Absence"; route: "request-absence" }
  | { name: "Edit"; route: "edit" };

// Events Tab Constructors

export const eventDetails: EventTab = { name: "Details", route: "details" };
export const eventAttendees: EventTab = {
  name: "Who's Attending",
  route: "attendees"
};
export const eventAttendance: EventTab = {
  name: "Attendance",
  route: "attendance"
};
export const eventSetlist: EventTab = { name: "Setlist", route: "setlist" };
export const eventCarpools: EventTab = { name: "Carpools", route: "carpools" };
export const eventRequestAbsence: EventTab = {
  name: "Request Absence",
  route: "request-absence"
};
export const eventEdit: EventTab = { name: "Edit", route: "edit" };

// Minutes Page Tabs //////////////////////////

export type MinutesTab =
  | { name: "Public"; route: "public" }
  | { name: "Private"; route: "private" }
  | { name: "Edit"; route: "edit" };

// Minutes Tab Constructors

export const minutesPublic: MinutesTab = { name: "Public", route: "public" };
export const minutesPrivate: MinutesTab = { name: "Private", route: "private" };
export const minutesEdit: MinutesTab = { name: "Edit", route: "edit" };

// Profile Page Tabs //////////////////////////

export type ProfileTab =
  | { name: "Details"; route: "details" }
  | { name: "Money"; route: "money" }
  | { name: "Attendance"; route: "attendance" }
  | { name: "Semesters"; route: "semesters" };

// Profile Tab Constructors

export const profileDetails: ProfileTab = { name: "Details", route: "details" };
export const profileMoney: ProfileTab = { name: "Money", route: "money" };
export const profileAttendance: ProfileTab = {
  name: "Attendance",
  route: "attendance"
};
export const profileSemesters: ProfileTab = {
  name: "Semesters",
  route: "semesters"
};

// Admin Page Tabs //////////////////////////

export type AdminRoute =
  | { name: "Create Event"; route: "create-event"; gigRequestId: number | null }
  | { name: "Gig Requests"; route: "gig-requests" }
  | { name: "Absence Requests"; route: "absence-requests" }
  | { name: "Edit Semester"; route: "edit-semester" }
  | { name: "Officer Positions"; route: "officer-positions" }
  | { name: "Site Permissions"; route: "site-permissions" }
  | { name: "Document Links"; route: "document-links" }
  | { name: "Webmaster Tools"; route: "webmaster-tools" }
  | { name: "Uniforms"; route: "uniforms" }
  | { name: "Dues"; route: "dues" };

// Admin Tab Constructors

export const adminCreateEvent = (gigRequestId: number | null): AdminRoute => ({
  name: "Create Event",
  route: "create-event",
  gigRequestId
});
export const adminGigRequests: AdminRoute = {
  name: "Gig Requests",
  route: "gig-requests"
};
export const adminAbsenceRequests: AdminRoute = {
  name: "Absence Requests",
  route: "absence-requests"
};
export const adminEditSemester: AdminRoute = {
  name: "Edit Semester",
  route: "edit-semester"
};
export const adminOfficerPositions: AdminRoute = {
  name: "Officer Positions",
  route: "officer-positions"
};
export const adminSitePermissions: AdminRoute = {
  name: "Site Permissions",
  route: "site-permissions"
};
export const adminDocumentLinks: AdminRoute = {
  name: "Document Links",
  route: "document-links"
};
export const adminWebmasterTools: AdminRoute = {
  name: "Webmaster Tools",
  route: "webmaster-tools"
};
export const adminUniforms: AdminRoute = {
  name: "Uniforms",
  route: "uniforms"
};
export const adminDues: AdminRoute = { name: "Dues", route: "dues" };

// Parsing Routes //////////////////////////

export const parseRoute = (segments: string[]): GlubRoute | null => {
  if (segments.length === 0) {
    return routeHome;
  }

  switch (segments[0]) {
    case routeLogin.route:
      return routeLogin;

    case routeRoster.route:
      return routeRoster;

    case routeProfile("", null).route:
      return parseProfileRoute(segments.slice(1));

    case routeEditProfile.route:
      return routeEditProfile;

    case routeEvents(null, null).route:
      return parseEventsRoute(segments.slice(1));

    case routeEditCarpools(0).route:
      return parseEditCarpoolsRoute(segments.slice(1));

    case routeRepertoire(null).route:
      return parseRepertoireRoute(segments.slice(1));

    case routeMinutes(null, null).route:
      return parseMinutesRoute(segments.slice(1));

    case routeForgotPassword.route:
      return routeForgotPassword;

    case routeResetPassword(null).route:
      return parseResetPasswordRoute(segments.slice(1));

    case routeAdmin(null).route:
      return parseAdminRoute(segments.slice(1));

    default:
      return null;
  }
};

// Parsing Helpers

const parseProfileRoute = (segments: string[]): GlubRoute | null => {
  if (segments.length === 0) {
    return null;
  }

  if (segments.length === 1) {
    return routeProfile(segments[0], null);
  }

  switch (segments[2]) {
    case profileAttendance.route:
      return routeProfile(segments[0], profileAttendance);

    case profileDetails.route:
      return routeProfile(segments[0], profileDetails);

    case profileMoney.route:
      return routeProfile(segments[0], profileMoney);

    case profileSemesters.route:
      return routeProfile(segments[0], profileSemesters);

    default:
      return null;
  }
};

const parseEventsRoute = (segments: string[]): GlubRoute | null => {
  if (segments.length === 0) {
    return routeEvents(null, null);
  }

  if (segments.length === 1) {
    try {
      const eventId = parseInt(segments[0]);
      return routeEvents(eventId, null);
    } catch {
      return null;
    }
  }

  try {
    const eventId = parseInt(segments[0]);
    switch (segments[2]) {
      case eventDetails.route:
        return routeEvents(eventId, eventDetails);

      case eventAttendees.route:
        return routeEvents(eventId, eventAttendees);

      case eventAttendance.route:
        return routeEvents(eventId, eventAttendance);

      case eventSetlist.route:
        return routeEvents(eventId, eventSetlist);

      case eventCarpools.route:
        return routeEvents(eventId, eventCarpools);

      case eventRequestAbsence.route:
        return routeEvents(eventId, eventRequestAbsence);

      case eventEdit.route:
        return routeEvents(eventId, eventEdit);

      default:
        return null;
    }
  } catch {
    return null;
  }
};

const parseEditCarpoolsRoute = (segments: string[]): GlubRoute | null => {
  try {
    const eventId = parseInt(segments[0]);
    return routeEditCarpools(eventId);
  } catch {
    return null;
  }
};

const parseRepertoireRoute = (segments: string[]): GlubRoute | null => {
  if (segments.length === 0) {
    return routeRepertoire(null);
  }

  try {
    const songId = parseInt(segments[0]);
    return routeRepertoire(songId);
  } catch {
    return null;
  }
};

const parseMinutesRoute = (segments: string[]): GlubRoute | null => {
  if (segments.length === 0) {
    return routeMinutes(null, null);
  }

  if (segments.length === 1) {
    try {
      const minutesId = parseInt(segments[0]);
      return routeMinutes(minutesId, null);
    } catch {
      return null;
    }
  }

  try {
    const minutesId = parseInt(segments[0]);
    switch (segments[2]) {
      case minutesPublic.route:
        return routeMinutes(minutesId, minutesPublic);

      case minutesPrivate.route:
        return routeMinutes(minutesId, minutesPrivate);

      case minutesEdit.route:
        return routeMinutes(minutesId, minutesEdit);

      default:
        return null;
    }
  } catch {
    return null;
  }
};

const parseResetPasswordRoute = (segments: string[]): GlubRoute | null => {
  return routeResetPassword(segments[0] || null);
};

const parseAdminRoute = (segments: string[]): GlubRoute | null => {
  if (segments.length === 0) {
    return routeAdmin(null);
  }

  switch (segments[0]) {
    case adminGigRequests.route:
      return routeAdmin(adminGigRequests);

    case adminAbsenceRequests.route:
      return routeAdmin(adminAbsenceRequests);

    case adminEditSemester.route:
      return routeAdmin(adminEditSemester);

    case adminOfficerPositions.route:
      return routeAdmin(adminOfficerPositions);

    case adminSitePermissions.route:
      return routeAdmin(adminSitePermissions);

    case adminDocumentLinks.route:
      return routeAdmin(adminDocumentLinks);

    case adminWebmasterTools.route:
      return routeAdmin(adminWebmasterTools);

    case adminUniforms.route:
      return routeAdmin(adminUniforms);

    case adminDues.route:
      return routeAdmin(adminDues);

    case adminCreateEvent(null).route:
      if (segments.length === 1) {
        return routeAdmin(adminCreateEvent(null));
      }

      try {
        const gigRequestId = parseInt(segments[1]);
        return routeAdmin(adminCreateEvent(gigRequestId));
      } catch {
        return null;
      }

    default:
      return null;
  }
};

// Routes to String //////////////////////////

export const renderRoute = (route: GlubRoute): string =>
  `/#/${buildRoute(route).join("/")}`;

// Route Building Helpers

const buildAdminRoute = (base: string, tab: AdminRoute | null): string[] => {
  if (tab === null) {
    return [base];
  } else if (tab.route === "create-event" && tab.gigRequestId !== null) {
    return [base, tab.route, `${tab.gigRequestId}`];
  } else {
    return [base, tab.route];
  }
};

const buildEventsRoute = (
  base: string,
  id: number | null,
  tab: EventTab | null
): string[] => [base, ...(id ? [`${id}`] : []), ...(tab ? [tab.route] : [])];

const buildMinutesRoute = (
  base: string,
  id: number | null,
  tab: MinutesTab | null
): string[] => [base, ...(id ? [`${id}`] : []), ...(tab ? [tab.route] : [])];

const buildRoute = (route: GlubRoute): string[] => {
  if (route.route === "") {
    return [];
  } else if (route.route === "events") {
    return buildEventsRoute(route.route, route.eventId, route.tab);
  } else if (route.route === "minutes") {
    return buildMinutesRoute(route.route, route.minutesId, route.tab);
  } else if (route.route === "admin") {
    return buildAdminRoute(route.route, route.tab);
  } else if (route.route === "profile") {
    return [route.route, route.email, ...(route.tab ? [route.tab.route] : [])];
  } else if (route.route === "repertoire") {
    return [route.route, ...(route.songId ? [`${route.songId}`] : [])];
  } else if (route.route === "reset-password") {
    return [route.route, ...(route.token ? [route.token] : [])];
  } else if (route.route === "edit-carpools") {
    return [route.route, `${route.eventId}`];
  } else {
    return [route.route];
  }
};
