import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider } from '../../../context/ToastContext';
import { useToast } from '../../../hooks/useToast';

// Dummy component that triggers a toast
const ToastTrigger = () => {
  const { toast } = useToast();
  return (
    <button onClick={() => toast('success', 'Hello Toast Notification', 3000)}>
      Show Toast
    </button>
  );
};

describe('Toast Notification System', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('triggers and renders a success toast alert upon hook invocation', () => {
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>
    );

    // Initial state: no toast
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    // Click trigger button
    const btn = screen.getByRole('button', { name: 'Show Toast' });
    fireEvent.click(btn);

    // Verify toast renders in document
    const alertBox = screen.getByRole('alert');
    expect(alertBox).toBeInTheDocument();
    expect(screen.getByText('Hello Toast Notification')).toBeInTheDocument();
  });

  test('dismisses toast notification manually when X close button is clicked', () => {
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>
    );

    const btn = screen.getByRole('button', { name: 'Show Toast' });
    fireEvent.click(btn);

    const closeBtn = screen.getByLabelText('Dismiss notification alert');
    expect(closeBtn).toBeInTheDocument();

    // Click close
    fireEvent.click(closeBtn);

    // Verify toast is removed
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('automatically dismisses toast notifications after duration limit expires', () => {
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>
    );

    const btn = screen.getByRole('button', { name: 'Show Toast' });
    fireEvent.click(btn);

    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Fast-forward fake timer by 3000ms
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Toast should disappear
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
