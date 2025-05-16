# Logic Explorer

A web application for exploring propositional logic expressions, truth tables, and logical evaluations.

## Features

- Parse and evaluate logical expressions with support for:
  - Propositional variables (A, B, C, etc.)
  - Logical operators: ¬ (negation), ∧ (and), ∨ (or), → (implies)
- Generate truth tables for any valid logical expression
- Visualize parsed expression structure
- Real-time error feedback for invalid expressions

## Technology Stack

- React 19
- TypeScript
- Tailwind CSS
- Vite

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/logic-explorer.git
   cd logic-explorer
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter a logical formula in the input field using the supported operators
2. Click "Evaluate" to generate the truth table and see the parsed expression
3. Experiment with different logical expressions to explore their behavior

## Examples

- Simple conjunction: `P ∧ Q`
- Implication: `P → Q`
- Complex expression: `(P → Q) ∧ ¬(P ∨ R)`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
