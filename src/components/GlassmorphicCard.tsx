import React from 'react';

interface GlassmorphicCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'strong' | 'subtle';
  hoverable?: boolean;
  onClick?: () => void;
}

/**
 * GlassmorphicCard Component
 * 
 * A card with frosted glass effect (glassmorphism) as defined in the design system.
 * Features backdrop blur, transparency, and subtle borders for a modern aesthetic.
 * 
 * @example
 * ```tsx
 * <GlassmorphicCard>
 *   <h2>Card Title</h2>
 *   <p>Card content here...</p>
 * </GlassmorphicCard>
 * ```
 */
export const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  className = '',
  variant = 'default',
  hoverable = true,
  onClick,
}) => {
  const variantClasses = {
    default: 'glass-card',
    strong: 'glass-card-strong',
    subtle: 'glass-card-subtle',
  };

  const baseClasses = variantClasses[variant];
  const hoverClasses = hoverable ? 'glass-transition cursor-pointer' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassmorphicCard;


