export default function HeroGraphic() {
  return (
    <svg
      viewBox="0 0 520 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Defs */}
      <defs>
        <radialGradient id="g1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#228450" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#228450" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="g2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c9921c" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#c9921c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#155230" />
          <stop offset="100%" stopColor="#228450" />
        </linearGradient>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c9921c" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#e0aa30" stopOpacity="0.2" />
        </linearGradient>
        <filter id="blur1">
          <feGaussianBlur stdDeviation="20" />
        </filter>
        <filter id="blur2">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      {/* Background blobs */}
      <circle cx="380" cy="120" r="180" fill="url(#g1)" filter="url(#blur1)" />
      <circle cx="140" cy="360" r="140" fill="url(#g2)" filter="url(#blur1)" />

      {/* Outer decorative rings */}
      <circle cx="260" cy="220" r="200" stroke="url(#ringGrad)" strokeWidth="1" strokeDasharray="6 8" />
      <circle cx="260" cy="220" r="160" stroke="#155230" strokeOpacity="0.07" strokeWidth="1" />

      {/* Central shield */}
      <g transform="translate(175, 95)">
        <path
          d="M85 10 L160 38 L160 105 C160 152 85 185 85 185 C85 185 10 152 10 105 L10 38 Z"
          fill="url(#shieldGrad)"
          opacity="0.95"
        />
        {/* Shield inner highlight */}
        <path
          d="M85 25 L148 49 L148 108 C148 147 85 176 85 176 C85 176 22 147 22 108 L22 49 Z"
          fill="white"
          opacity="0.08"
        />
        {/* Checkmark */}
        <path
          d="M55 95 L75 115 L118 72"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Floating card — Consented */}
      <g transform="translate(310, 80)" filter="url(#blur2)">
        <rect width="160" height="52" rx="12" fill="white" opacity="0.15" />
      </g>
      <g transform="translate(310, 80)">
        <rect width="160" height="52" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="1" />
        <circle cx="22" cy="26" r="10" fill="#d4ede0" />
        <path d="M17 26 L21 30 L28 22" stroke="#155230" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="40" y="16" width="70" height="7" rx="3" fill="#0f3d24" opacity="0.15" />
        <rect x="40" y="29" width="50" height="6" rx="3" fill="#0f3d24" opacity="0.08" />
        <rect x="122" y="20" width="28" height="14" rx="7" fill="#d4ede0" />
        <text x="136" y="30" textAnchor="middle" fill="#155230" fontSize="7" fontWeight="700">✓</text>
      </g>

      {/* Floating card — Medical alert */}
      <g transform="translate(30, 200)">
        <rect width="148" height="52" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="1" />
        <circle cx="22" cy="26" r="10" fill="#fdf0cb" />
        <text x="22" y="30" textAnchor="middle" fill="#92620a" fontSize="11" fontWeight="700">⚕</text>
        <rect x="40" y="16" width="60" height="7" rx="3" fill="#0f3d24" opacity="0.15" />
        <rect x="40" y="29" width="80" height="6" rx="3" fill="#0f3d24" opacity="0.08" />
        <rect x="108" y="20" width="28" height="14" rx="7" fill="#fdf0cb" />
        <text x="122" y="30" textAnchor="middle" fill="#92620a" fontSize="6" fontWeight="700">ALERT</text>
      </g>

      {/* Floating card — Audit */}
      <g transform="translate(330, 300)">
        <rect width="148" height="52" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="1" />
        <circle cx="22" cy="26" r="10" fill="#edf7f2" />
        <path d="M17 22 L22 22 M17 26 L27 26 M17 30 L24 30" stroke="#155230" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="40" y="16" width="55" height="7" rx="3" fill="#0f3d24" opacity="0.15" />
        <rect x="40" y="29" width="75" height="6" rx="3" fill="#0f3d24" opacity="0.08" />
      </g>

      {/* Connecting dots */}
      {[[260,60],[390,170],[350,400],[120,400],[80,160]].map(([cx,cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#155230" opacity="0.2" />
      ))}

      {/* Subtle grid dots */}
      {Array.from({length:6}, (_,row) =>
        Array.from({length:6}, (_,col) => (
          <circle
            key={`${row}-${col}`}
            cx={40 + col * 80}
            cy={40 + row * 80}
            r="1.5"
            fill="#155230"
            opacity="0.06"
          />
        ))
      )}
    </svg>
  )
}
