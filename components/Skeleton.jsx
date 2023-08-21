import React from 'react'

export function UserSkeleton() {
  return (
    <div className='flex flex-col gap-2'>
      <div className="h-16 rounded-md bg-gray-400 animate-pulse"></div>
      <div className="h-16 rounded-md bg-gray-400 animate-pulse"></div>
      <div className="h-16 rounded-md bg-gray-400 animate-pulse"></div>
      <div className="h-16 rounded-md bg-gray-400 animate-pulse"></div>
      <div className="h-16 rounded-md bg-gray-400 animate-pulse"></div>
    </div>
  );
}