const UgaiaLogo = ({ size = 60 }) => {
  const scale = size / 100;

  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circuit lines left */}
      <line x1="5" y1="45" x2="25" y2="45" stroke="#29B6F6" strokeWidth="3"/>
      <circle cx="5" cy="45" r="4" fill="#29B6F6"/>
      <circle cx="18" cy="45" r="3" fill="#29B6F6"/>

      {/* Circuit lines right */}
      <line x1="75" y1="45" x2="95" y2="45" stroke="#29B6F6" strokeWidth="3"/>
      <circle cx="95" cy="45" r="4" fill="#29B6F6"/>
      <circle cx="82" cy="45" r="3" fill="#29B6F6"/>

      {/* Main blue shield */}
      <path
        d="M50 5 L85 20 L85 50 Q85 75 50 95 Q15 75 15 50 L15 20 Z"
        fill="#29B6F6"
      />

      {/* Inner white shield */}
      <path
        d="M50 25 L70 35 L70 52 Q70 68 50 80 Q30 68 30 52 L30 35 Z"
        fill="white"
        stroke="#E0E0E0"
        strokeWidth="1"
      />

      {/* Orange keyhole */}
      <circle cx="50" cy="48" r="8" fill="#FF6B35"/>
      <path
        d="M46 52 L46 68 Q46 70 50 70 Q54 70 54 68 L54 52"
        fill="#FF6B35"
      />

      {/* UGAIA text */}
      <text
        x="50"
        y="112"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        fontWeight="bold"
        fill="#FF6B35"
        letterSpacing="2"
      >
        UGAIA
      </text>
    </svg>
  );
};

export default UgaiaLogo;
