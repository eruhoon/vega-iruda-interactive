export type ArgumentMatchResult =
  | ArgumentMatchTrueResult
  | ArgumentMatchFalseResult;

type ArgumentMatchFalseResult = { result: false };

type ArgumentMatchTrueResult = { result: true; argument: string };
