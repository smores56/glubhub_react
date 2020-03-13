export interface Member {
  email: string;
  firstName: string;
  preferredName: string | null;
  lastName: string;
  phoneNumber: string;
  picture: string | null;
  passengers: number;
  location: string;
  onCampus: boolean | null;
  about: string | null;
  major: string | null;
  minor: string | null;
  hometown: string | null;
  arrivedAtTech: number | null;
  gatewayDrug: string | null;
  conflicts: string | null;
  dietaryRestrictions: string | null;
  section: string | null;
  enrollment: Enrollment | null;
  permissions?: MemberPermission[];
  positions?: string[];
}

export interface GlubSimpleEvent {
  id: number;
  name: string;
  semester: string;
  type: GlubEventType;
  callTime: number;
  releaseTime: number | null;
  points: number;
  comments: string | null;
  location: string | null;
  gigCount: boolean;
  defaultAttend: boolean;
  section: string | null;
  gig?: Gig | null;
}

export type GlubEventType =
  | "Volunteer Gig"
  | "Rehearsal"
  | "Sectional"
  | "Tutti Gig"
  | "Ombuds"
  | "Other";

export interface Gig {
  performanceTime: number;
  uniform: number;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  price: number | null;
  public: boolean;
  summary: string | null;
  description: string | null;
}

interface GlubEventAttendanceFields {
  rsvpIssue: string | null;
  attendance: SimpleAttendance | null;
  change: SimpleGradeChange | null;
  absenceRequest: AbsenceRequest | null;
}

export interface GlubEvent extends GlubSimpleEvent, GlubEventAttendanceFields {}

export interface SimpleGradeChange {
  change: number;
  reason: string;
  partialScore: number;
}

export interface SimpleAttendance {
  shouldAttend: boolean;
  didAttend: boolean;
  confirmed: boolean;
  minutesLate: number;
}

export const defaultSimpleAttendance = {
  shouldAttend: false,
  didAttend: false,
  confirmed: false,
  minutesLate: 0
};

export interface Attendance extends SimpleAttendance {
  member: string;
  event: number;
}

export interface EventAttendance {
  event: GlubEvent;
  attendance: SimpleAttendance;
}

export interface EventAttendee {
  member: Member;
  attendance: SimpleAttendance;
}

export interface EventCarpool {
  id: number;
  event: number;
  driver: Member;
  passengers: Member[];
}

export interface UpdatedCarpool {
  driver: Member;
  passengers: Member[];
}

export interface Grades {
  grade: number;
  eventsWithChanges: GlubEvent[];
  volunteerGigsAttended: number;
}

export interface GradeChange {
  event: GlubEvent;
  attendance: SimpleAttendance;
  reason: string;
  change: number;
  partialScore: number;
}

export interface MemberPermission {
  name: string;
  eventType: string | null;
}

export interface MemberRole {
  member: Member;
  role: Role;
}

export interface ActiveSemester {
  semester: string;
  enrollment: Enrollment | null;
  section: string | null;
  grades: Grades;
}

export interface Info {
  eventTypes: EventType[];
  mediaTypes: MediaType[];
  permissions: Permission[];
  roles: Role[];
  sections: string[];
  transactionTypes: string[];
  uniforms: Uniform[];
  documents: DocumentLink[];
}

export interface DocumentLink {
  name: string;
  url: string;
}

export const emptyDocumentLink = { name: "", url: "" };

export type Enrollment = "Class" | "Club";

export interface MediaType {
  name: string;
  order: number;
  storage: StorageType;
}

export type StorageType = "Local" | "Remote";

export interface EventType {
  name: GlubEventType;
  weight: number;
}

export interface Permission {
  name: string;
  description: string | null;
  type: PermissionType;
}

export type PermissionType = "Static" | "Event";

export interface Role {
  name: string;
  rank: number;
  maxQuantity: number;
}

export interface Uniform {
  id: number;
  name: string;
  color: string | null;
  description: string | null;
}

export const emptyUniform = { name: "", description: "", color: null, id: 0 };

export interface Semester {
  name: string;
  startDate: number;
  endDate: number;
  gigRequirement: number;
  current: boolean;
}

export interface Transaction {
  id: number;
  member: string;
  time: number;
  amount: number;
  description: string;
  semester: string | null;
  type: string;
  resolved: boolean;
}

export interface MeetingMinutes {
  id: number;
  name: string;
  date: number;
  public: string | null;
  private: string | null;
}

export interface Announcement {
  id: number;
  member: string | null;
  semester: string;
  time: number;
  content: string;
  archived: boolean;
}

export interface MemberPermission {
  name: string;
  eventType: string | null;
}

export interface RolePermission {
  role: string;
  permission: string;
  eventType: string | null;
}

export interface Fee {
  name: string;
  description: string;
  amount: number;
}

export interface AbsenceRequest {
  member: string;
  event: number;
  time: number;
  reason: string;
  state: AbsenceRequestState;
}

export type AbsenceRequestState = "Approved" | "Denied" | "Pending";

export interface GigRequest {
  id: number;
  time: number;
  name: string;
  organization: string;
  event: number | null;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  startTime: number;
  location: string;
  comments: string | null;
  status: GigRequestStatus;
}

export type GigRequestStatus = "Accepted" | "Dismissed" | "Pending";

export interface TransactionBatch {
  members: string[];
  amount: number | null;
  type: string;
  description: string;
}

export const emptyTransactionBatch: TransactionBatch = {
  members: [],
  amount: null,
  type: "Expense",
  description: ""
};

export interface Song {
  id: number;
  title: string;
  info: string | null;
  current: boolean;
  key: Pitch | null;
  startingPitch: Pitch | null;
  mode: SongMode | null;
  links?: SongLinkSection[];
}

export interface SongLinkSection {
  name: String;
  links: SongLink[];
}

export interface SongLink {
  id: number;
  song: number;
  type: string;
  name: string;
  target: string;
}

export type SongMode = "Major" | "Minor";

export enum Pitch {
  AFlat = "AFlat",
  A = "A",
  ASharp = "ASharp",
  BFlat = "BFlat",
  B = "B",
  BSharp = "BSharp",
  CFlat = "CFlat",
  C = "C",
  CSharp = "CSharp",
  DFlat = "DFlat",
  D = "D",
  DSharp = "DSharp",
  EFlat = "EFlat",
  E = "E",
  ESharp = "ESharp",
  FFlat = "FFlat",
  F = "F",
  FSharp = "FSharp",
  GFlat = "GFlat",
  G = "G",
  GSharp = "GSharp"
}
