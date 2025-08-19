"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import React from "react";
import styles from "./style.module.scss";

const Scrollbar: React.FC = () => {
	// Track viewport scroll progress (0 -> 1) without needing a ref
	const { scrollYProgress } = useScroll();
	// Smooth it a bit so it feels nicer
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 120,
		damping: 20,
		mass: 0.2,
	});

	return (
		<motion.div aria-hidden className={styles.scrollbarProgress} style={{ scaleX }} />
	);
};

export default Scrollbar;

