import { forwardRef } from 'react';

import { Button as ShadcnButton } from '@/components/ui/button';
import { cn } from '../lib/cn';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const variantMap: Record<string, string> = {
  primary: 'default',
  secondary: 'outline',
  ghost: 'ghost',
};

const sizeMap: Record<string, string> = {
  sm: 'sm',
  md: 'default',
  lg: 'lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => {
    return (
      <ShadcnButton
        ref={ref}
        variant={variantMap[variant] as any}
        size={sizeMap[size] as any}
        className={cn(className)}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
