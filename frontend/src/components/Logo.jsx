function Logo({ size = 9 }) {
  return (
    <div className={`w-${size} h-${size} bg-violet-600 rounded-xl flex items-center justify-center flex-shrink-0`}>
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        {/* Cloud */}
        <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        {/* Lightning bolt */}
        <path d="M13 10l-2 3h3l-2 3" />
      </svg>
    </div>
  )
}

export default Logo