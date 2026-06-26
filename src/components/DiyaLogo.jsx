export default function DiyaLogo({ size = 32, className = '', color = '#3D5240' }) {
  const w = size
  const h = Math.round(size * 1.4)
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 40 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer flame */}
      <path
        d="M20 2 C14 12 10 20 10 30 C10 40.5 14.5 54 20 54 C25.5 54 30 40.5 30 30 C30 20 26 12 20 2Z"
        fill={color}
        opacity="0.9"
      />
      {/* Inner highlight — gives depth */}
      <path
        d="M20 14 C17 20 15.5 26 15.5 32 C15.5 38 17 44 20 44 C23 44 24.5 38 24.5 32 C24.5 26 23 20 20 14Z"
        fill="white"
        opacity="0.25"
      />
    </svg>
  )
}
