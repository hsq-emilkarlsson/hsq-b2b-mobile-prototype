import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const parseCsvLine = (line) => {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }

  result.push(current)
  return result
}

const parseCsv = (text) => {
  const lines = text.split(/\r?\n/).filter(Boolean)
  if (!lines.length) return []
  const header = parseCsvLine(lines[0])
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    return header.reduce((acc, key, index) => {
      acc[key] = values[index] ?? ''
      return acc
    }, {})
  })
}

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
    serial: 'Serienummer 970535221',
    price: '39 900 kr',
    oldPrice: '44 900 kr',
  },
  {
    name: 'R 214TC 103',
    subtitle: 'Åkgräsklippare med 103 cm combi-aggregat',
    serial: 'Serienummer 970843001',
    price: '47 120 kr',
    oldPrice: '58 900 kr',
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
  { title: 'Säljregistrering', subtitle: 'Registrera serienummer' },
  { title: 'Prislistor', subtitle: 'Uppdatera pris & rabatt' },
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
      list: 'M5 7h14M5 12h14M5 17h14M3 7h.01M3 12h.01M3 17h.01',
      share: 'M16 6a2 2 0 1 0-2-2M8 12a2 2 0 1 0-2-2m10 8a2 2 0 1 0-2-2M8 10l6-4M8 14l6 4',
      marketing:
        'M3 10l10-4v12L3 14v-4Zm10 0l7-2v8l-7-2M6 16v2a2 2 0 0 0 2 2h2v-3',
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

function ActionRow({ onShare, onMarketing, showMarketing = false }) {
  const handleShare = onShare || (() => {})
  const handleMarketing = onMarketing || (() => {})
  return (
    <div className={`action-row ${showMarketing ? 'action-row--four' : ''}`}>
      {showMarketing ? (
        <button
          className="action-button"
          type="button"
          aria-label="Marknadsför"
          onClick={(event) => {
            event.stopPropagation()
            handleMarketing()
          }}
        >
          <Icon name="marketing" />
        </button>
      ) : null}
      <button
        className="action-button"
        type="button"
        aria-label="Spara i lista"
        onClick={(event) => event.stopPropagation()}
      >
        <Icon name="list" />
      </button>
      <button
        className="action-button"
        type="button"
        aria-label="Dela"
        onClick={(event) => {
          event.stopPropagation()
          handleShare()
        }}
      >
        <Icon name="share" />
      </button>
      <button
        className="action-button success"
        type="button"
        aria-label="Lägg i varukorg"
        onClick={(event) => event.stopPropagation()}
      >
        <Icon name="cart" />
      </button>
    </div>
  )
}

function HomeScreen({ onAccount, onOpenProduct, onOpenDeliveries, onShare, onMarketing }) {
  return (
    <section className="screen">
      <Header title="Hem" onAccount={onAccount} />
      <button className="primary-cta" type="button" onClick={onOpenDeliveries}>
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
        <h2>Populära</h2>
        <button className="text-button" type="button">
          Se sortiment <Icon name="chevron" />
        </button>
      </div>
      <div className="product-list">
        {products.map((product) => {
          const openProduct = () =>
            product.name === 'Automower 430X NERA'
              ? onOpenProduct('automower-430x-nera')
              : product.name === 'R 214TC 103'
                ? onOpenProduct('r-214tc-103')
                : null

          return (
            <article
              key={product.name}
              className="product-card clickable no-thumb"
              role="button"
              tabIndex={0}
              onClick={openProduct}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  openProduct()
                }
              }}
            >
            <div className="product-image-spacer" />
            <div className="product-info">
              <div className="product-title">
                <h3>{product.name}</h3>
              </div>
              <p>{product.subtitle}</p>
              <p className="product-serial">{product.serial}</p>
              <div className="price-row">
                <strong>{product.price}</strong>
              </div>
              <div className="product-actions">
                <button
                  className="text-button"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    openProduct()
                  }}
                >
                  Öppna <Icon name="chevron" />
                </button>
              </div>
              <ActionRow
                onShare={() => onShare(product.name)}
                onMarketing={() => onMarketing(product.name)}
                showMarketing
              />
            </div>
          </article>
          )
        })}
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

