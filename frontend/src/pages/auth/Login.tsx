import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { Button, Input, PasswordInput, AuthLayout, SEO } from '../../components';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Login - Accessible Sign-in view page.
 * Implements form validation using React Hook Form + Zod,
 * and calls the unified AuthContext logic to log the user in.
 */
export const Login: React.FC = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      toast('success', 'Logged in successfully! Welcome back.');
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error(err);
      toast('error', err.message || 'Failed to authenticate login details.');
    }
  };

  return (
    <AuthLayout subtitle="Welcome back to Commute Connect">
      <SEO
        title="Sign In"
        description="Sign in to your Commute Connect account to find active carpools, match with riders, and review fuel-sharing bookings."
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@college-or-company.com"
          error={errors.email?.message}
          disabled={isSubmitting}
          {...register('email')}
        />

        <div className="space-y-1">
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            disabled={isSubmitting}
            {...register('password')}
          />
          <div className="flex justify-end pt-1">
            <Link
              to="/forgot-password"
              className="text-tiny text-brand-primary hover:underline outline-none focus-visible:ring-1 focus-visible:ring-brand-primary"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full h-10 mt-2 font-semibold"
          loading={isSubmitting}
        >
          Sign In
        </Button>

        <p className="text-small text-neutral-textSub dark:text-slate-400 text-center mt-4">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-brand-primary font-medium hover:underline outline-none focus-visible:ring-1 focus-visible:ring-brand-primary"
          >
            Create Account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
export default Login;
