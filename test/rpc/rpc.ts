export interface TestService {
  rpcMethod: {
    request: Request;
    response: Response;
  };
}

export interface Request {
  data: string;
}

export interface Response {
  data: string;
}
