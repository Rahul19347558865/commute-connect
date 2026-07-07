import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { ProfileView } from '../components/profile/ProfileView';
import { AvatarUploader } from '../components/profile/AvatarUploader';
import { Button, Skeleton, ErrorState } from '../components';
import { Edit } from '../components/icons';

/**
 * ProfilePage - Container page showing the current user's read-only profile details
 * and providing access to photo uploads and profile modifications.
 */
export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading, error, refetch } = useProfile();

  if (isLoading) {
    return (
      <DashboardLayout activeTab="profile">
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 py-6">
            <Skeleton variant="circle" width="96px" height="96px" />
            <Skeleton variant="text" width="120px" height="24px" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton variant="rect" height="200px" className="md:col-span-1" />
            <Skeleton variant="rect" height="320px" className="md:col-span-2" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !profile) {
    return (
      <DashboardLayout activeTab="profile">
        <ErrorState
          title="Failed to Load Profile"
          message={error?.message || 'Could not retrieve your commuter profile details.'}
          onRetry={refetch}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="profile">
      <div className="space-y-6">
        {/* Profile Card Header containing Uploader & Modify Action */}
        <div className="p-6 rounded-radius-lg bg-neutral-surface dark:bg-slate-900 border border-neutral-borderLine dark:border-slate-800 shadow-shadow-small flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <AvatarUploader currentUrl={profile.profile_photo} name={profile.full_name} />
            <div className="space-y-1">
              <h1 className="text-h2 font-bold text-neutral-textMain dark:text-slate-100">
                {profile.full_name}
              </h1>
              <p className="text-small text-neutral-textSub dark:text-slate-400">
                {profile.email}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/profile/edit')}
            leftIcon={<Edit className="w-4 h-4" />}
          >
            Edit Profile
          </Button>
        </div>

        {/* Dynamic visual views details panels */}
        <ProfileView profile={profile} />
      </div>
    </DashboardLayout>
  );
};
export default ProfilePage;