function ToolsScreen({ onAccount, view = 'list', onViewChange = () => {} }) {
  const setView = onViewChange
  const registrationTrend = [24, 32, 28, 40, 46, 54, 48]
  const bestSellers = [
    { label: 'Automower 430X NERA', value: 86 },
    { label: 'R 214TC 103', value: 64 },
    { label: 'Automower 450X NERA', value: 52 },
  ]
  const topAccessories = [
    { label: 'Installationskit Medium', value: 72 },
    { label: 'Automower Endurance knivar', value: 61 },
    { label: 'Batteri 40-B140', value: 45 },
  ]
  const topSpares = [
    { label: 'Knivdisk 3‑pack', value: 58 },
    { label: 'Luftfilter kit', value: 41 },
    { label: 'Hjulnav fram', value: 33 },
  ]
  const priceTagItems = [
    { name: 'Automower 430X NERA', sku: '970535221', size: 'A6' },
    { name: 'R 214TC 103', sku: '970843001', size: 'A6' },
    { name: 'Automower 450X NERA', sku: '970535321', size: 'A6' },
    { name: 'Batteri BLi200X', sku: '967091401', size: 'A7' },
  ]
  const marketingPrintItems = [
    { name: 'Butiksaffisch A3', note: 'Produktnyheter & kampanjyta' },
    { name: 'Hylla‑wobbler A6', note: 'Pris & USP på hyllkant' },
    { name: 'Broschyr pack (20 st)', note: 'Automower + rider' },
  ]
  const [priceTagQuantities, setPriceTagQuantities] = useState(
    () =>
      priceTagItems.reduce((acc, item) => {
        acc[item.sku] = 0
        return acc
      }, {}),
  )
  const [printQuantities, setPrintQuantities] = useState(
    () =>
      marketingPrintItems.reduce((acc, item) => {
        acc[item.name] = 0
        return acc
      }, {}),
  )
  const maxRegistration = Math.max(...registrationTrend)
  const maxBest = Math.max(...bestSellers.map((item) => item.value))
  const maxAccessories = Math.max(...topAccessories.map((item) => item.value))
  const maxSpares = Math.max(...topSpares.map((item) => item.value))

  return view === 'analytics' ? (
    <section className="screen">
      <div className="detail-header">
        <button className="icon-button" type="button" onClick={() => setView('list')}>
          <Icon name="back" />
        </button>
        <div>
          <p className="eyebrow">Verktyg</p>
          <h1>Analytics</h1>
        </div>
      </div>
      <div className="section-header">
        <h2>Senaste 30 dagarna</h2>
      </div>
      <div className="analytics-grid">
        <article className="analytics-card">
          <h3>Produktregistreringar</h3>
          <p className="chart-caption">Veckotrend</p>
          <div className="sparkline">
            {registrationTrend.map((value, index) => (
              <span
                key={`reg-${index}`}
                className="spark-bar"
                style={{ height: `${Math.round((value / maxRegistration) * 100)}%` }}
              />
            ))}
          </div>
        </article>
        <article className="analytics-card">
          <h3>Mest sålda produkter</h3>
          <div className="bar-list">
            {bestSellers.map((item) => (
              <div key={item.label} className="bar-row">
                <span>{item.label}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${Math.round((item.value / maxBest) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
        <article className="analytics-card">
          <h3>Mest sålda tillbehör</h3>
          <div className="bar-list">
            {topAccessories.map((item) => (
              <div key={item.label} className="bar-row">
                <span>{item.label}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${Math.round((item.value / maxAccessories) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
        <article className="analytics-card">
          <h3>Mest sålda reservdelar</h3>
          <div className="bar-list">
            {topSpares.map((item) => (
              <div key={item.label} className="bar-row">
                <span>{item.label}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${Math.round((item.value / maxSpares) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  ) : view === 'price-tags' ? (
    <section className="screen">
      <div className="detail-header">
        <button className="icon-button" type="button" onClick={() => setView('list')}>
          <Icon name="back" />
        </button>
        <div>
          <p className="eyebrow">Verktyg</p>
          <h1>Prisskyltar</h1>
        </div>
      </div>
      <p className="helper-text">Välj antal prisskyltar per produkt för nästa utskick.</p>
      <div className="price-tag-list">
        {priceTagItems.map((item) => (
          <article key={item.sku} className="price-tag-row">
            <div>
              <p>{item.name}</p>
              <span>
                Art.nr {item.sku} · Format {item.size}
              </span>
            </div>
            <div className="quantity-stepper">
              <button
                className="icon-button compact"
                type="button"
                aria-label={`Minska antal för ${item.name}`}
                onClick={() =>
                  setPriceTagQuantities((prev) => ({
                    ...prev,
                    [item.sku]: Math.max(0, prev[item.sku] - 1),
                  }))
                }
              >
                −
              </button>
              <strong>{priceTagQuantities[item.sku]}</strong>
              <button
                className="icon-button compact"
                type="button"
                aria-label={`Öka antal för ${item.name}`}
                onClick={() =>
                  setPriceTagQuantities((prev) => ({
                    ...prev,
                    [item.sku]: prev[item.sku] + 1,
                  }))
                }
              >
                +
              </button>
            </div>
          </article>
        ))}
      </div>
      <button className="primary-cta" type="button">
        Skicka beställning
      </button>
    </section>
  ) : view === 'marketing' ? (
    <section className="screen">
      <div className="detail-header">
        <button className="icon-button" type="button" onClick={() => setView('list')}>
          <Icon name="back" />
        </button>
        <div>
          <p className="eyebrow">Verktyg</p>
          <h1>Marknadsföringsmaterial</h1>
        </div>
      </div>
      <div className="detail-section">
        <h2>Tryckt material</h2>
        <p className="helper-text">Välj antal per material och skicka beställning.</p>
        <div className="price-tag-list">
          {marketingPrintItems.map((item) => (
            <article key={item.name} className="price-tag-row">
              <div>
                <p>{item.name}</p>
                <span>{item.note}</span>
              </div>
              <div className="quantity-stepper">
                <button
                  className="icon-button compact"
                  type="button"
                  aria-label={`Minska antal för ${item.name}`}
                  onClick={() =>
                    setPrintQuantities((prev) => ({
                      ...prev,
                      [item.name]: Math.max(0, prev[item.name] - 1),
                    }))
                  }
                >
                  −
                </button>
                <strong>{printQuantities[item.name]}</strong>
                <button
                  className="icon-button compact"
                  type="button"
                  aria-label={`Öka antal för ${item.name}`}
                  onClick={() =>
                    setPrintQuantities((prev) => ({
                      ...prev,
                      [item.name]: prev[item.name] + 1,
                    }))
                  }
                >
                  +
                </button>
              </div>
            </article>
          ))}
        </div>
        <button className="primary-cta" type="button">
          Beställ tryckt material
        </button>
      </div>
      <div className="detail-section">
        <h2>Digitala kampanjer</h2>
        <div className="marketing-actions">
          <button className="secondary-cta" type="button">
            Skapa kampanjbrief
          </button>
          <button className="secondary-cta ghost" type="button">
            Få hjälp med annonser
          </button>
        </div>
        <div className="tip-list">
          <div className="tip-row">
            <span>Förifylld mall med målgrupp och budget.</span>
            <strong>2 min</strong>
          </div>
          <div className="tip-row">
            <span>Färdiga annonser för Automower & rider.</span>
            <strong>8 st</strong>
          </div>
        </div>
      </div>
    </section>
  ) : (
    <section className="screen">
      <Header title="Verktyg" subtitle="Översikt" onAccount={onAccount} />
      <h2 className="section-title">Marknadsföring</h2>
      <div className="account-list">
        <button className="account-row" type="button" onClick={() => setView('marketing')}>
          <div>
            <p>Marknadsföringsmaterial</p>
            <span>Tryck & digitala kampanjer</span>
          </div>
          <Icon name="chevron" />
        </button>
        <button className="account-row" type="button" onClick={() => setView('price-tags')}>
          <div>
            <p>Prisskyltar</p>
            <span>Beställ skyltar per produkt</span>
          </div>
          <Icon name="chevron" />
        </button>
        <button className="account-row" type="button" onClick={() => setView('analytics')}>
          <div>
            <p>Analytics</p>
            <span>Trender och topplistor</span>
          </div>
          <Icon name="chevron" />
        </button>
      </div>
      <h2 className="section-title">Administration</h2>
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
  const [explodedParts, setExplodedParts] = useState([])
  const [dataStatus, setDataStatus] = useState('loading')
  const [selectedAssembly, setSelectedAssembly] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [imageOpen, setImageOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}automower-430x-exploded.csv`
    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        const rows = parseCsv(text).map((row) => ({
          assemblyId: row['Sprängskiss-ID'],
          assemblyName: row['Sprängskiss-namn'],
          ref: row.Referens,
          partNo: row['Art.nr'],
          partName: row.Artikelnamn,
          qty: row.Mängd,
          comment: row.Kommentar,
          link: row.Länk,
          image: row['Sprängskiss-bild'],
          coords: row.Koordinater,
        }))
        setExplodedParts(rows)
        if (rows[0]?.assemblyName) {
          setSelectedAssembly(rows[0].assemblyName)
        }
        setDataStatus(rows.length ? 'ready' : 'error')
      })
      .catch(() => {
        setExplodedParts([])
        setDataStatus('error')
      })
  }, [])

  const assemblies = useMemo(() => {
    const map = new Map()
    explodedParts.forEach((row) => {
      if (!map.has(row.assemblyName)) {
        map.set(row.assemblyName, {
          name: row.assemblyName,
          image: row.image,
        })
      }
    })
    return Array.from(map.values())
  }, [explodedParts])

  const activeAssembly = assemblies.find((item) => item.name === selectedAssembly)
  const filteredParts = useMemo(() => {
    return explodedParts.filter((row) => {
      const matchesAssembly = row.assemblyName === selectedAssembly
      const query = searchTerm.trim().toLowerCase()
      if (!query) return matchesAssembly
      const name = (row.partName || '').toLowerCase()
      const partNo = (row.partNo || '').toLowerCase()
      const ref = (row.ref || '').toLowerCase()
      return (
        matchesAssembly &&
        (name.includes(query) || partNo.includes(query) || ref.includes(query))
      )
    })
  }, [explodedParts, selectedAssembly, searchTerm])
  const activeImage = activeAssembly?.image || filteredParts[0]?.image || ''

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
        <div className="hero-image">
          <img
            src="https://media.husqvarnagroup.com/image/H310-1611.png?canvas=800%2C440&fit=bounds&height=440&width=800"
            alt="Automower 430X NERA"
          />
        </div>
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
        <h2>Sprängskiss & delar</h2>
        <div className="exploded-toolbar">
          <select
            className="select"
            value={selectedAssembly}
            onChange={(event) => setSelectedAssembly(event.target.value)}
          >
            {assemblies.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <label className="search-input compact">
            <Icon name="search" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Sök ref, art.nr eller namn"
            />
          </label>
        </div>

        {dataStatus === 'loading' ? (
          <p className="helper-text">Laddar sprängskiss…</p>
        ) : null}
        {dataStatus === 'error' ? (
          <p className="helper-text">Kunde inte läsa sprängskissen.</p>
        ) : null}

        {activeImage ? (
          <button
            className="exploded-image"
            type="button"
            onClick={() => {
              setImageUrl(activeImage)
              setImageOpen(true)
            }}
          >
            <img src={activeImage} alt={activeAssembly?.name || 'Sprängskiss'} />
            <span>Tryck för att zooma</span>
          </button>
        ) : null}

        <div className="part-list">
          {filteredParts.slice(0, 12).map((part) => (
            <article key={`${part.assemblyId}-${part.ref}`} className="part-row">
              <div>
                <p>
                  #{part.ref} · {part.partName}
                </p>
                <span>
                  Art.nr {part.partNo} · {part.qty} st
                  {part.comment ? ` · ${part.comment}` : ''}
                </span>
              </div>
              <div className="part-actions">
                <a className="link-button" href={part.link} target="_blank" rel="noreferrer">
                  Öppna artikel
                </a>
                <ActionRow onShare={() => onShare(`${part.partName} ${part.partNo}`)} />
              </div>
            </article>
          ))}
        </div>
        {filteredParts.length > 12 ? (
          <p className="helper-text">Visa fler delar genom att filtrera.</p>
        ) : null}
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

      {imageOpen ? (
        <section className="search-overlay">
          <div className="search-panel image-panel">
            <div className="search-header">
              <div>
                <p className="eyebrow">Sprängskiss</p>
                <h2>{activeAssembly?.name}</h2>
              </div>
              <button className="close-button" type="button" onClick={() => setImageOpen(false)}>
                <Icon name="close" />
              </button>
            </div>
            <div className="image-wrapper">
              <img src={imageUrl} alt={activeAssembly?.name || 'Sprängskiss'} />
            </div>
          </div>
        </section>
      ) : null}
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
          <button className="action-button success" type="button">
            Dela via telefon
          </button>
        </div>
      </div>
    </section>
  )
}

function RiderDetail({ onBack, onShare }) {
  const scrollRef = useRef(null)
  const explodedRef = useRef(null)
  const [explodedParts, setExplodedParts] = useState([])
  const [dataStatus, setDataStatus] = useState('loading')
  const [selectedAssembly, setSelectedAssembly] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [imageOpen, setImageOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}r214tc-exploded.csv`
    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        const rows = parseCsv(text).map((row) => ({
          assemblyId: row['Sprängskiss-ID'],
          assemblyName: row['Sprängskiss-namn'],
          ref: row.Referens,
          partNo: row['Art.nr'],
          partName: row.Artikelnamn,
          qty: row.Mängd,
          comment: row.Kommentar,
          link: row.Länk,
          image: row['Sprängskiss-bild'],
          coords: row.Koordinater,
        }))
        setExplodedParts(rows)
        if (rows[0]?.assemblyName) {
          setSelectedAssembly(rows[0].assemblyName)
        }
        setDataStatus(rows.length ? 'ready' : 'error')
      })
      .catch(() => {
        setExplodedParts([])
        setDataStatus('error')
      })
  }, [])

  const assemblies = useMemo(() => {
    const map = new Map()
    explodedParts.forEach((row) => {
      if (!map.has(row.assemblyName)) {
        map.set(row.assemblyName, {
          name: row.assemblyName,
          image: row.image,
        })
      }
    })
    return Array.from(map.values())
  }, [explodedParts])

  const activeAssembly = assemblies.find((item) => item.name === selectedAssembly)
  const filteredParts = useMemo(() => {
    return explodedParts.filter((row) => {
      const matchesAssembly = row.assemblyName === selectedAssembly
      const query = searchTerm.trim().toLowerCase()
      if (!query) return matchesAssembly
      const name = (row.partName || '').toLowerCase()
      const partNo = (row.partNo || '').toLowerCase()
      const ref = (row.ref || '').toLowerCase()
      return (
        matchesAssembly &&
        (name.includes(query) || partNo.includes(query) || ref.includes(query))
      )
    })
  }, [explodedParts, selectedAssembly, searchTerm])
  const activeImage = activeAssembly?.image || filteredParts[0]?.image || ''

  return (
    <section className="screen product-detail" ref={scrollRef}>
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
        <div className="hero-image">
          <img
            src="https://media.husqvarnagroup.com/image/KH-459456.png?canvas=800%2C440&fit=bounds&height=440&width=800"
            alt="R 214TC 103"
          />
        </div>
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
        <h2>Sprängskiss & delar</h2>
        <div className="exploded-toolbar">
          <select
            className="select"
            value={selectedAssembly}
            onChange={(event) => setSelectedAssembly(event.target.value)}
          >
            {assemblies.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <label className="search-input compact">
            <Icon name="search" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Sök ref, art.nr eller namn"
            />
          </label>
        </div>

        {dataStatus === 'loading' ? (
          <p className="helper-text">Laddar sprängskiss…</p>
        ) : null}
        {dataStatus === 'error' ? (
          <p className="helper-text">Kunde inte läsa sprängskissen.</p>
        ) : null}

        {activeImage ? (
          <button
            className="exploded-image"
            type="button"
            onClick={() => {
              setImageUrl(activeImage)
              setImageOpen(true)
            }}
          >
            <img src={activeImage} alt={activeAssembly?.name || 'Sprängskiss'} />
            <span>Tryck för att zooma</span>
          </button>
        ) : null}

        <div className="part-list">
          {filteredParts.slice(0, 12).map((part) => (
            <article key={`${part.assemblyId}-${part.ref}`} className="part-row">
              <div>
                <p>
                  #{part.ref} · {part.partName}
                </p>
                <span>
                  Art.nr {part.partNo} · {part.qty} st
                  {part.comment ? ` · ${part.comment}` : ''}
                </span>
              </div>
              <div className="part-actions">
                <a className="link-button" href={part.link} target="_blank" rel="noreferrer">
                  Öppna artikel
                </a>
                <ActionRow onShare={() => onShare(`${part.partName} ${part.partNo}`)} />
              </div>
            </article>
          ))}
        </div>
        {filteredParts.length > 12 ? (
          <p className="helper-text">Visa fler delar genom att filtrera.</p>
        ) : null}
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

      {imageOpen ? (
        <section className="search-overlay">
          <div className="search-panel image-panel">
            <div className="search-header">
              <div>
                <p className="eyebrow">Sprängskiss</p>
                <h2>{activeAssembly?.name}</h2>
              </div>
              <button className="close-button" type="button" onClick={() => setImageOpen(false)}>
                <Icon name="close" />
              </button>
            </div>
            <div className="image-wrapper">
              <img src={imageUrl} alt={activeAssembly?.name} />
            </div>
          </div>
        </section>
      ) : null}
    </section>
  )
}

function DeliveriesScreen({ onBack }) {
  return (
    <section className="screen">
      <div className="detail-header">
        <button className="icon-button" type="button" onClick={onBack}>
          <Icon name="back" />
        </button>
        <div>
          <p className="eyebrow">Logistik</p>
          <h1>Kommande leveranser</h1>
        </div>
      </div>

      <div className="detail-section">
        <h2>Denna vecka</h2>
        <div className="detail-cards">
          <article>
            <p>Ons 12 feb • Stockholm</p>
            <span>08:30–11:30 · 14 artiklar</span>
            <div className="delivery-actions">
              <button className="action-button" type="button">
                Detaljer
              </button>
            </div>
          </article>
          <article>
            <p>Fre 14 feb • Stockholm</p>
            <span>13:00–16:00 · 8 artiklar</span>
            <div className="delivery-actions">
              <button className="action-button" type="button">
                Detaljer
              </button>
            </div>
          </article>
        </div>
      </div>

      <div className="detail-section">
        <h2>Kommande</h2>
        <div className="detail-cards">
          <article>
            <p>Tis 18 feb • Stockholm</p>
            <span>09:00–12:00 · 21 artiklar</span>
            <div className="delivery-actions">
              <button className="action-button" type="button">
                Detaljer
              </button>
            </div>
          </article>
          <article>
            <p>Tor 20 feb • Stockholm</p>
            <span>10:00–12:30 · 6 artiklar</span>
            <div className="delivery-actions">
              <button className="action-button" type="button">
                Detaljer
              </button>
            </div>
          </article>
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
  const [deliveriesOpen, setDeliveriesOpen] = useState(false)
  const [toolsView, setToolsView] = useState('list')
  const handleAccount = () => setActiveTab('account')
  const handleOpenProduct = (id) => setProductOpen(id)
  const handleBack = () => setProductOpen(null)
  const handleShare = (item) => setShareItem(item)
  const handleOpenDeliveries = () => setDeliveriesOpen(true)
  const handleCloseDeliveries = () => setDeliveriesOpen(false)
  const handleOpenMarketing = () => {
    setActiveTab('tools')
    setToolsView('marketing')
    setProductOpen(null)
    setDeliveriesOpen(false)
  }

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
        {deliveriesOpen && <DeliveriesScreen onBack={handleCloseDeliveries} />}
        {!productOpen && !deliveriesOpen && activeTab === 'home' && (
          <HomeScreen
            onAccount={handleAccount}
            onOpenProduct={handleOpenProduct}
            onOpenDeliveries={handleOpenDeliveries}
            onShare={handleShare}
            onMarketing={handleOpenMarketing}
          />
        )}
        {!productOpen && !deliveriesOpen && activeTab === 'categories' && (
          <CategoriesScreen onAccount={handleAccount} />
        )}
        {!productOpen && !deliveriesOpen && activeTab === 'guide' && (
          <GuideScreen onAccount={handleAccount} />
        )}
        {!productOpen && !deliveriesOpen && activeTab === 'cart' && (
          <CartScreen onAccount={handleAccount} />
        )}
        {!productOpen && !deliveriesOpen && activeTab === 'account' && (
          <AccountScreen onAccount={handleAccount} />
        )}
        {!productOpen && !deliveriesOpen && activeTab === 'tools' && (
          <ToolsScreen
            onAccount={handleAccount}
            view={toolsView}
            onViewChange={setToolsView}
          />
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
