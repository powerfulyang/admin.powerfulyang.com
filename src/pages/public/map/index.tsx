import { useRef } from 'react';
import './index.less';
import { getSuitableImageSize } from '@powerfulyang/utils';
import { useMount } from '@powerfulyang/hooks';

const Map = () => {
  const bgRef = useRef<HTMLImageElement>(null);

  useMount(() => {
    bgRef.current!.onload = () => {
      const { width, height } = bgRef.current!;
      const { width: fitWidth, height: fitHeight } = getSuitableImageSize(width, height);
      bgRef.current!.width = fitWidth * 0.9;
      bgRef.current!.height = fitHeight * 0.9;
    };
  });

  return (
    <div className="flex h-full justify-center items-center">
      <img className="block" src="/map/bg.jpg" ref={bgRef} alt="" />
    </div>
  );
};

export default Map;
