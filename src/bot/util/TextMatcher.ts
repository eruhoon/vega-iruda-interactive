export class TextMatcher {
  readonly commandMark = '@';

  isCommand(text: string, command: string): boolean {
    const trimmed = text.trim();
    return trimmed === `${this.commandMark}${command}`;
  }

  isArgumentMatch(text: string, command: string): ArgumentMatchResult {
    const regex = new RegExp(`${this.commandMark}${command} (.*)`);
    const match = regex.exec(text);
    const arg = match?.[1];
    return arg === undefined
      ? { result: false }
      : { result: true, argument: arg };
  }
}

type ArgumentMatchFalseResult = { result: false };
type ArgumentMatchTrueResult = { result: true; argument: string };
type ArgumentMatchResult = ArgumentMatchTrueResult | ArgumentMatchFalseResult;
