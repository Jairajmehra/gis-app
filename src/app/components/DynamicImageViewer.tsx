import dynamic from 'next/dynamic';

const DynamicImageViewer = dynamic(() => import('./ImageViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      Loading map...
    </div>
  ),
});

export default DynamicImageViewer; 