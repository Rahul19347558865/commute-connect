import React, { useRef, useState } from 'react';
import { useUploadAvatar } from '../../hooks/useProfile';
import { useToast } from '../../hooks/useToast';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Upload, Loader } from '../icons';

interface AvatarUploaderProps {
  currentUrl?: string | null;
  name: string;
}

/**
 * AvatarUploader - Sub-component to manage profile photo image selections,
 * instant client previews, and secure uploads to Cloudinary via TanStack Query.
 */
export const AvatarUploader: React.FC<AvatarUploaderProps> = ({ currentUrl, name }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: uploadAvatar, isPending } = useUploadAvatar();
  const { toast } = useToast();
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation: must be image under 5MB
    if (!file.type.startsWith('image/')) {
      toast('error', 'Please select a valid image file (PNG/JPG).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast('error', 'File size exceeds 5MB limit.');
      return;
    }

    // Instant local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      await uploadAvatar(file);
      toast('success', 'Profile photo updated successfully!');
      setPreviewUrl(null);
    } catch (err: any) {
      console.error(err);
      toast('error', err.message || 'Failed to upload profile photo.');
      setPreviewUrl(null);
    }
  };

  const triggerFileInput = () => {
    if (isPending) return;
    fileInputRef.current?.click();
  };

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').substring(0, 2)
    : '?';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group select-none">
        <Avatar
          src={previewUrl || currentUrl || undefined}
          fallback={initials}
          size="lg"
          alt={`${name} profile picture`}
          className="w-24 h-24 border-2 border-brand-primary"
        />
        {isPending && (
          <div className="absolute inset-0 rounded-radius-pill bg-slate-950/50 flex items-center justify-center text-neutral-surface">
            <Loader className="w-6 h-6 animate-spin" />
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload profile photo avatar"
        disabled={isPending}
      />

      <Button
        variant="ghost"
        size="sm"
        onClick={triggerFileInput}
        loading={isPending}
        leftIcon={<Upload className="w-3.5 h-3.5" />}
        className="text-brand-primary hover:text-blue-700"
      >
        Change Photo
      </Button>
    </div>
  );
};
