import { Link } from 'react-router-dom'
import BnsLogo from './BnsLogo'
import { WhatsAppIcon, FacebookIcon, InstagramIcon } from './SocialIcons'

const WHATSAPP_NUMBER = '221784459510'
const WHATSAPP_DISPLAY = '+221 78 445 95 10'

const socialLinks = [
  {
    name: 'WhatsApp',
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    Icon: WhatsAppIcon,
    hoverClass: 'hover:border-[#25D366]/60 hover:bg-[#25D366]/15 hover:text-[#25D366]',
  },
  {
    name: 'Facebook',
    href: '#',
    title: 'Bientôt disponible',
    Icon: FacebookIcon,
    hoverClass: 'hover:border-[#1877F2]/60 hover:bg-[#1877F2]/15 hover:text-[#1877F2]',
  },
  {
    name: 'Instagram',
    href: '#',
    title: 'Bientôt disponible',
    Icon: InstagramIcon,
    hoverClass: 'hover:border-[#E4405F]/60 hover:bg-[#E4405F]/15 hover:text-[#E4405F]',
  },
]

function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/20">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1f3a]/95 via-[#122a4a]/90 to-[#0d2240]/95 backdrop-blur-2xl" />
      <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-[#f5a623]/10 blur-[100px]" />
      <div className="absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-[#60a5fa]/10 blur-[80px]" />

      <div className="relative mx-auto grid max-w-[1400px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <BnsLogo size={48} />
            <div>
              <p className="font-black uppercase tracking-tight text-white">BNS Services</p>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#f9b448]">Sénégal</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            Vente de matériel informatique, accessoires et solutions pour particuliers et professionnels.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">Navigation</h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li><Link to="/" className="transition hover:text-[#f5a623]">Accueil</Link></li>
            <li><Link to="/catalogue" className="transition hover:text-[#f5a623]">Catalogue</Link></li>
            <li><Link to="/a-propos" className="transition hover:text-[#f5a623]">À propos</Link></li>
            <li><Link to="/contact" className="transition hover:text-[#f5a623]">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">Informations</h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li><Link to="/conditions-generales" className="transition hover:text-[#f5a623]">CGV</Link></li>
            <li><Link to="/politique-de-confidentialite" className="transition hover:text-[#f5a623]">Politique de confidentialité</Link></li>
            <li><Link to="/mentions-legales" className="transition hover:text-[#f5a623]">Mentions légales</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">Contact</h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition hover:text-[#25D366]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>contact@bnsservices.sn</li>
            <li>Dakar, Sénégal</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">Réseaux</h3>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map(({ name, href, title, Icon, hoverClass }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={name}
                title={title || name}
                className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-slate-300 backdrop-blur-md transition ${hoverClass}`}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} BNS Services. Tous droits réservés.
      </div>
    </footer>
  )
}

export default Footer
