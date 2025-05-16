// Types for logical expressions

export type PropositionalVariable = string;

export type LogicalOperator = '¬' | '∧' | '∨' | '→';

export interface BinaryExpression {
  type: 'binary';
  operator: LogicalOperator;
  left: LogicalExpression;
  right: LogicalExpression;
}

export interface UnaryExpression {
  type: 'unary';
  operator: '¬';
  operand: LogicalExpression;
}

export interface VariableExpression {
  type: 'variable';
  name: PropositionalVariable;
}

export type LogicalExpression = 
  | BinaryExpression 
  | UnaryExpression 
  | VariableExpression;

// Token types for the lexer
export type TokenType = 
  | 'VARIABLE'
  | 'OPERATOR'
  | 'LEFT_PAREN'
  | 'RIGHT_PAREN'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  position: number;
} 