import { motion } from "framer-motion";

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
}) {
  const styles = {
    primary:
      "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(0,100,255,0.35)]",
    secondary:
      "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-white/10",
    danger:
      "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(255,0,0,0.35)]",
    success:
      "bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(0,255,0,0.35)]",
    purple:
      "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(150,0,255,0.35)]",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.03 }}
      className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${styles[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
