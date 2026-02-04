import { useMemo, useState } from 'react'
import './App.css'

const tabs = [
  { id: 'home', label: 'Hem', icon: 'home' },
  { id: 'categories', label: 'Kategorier', icon: 'grid' },
  { id: 'guide', label: 'Guider', icon: 'sparkles' },
  { id: 'cart', label: 'Varukorg', icon: 'cart' },
  { id: 'tools', label: 'Verktyg', icon: 'tools' },
]

const quickActions = [
  {
    title: 'Snabborder',
    subtitle: 'Vanliga artiklar',
  },
  {
    title: 'Produktfrågor',
    subtitle: 'Spec & kompatibilitet',
  },
]

const products = [
  {
    name: 'Automower 430X NERA',
    subtitle: 'Robotgräsklippare, upp till 3200 m²',
    price: '39 900 kr',
    oldPrice: '44 900 kr',
  },
  {
    name: 'R 214TC 103',
    subtitle: 'Åkgräsklippare med 103 cm combi-aggregat',
    price: '47 120 kr',
    oldPrice: '58 900 kr',
  },
  {
    name: 'Trimmer 525iLXT',
    subtitle: 'Batteritrimmer, låg vikt och hög effekt',
    price: '5 990 kr',
    oldPrice: '6 490 kr',
  },
  {
    name: 'Häcksax 522iHD60',
    subtitle: '60 cm svärd, låg vibration',
    price: '6 490 kr',
    oldPrice: '7 290 kr',
  },
  {
    name: 'Lövblås 525iB',
    subtitle: 'Batteridriven lövblås för proffs',
    price: '4 990 kr',
    oldPrice: '5 690 kr',
  },
]

const categoryTiles = [
  { title: 'Robotgräsklippare', note: 'Nya NERA-serien', accent: 'primary' },
  { title: 'Åkgräsklippare', note: 'Combi, 200-serien', accent: 'amber' },
  { title: 'Batteriserie', note: 'Professionellt sortiment', accent: 'mint' },
  { title: 'Skog & park', note: 'Motorsågar och röjsågar', accent: 'forest' },
]

const productCategories = [
  { title: 'Gräsklippning', count: '86 produkter' },
  { title: 'Sågning och kapning', count: '57 produkter' },
  { title: 'Trimning och röjning', count: '64 produkter' },
  { title: 'Jord- och markskötsel', count: '34 produkter' },
  { title: 'Trädgårdsskötsel', count: '49 produkter' },
  { title: 'Bevattning', count: '18 produkter' },
]

const accessoryCategories = [
  { title: 'Tillbehör gräsklippning', count: '142 artiklar' },
  { title: 'Batterier & laddare', count: '38 artiklar' },
  { title: 'Aggregat & redskap', count: '27 artiklar' },
  { title: 'Skydd & säkerhet', count: '41 artiklar' },
]

const spareCategories = [
  { title: 'Knivar & blad', count: '62 reservdelar' },
  { title: 'Filter & servicekit', count: '45 reservdelar' },
  { title: 'Hjul & drivning', count: '31 reservdelar' },
  { title: 'Kablage & elektronik', count: '29 reservdelar' },
]

const guideCards = [
  {
    title: 'Säljargument för Automower',
    subtitle: 'Så matchar du behov mot modell',
  },
  {
    title: 'Batterifördelar för proffskund',
    subtitle: 'ROI, driftstopp och arbetsmiljö',
  },
]

const guideTips = [
  { title: 'Invändningar och hur du svarar', time: '5 min läsning' },
  { title: 'Frågor som kvalar affären snabbt', time: '6 min läsning' },
  { title: 'Paketera service och tillbehör', time: '7 min läsning' },
]

