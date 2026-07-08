import React, { useState } from 'react';
import { useSavedPlaces, useAddSavedPlace, useDeleteSavedPlace } from '../../hooks/useTrust';
import { useToast } from '../../hooks/useToast';
import { LocationAutocomplete } from '../rides/LocationAutocomplete';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Trash, MapPin, Plus } from '../icons';

/**
 * SavedPlaces - Bookmark locations selector panel.
 * Registers pickup/destination shortcuts (Home, Office, College) using autocomplete APIs.
 */
export const SavedPlaces: React.FC = () => {
  const { toast } = useToast();
  const { data: places, isLoading } = useSavedPlaces();
  const { mutateAsync: addPlace, isPending: isAdding } = useAddSavedPlace();
  const { mutateAsync: deletePlace } = useDeleteSavedPlace();

  const [label, setLabel] = useState('Home');
  const [customLabel, setCustomLabel] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);

  const handleSelectAutocomplete = (val: { address: string; lat: number; lon: number }) => {
    setAddress(val.address);
    setLat(val.lat);
    setLon(val.lon);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || lat === null || lon === null) {
      toast('error', 'Please select a valid coordinate address using the search list.');
      return;
    }

    const finalLabel = label === 'Custom' ? customLabel : label;
    if (!finalLabel.trim()) {
      toast('error', 'Saved place label description is required.');
      return;
    }

    try {
      await addPlace({
        label: finalLabel,
        address,
        latitude: lat,
        longitude: lon,
      });
      toast('success', `Bookmark "${finalLabel}" added successfully!`);
      // Reset states
      setAddress('');
      setLat(null);
      setLon(null);
      setCustomLabel('');
    } catch (err: any) {
      toast('error', err.response?.data?.message || err.message || 'Failed to save location.');
    }
  };

  const handleDelete = async (id: string, labelText: string) => {
    try {
      await deletePlace(id);
      toast('success', `Bookmark "${labelText}" deleted.`);
    } catch (err: any) {
      toast('error', err.message || 'Failed to delete saved location.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-small">
      {/* Save Place Form Card */}
      <Card className="border border-neutral-borderLine dark:border-slate-800">
        <CardContent className="p-5 space-y-4">
          <h3 className="font-bold text-neutral-textMain dark:text-slate-100 flex items-center gap-2">
            <Plus className="w-5 h-5 text-brand-primary" />
            Add Bookmark Place
          </h3>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-small font-medium text-neutral-textMain select-none">Label Category</label>
              <select
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full h-10 px-3 text-small rounded-radius-md border bg-neutral-surface dark:bg-slate-900 border-neutral-borderLine dark:border-slate-800 outline-none"
              >
                <option value="Home">Home 🏠</option>
                <option value="College">College 🎓</option>
                <option value="Office">Office 🏢</option>
                <option value="Custom">Custom 📌</option>
              </select>
            </div>

            {label === 'Custom' && (
              <Input
                label="Custom Label Name"
                placeholder="e.g. Gym, Library"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
              />
            )}

            <div className="md:col-span-2 relative w-full">
              <LocationAutocomplete
                label="Location Address"
                placeholder="Search bookmark address..."
                onSelect={handleSelectAutocomplete}
              />
            </div>

            <Button type="submit" variant="primary" loading={isAdding} className="h-10 w-full font-bold">
              Save Bookmark
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Bookmarks List */}
      <div className="space-y-3">
        <h3 className="font-bold text-neutral-textMain dark:text-slate-200">
          Saved Location Shortcuts
        </h3>

        {isLoading ? (
          <div className="space-y-2">
            <Card className="h-16 animate-pulse" />
          </div>
        ) : !places || places.length === 0 ? (
          <div className="p-6 text-center text-neutral-textSub border border-dashed border-neutral-borderLine dark:border-slate-800 rounded">
            You don't have any bookmarked places yet. Add your Home, College, or Office shortcuts!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {places.map((place) => (
              <Card key={place.id} className="border border-neutral-borderLine dark:border-slate-800 hover:shadow-shadow-small transition-all">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <MapPin className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="font-bold text-neutral-textMain dark:text-slate-100 flex items-center gap-1.5">
                        {place.label}
                      </span>
                      <p className="text-[11px] text-neutral-textSub dark:text-slate-400 truncate mt-0.5" title={place.address}>
                        {place.address}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(place.id, place.label)}
                    className="p-2 h-auto text-brand-error hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0"
                    aria-label={`Delete bookmark ${place.label}`}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default SavedPlaces;
