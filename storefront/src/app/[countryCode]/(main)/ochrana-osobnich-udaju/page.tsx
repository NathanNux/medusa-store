"use client"

import React from "react"
import "./styles.scss"

type Section = {
  id: string
  title: string
  paragraphs?: string[]
  bullets?: string[]
}

const sections: Section[] = [
  {
    id: "uvod",
    title: "Zásady ochrany osobních údajů",
    paragraphs: [
      "Jsme společnost, která bere ochranu dat a soukromí velmi vážně. Jsme odhodláni chránit vaše osobní údaje a být transparentní ohledně toho, jaké informace o vás máme.",
    ],
  },
  {
    id: "jak-shromazdujeme",
    title: "Jaké údaje shromažďujeme?",
    paragraphs: [
      "Shromažďujeme osobní údaje od vás, když nám je přímo poskytujete, a také prostřednictvím vašeho využívání našich služeb.",
      "Tyto informace mohou zahrnovat:",
    ],
    bullets: [
      "Informace, které nám poskytnete, když používáte naše služby nebo se registrujete k účtu.",
      "Informace, které poskytnete při účasti na jakýchkoli interaktivních funkcích služeb.",
      "Korespondenci nebo jiné informace, které nám zasíláte.",
      "Informace shromážděné při používání našich služeb.",
    ],
  },
  {
    id: "jak-pouzivame",
    title: "Jak používáme vaše údaje?",
    paragraphs: [
      "Vaše údaje používáme k poskytování, podpoře, personalizaci a rozvoji našich služeb.",
      "Jak používáme vaše osobní údaje, závisí na tom, jakým způsobem interagujete s našimi službami a na volbách, které děláte.",
      "Používáme údaje, které máme o vás, k poskytování a personalizaci našich služeb, aby byly relevantnější a užitečnější pro vás i ostatní.",
    ],
  },
  {
    id: "sdileni",
    title: "Sdílíme vaše údaje?",
    paragraphs: [
      "Vaše údaje budeme sdílet s třetími stranami pouze způsoby uvedenými v těchto zásadách ochrany osobních údajů.",
      "Můžeme zpřístupnit třetím stranám údaje, které byly anonymizovány tak, aby nemohly být použity k vaší identifikaci.",
      "Můžeme sdílet vaše údaje s:",
    ],
    bullets: [
      "Společnostmi v rámci naší skupiny",
      "Našimi poskytovateli služeb třetích stran",
      "Našimi obchodními partnery",
    ],
  },
  {
    id: "pravni-zaklad",
    title: "Právní základ zpracování",
    paragraphs: [
      "Vaše osobní údaje zpracováváme na základě:",
    ],
    bullets: [
      "Váš souhlas",
      "Plnění smlouvy",
      "Naše oprávněné zájmy",
      "Plnění právních povinností",
    ],
  },
  {
    id: "doba-uchovavani",
    title: "Doba uchovávání údajů",
    paragraphs: [
      "Vaše osobní údaje uchováváme pouze po dobu nezbytně nutnou k naplnění účelů uvedených v těchto zásadách, obvykle po dobu trvání vašeho účtu plus 24 měsíců, nebo dokud neodvoláte svůj souhlas.",
    ],
  },
  {
    id: "prava",
    title: "Vaše práva",
    paragraphs: ["Podle GDPR máte právo na:"],
    bullets: [
      "Přístup k vašim údajům",
      "Opravu údajů",
      "Výmaz údajů",
      "Přenositelnost údajů",
      "Vznesení námitky",
      "Odvolání souhlasu",
      "Pro uplatnění těchto práv nás kontaktujte na gdpr@prochazkagroup.cz.",
    ],
  },
  {
    id: "mezinarodni-prenosy",
    title: "Mezinárodní přenosy",
    paragraphs: [
      "Pokud přenášíme vaše údaje mimo EU/EHP, zajišťujeme odpovídající úroveň ochrany pomocí standardních smluvních doložek schválených Evropskou komisí nebo jiných vhodných záruk.",
    ],
  },
  {
    id: "kontakt-dpo",
    title: "Kontakt na DPO",
    paragraphs: [
      "Máte-li jakékoliv dotazy týkající se zpracování vašich osobních údajů, můžete kontaktovat našeho pověřence pro ochranu osobních údajů (DPO) na email: dpo@prochazkagroup.cz",
    ],
  },
]

export default function Page() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      history.replaceState(null, "", `#${id}`)
    }
  }

  return (
    <main className="terms" aria-labelledby="page-title">
      <div className="container">
        <header className="header">
          <h1 id="page-title">Zásady ochrany osobních údajů</h1>
        </header>

        <div className="layout">
          <aside className="sidebar" role="navigation" aria-label="Navigace sekcí">
            <ul>
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} onClick={(e) => handleNavClick(e, s.id)}>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <div className="content">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="section" aria-labelledby={`${s.id}-title`}>
                <h2 id={`${s.id}-title`}>{s.title}</h2>
                {s.paragraphs?.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
                {s.bullets && s.bullets.length > 0 && (
                  <ul className="bullets">
                    {s.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
