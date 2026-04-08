export default function AnimatedShield() {
  return (
    <div className="relative flex items-center justify-center">
      <style>{`
        @keyframes shieldPulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.28; transform: scale(1.06); }
        }
        @keyframes shieldPulse2 {
          0%, 100% { opacity: 0.08; transform: scale(1); }
          50% { opacity: 0.16; transform: scale(1.12); }
        }
        @keyframes checkDraw {
          from { stroke-dashoffset: 60; opacity: 0; }
          to { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .shield-ring-1 { animation: shieldPulse 3s ease-in-out infinite; transform-origin: center; }
        .shield-ring-2 { animation: shieldPulse2 3s ease-in-out infinite 0.5s; transform-origin: center; }
        .shield-float { animation: floatUp 4s ease-in-out infinite; }
        .shield-check { stroke-dasharray: 60; animation: checkDraw 1s ease-out 0.5s forwards; opacity: 0; }
        .orbit-ring { animation: ringRotate 12s linear infinite; transform-origin: 120px 120px; }
      `}</style>

      <svg viewBox="0 0 240 240" className="w-64 h-64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Pulsing rings */}
        <circle cx="120" cy="120" r="100" stroke="#155230" strokeWidth="1.5" strokeDasharray="4 6" className="shield-ring-2" />
        <circle cx="120" cy="120" r="80" stroke="#228450" strokeWidth="1" strokeDasharray="3 5" className="shield-ring-1" />

        {/* Orbiting dot */}
        <g className="orbit-ring">
          <circle cx="120" cy="22" r="5" fill="#c9921c" opacity="0.8" />
        </g>

        {/* Shield body */}
        <g className="shield-float">
          <path d="M120 40 L185 65 L185 120 C185 158 120 188 120 188 C120 188 55 158 55 120 L55 65 Z"
            fill="url(#sg)" />
          <path d="M120 52 L175 74 L175 122 C175 153 120 178 120 178 C120 178 65 153 65 122 L65 74 Z"
            fill="white" opacity="0.08" />
          {/* Check */}
          <path d="M93 118 L110 136 L148 98"
            stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
            className="shield-check" />
        </g>

        {/* Floating badges */}
        <g transform="translate(168, 70)">
          <rect width="56" height="26" rx="8" fill="white" stroke="#e5e7eb" strokeWidth="1" />
          <circle cx="13" cy="13" r="7" fill="#edf7f2" />
          <path d="M10 13 L12 15 L16 11" stroke="#155230" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="24" y="8" width="24" height="4" rx="2" fill="#155230" opacity="0.2" />
          <rect x="24" y="15" width="16" height="3" rx="1.5" fill="#155230" opacity="0.12" />
        </g>

        <g transform="translate(18, 140)">
          <rect width="56" height="26" rx="8" fill="white" stroke="#e5e7eb" strokeWidth="1" />
          <circle cx="13" cy="13" r="7" fill="#fffaeb" />
          <text x="13" y="17" textAnchor="middle" fill="#92620a" fontSize="9" fontWeight="700">⚕</text>
          <rect x="24" y="8" width="20" height="4" rx="2" fill="#92620a" opacity="0.2" />
          <rect x="24" y="15" width="28" height="3" rx="1.5" fill="#92620a" opacity="0.12" />
        </g>

        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#155230" />
            <stop offset="100%" stopColor="#228450" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
