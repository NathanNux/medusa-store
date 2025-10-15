"use client";
import { useState, useEffect } from "react";
import Benefits from "./Benefits";
import Inspiration from "./Inspiration";
import Shaping from "./Shaping";

interface DescProps {
    settings?: {
        inspiration?: boolean;
        shaping?: boolean;
        benefits?: boolean;
    };
}

export default function Desc({ settings }: DescProps){
    const inspirationEnabled = settings?.inspiration !== false;
    const shapingEnabled = settings?.shaping !== false;
    const benefitsEnabled = settings?.benefits !== false;

    return (
        <section className="desc">
            {inspirationEnabled && <Inspiration />}
            {shapingEnabled && <Shaping />}
            {benefitsEnabled && <Benefits />}
        </section>
    );
}