import { motion } from "framer-motion";

export default function Card({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className={`p-6 rounded-2xl bg-[#0f1115] border border-white/10 shadow-lg ${className}`}
    >
      {children}
    </motion.div>
  );
}
