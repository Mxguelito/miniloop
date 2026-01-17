export default function KioscoIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      {/* Carrito */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.5l1.2 10.2a2 2 0 0 0 2 1.8h9.6a2 2 0 0 0 2-1.7l1.05-6.3H6.3"
      />
      {/* Ruedas */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm10.5 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
      />
      {/* Manija */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6h15"
      />
    </svg>
  );
}
