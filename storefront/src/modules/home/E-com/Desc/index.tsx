import Benefits from "./Benefits";
import Inspiration from "./Inspiration";
import Shaping from "./Shaping";

export default function Desc(){
    return (
        <section className="desc">
            <Inspiration />
            <Shaping />
            <Benefits />
        </section>
    );
}