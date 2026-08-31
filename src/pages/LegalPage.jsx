import { FileText, ShieldCheck, ScrollText, Sparkles } from 'lucide-react'

const TYPE_META = {
  cgv: {
    icon: ScrollText,
    badge: 'CGV',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  privacy: {
    icon: ShieldCheck,
    badge: 'Confidentialité',
    color: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  legal: {
    icon: FileText,
    badge: 'Mentions légales',
    color: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
}

const CONTENT = {
  cgv: {
    title: 'Conditions générales de vente',
    sections: [
      {
        heading: '1. Objet',
        text: 'Les présentes conditions générales de vente (CGV) régissent les relations entre BNS Services (ci-après « le Vendeur ») et tout client effectuant un achat sur le site BNS Services (ci-après « le Client »). Toute commande implique l\'acceptation pleine et entière de ces CGV.',
      },
      {
        heading: '2. Prix',
        text: 'Les prix sont affichés en francs CFA (FCFA), toutes taxes comprises. Le Vendeur se réserve le droit de modifier ses prix à tout moment, mais les produits seront facturés au prix en vigueur lors de la validation de la commande.',
      },
      {
        heading: '3. Commandes',
        text: 'Le Client peut passer commande directement sur le site ou via WhatsApp. La commande est confirmée après vérification de la disponibilité des produits et confirmation par le service commercial.',
      },
      {
        heading: '4. Paiement',
        text: 'Le paiement s\'effectue à la livraison, en espèces ou par virement/mobile money. Aucun paiement en ligne n\'est requis. Le Client vérifie l\'état des produits avant de régler.',
      },
      {
        heading: '5. Livraison',
        text: 'Les délais de livraison sont de 24 à 48 heures pour Dakar et jusqu\'à 5 jours ouvrés pour les autres régions du Sénégal. Les frais de livraison sont indiqués avant la validation finale de la commande.',
      },
      {
        heading: '6. Retours et remboursements',
        text: 'En cas de produit défectueux ou non conforme, le Client dispose de 7 jours après réception pour contacter le Vendeur. Le remboursement ou le remplacement sera effectué après vérification.',
      },
      {
        heading: '7. Garantie',
        text: 'Tous les produits vendus sont neufs et couverts par la garantie constructeur. La durée et les conditions de garantie varient selon les marques et les produits.',
      },
      {
        heading: '8. Responsabilité',
        text: 'Le Vendeur ne saurait être tenu responsable des dommages résultant de l\'utilisation des produits vendus. Il appartient au Client de choisir les produits adaptés à ses besoins.',
      },
    ],
  },
  privacy: {
    title: 'Politique de confidentialité',
    sections: [
      {
        heading: '1. Collecte des données',
        text: 'Nous collectons uniquement les données nécessaires au traitement de vos commandes : nom, prénom, email, numéro de téléphone, adresse de livraison. Ces informations sont conservées de manière sécurisée.',
      },
      {
        heading: '2. Utilisation des données',
        text: 'Vos données sont utilisées pour : traiter vos commandes, vous contacter concernant votre commande, améliorer nos services. Elles ne sont jamais vendues ni partagées avec des tiers, sauf pour les besoins de livraison.',
      },
      {
        heading: '3. Cookies',
        text: 'Notre site utilise des cookies techniques nécessaires à son fonctionnement (gestion du panier, authentification). Aucun cookie publicitaire ou de tracking n\'est utilisé sans votre consentement.',
      },
      {
        heading: '4. Durée de conservation',
        text: 'Vos données personnelles sont conservées tant que votre compte est actif. Vous pouvez demander leur suppression à tout moment en nous contactant sur WhatsApp.',
      },
      {
        heading: '5. Vos droits',
        text: 'Vous disposez d\'un droit d\'accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous via WhatsApp ou par email à contact@bnsservices.sn.',
      },
    ],
  },
  legal: {
    title: 'Mentions légales',
    sections: [
      {
        heading: 'Éditeur du site',
        text: 'BNS Services\nDakar, Sénégal\nEmail : contact@bnsservices.sn\nWhatsApp : +221 78 445 95 10',
      },
      {
        heading: 'Hébergement',
        text: 'Ce site est hébergé par un prestataire externe. Pour toute question relative à l\'hébergement, contactez-nous via les coordonnées ci-dessus.',
      },
      {
        heading: 'Propriété intellectuelle',
        text: 'L\'ensemble du contenu de ce site (textes, images, logos, design) est la propriété exclusive de BNS Services ou de ses fournisseurs. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.',
      },
      {
        heading: 'Limitation de responsabilité',
        text: 'Les informations présentées sur ce site sont fournies à titre indicatif. Malgré nos efforts pour maintenir des informations à jour et exactes, le Vendeur ne saurait être tenu responsable d\'erreurs ou d\'omissions.',
      },
    ],
  },
}

export default function LegalPage({ type }) {
  const content = CONTENT[type] || CONTENT.legal
  const meta = TYPE_META[type] || TYPE_META.legal
  const Icon = meta.icon

  return (
    <div className="space-y-8 pb-16">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50/40 to-white border border-slate-200 p-6 sm:p-10">
        <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full ${meta.bg} opacity-40 blur-3xl`} />
        <Sparkles className="absolute right-8 top-8 h-6 w-6 text-[#e87722]/30" />

        <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.color} text-white shadow-lg`}>
            <Icon size={26} />
          </div>
          <div className="flex-1">
            <span className={`inline-flex items-center gap-1.5 rounded-full ${meta.bg} px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${meta.iconColor}`}>
              {meta.badge}
            </span>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#0f2557] sm:text-3xl lg:text-4xl">
              {content.title}
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Dernière mise à jour : août 2026
            </p>
          </div>
        </div>
      </section>

      {/* CONTENU */}
      <section className="grid gap-4 sm:gap-5">
        {content.sections.map((section, idx) => (
          <div
            key={section.heading}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
          >
            <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full ${meta.bg} opacity-0 blur-2xl transition group-hover:opacity-60`} />
            <div className="relative flex items-start gap-3 sm:gap-4">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${meta.bg} ${meta.iconColor} text-xs font-black sm:h-9 sm:w-9`}>
                {idx + 1}
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-black text-[#0f2557] sm:text-base">{section.heading}</h2>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 whitespace-pre-line sm:mt-2 sm:text-sm">
                  {section.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

    </div>
  )
}
