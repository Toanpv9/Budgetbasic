export default function BeeMark({ size = 24, className = '' }) {
  return <img src="logo-mark.png" alt="" width={size} height={size} className={`inline-block object-contain shrink-0 ${className}`} style={{ width: size, height: size }} />
}
