import { motion } from 'framer-motion';
import { useState } from 'react';

const AnimatedCard = ({
    children,
    className = '',
    delay = 0,
    glassmorphism = true,
    hover = true,
    ...props
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                delay: delay,
                ease: 'easeOut'
            }
        }
    };

    const hoverVariants = {
        hover: {
            y: -8,
            scale: 1.02,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            transition: {
                duration: 0.3,
                ease: 'easeOut'
            }
        }
    };

    const glassmorphismClass = glassmorphism
        ? 'backdrop-blur-md bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/20'
        : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600';

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={hover ? hoverVariants.hover : undefined}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={`
                rounded-xl shadow-lg overflow-hidden
                ${glassmorphismClass}
                ${hover ? 'cursor-pointer' : ''}
                ${className}
            `}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedCard;