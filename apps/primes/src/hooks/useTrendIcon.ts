import { useState, useEffect } from 'react';
import trendUp1 from '../pages/img/trend-up-01.png';
import trendDown1 from '../pages/img/trend-down-01.png';

interface TrendIconProps {
  percentage: number;
  threshold?: number;
}

export const useTrendIcon = ({ percentage, threshold = 80 }: TrendIconProps) => {
  const [iconSrc, setIconSrc] = useState<string>('');
  const [iconColor, setIconColor] = useState<string>('');

  useEffect(() => {
    if (percentage >= threshold) {
      setIconSrc(trendUp1);
      setIconColor('text-green-600');
    } else {
      setIconSrc(trendDown1);
      setIconColor('text-red-600');
    }
  }, [percentage, threshold]);

  return { iconSrc, iconColor };
}; 