'use client'

import { useEffect, useRef, useState } from 'react'

interface LottiePlayerProps {
  src: string
  className?: string
  loop?: boolean
  autoplay?: boolean
}

export default function LottiePlayer({ src, className = '', loop = true, autoplay = true }: LottiePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [animationData, setAnimationData] = useState<object | null>(null)
  const lottieRef = useRef<{ destroy: () => void } | null>(null)

  useEffect(() => {
    fetch(src)
      .then((r) => r.json())
      .then((data) => setAnimationData(data))
      .catch(() => {/* silently fail — container stays empty */})
  }, [src])

  useEffect(() => {
    if (!animationData || !containerRef.current) return

    let cancelled = false

    import('lottie-react').then(({ default: Lottie }) => {
      if (cancelled || !containerRef.current) return
      // render via lottie-web directly for imperative control
    })

    return () => { cancelled = true }
  }, [animationData])

  // Simpler approach: use lottie-react's Lottie component directly
  return <div ref={containerRef} className={className} data-src={src} data-loop={loop} data-autoplay={autoplay} />
}
