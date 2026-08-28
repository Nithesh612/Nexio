import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

export default function LottieAnimation({ animationData, width = 280, height = 280, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !animationData) return;

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData,
    });

    return () => {
      anim.destroy();
    };
  }, [animationData]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width, height, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    />
  );
}
