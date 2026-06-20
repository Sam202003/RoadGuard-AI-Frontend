'use client';

import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from '@roadguard/types';
import { routes } from '@roadguard/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ensureSessionCookie } from '@/lib/auth-storage';
import { useRegisterMutation } from '@/store/api/auth.api';
import { registerSchema, type RegisterFormValues } from '../validations/auth.schema';
import { getErrorMessage } from '@/lib/get-error-message';
import { useAuthRedirect } from '../hooks/use-auth-redirect';

export function RegisterForm() {
  const [registerUser, { isLoading }] = useRegisterMutation();
  const redirectByRole = useAuthRedirect();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      role: UserRole.CUSTOMER,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const result = await registerUser({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.toLowerCase().trim(),
        phoneNumber: values.phoneNumber.trim(),
        password: values.password,
        role: values.role,
      }).unwrap();
      await ensureSessionCookie(result.tokens.accessToken);
      toast.success('Account created successfully');
      redirectByRole(result.user.role);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Registration failed'));
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" autoComplete="given-name" {...register('firstName')} />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" autoComplete="family-name" {...register('lastName')} />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register('email')} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          autoComplete="tel"
          placeholder="+919876543210"
          {...register('phoneNumber')}
        />
        {errors.phoneNumber && (
          <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Account type</Label>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.CUSTOMER}>Customer — I need roadside help</SelectItem>
                <SelectItem value={UserRole.PROVIDER}>Provider — I offer assistance</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput id="password" autoComplete="new-password" {...register('password')} />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account…
          </>
        ) : (
          'Create account'
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href={routes.auth.login} className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </motion.form>
  );
}
