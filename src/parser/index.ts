import { Lexer } from './lexer';
import { Parser } from './parser';
import { LogicalExpression } from './types';

export function parseFormula(input: string): LogicalExpression {
  const lexer = new Lexer(input);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  return parser.parse();
}

export * from './types'; 