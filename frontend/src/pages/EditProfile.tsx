import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile, useUpdateProfile } from '../hooks/useProfile';
import { useToast } from '../hooks/useToast';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { ProfileForm, ProfileFormValues } from '../components/profile/ProfileForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Skeleton, ErrorState } from '../components';

/**
 * EditProfilePage - Edit profile page.
 * Uses React Hook Form + Zod and handles TanStack Mutation updates.
 */
export const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: profile, isLoading, error, refetch } = useProfile();
  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const handleFormSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile(data);
      toast('success', 'Commuter profile updated successfully!');
      navigate('/profile');
    } catch (err: any) {
      console.error(err);
      toast('error', err.response?.data?.message || err.message || 'Failed to update profile details.');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout activeTab="profile">
        <Card>
          <CardHeader>
            <Skeleton variant="text" width="200px" height="24px" />
            <Skeleton variant="text" width="300px" />
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <Skeleton variant="rect" height="150px" />
            <Skeleton variant="rect" height="100px" />
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  if (error || !profile) {
    return (
      <DashboardLayout activeTab="profile">
        <ErrorState
          title="Failed to Load Profile"
          message={error?.message || 'Could not retrieve your profile details.'}
          onRetry={refetch}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="profile">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Commuter Profile</CardTitle>
          <CardDescription>
            Update your personal bio details, commute destinations, role, and vehicle parameters.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <ProfileForm
            initialData={profile}
            onSubmit={handleFormSubmit}
            isPending={isUpdating}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};
export default EditProfilePage;
