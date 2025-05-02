
import React from "react";

interface SkeletonLoaderProps {
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className = "" }) => {
  return (
    <div className={`bg-crypto-card-light dark:bg-crypto-card-dark rounded-md animate-pulse-slow ${className}`} />
  );
};

export default SkeletonLoader;
