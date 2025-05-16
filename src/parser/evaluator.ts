import type { LogicalExpression } from './types';

export class Evaluator {
  private variables: Map<string, boolean>;

  constructor(variables: Map<string, boolean>) {
    this.variables = variables;
  }

  public evaluate(expression: LogicalExpression): boolean {
    switch (expression.type) {
      case 'variable':
        const value = this.variables.get(expression.name);
        if (value === undefined) {
          throw new Error(`Variable ${expression.name} is not defined`);
        }
        return value;

      case 'unary':
        // Type assertion to tell TypeScript that we know the structure
        // when expression.type is 'unary'
        const unaryExpr = expression as Extract<LogicalExpression, { type: 'unary' }>;
        if (unaryExpr.operator === '¬') {
          return !this.evaluate(unaryExpr.operand);
        }
        throw new Error(`Unknown unary operator: ${unaryExpr.operator}`);

      case 'binary':
        const left = this.evaluate(expression.left);
        const right = this.evaluate(expression.right);

        switch (expression.operator) {
          case '∧': // AND
            return left && right;
          case '∨': // OR
            return left || right;
          case '→': // Implication
            return !left || right; // P → Q is equivalent to ¬P ∨ Q
          default:
            throw new Error(`Unknown binary operator: ${expression.operator}`);
        }

      default:
        throw new Error(`Unknown expression type: ${(expression as any).type}`);
    }
  }
} 