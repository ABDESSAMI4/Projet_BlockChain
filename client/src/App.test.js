import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Solidity Lab dashboard', () => {
  render(<App />);
  expect(screen.getByText(/dApp Solidity professionnelle/i)).toBeInTheDocument();
});
