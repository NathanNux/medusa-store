'use client';

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { updateRegion } from "@lib/data/cart";
import { StateType } from "@lib/hooks/use-toggle-state"
import { HttpTypes } from "@medusajs/types"
import Magnetic from "@modules/common/components/Buttons/Magnetic";
import { useParams, usePathname } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react"
import ReactCountryFlag from "react-country-flag";

type CountryOption = {
  country: string
  region: string
  label: string
}

type CountrySelectProps = {
  toggleState: StateType
  regions: HttpTypes.StoreRegion[] | undefined
}

const CountrySelect = ({ toggleState, regions }: CountrySelectProps) => {
    const [ current, setCurrent ] = useState<
        | { country: string | undefined; region: string; label: string | undefined }
        | undefined
    >(undefined)

    const { countryCode } = useParams<{ countryCode: string }>() 
    const currentPath = usePathname().split(`/${countryCode}`)[1]
 
    const { state, close } = toggleState

    const options = useMemo(() => {
        return regions?.map((r) => {
            return r.countries?.map((c) => ({
                country: c.iso_2,
                region: r.id,
                label: c.display_name,
            }))
        })
        .flat()
        .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? ""))
    }, [regions])


    useEffect(() => {
        if (countryCode) {
            const option = options?.find((o) => o?.country === countryCode)
            setCurrent(option)
        }
    }, [options, countryCode])

    const handleChange = (option: CountryOption) => {
        updateRegion(option.country, currentPath)
        close()
    }

    return (
        <div>
            <Listbox
            as="span"
            onChange={handleChange}
            defaultValue={
                countryCode
                ? options?.find((o) => o?.country === countryCode)
                : undefined
            }
            >
            <ListboxButton className="py-1 w-full">
                <Magnetic>
                    <div className="txt-compact-small flex items-start justify-center gap-x-2  cursor-pointer border border-ui-border-base rounded-rounded px-2 py-1 text-ui-fg-base hover:bg-ui-bg-hover shadow-2xl transition-all duration-200">
                        {current && (
                            <span className="txt-compact-small flex items-center justify-center gap-x-2">
                            {/* @ts-ignore */}
                            <ReactCountryFlag
                                svg
                                style={{
                                width: "20px",
                                height: "20px",
                                }}
                                countryCode={current.country ?? ""}
                            />
                            </span>
                        )}
                    </div>
                </Magnetic>
            </ListboxButton>
            <div className="flex relative w-full min-w-[50px]">
                <Transition
                    show={state}
                    as={Fragment}
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                <ListboxOptions
                    className="absolute -top-[calc(100%-5px)] left-0 xsmall:left-auto xsmall:right-0 max-h-[442px] overflow-y-scroll z-[900] bg-white drop-shadow-md text-small-regular uppercase text-black no-scrollbar rounded-rounded w-full"
                    static
                >
                    {options?.map((o, index) => {
                    return (
                        <ListboxOption
                        key={index}
                        value={o}
                        className="py-2 hover:bg-gray-200 px-3 cursor-pointer flex items-center justify-center gap-x-2"
                        >
                        {/* @ts-ignore */}
                        <ReactCountryFlag
                            svg
                            style={{
                            width: "20px",
                            height: "20px",
                            }}
                            countryCode={o?.country ?? ""}
                        />{" "}
                        </ListboxOption>
                    )
                    })}
                </ListboxOptions>
                </Transition>
            </div>
            </Listbox>
        </div>
    )
}

export default CountrySelect;