const accountItems = [
  { title: 'Kundtjänst', subtitle: 'Kontakta din säljare' },
  { title: 'Leverans till din region', subtitle: 'Se leveranstider' },
  { title: 'Språk', subtitle: 'Svenska' },
  { title: 'Notifikationer', subtitle: 'Kampanjer och statusuppdateringar' },
  { title: 'Beställningar', subtitle: 'Tidigare inköp' },
  { title: 'Favoriter', subtitle: 'Spara produkter och paket' },
  { title: 'Fakturering', subtitle: 'Betalningssätt' },
]

const toolItems = [
  { title: 'Produktregistrering', subtitle: 'Registrera serienummer' },
  { title: 'Skapa kampanjer', subtitle: 'Kampanjmallar och utskick' },
  { title: 'Prislistor', subtitle: 'Uppdatera pris & rabatt' },
  { title: 'Lagerstatus', subtitle: 'Tillgänglighet per artikel' },
  { title: 'Serviceärenden', subtitle: 'Skapa och följ upp' },
]

const searchShortcuts = [
  { title: 'Robotgräsklippare', subtitle: 'Ytor 500–5000 m²' },
  { title: 'Batteriserie', subtitle: '36V pro-sortiment' },
  { title: 'Service & delar', subtitle: 'Filter, knivar, kit' },
]

const searchSuggestions = [
  'Automower NERA med GPS',
  'Låg ljudnivå för skolor',
  'Rider med frontaggregat',
  'Tysta batteritrimmers',
]

const searchResults = [
  {
    name: 'Automower 430X NERA',
    note: '3200 m², EPOS-ready',
    price: '39 900 kr',
  },
  {
    name: 'Automower 450X NERA',
    note: '5000 m², hög lutning',
    price: '49 900 kr',
  },
  {
    name: 'R 214TC 103',
    note: 'Combi-aggregat 103 cm',
    price: '47 120 kr',
  },
]

