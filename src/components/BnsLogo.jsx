export default function BnsLogo({ size = 44, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="BNS Services"
    >
      {/* Cadre bleu (ecran/monitor) */}
      <rect x="15" y="15" width="170" height="150" rx="14" ry="14" fill="white" stroke="#1a3a8a" strokeWidth="5" />

      {/* Engrenage bleu en haut a droite */}
      <g transform="translate(160, 42)">
        <path
          d="M0,-16 L2.5,-16 L3.5,-12 L6,-11 L8.5,-14 L11,-11 L9,-8 L10,-5 L14,-4 L14,-1.5 L10,-0.5 L9,2 L12,4.5 L9,7 L6.5,5 L4,6 L3,10 L0.5,10 L0,6 L-2.5,5 L-5,7.5 L-7.5,5 L-5.5,2 L-6.5,-1 L-10,-2 L-10,-4.5 L-6.5,-3.5 L-5.5,-6.5 L-8,-9 L-5.5,-11.5 L-3,-9.5 L-0.5,-10.5 L0,-14 Z"
          fill="#1a3a8a"
        />
        <circle cx="0" cy="-3" r="7" fill="white" stroke="#1a3a8a" strokeWidth="2" />
      </g>

      {/* Vague orange (swoosh) - plus large et fluide */}
      <path
        d="M15,115 C45,95 75,108 105,92 C85,112 55,128 15,138 Z"
        fill="#e87722"
      />
      <path
        d="M15,142 C50,125 85,138 125,120 C95,145 55,158 15,162 Z"
        fill="#e87722"
      />

      {/* Cercle bleu (personne) */}
      <circle cx="68" cy="62" r="15" fill="#1a3a8a" />

      {/* Texte BNS - bien centre dans le cadre */}
      <text x="70" y="115" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="40" letterSpacing="4">
        <tspan fill="#1a3a8a">B</tspan>
        <tspan fill="#e87722">N</tspan>
        <tspan fill="#1a3a8a">S</tspan>
      </text>
    </svg>
  )
}
