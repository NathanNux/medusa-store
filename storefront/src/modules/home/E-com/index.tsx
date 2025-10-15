"use client";
import { useState, useEffect } from "react";
import CTA from "./CTA";
import Desc from "./Desc";
import Entry from "./Entry";
import Intro from "./Intro";
import { client } from "../../../sanity/lib/client";

export default function ECom() {
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            const mainSettings = await client.fetch('*[_type == "mainPageSettings"][0]');
            setSettings(mainSettings);
        };
        fetchSettings();
    }, []);

    const ecomEnabled = settings?.ecomSection?.enabled !== false;
    const introEnabled = settings?.ecomSection?.intro !== false;
    const entryEnabled = settings?.ecomSection?.entry !== false;
    const descEnabled = settings?.ecomSection?.desc?.enabled !== false;
    const ctaEnabled = settings?.ecomSection?.cta !== false;

    if (!ecomEnabled) {
        return null;
    }

    return (
        <section style={{ overflow: "hidden" }}>
            {introEnabled && <Intro />}
            {entryEnabled && <Entry />}
            {descEnabled && <Desc settings={settings?.ecomSection?.desc} />}
            {ctaEnabled && <CTA />}
        </section>
    )
}