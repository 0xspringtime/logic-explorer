import type { Token } from './types';

export class Lexer {
  private input: string;
  private position: number;
  private currentChar: string | null;

  constructor(input: string) {
    this.input = input;
    this.position = 0;
    this.currentChar = input.length > 0 ? input[0] : null;
  }

  private advance(): void {
    this.position++;
    this.currentChar = this.position < this.input.length ? this.input[this.position] : null;
  }

  private skipWhitespace(): void {
    while (this.currentChar !== null && /\s/.test(this.currentChar)) {
      this.advance();
    }
  }

  private isVariable(char: string | null): boolean {
    return char !== null && /^[A-Z]$/.test(char);
  }

  private isOperator(char: string | null): boolean {
    return char !== null && ['¬', '∧', '∨', '→'].includes(char);
  }

  private getNextToken(): Token {
    while (this.currentChar !== null) {
      if (/\s/.test(this.currentChar)) {
        this.skipWhitespace();
        continue;
      }

      if (this.isVariable(this.currentChar)) {
        const start = this.position;
        const value = this.currentChar;
        this.advance();
        return {
          type: 'VARIABLE',
          value,
          position: start
        };
      }

      if (this.isOperator(this.currentChar)) {
        const start = this.position;
        const value = this.currentChar;
        this.advance();
        return {
          type: 'OPERATOR',
          value,
          position: start
        };
      }

      if (this.currentChar === '(') {
        const start = this.position;
        this.advance();
        return {
          type: 'LEFT_PAREN',
          value: '(',
          position: start
        };
      }

      if (this.currentChar === ')') {
        const start = this.position;
        this.advance();
        return {
          type: 'RIGHT_PAREN',
          value: ')',
          position: start
        };
      }

      throw new Error(`Invalid character: ${this.currentChar} at position ${this.position}`);
    }

    return {
      type: 'EOF',
      value: '',
      position: this.position
    };
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];
    let token = this.getNextToken();
    
    while (token.type !== 'EOF') {
      tokens.push(token);
      token = this.getNextToken();
    }
    
    tokens.push(token); // Add EOF token
    return tokens;
  }
} 