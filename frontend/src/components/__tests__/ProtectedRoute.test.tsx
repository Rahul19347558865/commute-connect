import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import * as AuthContextModule from '../../context/AuthContext';

// Mock the useAuth hook
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('displays loading spinner when session state is loading', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      profile: null,
      loading: true,
      requiresProfileSetup: false,
      login: vi.fn(),
      signUp: vi.fn(),
      logout: vi.fn(),
      syncProfile: vi.fn(),
      sendPasswordReset: vi.fn(),
      updateUserPassword: vi.fn(),
      refreshProfile: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Verifying session...')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  test('redirects to login view when user is unauthenticated', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      profile: null,
      loading: false,
      requiresProfileSetup: false,
      login: vi.fn(),
      signUp: vi.fn(),
      logout: vi.fn(),
      syncProfile: vi.fn(),
      sendPasswordReset: vi.fn(),
      updateUserPassword: vi.fn(),
      refreshProfile: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div data-testid="protected-content">Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div data-testid="login-view">Login View</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('login-view')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  test('redirects to profile setup when user has no database profile record', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 'user-123', email: 'test@domain.com' } as any,
      profile: null,
      loading: false,
      requiresProfileSetup: true,
      login: vi.fn(),
      signUp: vi.fn(),
      logout: vi.fn(),
      syncProfile: vi.fn(),
      sendPasswordReset: vi.fn(),
      updateUserPassword: vi.fn(),
      refreshProfile: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div data-testid="protected-content">Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/register-profile" element={<div data-testid="profile-setup">Profile Setup</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('profile-setup')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  test('renders children content when session is authenticated and profile is active', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 'user-123', email: 'test@domain.com' } as any,
      profile: { id: 'user-123', full_name: 'Rahul', email: 'test@domain.com', role: 'passenger', college_company: 'IIT' } as any,
      loading: false,
      requiresProfileSetup: false,
      login: vi.fn(),
      signUp: vi.fn(),
      logout: vi.fn(),
      syncProfile: vi.fn(),
      sendPasswordReset: vi.fn(),
      updateUserPassword: vi.fn(),
      refreshProfile: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByText('Verifying session...')).not.toBeInTheDocument();
  });
});
