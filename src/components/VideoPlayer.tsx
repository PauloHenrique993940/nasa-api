import { useState, useEffect } from 'react';
import axios from 'axios';

export function VideoPlayer({ assetUrl }: { assetUrl: string }) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    //Usando json
    axios.get(assetUrl).then((response) => {
      const mp4Link = response.data.find((url: string) => url.endsWith('~mobile.mp4') || url.endsWith('.mp4'));
      setVideoSrc(mp4Link);
    });
  }, [assetUrl]);

  if (!videoSrc) return <div style={{height: '220px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Carregando vídeo...</div>;

  return (
    <video controls style={{ width: '100%', height: '220px', objectFit: 'cover' }}>
      <source src={videoSrc} type="video/mp4" />
    </video>
  );
}