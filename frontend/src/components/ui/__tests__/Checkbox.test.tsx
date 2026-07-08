import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from '../Checkbox';

describe('Checkbox Component', () => {
  test('renders label and element successfully', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  test('toggles check state on click', () => {
    let checkedState = false;
    const handleChange = vi.fn((e) => {
      checkedState = e.target.checked;
    });

    const { rerender } = render(
      <Checkbox label="Accept terms" checked={checkedState} onChange={handleChange} />
    );

    const checkbox = screen.getByLabelText('Accept terms') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);

    // Trigger toggle click
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(checkedState).toBe(true);

    // Re-render with new state
    rerender(<Checkbox label="Accept terms" checked={checkedState} onChange={handleChange} />);
    expect(checkbox.checked).toBe(true);
  });

  test('disables interaction when disabled prop is set', () => {
    const handleChange = vi.fn();
    render(<Checkbox label="Accept terms" disabled onChange={handleChange} />);
    
    const checkbox = screen.getByLabelText('Accept terms') as HTMLInputElement;
    expect(checkbox).toBeDisabled();
    
    fireEvent.click(checkbox);
    expect(handleChange).not.toHaveBeenCalled();
  });
});
