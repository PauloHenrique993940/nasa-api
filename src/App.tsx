import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';

const queryClient = new QueryClient();


function VideoPlayer({ assetUrl }: { assetUrl: string }) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    
    axios.get(assetUrl).then((response) => {
      
      const mp4Link = response.data.find((url: string) => 
        url.endsWith('~mobile.mp4') || url.endsWith('.mp4')
      );
      setVideoSrc(mp4Link);
    }).catch(() => setVideoSrc(null));
  }, [assetUrl]);

  if (!videoSrc) {
    return <div style={videoPlaceholder}>Carregando vídeo...</div>;
  }

  return (
    <video controls style={media} poster="">
      <source src={videoSrc} type="video/mp4" />
      Seu navegador não suporta vídeos.
    </video>
  );
}

// Hook para buscar Galeria da NASA
function useNASAGallery(query: string) {
  return useQuery({
    queryKey: ['nasa-gallery', query],
    queryFn: async () => {
      const { data } = await axios.get(`https://images-api.nasa.gov/search?q=${query}&media_type=image,video`);
      return data.collection.items;
    }
  });
}

function GalacticGallery() {
  const { data: items, isLoading, isError } = useNASAGallery('mars');

  if (isLoading) return <div style={centerMsg}>Conectando ao Deep Space Network...</div>;
  if (isError) return <div style={centerMsg}>Erro ao carregar arquivos da NASA.</div>;

  return (
    <div style={container}>
      <h1 style={title}>🚀 NASA Media Explorer</h1>
      
      <div style={grid}>
        {items?.slice(0, 12).map((item: any) => {
          const isVideo = item.data[0].media_type === 'video';
          
          return (
            <div key={item.data[0].nasa_id} style={card}>
              {isVideo ? (
                /* Chamando o player inteligente para vídeos */
                <VideoPlayer assetUrl={item.href} />
              ) : (
                <img 
                  src={item.links[0].href} 
                  alt={item.data[0].title} 
                  style={media} 
                />
              )}
              
              <div style={info}>
                <h3 style={itemTitle}>{item.data[0].title}</h3>
                <p style={description}>
                  {item.data[0].description?.substring(0, 80)}...
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ backgroundColor: '#020617', minHeight: '100vh' }}>
        <GalacticGallery />
      </div>
    </QueryClientProvider>
  );
}

// --- ESTILOS ---
const container = { maxWidth: '1200px', margin: '0 auto', padding: '40px' };
const title = { textAlign: 'center' as const, color: '#38bdf8', marginBottom: '40px', fontSize: '2.5rem' };
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' };
const card = { background: '#1e293b', borderRadius: '15px', overflow: 'hidden', border: '1px solid #334155', display: 'flex', flexDirection: 'column' as const };
const media = { width: '100%', height: '220px', objectFit: 'cover' as const, background: '#000' };
const videoPlaceholder = { height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#38bdf8', fontSize: '0.9rem' };
const info = { padding: '15px', flexGrow: 1 };
const itemTitle = { fontSize: '1.1rem', color: '#f8fafc', marginBottom: '8px' };
const description = { fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.4' };
const centerMsg = { textAlign: 'center' as const, color: '#38bdf8', padding: '100px' };