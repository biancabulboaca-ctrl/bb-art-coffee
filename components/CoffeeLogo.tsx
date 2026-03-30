export default function CoffeeLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Abur stânga */}
      <path
        d="M20 10 C20 7, 23 5, 23 2"
        stroke="#2DD4BF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />
      {/* Abur mijloc */}
      <path
        d="M28 12 C28 8, 32 6, 32 2"
        stroke="#2DD4BF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />
      {/* Abur dreapta */}
      <path
        d="M36 10 C36 7, 39 5, 39 2"
        stroke="#2DD4BF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />

      {/* Corp cașcă */}
      <path
        d="M14 18 L18 52 H46 L50 18 Z"
        stroke="#14B8A6"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="rgba(20,184,166,0.08)"
      />

      {/* Toartă */}
      <path
        d="M50 24 C60 24, 62 34, 56 38 C53 40, 50 40, 50 40"
        stroke="#14B8A6"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Farfurie */}
      <path
        d="M10 54 Q32 60 54 54"
        stroke="#14B8A6"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Linie accent interior */}
      <path
        d="M22 28 Q32 32 42 28"
        stroke="#2DD4BF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.5"
        fill="none"
      />
    </svg>
  );
}
