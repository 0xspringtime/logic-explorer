import type { Token, TokenType, LogicalExpression } from './types';

export class Parser {
  private tokens: Token[];
  private current: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.current = 0;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new Error(message);
  }

  private expression(): LogicalExpression {
    return this.binary();
  }

  private primary(): LogicalExpression {
    if (this.match('VARIABLE')) {
      return {
        type: 'variable',
        name: this.previous().value
      };
    }

    if (this.match('LEFT_PAREN')) {
      const expr = this.expression();
      this.consume('RIGHT_PAREN', "Expect ')' after expression.");
      return expr;
    }

    if (this.match('OPERATOR') && this.previous().value === '¬') {
      return {
        type: 'unary',
        operator: '¬',
        operand: this.primary()
      };
    }

    throw new Error('Expect expression.');
  }

  private binary(): LogicalExpression {
    let expr = this.primary();

    while (this.match('OPERATOR')) {
      const operator = this.previous().value;
      if (['∧', '∨', '→'].includes(operator)) {
        const right = this.primary();
        expr = {
          type: 'binary',
          operator: operator as '∧' | '∨' | '→',
          left: expr,
          right
        };
      }
    }

    return expr;
  }

  public parse(): LogicalExpression {
    try {
      return this.binary();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Parse error: ${error.message}`);
      }
      throw new Error('Unknown parse error occurred');
    }
  }
} 