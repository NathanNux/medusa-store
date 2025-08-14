'use client';


import { ArrowRightMini } from "@medusajs/icons"
import useToggleState from "@lib/hooks/use-toggle-state";
import { HttpTypes } from "@medusajs/types";
import { clx } from "@medusajs/ui";
import CountrySelect from "./country-select";


export default function RegionsSelect ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) {
    const toggleState = useToggleState();
    // WIP: after launch, rebuild the component with framer motion animations rather than tailwind transitions

    if (!regions || regions.length === 0) {
        return null;
    }

    return ( 
        <div className="regions__select">
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
                <ArrowRightMini
                    className={clx(
                    "transition-transform duration-150",
                    toggleState.state ? "-rotate-90" : ""
                    )}
                />
            </div>
        </div>
    )
}