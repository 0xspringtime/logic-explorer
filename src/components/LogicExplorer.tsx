import { useState } from 'react';
import { Lexer } from '../parser/lexer';
import { Parser } from '../parser/parser';
import { Evaluator } from '../parser/evaluator';

export function LogicExplorer() {
  const [formula, setFormula] = useState('');
  const [variables, setVariables] = useState<Map<string, boolean>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ parsed: any; evaluations: { [key: string]: boolean } } | null>(null);

  const handleEvaluate = () => {
    try {
      setError(null);
      const lexer = new Lexer(formula);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const parsed = parser.parse();

      // Generate all possible combinations of variables
      const variableNames = Array.from(new Set(formula.match(/[A-Z]/g) || [])).sort();
      const combinations = generateCombinations(variableNames);
      
      const evaluations: { [key: string]: boolean } = {};
      
      combinations.forEach((vars, index) => {
        const evaluator = new Evaluator(vars);
        const value = evaluator.evaluate(parsed);
        const key = Array.from(vars.entries())
          .map(([k, v]) => `${k}=${v}`)
          .join(', ');
        evaluations[key] = value;
      });

      setResult({ parsed, evaluations });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Logic Explorer</h1>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Enter a logical formula:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder="e.g., P ∧ Q, ¬(P ∨ Q), (P → Q) ∧ R"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleEvaluate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Evaluate
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Use: ¬ (negation), ∧ (and), ∨ (or), → (implies)
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="w-full min-h-[400px] grid grid-cols-[400px_1fr] gap-8 items-start">
          <div className="w-[400px]">
            <h2 className="text-lg font-semibold mb-2">Parsed Expression:</h2>
            <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
              {JSON.stringify(result.parsed, null, 2)}
            </pre>
          </div>
          <div className="w-full">
            <h2 className="text-lg font-semibold mb-2">Truth Table:</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    {Object.keys(result.evaluations)[0].split(', ').map((_, index) => (
                      <th key={index} className="px-4 py-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {Object.keys(result.evaluations)[0].split(', ')[index].split('=')[0]}
                      </th>
                    ))}
                    <th className="px-4 py-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(result.evaluations).map(([vars, value], index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {vars.split(', ').map((varValue, varIndex) => (
                        <td key={varIndex} className="px-4 py-2 border-b border-gray-200 text-sm">
                          {varValue.split('=')[1]}
                        </td>
                      ))}
                      <td className="px-4 py-2 border-b border-gray-200 text-sm font-medium">
                        {value ? 'T' : 'F'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to generate all possible combinations of variable values
function generateCombinations(variables: string[]): Map<string, boolean>[] {
  const combinations: Map<string, boolean>[] = [];
  const count = Math.pow(2, variables.length);

  for (let i = 0; i < count; i++) {
    const combination = new Map<string, boolean>();
    variables.forEach((variable, index) => {
      combination.set(variable, Boolean(i & (1 << index)));
    });
    combinations.push(combination);
  }

  return combinations;
} 