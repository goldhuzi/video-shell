import { useEffect, useRef, useState } from "react";
import { clampTime, formatTime } from "../../utils/timeFormat";

type VideoPreviewControllerProps = {
  src: string;
  currentTime: number;
  fallbackDuration: number;
  onCurrentTimeChange: (time: number) => void;
  onDurationChange: (duration: number) => void;
};

export function VideoPreviewController({
  src,
  currentTime,
  fallbackDuration,
  onCurrentTimeChange,
  onDurationChange,
}: VideoPreviewControllerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [canUseVideo, setCanUseVideo] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const maxDuration = fallbackDuration > 0 ? fallbackDuration : 360;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (Math.abs(video.currentTime - currentTime) > 0.35) {
      video.currentTime = clampTime(currentTime, 0, video.duration || maxDuration);
    }
  }, [currentTime, maxDuration]);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video || loadError) {
      return;
    }

    if (video.paused) {
      await video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const seekTo = (time: number) => {
    const nextTime = clampTime(time, 0, videoRef.current?.duration || maxDuration);
    if (videoRef.current) {
      videoRef.current.currentTime = nextTime;
    }
    onCurrentTimeChange(nextTime);
  };

  return (
    <div className="video-preview-controller" aria-label="编辑器视频控制器">
      <video
        ref={videoRef}
        className="video-preview-probe"
        muted
        onCanPlay={() => {
          setCanUseVideo(true);
          setLoadError(false);
        }}
        onDurationChange={(event) => {
          const duration = event.currentTarget.duration;
          if (Number.isFinite(duration) && duration > 0) {
            onDurationChange(duration);
          }
        }}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setCanUseVideo(false);
          setLoadError(true);
          setIsPlaying(false);
        }}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onTimeUpdate={(event) => onCurrentTimeChange(event.currentTarget.currentTime)}
        playsInline
        preload="metadata"
        src={src}
      />
      <button disabled={loadError} type="button" onClick={togglePlayback}>
        {isPlaying ? "暂停" : "播放"}
      </button>
      <input
        aria-label="拖动编辑器视频预览时间"
        max={maxDuration}
        min={0}
        onChange={(event) => seekTo(Number(event.target.value))}
        step={0.5}
        type="range"
        value={clampTime(currentTime, 0, maxDuration)}
      />
      <output>
        {formatTime(currentTime)} / {formatTime(maxDuration)}
      </output>
      <span className={`video-probe-state ${canUseVideo ? "is-ready" : "is-warning"}`}>
        {canUseVideo ? "已读取视频时间" : loadError ? "主视频未找到，可手动配置" : "等待视频元数据"}
      </span>
    </div>
  );
}
