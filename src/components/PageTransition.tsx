'use client';

import { motion } from 'framer-motion';
import { useNavigation } from '@/utils/navigation-context';
import { ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function PageTransition({ children, className = '', delay = 0 }: PageTransitionProps) {
    const { direction } = useNavigation();

    const variants = {
        initial: {
            opacity: 0,
            x: direction === 'forward' ? 100 : -100
        },
        animate: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut",
                delay
            }
        },
        exit: {
            opacity: 0,
            x: direction === 'forward' ? -100 : 100,
            transition: {
                duration: 0.4,
                ease: "easeIn"
            }
        }
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
} 