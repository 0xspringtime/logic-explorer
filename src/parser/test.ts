import { Lexer } from './lexer';
import { Parser } from './parser';
import { Evaluator } from './evaluator';

function testParser(input: string) {
  console.log(`\nTesting: "${input}"`);
  try {
    const lexer = new Lexer(input);
    const tokens = lexer.tokenize();
    console.log('Tokens:', tokens);
    
    const parser = new Parser(tokens);
    const result = parser.parse();
    console.log('Parsed:', JSON.stringify(result, null, 2));

    // Test evaluation with different variable assignments
    const testCases = [
      new Map([['P', true], ['Q', true], ['R', true]]),
      new Map([['P', true], ['Q', false], ['R', true]]),
      new Map([['P', false], ['Q', true], ['R', false]]),
      new Map([['P', false], ['Q', false], ['R', false]])
    ];

    console.log('\nEvaluation results:');
    testCases.forEach((variables, index) => {
      const evaluator = new Evaluator(variables);
      try {
        const value = evaluator.evaluate(result);
        console.log(`Case ${index + 1} (${Array.from(variables.entries()).map(([k, v]) => `${k}=${v}`).join(', ')}): ${value}`);
      } catch (error) {
        console.error(`Case ${index + 1} Error:`, error instanceof Error ? error.message : 'Unknown error');
      }
    });
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// Test cases
testParser('P');                    // Simple variable
testParser('¬P');                   // Negation
testParser('P ∧ Q');               // Conjunction
testParser('P ∨ Q');               // Disjunction
testParser('P → Q');               // Implication
testParser('(P ∨ Q) → R');         // Complex expression
testParser('¬(P ∧ Q)');            // Nested negation 