import React, { useState } from 'react';
import { useProfile, useUpdateProfile } from '../hooks/useProfile';
import { useUserReviews, useRideHistory } from '../hooks/useTrust';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { AvatarUploader } from '../components/profile/AvatarUploader';
import { SavedPlaces } from '../components/profile/SavedPlaces';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button, Skeleton, ErrorState, SEO } from '../components';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Star, Calendar, Edit, Check, X, Shield, Car, Heart } from '../components/icons';
import { useToast } from '../hooks/useToast';

export const ProfilePage: React.FC = () => {
  const { data: profile, isLoading: isProfileLoading, error, refetch } = useProfile();
  const { data: reviews, isLoading: isReviewsLoading } = useUserReviews(profile?.id || '');
  const { data: historyData, isLoading: isHistoryLoading } = useRideHistory(1, 15);
  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('personal');

  // Edit states for tabs
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);

  // Form states matching schemas
  const [personalForm, setPersonalForm] = useState({
    full_name: '',
    role: 'passenger',
    college_company: '',
    bio: '',
    gender: '',
    contact_number: '',
  });

  const [vehicleForm, setVehicleForm] = useState({
    vehicle_type: '',
    company: '',
    model: '',
    color: '',
    registration_number: '',
    seat_capacity: 4,
  });

  const [preferencesForm, setPreferencesForm] = useState({
    emergency_contact: '',
    preferred_pickup_area: '',
    preferred_drop_area: '',
    travel_preferences: '',
  });

  // Load initial form values once profile is fetched
  React.useEffect(() => {
    if (profile) {
      setPersonalForm({
        full_name: profile.full_name || '',
        role: profile.role || 'passenger',
        college_company: profile.college_company || '',
        bio: profile.bio || '',
        gender: profile.gender || '',
        contact_number: profile.contact_number || '',
      });

      const vehicle = profile.vehicle_information || {};
      setVehicleForm({
        vehicle_type: vehicle.vehicle_type || '',
        company: vehicle.company || '',
        model: vehicle.model || '',
        color: vehicle.color || '',
        registration_number: vehicle.registration_number || '',
        seat_capacity: vehicle.seat_capacity || 4,
      });

      setPreferencesForm({
        emergency_contact: profile.emergency_contact || '',
        preferred_pickup_area: profile.preferred_pickup_area || '',
        preferred_drop_area: profile.preferred_drop_area || '',
        travel_preferences: profile.travel_preferences || '',
      });
    }
  }, [profile]);

  if (isProfileLoading) {
    return (
      <DashboardLayout activeTab="profile">
        <div className="space-y-6 max-w-4xl mx-auto p-2">
          <Skeleton variant="rect" height="120px" className="rounded-radius-lg" />
          <Skeleton variant="rect" height="40px" className="w-1/2 rounded" />
          <Skeleton variant="rect" height="240px" className="rounded-radius-md" />
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

  const handleSavePersonal = async () => {
    if (!personalForm.full_name || !personalForm.college_company) {
      toast('error', 'Name and organization are required fields.');
      return;
    }
    try {
      await updateProfile({
        ...profile,
        ...personalForm,
      });
      setIsEditingPersonal(false);
      toast('success', 'Personal information updated.');
    } catch (err: any) {
      toast('error', err.response?.data?.message || err.message || 'Failed to update profile.');
    }
  };

  const handleSaveVehicle = async () => {
    if (
      !vehicleForm.vehicle_type ||
      !vehicleForm.company ||
      !vehicleForm.model ||
      !vehicleForm.color ||
      !vehicleForm.registration_number
    ) {
      toast('error', 'All vehicle parameters are required.');
      return;
    }
    try {
      await updateProfile({
        ...profile,
        vehicle_information: vehicleForm,
      });
      setIsEditingVehicle(false);
      toast('success', 'Vehicle information updated.');
    } catch (err: any) {
      toast('error', err.response?.data?.message || err.message || 'Failed to update vehicle details.');
    }
  };

  const handleSavePreferences = async () => {
    try {
      await updateProfile({
        ...profile,
        ...preferencesForm,
      });
      setIsEditingPreferences(false);
      toast('success', 'Preferences updated.');
    } catch (err: any) {
      toast('error', err.response?.data?.message || err.message || 'Failed to update preferences.');
    }
  };

  // Review & Rating averages helper calculations
  const reviewList = reviews || [];
  const avgRating = reviewList.length > 0
    ? (reviewList.reduce((acc, r) => acc + r.rating, 0) / reviewList.length).toFixed(1)
    : '5.0';

  const isDriver = profile.role === 'driver' || profile.role === 'both';

  return (
    <DashboardLayout activeTab="profile">
      <SEO
        title="My Profile"
        description="View and update your Commute Connect commuter profile, vehicle details, travel preferences, and reviews rating history."
      />
      <div className="space-y-8 max-w-4xl mx-auto p-2 animate-fade-in">
        
        {/* Header Block */}
        <div className="p-6 rounded-radius-lg bg-neutral-surface dark:bg-slate-900 border border-neutral-borderLine dark:border-slate-800 shadow-shadow-small flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <AvatarUploader currentUrl={profile.profile_photo} name={profile.full_name} />
            <div className="space-y-1">
              <h1 className="text-h2 font-bold text-neutral-textMain dark:text-slate-100 flex items-center justify-center sm:justify-start gap-2">
                {profile.full_name}
                {reviewList.length > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-tiny font-bold text-neutral-textMain bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded border border-amber-250/20">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {avgRating}
                  </span>
                )}
              </h1>
              <p className="text-small text-neutral-textSub dark:text-slate-400">
                {profile.email}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-radius-sm">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            {isDriver && <TabsTrigger value="vehicle">Vehicle</TabsTrigger>}
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="history">Ride History</TabsTrigger>
            <TabsTrigger value="ratings">Ratings ({reviewList.length})</TabsTrigger>
          </TabsList>

          {/* ========================================== */}
          {/* TAB 1: PERSONAL INFORMATION                */}
          {/* ========================================== */}
          <TabsContent value="personal">
            <Card className="border border-neutral-borderLine dark:border-slate-800 bg-neutral-surface dark:bg-slate-900 shadow-shadow-small rounded-radius-md">
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-neutral-borderLine dark:border-slate-850">
                <div>
                  <CardTitle className="text-h3 font-bold text-neutral-textMain dark:text-slate-100">Personal Information</CardTitle>
                  <CardDescription className="text-small text-neutral-textSub dark:text-slate-400">Your profile contact details and platform role.</CardDescription>
                </div>
                {!isEditingPersonal ? (
                  <Button
                    variant="ghost"
                    onClick={() => setIsEditingPersonal(true)}
                    leftIcon={<Edit className="w-4 h-4" />}
                    className="h-9 px-4 rounded text-brand-primary"
                  >
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditingPersonal(false)}
                      leftIcon={<X className="w-4 h-4" />}
                      className="h-9 px-3 rounded text-neutral-textSub"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSavePersonal}
                      loading={isUpdating}
                      leftIcon={<Check className="w-4 h-4" />}
                      className="h-9 px-4 rounded font-semibold"
                    >
                      Save
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {!isEditingPersonal ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-small">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-textSub tracking-wider block">Full Name</span>
                      <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-1">{profile.full_name}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-textSub tracking-wider block">Role Preferences</span>
                      <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-1 capitalize">{profile.role}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-textSub tracking-wider block">College / Organization</span>
                      <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-1">{profile.college_company}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-textSub tracking-wider block">Gender</span>
                      <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-1 capitalize">{profile.gender || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-textSub tracking-wider block">Contact Number</span>
                      <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-1">{profile.contact_number || 'N/A'}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[10px] uppercase font-bold text-neutral-textSub tracking-wider block">Commuter Biography</span>
                      <p className="text-neutral-textMain dark:text-slate-300 mt-1 italic">
                        "{profile.bio || 'No biography written.'}"
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={personalForm.full_name}
                      onChange={(e) => setPersonalForm({ ...personalForm, full_name: e.target.value })}
                    />
                    <Select
                      label="Commuter Role"
                      value={personalForm.role}
                      onChange={(e) => setPersonalForm({ ...personalForm, role: e.target.value })}
                    >
                      <option value="passenger">Passenger / Rider</option>
                      <option value="driver">Driver Offering</option>
                      <option value="both">Dual Role (Both)</option>
                    </Select>
                    <Input
                      label="College or Organization"
                      value={personalForm.college_company}
                      onChange={(e) => setPersonalForm({ ...personalForm, college_company: e.target.value })}
                    />
                    <Select
                      label="Gender"
                      value={personalForm.gender}
                      onChange={(e) => setPersonalForm({ ...personalForm, gender: e.target.value })}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Select>
                    <Input
                      label="Contact Number"
                      value={personalForm.contact_number}
                      onChange={(e) => setPersonalForm({ ...personalForm, contact_number: e.target.value })}
                    />
                    <div className="sm:col-span-2">
                      <Textarea
                        label="Biography"
                        rows={3}
                        value={personalForm.bio}
                        onChange={(e) => setPersonalForm({ ...personalForm, bio: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Bookmarks Section */}
            <div className="mt-8">
              <SavedPlaces />
            </div>
          </TabsContent>

          {/* ========================================== */}
          {/* TAB 2: VEHICLE DETAILS                     */}
          {/* ========================================== */}
          {isDriver && (
            <TabsContent value="vehicle">
              <Card className="border border-neutral-borderLine dark:border-slate-800 bg-neutral-surface dark:bg-slate-900 shadow-shadow-small rounded-radius-md">
                <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-neutral-borderLine dark:border-slate-850">
                  <div>
                    <CardTitle className="text-h3 font-bold text-neutral-textMain dark:text-slate-100 flex items-center gap-2">
                      <Car className="w-5 h-5 text-brand-primary" />
                      Vehicle Details
                    </CardTitle>
                    <CardDescription className="text-small text-neutral-textSub dark:text-slate-400">Vacant seats parameters used during carpool creations.</CardDescription>
                  </div>
                  {!isEditingVehicle ? (
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditingVehicle(true)}
                      leftIcon={<Edit className="w-4 h-4" />}
                      className="h-9 px-4 rounded text-brand-primary"
                    >
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => setIsEditingVehicle(false)}
                        leftIcon={<X className="w-4 h-4" />}
                        className="h-9 px-3 rounded text-neutral-textSub"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleSaveVehicle}
                        loading={isUpdating}
                        leftIcon={<Check className="w-4 h-4" />}
                        className="h-9 px-4 rounded font-semibold"
                      >
                        Save
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {!isEditingVehicle ? (
                    profile.vehicle_information ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-small">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-textSub tracking-wider block">Vehicle Type</span>
                          <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-1 capitalize">{vehicleForm.vehicle_type}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-textSub tracking-wider block">Company</span>
                          <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-1">{vehicleForm.company}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-textSub tracking-wider block">Model</span>
                          <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-1">{vehicleForm.model}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-textSub tracking-wider block">Color</span>
                          <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-1">{vehicleForm.color}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-textSub tracking-wider block">Registration Number</span>
                          <p className="font-mono font-semibold text-neutral-textMain dark:text-slate-200 mt-1">{vehicleForm.registration_number}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-textSub tracking-wider block">Seat Capacity</span>
                          <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-1">{vehicleForm.seat_capacity} offering</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center border border-dashed border-neutral-borderLine dark:border-slate-800 rounded-radius-md bg-slate-50/50 dark:bg-slate-900/40">
                        <p className="text-neutral-textSub dark:text-slate-400">No vehicle details configured yet. Click Edit to add details.</p>
                      </div>
                    )
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Vehicle Type (e.g. Sedan, SUV, Bike)"
                        value={vehicleForm.vehicle_type}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, vehicle_type: e.target.value })}
                      />
                      <Input
                        label="Company Manufacturer (e.g. Honda, Suzuki)"
                        value={vehicleForm.company}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, company: e.target.value })}
                      />
                      <Input
                        label="Model Description (e.g. Civic, Swift)"
                        value={vehicleForm.model}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                      />
                      <Input
                        label="Vehicle Color"
                        value={vehicleForm.color}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, color: e.target.value })}
                      />
                      <Input
                        label="Registration Number"
                        value={vehicleForm.registration_number}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, registration_number: e.target.value })}
                      />
                      <Input
                        label="Seat Capacity"
                        type="number"
                        value={vehicleForm.seat_capacity}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, seat_capacity: parseInt(e.target.value, 10) || 4 })}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* ========================================== */}
          {/* TAB 3: TRAVEL PREFERENCES                  */}
          {/* ========================================== */}
          <TabsContent value="preferences">
            <Card className="border border-neutral-borderLine dark:border-slate-800 bg-neutral-surface dark:bg-slate-900 shadow-shadow-small rounded-radius-md">
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-neutral-borderLine dark:border-slate-855">
                <div>
                  <CardTitle className="text-h3 font-bold text-neutral-textMain dark:text-slate-100 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-brand-primary" />
                    Travel Preferences
                  </CardTitle>
                  <CardDescription className="text-small text-neutral-textSub dark:text-slate-400">Emergency safety contacts and matching coordinate details.</CardDescription>
                </div>
                {!isEditingPreferences ? (
                  <Button
                    variant="ghost"
                    onClick={() => setIsEditingPreferences(true)}
                    leftIcon={<Edit className="w-4 h-4" />}
                    className="h-9 px-4 rounded text-brand-primary"
                  >
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditingPreferences(false)}
                      leftIcon={<X className="w-4 h-4" />}
                      className="h-9 px-3 rounded text-neutral-textSub"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSavePreferences}
                      loading={isUpdating}
                      leftIcon={<Check className="w-4 h-4" />}
                      className="h-9 px-4 rounded font-semibold"
                    >
                      Save
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {!isEditingPreferences ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-small">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-textSub tracking-wider block">Emergency Contact</span>
                      <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-1">{profile.emergency_contact || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-textSub tracking-wider block">Preferred Pickup Area</span>
                      <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-1">{profile.preferred_pickup_area || 'Not set'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-textSub tracking-wider block">Preferred Drop Area</span>
                      <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-1">{profile.preferred_drop_area || 'Not set'}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[10px] uppercase font-bold text-neutral-textSub tracking-wider block">Ride Guidelines / Notes</span>
                      <p className="text-neutral-textMain dark:text-slate-300 mt-1">
                        {profile.travel_preferences || 'No travel guidelines listed.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Emergency Contact Number"
                      value={preferencesForm.emergency_contact}
                      onChange={(e) => setPreferencesForm({ ...preferencesForm, emergency_contact: e.target.value })}
                    />
                    <Input
                      label="Preferred Pickup Location"
                      value={preferencesForm.preferred_pickup_area}
                      onChange={(e) => setPreferencesForm({ ...preferencesForm, preferred_pickup_area: e.target.value })}
                    />
                    <Input
                      label="Preferred Drop Location"
                      value={preferencesForm.preferred_drop_area}
                      onChange={(e) => setPreferencesForm({ ...preferencesForm, preferred_drop_area: e.target.value })}
                    />
                    <div className="sm:col-span-2">
                      <Textarea
                        label="Travel Guidelines (Optional)"
                        rows={3}
                        value={preferencesForm.travel_preferences}
                        onChange={(e) => setPreferencesForm({ ...preferencesForm, travel_preferences: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ========================================== */}
          {/* TAB 4: RIDE HISTORY                        */}
          {/* ========================================== */}
          <TabsContent value="history">
            <Card className="border border-neutral-borderLine dark:border-slate-800 bg-neutral-surface dark:bg-slate-900 shadow-shadow-small rounded-radius-md">
              <CardHeader>
                <CardTitle className="text-h3 font-bold text-neutral-textMain dark:text-slate-100 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-brand-primary" />
                  Commute Carpool History
                </CardTitle>
                <CardDescription className="text-small text-neutral-textSub dark:text-slate-400">Logs of completed and cancelled trip sessions.</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {isHistoryLoading ? (
                  <Skeleton variant="rect" height="150px" />
                ) : !historyData?.history || historyData.history.length === 0 ? (
                  <div className="p-6 text-center text-neutral-textSub border border-dashed border-neutral-borderLine dark:border-slate-800 rounded">
                    No rides recorded in historical logs.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {historyData.history.map((ride: any) => {
                      const dateObj = new Date(ride.departure_time);
                      const formattedDate = dateObj.toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      });
                      return (
                        <div
                          key={ride.id}
                          className="p-4 rounded border border-neutral-borderLine dark:border-slate-850 bg-neutral-surface dark:bg-slate-900/30 flex justify-between items-center text-small gap-4"
                        >
                          <div className="truncate space-y-1">
                            <span className="text-[10px] text-neutral-textSub font-bold">{formattedDate}</span>
                            <p className="font-semibold text-neutral-textMain dark:text-slate-200 truncate">
                              {ride.pickup_location.split(',')[0]} → {ride.destination.split(',')[0]}
                            </p>
                          </div>
                          <span className={`px-2.5 py-1 rounded text-tiny font-bold uppercase ${
                            ride.status === 'completed' ? 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                          }`}>
                            {ride.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ========================================== */}
          {/* TAB 5: RATINGS & REVIEWS                   */}
          {/* ========================================== */}
          <TabsContent value="ratings">
            <Card className="border border-neutral-borderLine dark:border-slate-800 bg-neutral-surface dark:bg-slate-900 shadow-shadow-small rounded-radius-md">
              <CardHeader>
                <CardTitle className="text-h3 font-bold text-neutral-textMain dark:text-slate-100 flex items-center gap-2">
                  <Star className="w-5 h-5 text-brand-primary" />
                  Commuter Feedback & Ratings
                </CardTitle>
                <CardDescription className="text-small text-neutral-textSub dark:text-slate-400">Reviews and stars rating score received from other commute matches.</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {isReviewsLoading ? (
                  <Skeleton variant="rect" height="120px" />
                ) : reviewList.length === 0 ? (
                  <div className="p-6 text-center text-neutral-textSub border border-dashed border-neutral-borderLine dark:border-slate-800 rounded">
                    No reviews received yet. Keep matching rides to build platform trust scores!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviewList.map((rev) => {
                      const revName = rev.reviewer?.full_name || 'Anonymous';
                      const dateStr = new Date(rev.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      });
                      return (
                        <div key={rev.id} className="p-4 rounded border border-neutral-borderLine dark:border-slate-850 bg-neutral-surface dark:bg-slate-900/30 space-y-2">
                          <div className="flex justify-between items-center text-small">
                            <span className="font-bold text-neutral-textMain dark:text-slate-100">{revName}</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${s <= rev.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-neutral-textSub dark:text-slate-350 italic text-small">
                            "{rev.comment || 'Smooth ride sharing experience.'}"
                          </p>
                          <div className="text-[10px] text-neutral-textSub flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Reviewed on {dateStr}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