function Icon({ name }) {
  const paths = useMemo(
    () => ({
      home: 'M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5Z',
      grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
      sparkles:
        'M12 3l1.4 3.6L17 8l-3.6 1.4L12 13l-1.4-3.6L7 8l3.6-1.4L12 3Zm7 9l.9 2.2L22 15l-2.1.8L19 18l-.8-2.2L16 15l2.2-.8L19 12Zm-14 2l.8 2.1L8 17l-2.2.9L5 20l-.9-2.1L2 17l2.1-.9L5 14Z',
      cart: 'M4 5h2l2.4 9.5a1 1 0 0 0 1 .8h7.8a1 1 0 0 0 1-.8L20 8H7.2',
      user: 'M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm7 9a7 7 0 0 0-14 0',
      plus: 'M12 5v14M5 12h14',
      search: 'M11 4a7 7 0 1 0 4.4 12.5L20 21',
      chevron: 'M9 6l6 6-6 6',
      close: 'M6 6l12 12M18 6l-12 12',
      menu: 'M4 7h16M4 12h16M4 17h10',
      back: 'M15 6l-6 6 6 6',
      heart: 'M12 21s-7-4.4-9-8.5C1.7 9.3 3.4 6 6.7 6c1.9 0 3.1 1 3.9 2 0.8-1 2-2 3.9-2 3.3 0 5 3.3 3.7 6.5C19 16.6 12 21 12 21Z',
      share: 'M16 6a2 2 0 1 0-2-2M8 12a2 2 0 1 0-2-2m10 8a2 2 0 1 0-2-2M8 10l6-4M8 14l6 4',
      tools:
        'M14 3l1 3 3 1-2 2 .6 3-2.6-1.3L11.4 12 12 9 10 7l3-1 1-3Zm-7 9 1.2 1.2-3.6 3.6-1.2-1.2 3.6-3.6Zm8.8.8 1.2-1.2 3.6 3.6-1.2 1.2-3.6-3.6Z',
      barcode:
        'M4 7V5h3v2H4Zm0 12v-2h3v2H4Zm13 0v-2h3v2h-3Zm0-12V5h3v2h-3ZM8 5h2v14H8V5Zm6 0h2v14h-2V5Z',
    }),
    [],
  )

  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function Header({ title, subtitle, onAccount }) {
  return (
    <header className="header">
      <div>
        {subtitle ? <p className="eyebrow">{subtitle}</p> : null}
        <h1>{title}</h1>
      </div>
      <button
        className="avatar"
        type="button"
        aria-label="Profil"
        onClick={onAccount}
      >
        <Icon name="user" />
      </button>
    </header>
  )
}

function ActionRow({ onShare }) {
  return (
    <div className="action-row">
      <button className="action-button" type="button" aria-label="Favorit">
        <Icon name="heart" />
      </button>
      <button
        className="action-button"
        type="button"
        aria-label="Dela"
        onClick={onShare}
      >
        <Icon name="share" />
      </button>
      <button className="action-button success" type="button" aria-label="Lägg i varukorg">
        <Icon name="cart" />
      </button>
    </div>
  )
}

function HomeScreen({ onAccount, onOpenProduct, onShare }) {
  return (
    <section className="screen">
      <Header title="Hem" onAccount={onAccount} />
      <button className="primary-cta" type="button">
        Kommande leveranser
      </button>

      <div className="section-header">
        <h2>Snabbåtkomst</h2>
        <button className="text-button" type="button">
          Visa fler <Icon name="chevron" />
        </button>
      </div>
      <div className="promo-row">
        {quickActions.map((card) => (
          <article key={card.title} className="quick-card">
            <p className="promo-title">{card.title}</p>
            <p className="promo-subtitle">{card.subtitle}</p>
          </article>
        ))}
      </div>

      <div className="section-header">
        <h2>Populära produkter</h2>
        <button className="text-button" type="button">
          Se sortiment <Icon name="chevron" />
        </button>
      </div>
      <div className="product-list">
        {products.map((product) => (
          <article key={product.name} className="product-card">
            <div className="product-image">
              <span>{product.name.slice(0, 1)}</span>
            </div>
            <div className="product-info">
              <div className="product-title">
                <h3>{product.name}</h3>
              </div>
              <p>{product.subtitle}</p>
              <div className="price-row">
                <strong>{product.price}</strong>
                <span className="old-price">{product.oldPrice}</span>
              </div>
              <div className="product-actions">
                <button
                  className="text-button"
                  type="button"
                  onClick={() =>
                    product.name === 'Automower 430X NERA'
                      ? onOpenProduct('automower-430x-nera')
                      : product.name === 'R 214TC 103'
                        ? onOpenProduct('r-214tc-103')
                      : null
                  }
                >
                  Öppna <Icon name="chevron" />
                </button>
              </div>
              <ActionRow onShare={() => onShare(product.name)} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function CategoriesScreen({ onAccount }) {
  const [mode, setMode] = useState('products')
  const categories =
    mode === 'products'
      ? productCategories
      : mode === 'accessories'
        ? accessoryCategories
        : spareCategories

  return (
    <section className="screen">
      <Header title="Kategorier" subtitle="Sortiment" onAccount={onAccount} />
      <div className="segment-row">
        <button
          className={`segment ${mode === 'products' ? 'active' : ''}`}
          type="button"
          onClick={() => setMode('products')}
        >
          Produkter
        </button>
        <button
          className={`segment ${mode === 'accessories' ? 'active' : ''}`}
          type="button"
          onClick={() => setMode('accessories')}
        >
          Tillbehör
        </button>
        <button
          className={`segment ${mode === 'spares' ? 'active' : ''}`}
          type="button"
          onClick={() => setMode('spares')}
        >
          Reservdelar
        </button>
      </div>
      <h2 className="section-title">Aktuellt</h2>
      <div className="tile-grid">
        {categoryTiles.map((tile) => (
          <article key={tile.title} className={`tile ${tile.accent}`}>
            <p>{tile.title}</p>
            <span>{tile.note}</span>
          </article>
        ))}
      </div>

      <h2 className="section-title">Kategorier</h2>
      <div className="category-list">
        {categories.map((category) => (
          <button key={category.title} className="category-row" type="button">
            <div>
              <p>{category.title}</p>
              <span>{category.count}</span>
            </div>
            <Icon name="chevron" />
          </button>
        ))}
      </div>
    </section>
  )
}

function GuideScreen({ onAccount }) {
  return (
    <section className="screen">
      <Header title="Guider" subtitle="Inspiration" onAccount={onAccount} />
      <div className="tab-row">
        <button className="tab-pill active" type="button">
          Säsong
        </button>
        <button className="tab-pill" type="button">
          Installation
        </button>
        <button className="tab-pill" type="button">
          Drift
        </button>
      </div>

      <div className="guide-grid">
        {guideCards.map((card) => (
          <article key={card.title} className="guide-card">
            <div className="guide-image" />
            <div>
              <h3>{card.title}</h3>
              <p>{card.subtitle}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="section-header">
        <h2>Säsongstips</h2>
        <button className="text-button" type="button">
          Se alla <Icon name="chevron" />
        </button>
      </div>
      <div className="tip-list">
        {guideTips.map((tip) => (
          <article key={tip.title} className="tip-row">
            <div>
              <h4>{tip.title}</h4>
              <span>{tip.time}</span>
            </div>
            <button className="round-button" type="button">
              <Icon name="plus" />
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

function CartScreen({ onAccount }) {
  return (
    <section className="screen center">
      <Header title="Varukorg" subtitle="Din beställning" onAccount={onAccount} />
      <div className="empty-state">
        <div className="empty-icon" />
        <h3>Varukorgen är tom</h3>
        <p>Lägg till produkter och paket för att skapa en offert.</p>
        <button className="secondary-cta" type="button">
          Utforska sortimentet
        </button>
      </div>
    </section>
  )
}

function AccountScreen({ onAccount }) {
  return (
    <section className="screen">
      <Header title="Konto" subtitle="Emil, demo" onAccount={onAccount} />
      <div className="account-list">
        {accountItems.map((item) => (
          <button key={item.title} className="account-row" type="button">
            <div>
              <p>{item.title}</p>
              <span>{item.subtitle}</span>
            </div>
            <Icon name="chevron" />
          </button>
        ))}
      </div>
    </section>
  )
}

function ToolsScreen({ onAccount }) {
  return (
    <section className="screen">
      <Header title="Verktyg" subtitle="Administration" onAccount={onAccount} />
      <div className="account-list">
        {toolItems.map((item) => (
          <button key={item.title} className="account-row" type="button">
            <div>
              <p>{item.title}</p>
              <span>{item.subtitle}</span>
            </div>
            <Icon name="chevron" />
          </button>
        ))}
      </div>
    </section>
  )
}
function ProductDetail({ onBack, onShare }) {
  return (
    <section className="screen product-detail">
      <div className="detail-header">
        <button className="icon-button" type="button" onClick={onBack}>
          <Icon name="back" />
        </button>
        <div>
          <p className="eyebrow">Robotgräsklippare</p>
          <h1>Automower 430X NERA</h1>
        </div>
      </div>

      <div className="detail-hero">
        <div className="hero-image">430X</div>
        <div>
          <p className="detail-subtitle">
            Robotgräsklippare som undviker föremål för gräsmattor upp till 3200 m².
          </p>
          <div className="detail-price">
            <strong>35 120 kr</strong>
            <span>exkl. moms</span>
            <div className="detail-pill">43 900 kr inkl. moms</div>
          </div>
        </div>
      </div>
      <ActionRow onShare={() => onShare('Automower 430X NERA')} />

      <div className="spec-grid">
        <div>
          <p>Ytkapacitet</p>
          <strong>3 200 m²</strong>
        </div>
        <div>
          <p>Max lutning</p>
          <strong>50 %</strong>
        </div>
        <div>
          <p>Begränsningstyp</p>
          <strong>Begränsningskabel</strong>
        </div>
        <div>
          <p>Artikelnummer</p>
          <strong>970535221</strong>
        </div>
      </div>

      <div className="detail-section">
        <h2>Översikt</h2>
        <p>
          Klarar tuff terräng och stora ytor med möjlighet till slinglös
          installation via EPOS® plug-in. Skapa flera arbetsområden och
          klippfria zoner i Automower® Connect.
        </p>
        <div className="detail-tags">
          <span>EPOS-ready</span>
          <span>GPS-stödd navigering</span>
          <span>Smart hem-integration</span>
        </div>
      </div>

      <div className="detail-section">
        <h2>Sprängskiss</h2>
        <div className="exploded-card">
          <p>Sprängskiss finns som dokument.</p>
          <button className="secondary-cta" type="button">
            Gå till dokument
          </button>
        </div>
      </div>

      <div className="detail-section">
        <h2>Funktioner</h2>
        <ul className="detail-list">
          <li>Tillgänglig utan begränsningskabel med EPOS® plug-in.</li>
          <li>Upptäcker och undviker föremål för mjukare kollisioner.</li>
          <li>Automower® Zone Control med flera arbetsområden.</li>
          <li>Automower® Connect-app med mobil, Wi‑Fi och Bluetooth®.</li>
          <li>GPS-stödd navigering och GeoFence stöldskydd.</li>
        </ul>
      </div>

      <div className="detail-section">
        <h2>Specifikationer</h2>
        <div className="spec-grid two">
          <div>
            <p>Klippbredd</p>
            <strong>24 cm</strong>
          </div>
          <div>
            <p>Klipphöjd</p>
            <strong>20–60 mm</strong>
          </div>
          <div>
            <p>Upplevd ljudnivå</p>
            <strong>56 dB(A)</strong>
          </div>
          <div>
            <p>Genomsnittlig klipptid</p>
            <strong>100 min</strong>
          </div>
          <div>
            <p>Batteri</p>
            <strong>5 Ah Li‑Ion</strong>
          </div>
          <div>
            <p>IP‑klassning</p>
            <strong>IPX5</strong>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h2>Vanligt förekommande delar</h2>
        <div className="detail-cards">
          <article>
            <p>Automower® Endurance knivar</p>
            <span>Art. nr 595084401</span>
            <ActionRow onShare={() => onShare('Endurance knivar 595084401')} />
          </article>
          <article>
            <p>Automower® rengöringskit</p>
            <span>Art. nr 590855101</span>
            <ActionRow onShare={() => onShare('Rengöringskit 590855101')} />
          </article>
          <article>
            <p>Automower® begränsningskabel Ø3.4</p>
            <span>Art. nr 522914101</span>
            <ActionRow onShare={() => onShare('Begränsningskabel 522914101')} />
          </article>
        </div>
      </div>

      <div className="detail-section">
        <h2>Tillbehör</h2>
        <div className="detail-cards">
          <article>
            <p>EPOS™ Plug‑in modul</p>
            <span>Art. nr 535545301</span>
            <ActionRow onShare={() => onShare('EPOS Plug-in 535545301')} />
          </article>
          <article>
            <p>Automower® hus</p>
            <span>Art. nr 536664101</span>
            <ActionRow onShare={() => onShare('Automower hus 536664101')} />
          </article>
          <article>
            <p>EPOS® RS1 referensstation</p>
            <span>Art. nr 970663301</span>
            <ActionRow onShare={() => onShare('EPOS RS1 970663301')} />
          </article>
        </div>
      </div>

      <div className="detail-section">
        <h2>Dokument</h2>
        <div className="document-list">
          <button className="document-row" type="button">
            Bruksanvisning 2025 (SV)
            <Icon name="chevron" />
          </button>
          <button className="document-row" type="button">
            Snabbguide 2025 (SV/DA/FI/NB)
            <Icon name="chevron" />
          </button>
          <button className="document-row" type="button">
            Försäkran om överensstämmelse
            <Icon name="chevron" />
          </button>
        </div>
      </div>
    </section>
  )
}

function ScannerOverlay({ onClose }) {
  return (
    <section className="search-overlay">
      <div className="search-panel scanner-panel">
        <div className="search-header">
          <div>
            <p className="eyebrow">Skanna produkt</p>
            <h2>Barcode/QR</h2>
          </div>
          <button className="close-button" type="button" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>

        <div className="scanner-frame">
          <div className="scanner-line" />
          <p>Rikta kameran mot streckkoden</p>
        </div>

        <label className="search-input">
          <Icon name="barcode" />
          <input type="text" placeholder="Skriv in artikelnummer manuellt" />
        </label>

        <div className="search-section">
          <h3>Senast skannat</h3>
          <div className="result-list">
            <article className="result-row">
              <div>
                <p>Automower 430X NERA</p>
                <span>Art.nr 970535221</span>
              </div>
              <strong>Visa</strong>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

function ShareOverlay({ item, onClose }) {
  return (
    <section className="search-overlay">
      <div className="search-panel share-panel">
        <div className="search-header">
          <div>
            <p className="eyebrow">Dela till kund</p>
            <h2>{item}</h2>
          </div>
          <button className="close-button" type="button" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <div className="share-preview">
          <p>Länk till produktsida inkluderas.</p>
          <span>portal.husqvarnagroup.com/...</span>
        </div>
        <label className="share-message">
          <textarea rows="4" placeholder="Skriv ett meddelande till kunden..." />
        </label>
        <div className="action-row">
          <button className="action-button" type="button" onClick={onClose}>
            Avbryt
          </button>
          <button className="action-button primary" type="button">
            Dela via telefon
          </button>
        </div>
      </div>
    </section>
  )
}

function RiderDetail({ onBack, onShare }) {
  return (
    <section className="screen product-detail">
      <div className="detail-header">
        <button className="icon-button" type="button" onClick={onBack}>
          <Icon name="back" />
        </button>
        <div>
          <p className="eyebrow">Åkgräsklippare</p>
          <h1>R 214TC 103</h1>
        </div>
      </div>

      <div className="detail-hero">
        <div className="hero-image">R 214TC</div>
        <div>
          <p className="detail-subtitle">
            Mångsidig och lättanvänd åkgräsklippare med 103 cm combi-aggregat och
            BioClip®/bakre utkast.
          </p>
          <div className="detail-price">
            <strong>47 120 kr</strong>
            <span>exkl. moms</span>
            <div className="detail-pill">58 900 kr inkl. moms</div>
          </div>
        </div>
      </div>
      <ActionRow onShare={() => onShare('R 214TC 103')} />

      <div className="spec-grid">
        <div>
          <p>Klippbredd</p>
          <strong>103 cm</strong>
        </div>
        <div>
          <p>Nettoeffekt</p>
          <strong>12 kW</strong>
        </div>
        <div>
          <p>Artikelnummer</p>
          <strong>970843001</strong>
        </div>
        <div>
          <p>Motor</p>
          <strong>HV 586AE</strong>
        </div>
      </div>

      <div className="detail-section">
        <h2>Översikt</h2>
        <p>
          Effektiv och lättmanövrerad rider för större gräsmattor. Tvåcylindrig
          motor och combi-aggregat med BioClip®-mulching eller bakre utkast för
          högre gräs.
        </p>
        <div className="detail-tags">
          <span>BioClip®</span>
          <span>Serviceläge</span>
          <span>Frontmonterat aggregat</span>
        </div>
      </div>

      <div className="detail-section">
        <h2>Sprängskiss</h2>
        <div className="exploded-card">
          <p>Sprängskiss finns som dokument.</p>
          <button className="secondary-cta" type="button">
            Gå till dokument
          </button>
        </div>
      </div>

      <div className="detail-section">
        <h2>Funktioner</h2>
        <ul className="detail-list">
          <li>Bekväm förarkomfort och låg tyngdpunkt.</li>
          <li>Mångsidig användning med brett tillbehörssortiment.</li>
          <li>Frontmonterat aggregat för åtkomst i trånga ytor.</li>
          <li>Serviceläge för enkel rengöring och underhåll.</li>
          <li>Pedalstyrd hydrostatisk transmission.</li>
        </ul>
      </div>

      <div className="detail-section">
        <h2>Specifikationer</h2>
        <div className="spec-grid two">
          <div>
            <p>Klipphöjd</p>
            <strong>25–75 mm</strong>
          </div>
          <div>
            <p>Oklippt cirkel</p>
            <strong>30 cm</strong>
          </div>
          <div>
            <p>Hjulbas</p>
            <strong>88,7 cm</strong>
          </div>
          <div>
            <p>Vikt</p>
            <strong>207 kg</strong>
          </div>
          <div>
            <p>Batteri</p>
            <strong>24 Ah</strong>
          </div>
          <div>
            <p>Kraftkälla</p>
            <strong>Bensin</strong>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h2>Vanligt förekommande delar</h2>
        <div className="detail-cards">
          <article>
            <p>Snöblad</p>
            <span>Art. nr 966978701</span>
            <ActionRow onShare={() => onShare('Snöblad 966978701')} />
          </article>
          <article>
            <p>Hjulvikt</p>
            <span>Art. nr 953515902</span>
            <ActionRow onShare={() => onShare('Hjulvikt 953515902')} />
          </article>
          <article>
            <p>Snökedjor</p>
            <span>Art. nr 585666101</span>
            <ActionRow onShare={() => onShare('Snökedjor 585666101')} />
          </article>
        </div>
      </div>

      <div className="detail-section">
        <h2>Tillbehör</h2>
        <div className="detail-cards">
          <article>
            <p>Transportvagn 275</p>
            <span>Art. nr 501008201</span>
            <ActionRow onShare={() => onShare('Transportvagn 275 501008201')} />
          </article>
          <article>
            <p>Sweeper 107 cm</p>
            <span>Art. nr 546081101</span>
            <ActionRow onShare={() => onShare('Sweeper 107 cm 546081101')} />
          </article>
          <article>
            <p>Spridare 75</p>
            <span>Art. nr 546080501</span>
            <ActionRow onShare={() => onShare('Spridare 75 546080501')} />
          </article>
        </div>
      </div>

      <div className="detail-section">
        <h2>Dokument</h2>
        <div className="document-list">
          <button className="document-row" type="button">
            Bruksanvisning (SV)
            <Icon name="chevron" />
          </button>
          <button className="document-row" type="button">
            Snabbguide (SV/DA/FI/NB)
            <Icon name="chevron" />
          </button>
          <button className="document-row" type="button">
            Försäkran om överensstämmelse
            <Icon name="chevron" />
          </button>
        </div>
      </div>
    </section>
  )
}

function SearchOverlay({ onClose }) {
  const [aiMode, setAiMode] = useState(false)

  if (aiMode) {
    return (
      <section className="search-overlay">
        <div className="search-panel ai-mode">
          <div className="ai-topbar">
            <button className="icon-button" type="button" aria-label="Meny">
              <Icon name="menu" />
            </button>
            <span className="beta-pill">BETA</span>
            <button
              className="icon-button"
              type="button"
              aria-label="Stäng"
              onClick={onClose}
            >
              <Icon name="close" />
            </button>
          </div>

          <h2>Jag hjälper dig gärna att hitta ...</h2>

          <div className="ai-pills">
            <button type="button">Robotgräsklippare</button>
            <button type="button">Tyst drift</button>
            <button type="button">Batteriserie</button>
            <button type="button">Service & delar</button>
            <button type="button">Helgprojekt</button>
          </div>

          <div className="ai-info">
            <span className="info-dot">i</span>
            Kom ihåg att jag bara är en robot! Jag gör mitt bästa, men ibland
            kanske jag råkar säga något lite knasigt.
          </div>

          <label className="ai-input">
            <input type="text" placeholder="Fråga mig om något" />
          </label>
        </div>
      </section>
    )
  }

  return (
    <section className="search-overlay">
      <div className="search-panel">
        <div className="search-header">
          <div>
            <p className="eyebrow">Sök & hitta</p>
            <h2>Vad vill du leta efter?</h2>
          </div>
          <button className="close-button" type="button" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>

        <button
          className="ai-entry"
          type="button"
          onClick={() => setAiMode(true)}
        >
          <span className="ai-badge">
            <Icon name="sparkles" /> AI-sök
          </span>
          <p>Hitta rätt produkt med assistans</p>
        </button>

        <label className="search-input">
          <Icon name="search" />
          <input
            type="text"
            placeholder="Sök på produkt, kategori eller artikelnummer"
          />
        </label>

        <div className="chip-row">
          <button className="chip active" type="button">
            Proffsklippning
          </button>
          <button className="chip" type="button">
            Batteri
          </button>
          <button className="chip" type="button">
            Tillbehör
          </button>
        </div>

        <div className="search-section">
          <h3>Snabbgenvägar</h3>
          <div className="shortcut-list">
            {searchShortcuts.map((item) => (
              <article key={item.title} className="shortcut-card">
                <div>
                  <p>{item.title}</p>
                  <span>{item.subtitle}</span>
                </div>
                <Icon name="chevron" />
              </article>
            ))}
          </div>
        </div>

        <div className="search-section">
          <h3>Populära sökningar</h3>
          <div className="suggestion-row">
            {searchSuggestions.map((item) => (
              <button key={item} className="suggestion-pill" type="button">
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="search-section">
          <h3>Rekommenderade träffar</h3>
          <div className="result-list">
            {searchResults.map((item) => (
              <article key={item.name} className="result-row">
                <div>
                  <p>{item.name}</p>
                  <span>{item.note}</span>
                </div>
                <strong>{item.price}</strong>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [searchOpen, setSearchOpen] = useState(false)
  const [productOpen, setProductOpen] = useState(null)
  const [scannerOpen, setScannerOpen] = useState(false)
  const [shareItem, setShareItem] = useState(null)
  const handleAccount = () => setActiveTab('account')
  const handleOpenProduct = (id) => setProductOpen(id)
  const handleBack = () => setProductOpen(null)
  const handleShare = (item) => setShareItem(item)

  return (
    <div className="app">
      <div className="phone">
        <div className="status-spacer" />
        {productOpen === 'automower-430x-nera' ? (
          <ProductDetail onBack={handleBack} onShare={handleShare} />
        ) : null}
        {productOpen === 'r-214tc-103' ? (
          <RiderDetail onBack={handleBack} onShare={handleShare} />
        ) : null}
        {!productOpen && activeTab === 'home' && (
          <HomeScreen
            onAccount={handleAccount}
            onOpenProduct={handleOpenProduct}
            onShare={handleShare}
          />
        )}
        {!productOpen && activeTab === 'categories' && (
          <CategoriesScreen onAccount={handleAccount} />
        )}
        {!productOpen && activeTab === 'guide' && (
          <GuideScreen onAccount={handleAccount} />
        )}
        {!productOpen && activeTab === 'cart' && (
          <CartScreen onAccount={handleAccount} />
        )}
        {!productOpen && activeTab === 'account' && (
          <AccountScreen onAccount={handleAccount} />
        )}
        {!productOpen && activeTab === 'tools' && (
          <ToolsScreen onAccount={handleAccount} />
        )}

        <button
          className="fab"
          type="button"
          aria-label="Sök"
          onClick={() => setSearchOpen(true)}
        >
          <Icon name="search" />
        </button>
        <button
          className="scan-fab"
          type="button"
          aria-label="Skanna"
          onClick={() => setScannerOpen(true)}
        >
          <Icon name="barcode" />
        </button>

        <nav className="tabbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon name={tab.icon} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
        {scannerOpen && <ScannerOverlay onClose={() => setScannerOpen(false)} />}
        {shareItem && <ShareOverlay item={shareItem} onClose={() => setShareItem(null)} />}
      </div>
    </div>
  )
}

export default App
