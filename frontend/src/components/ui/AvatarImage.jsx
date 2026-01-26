import { useState } from "react";

export default function AvatarImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="w-20 h-20 rounded-full
                 flex items-center justify-center
                 border-2 border-blue-400/40
                 shadow-[0_0_20px_rgba(59,130,246,0.4)]
                 bg-white/5"
    >
      {!loaded && (
        <div className="w-8 h-8 rounded-full
                        border-2 border-blue-400/40
                        animate-pulse" />
      )}

      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-20 h-20 rounded-full object-cover
                    transition-opacity duration-300
                    ${loaded ? "opacity-100" : "opacity-0 absolute"}`}
      />
    </div>
  );
}
