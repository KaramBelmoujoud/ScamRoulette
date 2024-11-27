'use client';
import dynamic from 'next/dynamic';

const UploadPage = dynamic(() => import('./UploadPage'), {
  ssr: false
});

export default function UploadPageWrapper() {
  return <UploadPage />;
} 