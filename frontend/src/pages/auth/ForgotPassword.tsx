import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { Button, Input, AuthLayout } from '../../components';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

/**
 * ForgotPassword - Trigger password recovery link requests.
 */
export const ForgotPassword: React.FC = () => {
  const { sendPasswordReset } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await sendPasswordReset(data.email);
      toast('success', 'Reset link dispatched! Please check your email inbox.');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      toast('error', err.message || 'Failed to dispatch recovery link.');
    }
  };

  return (
    <AuthLayout subtitle="Recover your account password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-small text-neutral-textSub dark:text-slate-400">
          Enter your registered email address, and we will email you a secure link to reset your password.
        </p>

        <Input
          label="Email Address"
          type="email"
          placeholder="name@college-or-company.com"
          error={errors.email?.message}
          disabled={isSubmitting}
          {...register('email')}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full h-10 mt-2 font-semibold"
          loading={isSubmitting}
        >
          Send Reset Link
        </Button>

        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-small font-medium text-brand-primary hover:underline outline-none focus-visible:ring-1 focus-visible:ring-brand-primary"
          >
            Back to Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
export default ForgotPassword;
