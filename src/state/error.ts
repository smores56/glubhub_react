import { Member } from "./models";

export interface NotFoundError {
  message: "resource not found";
  statusCode: 404;
}
export const notFoundError: NotFoundError = {
  message: "resource not found",
  statusCode: 404
};

export interface AlreadyLoggedInError {
  message: "member already logged in";
  statusCode: 400;
  token: string;
}
export const alreadyLoggedInError = (token: string): AlreadyLoggedInError => ({
  message: "member already logged in",
  statusCode: 400,
  token
});

export interface UnauthorizedError {
  message: "login required";
  statusCode: 401;
}
export const unauthorizedError = {
  message: "login required",
  statusCode: 401
};

export interface NotActiveYetError {
  message: "member not active yet";
  statusCode: 401;
  member: Member;
}
export const notActiveYetError = (member: Member): NotActiveYetError => ({
  message: "member not active yet",
  statusCode: 401,
  member
});

export interface ForbiddenError {
  message: "access forbidden";
  statusCode: 403;
  requiredPermission?: string;
}
export const forbiddenError = (
  requiredPermission?: string
): ForbiddenError => ({
  message: "access forbidden",
  statusCode: 403,
  requiredPermission
});

export interface ServerError {
  message: "server error";
  statusCode: 500;
  error: string;
}
export const serverError = (error: string): ServerError => ({
  message: "server error",
  statusCode: 500,
  error
});

export interface BadRequestError {
  message: "bad request";
  statusCode: 400;
  reason: string;
}
export const badRequestError = (reason: string): BadRequestError => ({
  message: "bad request",
  statusCode: 400,
  reason
});

export interface DatabaseError {
  message: "database error";
  statusCode: 500;
  error: string;
}
export const databaseError = (error: string): DatabaseError => ({
  message: "database error",
  statusCode: 500,
  error
});

export interface ConnectionError {
  message: "error connecting to database";
  statusCode: 500;
  error: string;
}
export const connectionError = (error: string): ConnectionError => ({
  message: "error connecting to database",
  statusCode: 500,
  error
});

export interface UnknownError {
  message: "unknown error";
  statusCode: number;
  error: string;
}
export const unknownError = (
  statusCode: number,
  error: string
): UnknownError => ({
  message: "unknown error",
  statusCode,
  error
});

export type GlubHubError =
  | NotFoundError
  | AlreadyLoggedInError
  | UnauthorizedError
  | NotActiveYetError
  | ForbiddenError
  | ServerError
  | BadRequestError
  | DatabaseError
  | ConnectionError
  | UnknownError;

export const parseErrorResponse = async (
  error: Response
): Promise<GlubHubError> => {
  try {
    const errorBody = await error.json();
    return parseError(errorBody, error.status);
  } catch (e) {
    return unknownError(error.status, `${e}`);
  }
};

export const parseError = (error: any, status: number): GlubHubError => {
  switch (error?.message) {
    case "resource not found":
      return error as NotFoundError;

    case "member already logged in":
      return error as AlreadyLoggedInError;

    case "login required":
      return error as UnauthorizedError;

    case "member not active yet":
      return error as NotActiveYetError;

    case "access forbidden":
      return error as ForbiddenError;

    case "server error":
      return error as ServerError;

    case "bad request":
      return error as BadRequestError;

    case "database error":
      return error as DatabaseError;

    case "error connecting to database":
      return error as ConnectionError;

    default:
      return unknownError(status, `${error}`);
  }
};
