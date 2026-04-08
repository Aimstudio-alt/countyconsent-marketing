'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

interface LottieAnimationProps {
  src: string
  className?: string
  loop?: boolean
}

export default function LottieAnimation({ src, className = '', loop = true }: LottieAnimationProps) {
  const [animationData, setAnimationData] = useState<object | null>(null)

  useEffect(() => {
    fetch(src)
      .then((r) => r.json())
      .then(setAnimationData)
      .catch(() => {})
  }, [src])

  if (!animationData) return <div className={className} />

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay
      className={className}
    />
  )
}
