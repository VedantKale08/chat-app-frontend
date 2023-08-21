import { loaderOptions } from '@/lottieOptions/Options';
import React from 'react'
import Lottie from 'react-lottie';

function Loader() {
  return (
    <div className="fixed overflow-scroll scroll  scrollbar-none backdrop-blur-[2px] backdrop-brightness-50 top-0 right-0 left-0 bottom-0 z-[100]">
      <div className="w-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute">
        <Lottie options={loaderOptions} />
      </div>
    </div>
  );
}

export default Loader