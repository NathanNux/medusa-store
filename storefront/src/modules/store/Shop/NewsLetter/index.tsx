import { useEffect, useState } from "react";

export default function NewsLetter() {
    const [ email, setEmail ] = useState<string>("");
    const [ isSubscribed, setIsSubscribed ] = useState<boolean>(false);
    const [ error, setError ] = useState<string | null>(null);
    const [ isMounted, setIsMounted ] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMounted(true);
        }, 3500); // Delay to simulate loading state
        return () => clearTimeout(timer);
    }, [error, isSubscribed]);


    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (email && email.includes("@")) {
                setIsSubscribed(true);
                setError("");
                setEmail(""); // Clear the input after success
            } else {
                setIsSubscribed(false);
                setError("Zadejte platnou e-mailovou adresu.");
            }
        } catch (error) {
            setIsSubscribed(false);
            setError("Nastala chyba. Zkuste to prosím znovu.");
            console.log(error);
        }
    };
    return (
        <div className="newsletter">
            <div className="newsletter__sticky">
                <div className="newsletter__title">
                    <h3>
                        Odebírejte mé novinky, abyste věděli, kdy budu mít nové produkty
                    </h3>
                </div>

                <div className="newsletter__input__container">
                    <form className="newsletter__input" onSubmit={handleSubscribe}>
                        <input 
                            type="email" 
                            placeholder="Zadejte svůj E-mail" 
                            className="newsletter__input__field"
                            aria-label="Zadejte svůj E-mail"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                        />
                        <button className="newsletter__input__button" type="submit">
                            <p>
                                Přihlásit se
                            </p>
                        </button>
                    </form> 
                    <div className="newsletter__input__message">
                        {popUpMessage({ error, isSubscribed, isMounted })}
                    </div> 
                </div>
            </div>            
        </div>
    );
}

function popUpMessage({ error, isSubscribed, isMounted }: { error: string | null; isSubscribed: boolean, isMounted: boolean }) {
    if (error) {
        return <p className={`error__message${isMounted ? " show" : ""}`}>{error}</p>;
    }
    if (isSubscribed) {
        return <p className={`success__message${isMounted ? " show" : ""}`}>Děkujeme za přihlášení k odběru novinek!</p>;
    }
    return null;
}