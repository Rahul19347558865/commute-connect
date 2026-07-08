import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, Skeleton } from './components';

// Lazy load page-level route components
const Login = React.lazy(() => import('./pages/auth/Login'));
const SignUp = React.lazy(() => import('./pages/auth/SignUp'));
const ForgotPassword = React.lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/auth/ResetPassword'));
const RegisterProfile = React.lazy(() => import('./pages/auth/RegisterProfile'));
const PlaygroundPage = React.lazy(() => import('./pages/Playground').then(m => ({ default: m.Playground })));
const ProfilePage = React.lazy(() => import('./pages/Profile'));
const SettingsPage = React.lazy(() => import('./pages/Settings'));
const CreateRidePage = React.lazy(() => import('./pages/rides/CreateRide'));
const SearchRidesPage = React.lazy(() => import('./pages/rides/SearchRides'));
const DashboardPage = React.lazy(() => import('./pages/Dashboard'));
const RideHistoryPage = React.lazy(() => import('./pages/rides/RideHistory'));
const RideDetailsPage = React.lazy(() => import('./pages/rides/RideDetails'));
const BookingsHistoryPage = React.lazy(() => import('./pages/rides/BookingsHistory'));
const ChatList = React.lazy(() => import('./pages/chat/ChatList'));
const ChatPage = React.lazy(() => import('./pages/chat/ChatPage'));
const NotificationPage = React.lazy(() => import('./pages/notifications/NotificationPage'));
const RideMapPage = React.lazy(() => import('./pages/rides/RideMap'));
const AdminDashboardPage = React.lazy(() => import('./pages/admin/AdminDashboard'));

/**
 * Reusable full-screen skeleton fallback loader for lazy-loaded page route loads.
 */
const PageLoader = () => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-neutral-bg dark:bg-slate-950">
    <div className="w-full max-w-md space-y-4">
      <Skeleton variant="circle" width="48px" height="48px" className="mx-auto" />
      <Skeleton variant="text" width="60%" className="mx-auto" />
      <Skeleton variant="rect" height="150px" />
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Protected Main App Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/rides"
              element={
                <ProtectedRoute>
                  <SearchRidesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/rides/:id"
              element={
                <ProtectedRoute>
                  <RideDetailsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <BookingsHistoryPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <RideHistoryPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat/:rideId"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/rides/:rideId/track"
              element={
                <ProtectedRoute>
                  <RideMapPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/rides/create"
              element={
                <ProtectedRoute>
                  <CreateRidePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/register-profile"
              element={
                <ProtectedRoute requireProfile={false}>
                  <RegisterProfile />
                </ProtectedRoute>
              }
            />

            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Design Playground Sandbox */}
            <Route path="/playground" element={<PlaygroundPage />} />

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
