import { assertEquals } from 'https://deno.land/std@0.178.0/testing/asserts.ts';
import { TextMatcher } from './TextMatcher.ts';

Deno.test('isCommand Test', () => {
  assertEquals(new TextMatcher().isCommand('@maple', 'maple'), true);
});

Deno.test('isArgumentMatch Test', () => {
  const result = new TextMatcher().isArgumentMatch('@maple shiguruna', 'maple');
  assertEquals(result, { result: true, argument: 'shiguruna' });
});
