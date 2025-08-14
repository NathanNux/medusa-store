import CTA from "./CTA";
import Desc from "./Desc";
import Entry from "./Entry";
import Intro from "./Intro";

export default function ECom() {
    return (
        <section style={{ overflow: "hidden" }}>
            <Intro />
            <Entry />
            <Desc />
            <CTA />
        </section>
    )
}