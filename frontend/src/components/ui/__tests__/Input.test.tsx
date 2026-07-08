import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';

describe('Input Component', () => {
  test('renders placeholder and input text correctly', () => {
    render(<Input placeholder="Enter username" />);
    const input = screen.getByPlaceholderText('Enter username') as HTMLInputElement;
    expect(input).toBeInTheDocument();
  });

  test('updates value on change event', () => {
    const handleChange = vi.fn();
    render(<Input placeholder="Enter username" onChange={handleChange} />);
    const input = screen.getByPlaceholderText('Enter username') as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: 'Rahul' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('displays label and helper text when provided', () => {
    render(
      <Input
        label="Username"
        helperText="Enter a unique name"
        placeholder="Username"
      />
    );
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Enter a unique name')).toBeInTheDocument();
  });

  test('displays error message and sets aria-invalid when error state is active', () => {
    render(<Input placeholder="User" error="Username is required" />);
    const errorText = screen.getByText('Username is required');
    expect(errorText).toBeInTheDocument();
    expect(errorText).toHaveAttribute('role', 'alert');
    
    const input = screen.getByPlaceholderText('User');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('disables input when disabled prop is set', () => {
    render(<Input placeholder="User" disabled />);
    const input = screen.getByPlaceholderText('User');
    expect(input).toBeDisabled();
  });
});
