import { motion } from 'framer-motion';

type HashtagButtonProps = {
    text: string;
    isActive: boolean;
    onClick: () => void
    disabled?: boolean; 
    "data-testid"?: string; // Optional prop for testing purposes
}

// Universal button for hashtag selection with form state management

export default function HashtagButton({
    text, 
    isActive, 
    onClick,
    disabled = false,
    "data-testid": dataTestId
}: HashtagButtonProps) {
    
    const handleClick = () => {
        onClick();
    };

    return (
        <div className="HashtagButton">
            <button className="button" disabled={disabled} datatype={dataTestId}>
                <motion.div 
                    className="slider"
                    animate={{top: isActive ? "-100%" : "0%"}}
                    transition={{ duration: 0.5, type: "tween", ease: [0.76, 0, 0.24, 1]}}
                >
                    <div 
                        className="el"
                        onClick={handleClick}
                        style={{ backgroundColor: "var(--OButton)" }}
                    >
                        <PerspectiveText label={`#${text}`} textColor={"var(--Wtext)"} />
                    </div>
                    <div 
                        className="el"
                        onClick={handleClick}
                        style={{ backgroundColor: "var(--CharcoalBg)" }}
                    >
                        <PerspectiveText label={`#${text}`} textColor="var(--Wtext)" />
                    </div>
                </motion.div>
            </button>
        </div>
    )
}

function PerspectiveText({label, textColor}: {label: string, textColor?: string}) {
    return (    
        <div className="perspectiveText">
            <p style={{ color: textColor }}>{label}</p>
            <p style={{ color: textColor }}>{label}</p>
        </div>
    )
}