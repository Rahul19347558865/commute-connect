import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  test('renders children text correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not call onClick when button is disabled', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('renders spinner and disables interaction when loading is true', () => {
    const handleClick = vi.fn();
    render(<Button loading onClick={handleClick}>Click Me</Button>);
    
    // Check loading indicator attributes
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    
    // Try to trigger click
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('supports rendering custom icons', () => {
    render(
      <Button leftIcon={<span data-testid="left-icon">L</span>}>
        Icon Test
      </Button>
    );
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });
});
