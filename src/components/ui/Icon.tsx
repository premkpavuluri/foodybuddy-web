import React from 'react';
import { iconRegistry, IconName } from './IconRegistry';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 20, 
  color, 
  className = '', 
  style = {} 
}) => {
  const IconComponent = iconRegistry[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in registry`);
    return null;
  }

  const iconStyle: React.CSSProperties = {
    width: size,
    height: size,
    color: color || 'currentColor',
    ...style,
  };

  return (
    <IconComponent
      width={size}
      height={size}
      className={className}
      style={iconStyle}
    />
  );
};

export default Icon;
