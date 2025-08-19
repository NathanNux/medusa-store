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
    title: "Oznámení o odstoupení od kupní smlouvy (spotřebitel)",
    paragraphs: [],
  },
  {
    id: "kupujici",
    title: "Kupující",
    paragraphs: [
      "Jméno a příjmení …………………………………",
      "Adresa …………………………………",
      "…………………………………",
      "Telefon a e­mail …………………………………",
    ],
  },
  {
    id: "prodavajici",
    title: "Prodávající",
    paragraphs: [
      `Keramická Zahrada, se sídlem ${process.env.SIDLO_ADRESA}`,
      `identifikační číslo: ${process.env.IDENTIFIKACNI_CISLO}`,
    ],
  },
  {
    id: "text",
    title: "Text oznámení",
    paragraphs: [
      "Vážení,",
      "dne …………………….… jsem prostřednictvím vašeho e­shopu www.eshop.cheesemafia.cz s vámi uzavřel(a) kupní smlouvu: číslo daňového dokladu (faktury) ………………………, na základě které jsem převzal dne ……………… zboží:",
      "Vzhledem k tomu, že smlouva byla uzavřena pomocí internetu, tj. typického prostředku komunikace na dálku, rozhodl(a) jsem se využít svého práva podle ustanovení § 1829 odst. 1 ve spojení s § 1818 zákona č. 89/2012 Sb., občanského zákoníku, a tímto oznamuji, že od výše uvedené kupní smlouvy odstupuji.",
    ],
  },
  {
    id: "rozsah",
    title: "Rozsah odstoupení",
    paragraphs: [
      "(zvolte jednu z možností, nehodící se škrtněte):",
    ],
    bullets: [
      "a) Od smlouvy odstupuji v plném rozsahu a vracím vše, co je uvedeno na faktuře.",
      "b) Od smlouvy odstupuji v částečném rozsahu, tj. pouze co do níže uvedeného zboží:",
      "",
    ],
  },
  {
    id: "prohlaseni",
    title: "Prohlášení",
    paragraphs: [
      "Prohlašuji, že výše uvedené zboží není zbožím uvedeným v ust. § 1837 zákona č. 89/2012 Sb., občanského zákoníku, tedy jsem oprávněn co do uvedeného zboží od kupní smlouvy odstoupit a nenastala skutečnost, která by mé právo odstoupení od smlouvy vyloučila nebo omezila.",
      "Zboží vám zasílám zpět a zároveň vás žádám o poukázání kupní ceny včetně účtovaného dopravného (uvedeno na daňovém dokladu) ve výši ………………,- Kč, ve prospěch mého bankovního účtu č. ……………………………………………… nejpozději do 14 kalendářních dnů od doručení tohoto odstoupení od smlouvy.",
    ],
  },
  {
    id: "datum-a-podpis",
    title: "Datum a podpis",
    paragraphs: [
      "V ……………………, dne …………",
      "",
      "Datum ......................     Podpis kupujícího..............................................",
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
          <h1 id="page-title">Odstoupení od smlouvy</h1>
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
