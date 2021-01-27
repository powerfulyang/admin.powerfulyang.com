import { useEffect, useRef } from 'react';
import './index.less';
import { getSuitableImageSize } from '@powerfulyang/utils';
import { useImmer, useMount, usePageQuery } from '@powerfulyang/hooks';
import { fromEvent } from 'rxjs';

const Map = () => {
  const bgRef = useRef<HTMLCanvasElement>(null);
  const rectRef = useRef({ width: 0, height: 0, x: 0, y: 0 });
  const callbackRef = useRef<any>(null);
  const queryX = usePageQuery('x');
  const queryY = usePageQuery('y');
  const [showRight, setShowRight] = useImmer(false);

  const drawCircle = (x: number, y: number, radius = 5) => {
    const { width, height } = rectRef.current;
    const ctx = bgRef.current!.getContext('2d')!;
    ctx.beginPath();
    ctx.arc(x * width, y * height, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    const _x = x * width + rectRef.current.x;
    const _y = y * height + rectRef.current.y;
    return (__x: number, __y: number) => {
      return Math.hypot(_x - __x, _y - __y) < radius;
    };
  };

  useEffect(() => {
    const event = fromEvent(bgRef.current!, 'mousedown');
    event.subscribe((e: any) => {
      const { pageX, pageY } = e;
      if (callbackRef.current(pageX, pageY)) {
        setShowRight(true);
      } else {
        setShowRight(false);
      }
    });
  }, [setShowRight]);

  useMount(() => {
    const img = new Image();
    img.src = '/map/bg.jpg';
    img.onload = () => {
      const { width, height } = img;
      let { width: fitWidth, height: fitHeight } = getSuitableImageSize(width, height);
      fitWidth *= 0.9;
      fitHeight *= 0.9;
      bgRef.current!.width = fitWidth;
      bgRef.current!.height = fitHeight;
      const { x, y } = bgRef.current!.getBoundingClientRect();
      rectRef.current = { width: fitWidth, height: fitHeight, x, y };
      const ctx = bgRef.current!.getContext('2d')!;
      ctx.drawImage(img, 0, 0, fitWidth, fitHeight);
      ctx.beginPath();
      ctx.moveTo(0, fitHeight);
      ctx.lineTo(fitWidth, fitHeight);
      ctx.moveTo(0, fitHeight);
      ctx.lineTo(0, 0);
      ctx.lineWidth = 2; // 设置线条宽度
      ctx.strokeStyle = 'blue'; // 设置线条颜色
      ctx.stroke(); // 用于绘制线条
      ctx.closePath();
      callbackRef.current = drawCircle(Number(queryX), Number(queryY));
    };
  });

  return (
    <div className="flex h-full justify-evenly items-center">
      <canvas ref={bgRef} />
      <div className="w-1/4 h-full flex flex-col justify-around">
        {showRight && (
          <>
            <img className="w-full block" src="/map/pois.jpg" alt="" />
            <img className="w-full block" src="/map/pois.jpg" alt="" />
          </>
        )}
      </div>
    </div>
  );
};

export default Map;
