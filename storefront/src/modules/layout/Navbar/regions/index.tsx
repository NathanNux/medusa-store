'use client';


import { ArrowRightMini } from "@medusajs/icons"
import useToggleState from "@lib/hooks/use-toggle-state";
import { HttpTypes } from "@medusajs/types";
import { clx } from "@medusajs/ui";
import CountrySelect from "./country-select";
import { motion } from "framer-motion";
import { useState } from "react";


export default function RegionsSelect ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) {
    const toggleState = useToggleState();
    const [ isHovered, setIsHovered ] = useState(false);
    // WIP: after launch, rebuild the component with framer motion animations rather than tailwind transitions

    if (!regions || regions.length === 0) {
        return null;
    }

    return ( 
        <div 
            className="regions__select"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className="regions__select__button flex justify-between items-center"
                onMouseEnter={toggleState.open}
                onMouseLeave={toggleState.close}
            >
                {regions && (
                    <CountrySelect
                        toggleState={toggleState}
                        regions={regions}
                    />
                )}
                <motion.div
                    animate={{
                        rotate: isHovered ? 90 : 180,
                        transition: { 
                            duration: 0.5,
                            ease: [ 0.76, 0, 0.24, 1 ]
                        }
                    }}
                >
                    <ArrowRightMini />
                </motion.div>
            </div>
        </div>
    )
}