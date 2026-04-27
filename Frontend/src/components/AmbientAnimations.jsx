import React from 'react';
import { useLocation } from 'react-router-dom';
import FloatingLeaves from './FloatingLeaves';

export default function AmbientAnimations() {
  const location = useLocation();

  const includedPaths = [
    '/dashboard',
    '/contact',
    '/leaderboard',
    '/badges',
    '/donate',
    '/log-action'
  ];

  if (!includedPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
      <FloatingLeaves />
    </div>
  );
}
