import { Variants } from "framer-motion";

export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};
