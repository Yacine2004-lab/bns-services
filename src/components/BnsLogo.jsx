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
      <rect x="20" y="20" width="160" height="140" rx="16" ry="16" fill="white" stroke="#1a3a8a" strokeWidth="6" />

      {/* Engrenage bleu en haut a droite */}
      <g transform="translate(155, 45)">
        <path
          d="M0,-18 L3,-18 L4,-14 L7,-13 L10,-16 L13,-13 L11,-10 L12,-7 L16,-6 L16,-3 L12,-2 L11,1 L14,4 L11,7 L8,5 L5,6 L4,10 L1,10 L0,6 L-3,5 L-6,8 L-9,5 L-7,2 L-8,-1 L-12,-2 L-12,-5 L-8,-4 L-7,-7 L-10,-10 L-7,-13 L-4,-11 L-1,-12 L0,-16 Z"
          fill="#1a3a8a"
        />
        <circle cx="0" cy="-4" r="8" fill="white" stroke="#1a3a8a" strokeWidth="2" />
      </g>

      {/* Vague orange (swoosh) */}
      <path
        d="M20,120 C50,100 80,110 110,95 C90,115 60,130 20,140 Z"
        fill="#e87722"
      />
      <path
        d="M20,145 C55,130 90,140 130,125 C100,148 60,158 20,162 Z"
        fill="#e87722"
      />

      {/* Cercle bleu (personne) */}
      <circle cx="72" cy="65" r="16" fill="#1a3a8a" />

      {/* Texte BNS */}
      <text x="105" y="120" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="36" letterSpacing="2">
        <tspan fill="#1a3a8a">B</tspan>
        <tspan fill="#e87722">N</tspan>
        <tspan fill="#1a3a8a">S</tspan>
      </text>
    </svg>
  )
}
