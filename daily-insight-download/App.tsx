import { AnimatePresence, motion } from "framer-motion";
import Dashboard from "./Dashboard";

function App() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="daily-insight-dashboard"
        initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <Dashboard />
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
