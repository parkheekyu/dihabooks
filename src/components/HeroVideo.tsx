import { useEffect, useRef } from "react";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<any> | null = null;
function loadYouTubeApi(): Promise<any> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT);
    };
    document.body.appendChild(tag);
  });
  return apiPromise;
}

interface HeroVideoProps {
  youtubeId: string;
  paused: boolean;
  onEnded: () => void;
}

const HeroVideo = ({ youtubeId, paused, onEnded }: HeroVideoProps) => {
  const holderRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  useEffect(() => {
    let destroyed = false;
    loadYouTubeApi().then((YT) => {
      if (destroyed || !holderRef.current) return;
      playerRef.current = new YT.Player(holderRef.current, {
        width: "100%",
        height: "100%",
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          fs: 0,
          disablekb: 1,
          cc_load_policy: 0, // do not force captions
          iv_load_policy: 3, // hide annotations
        },
        events: {
          onReady: (e: any) => {
            e.target.mute();
            // force captions off
            try {
              e.target.unloadModule("captions");
              e.target.unloadModule("cc");
            } catch {
              /* noop */
            }
            e.target.playVideo();
          },
          onStateChange: (e: any) => {
            if (e.data === YT.PlayerState.ENDED) onEndedRef.current();
          },
        },
      });
    });
    return () => {
      destroyed = true;
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* noop */
      }
      playerRef.current = null;
    };
  }, [youtubeId]);

  // Reflect the carousel play/pause button onto the video
  useEffect(() => {
    const p = playerRef.current;
    if (!p || !p.pauseVideo) return;
    if (paused) p.pauseVideo();
    else p.playVideo();
  }, [paused]);

  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center">
      <div className="h-full aspect-video max-w-full pointer-events-none">
        <div ref={holderRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default HeroVideo;
