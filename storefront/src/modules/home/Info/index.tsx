"use client";
import { useState, useEffect } from "react";
import Kontakt from "./Kontakt";
import Mapa from "./Mapa";
import { client } from "../../../sanity/lib/client";

export default function Info() {
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            const mainSettings = await client.fetch('*[_type == "mainPageSettings"][0]');
            setSettings(mainSettings);
        };
        fetchSettings();
    }, []);

    const infoEnabled = settings?.infoSection?.enabled !== false;
    const mapaEnabled = settings?.infoSection?.mapa !== false;
    const kontaktEnabled = settings?.infoSection?.kontakt !== false;

    if (!infoEnabled) {
        return null;
    }

    return (
        <section>
            {mapaEnabled && <Mapa />}
            {kontaktEnabled && <Kontakt />}
        </section>
    )
}