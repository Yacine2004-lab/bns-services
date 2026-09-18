/**
 * CookieBanner.jsx — Bannière de consentement RGPD / cookies analytiques
 * BNS Services
 *
 * - Stocke la décision dans localStorage ("bns_cookie_consent": "true" | "false")
 * - Quand accepté : active la collecte GA4 via gtag('consent', 'update', ...)
 * - La bannière n'apparaît qu'une seule fois (persiste entre les sessions)
 */

import { useState, useEffect } from 'react'
import { Cookie, X, BarChart2, ShieldCheck } from 'lucide-react'

const STORAGE_KEY = 'bns_cookie_consent'

function updateGtagConsent(granted) {
  if (typeof window.gtag !== 'function') return
  window.gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: 'denied', // jamais accordé — pas de pub
  })
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === null) {
      // Première visite : afficher la bannière après 1s (non intrusif)
      const t = setTimeout(() => setVisible(true), 1000)
      return () => clearTimeout(t)
    }
    // Consentement déjà donné → appliquer immédiatement
    updateGtagConsent(stored === 'true')
  }, [])

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    updateGtagConsent(true)
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, 'false')
    updateGtagConsent(false)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Bannière de consentement cookies"
      className="cookie-banner"
    >
      {/* Overlay flouté très léger */}
      <div className="cookie-banner__inner">
        {/* Icône */}
        <div className="cookie-banner__icon-wrap">
          <Cookie size={28} className="cookie-banner__icon" />
        </div>

        {/* Texte */}
        <div className="cookie-banner__content">
          <p className="cookie-banner__title">Votre vie privée nous importe</p>
          <p className="cookie-banner__body">
            Nous utilisons des cookies analytiques (Google Analytics 4) pour comprendre comment
            vous utilisez notre site et améliorer votre expérience. Aucune donnée publicitaire
            n&apos;est collectée.{' '}
            <a href="/politique-de-confidentialite" className="cookie-banner__link">
              En savoir plus
            </a>
          </p>
        </div>

        {/* Actions */}
        <div className="cookie-banner__actions">
          <button
            id="cookie-decline-btn"
            type="button"
            onClick={handleDecline}
            className="cookie-banner__btn cookie-banner__btn--secondary"
          >
            <X size={14} />
            Refuser
          </button>
          <button
            id="cookie-accept-btn"
            type="button"
            onClick={handleAccept}
            className="cookie-banner__btn cookie-banner__btn--primary"
          >
            <BarChart2 size={14} />
            Accepter
          </button>
        </div>

        {/* Badge RGPD */}
        <div className="cookie-banner__badge">
          <ShieldCheck size={11} />
          RGPD conforme
        </div>
      </div>

      <style>{`
        .cookie-banner {
          position: fixed;
          bottom: 1.25rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          width: calc(100% - 2rem);
          max-width: 560px;
          animation: cookieSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes cookieSlideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(1.5rem); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        .cookie-banner__inner {
          background: rgba(11, 31, 58, 0.97);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 20px;
          padding: 1.25rem 1.5rem 1rem;
          box-shadow: 0 24px 60px rgba(11,31,58,0.45);
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          position: relative;
        }

        .cookie-banner__icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 12px;
          background: rgba(232,119,34,0.18);
          flex-shrink: 0;
          align-self: flex-start;
        }

        .cookie-banner__icon {
          color: #e87722;
        }

        .cookie-banner__content {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .cookie-banner__title {
          font-size: 0.9375rem;
          font-weight: 800;
          color: #fff;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .cookie-banner__body {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.65);
          line-height: 1.6;
          margin: 0;
        }

        .cookie-banner__link {
          color: #e87722;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .cookie-banner__link:hover {
          color: #f09050;
        }

        .cookie-banner__actions {
          display: flex;
          gap: 0.625rem;
        }

        .cookie-banner__btn {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          border-radius: 10px;
          padding: 0.55rem 1rem;
          font-size: 0.8125rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: transform 0.15s, box-shadow 0.15s;
        }

        .cookie-banner__btn:hover { transform: translateY(-1px); }
        .cookie-banner__btn:active { transform: translateY(0); }

        .cookie-banner__btn--primary {
          background: #e87722;
          color: #0f2557;
          box-shadow: 0 4px 14px rgba(232,119,34,0.4);
          flex: 1;
          justify-content: center;
        }

        .cookie-banner__btn--primary:hover {
          background: #f09050;
          box-shadow: 0 6px 18px rgba(232,119,34,0.5);
        }

        .cookie-banner__btn--secondary {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.12);
        }

        .cookie-banner__btn--secondary:hover {
          background: rgba(255,255,255,0.13);
        }

        .cookie-banner__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          align-self: flex-end;
        }
      `}</style>
    </div>
  )
}
