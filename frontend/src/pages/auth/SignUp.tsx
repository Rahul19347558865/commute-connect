import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { Button, Input, PasswordInput, AuthLayout } from '../../components';

const signUpSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

/**
 * SignUp - Sign up page view.
 * Handles form validation using React Hook Form + Zod.
 */
export const SignUp: React.FC = () => {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      await signUp(data.email, data.password);
      toast(
        'success',
        'Account created successfully! Please verify your email check links (if active) and set up your profile.'
      );
      navigate('/register-profile');
    } catch (err: any) {
      console.error(err);
      toast('error', err.message || 'Failed to register account.');
    }
  };

  return (
    <AuthLayout subtitle="Create your Commute Connect account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@college-or-company.com"
          error={errors.email?.message}
          disabled={isSubmitting}
          {...register('email')}
        />

        <PasswordInput
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          disabled={isSubmitting}
          {...register('password')}
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          disabled={isSubmitting}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full h-10 mt-2 font-semibold"
          loading={isSubmitting}
        >
          Sign Up
        </Button>

        <p className="text-small text-neutral-textSub dark:text-slate-400 text-center mt-4">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-brand-primary font-medium hover:underline outline-none focus-visible:ring-1 focus-visible:ring-brand-primary"
          >
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
export default SignUp;
