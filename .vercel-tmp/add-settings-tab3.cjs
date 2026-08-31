const fs = require('fs')
const file = 'c:\\Users\\HP\\Desktop\\bns\\src\\pages\\ClientDashboard.jsx'
let content = fs.readFileSync(file, 'utf8')

if (content.includes("activeTab === 'settings' && (")) {
  console.log('Deja ajoute, on sort')
  process.exit(0)
}

const target = "      {/* MODAL DE CONFIRMATION D'ANNULATION */}"
const idx = content.indexOf(target)
if (idx === -1) {
  console.log('ERREUR: target non trouve')
  process.exit(1)
}

const settingsContent = `      {/* ONGLET 4 : PARAMETRES */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          {/* Sous-navigation */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
            {[
              { id: 'profile', label: 'Mon profil', icon: User },
              { id: 'password', label: 'Mot de passe', icon: Lock },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'danger', label: 'Zone sensible', icon: AlertTriangle },
            ].map((tab) => {
              const Icon = tab.icon
              const active = settingsTab === tab.id
              const isDanger = tab.id === 'danger'
              return (
                <button
                  key={tab.id}
                  onClick={() => setSettingsTab(tab.id)}
                  className={\`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all \${
                    active
                      ? isDanger
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-[#0f2557] text-white shadow-md'
                      : isDanger
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-slate-600 hover:bg-slate-100'
                  }\`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* === SOUS-ONGLET : PROFIL === */}
          {settingsTab === 'profile' && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* En-tete */}
              <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-[#0f2557] via-[#0f2557] to-[#1a3a8a] px-5 py-4">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
                <div className="absolute -left-4 -bottom-4 h-20 w-20 rounded-full bg-[#e87722]/20 blur-2xl" />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Informations personnelles</h2>
                    <p className="text-xs text-blue-100">Mettez a jour vos informations de profil</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="p-5">
                {/* Avatar + email verrouille */}
                <div className="mb-5 flex items-center gap-4 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-3.5">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0f2557] to-[#1a3a8a] text-lg font-bold text-white shadow-md">
                    {user?.firstName?.[0]?.toUpperCase() || 'U'}{user?.lastName?.[0]?.toUpperCase() || ''}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-slate-900">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Mail size={12} />
                      <span className="truncate">{user?.email}</span>
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">verrouille</span>
                    </div>
                  </div>
                </div>

                {/* Champs */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Prenom</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        disabled={!profileEditing}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 transition-all focus:border-[#0f2557] focus:outline-none focus:ring-2 focus:ring-[#0f2557]/20 disabled:bg-slate-50 disabled:text-slate-500"
                        placeholder="Votre prenom"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Nom</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        disabled={!profileEditing}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 transition-all focus:border-[#0f2557] focus:outline-none focus:ring-2 focus:ring-[#0f2557]/20 disabled:bg-slate-50 disabled:text-slate-500"
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Telephone</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        disabled={!profileEditing}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 transition-all focus:border-[#0f2557] focus:outline-none focus:ring-2 focus:ring-[#0f2557]/20 disabled:bg-slate-50 disabled:text-slate-500"
                        placeholder="+221 77 000 00 00"
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">Le telephone permet de vous contacter pour la livraison.</p>
                  </div>
                </div>

                {/* Message feedback */}
                {profileMsg.text && (
                  <div className={\`mt-4 flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold \${
                    profileMsg.type === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-red-200 bg-red-50 text-red-700'
                  }\`}>
                    {profileMsg.type === 'success' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                    {profileMsg.text}
                  </div>
                )}

                {/* Boutons */}
                <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 pt-4">
                  {!profileEditing ? (
                    <button
                      type="button"
                      onClick={() => { setProfileEditing(true); setProfileMsg({ type: '', text: '' }) }}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0f2557] to-[#1a3a8a] px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
                    >
                      <Edit3 size={14} />
                      Modifier
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileEditing(false)
                          setProfileForm({ firstName: user.firstName || '', lastName: user.lastName || '', phone: user.phone || '' })
                          setProfileMsg({ type: '', text: '' })
                        }}
                        disabled={profileSaving}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition-all hover:bg-slate-50 disabled:opacity-50"
                      >
                        <X size={14} />
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={profileSaving}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e87722] to-[#f09050] px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-50"
                      >
                        {profileSaving ? (
                          <>
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save size={14} />
                            Enregistrer
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* === SOUS-ONGLET : MOT DE PASSE === */}
          {settingsTab === 'password' && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-[#0f2557] via-[#0f2557] to-[#1a3a8a] px-5 py-4">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
                <div className="absolute -left-4 -bottom-4 h-20 w-20 rounded-full bg-[#e87722]/20 blur-2xl" />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                    <Lock size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Securite du compte</h2>
                    <p className="text-xs text-blue-100">Changez votre mot de passe regulierement</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="p-5">
                <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                  <ShieldCheck size={14} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-bold">Conseil de securite</div>
                    <div className="mt-0.5 text-amber-700">Utilisez au moins 6 caracteres, melangez lettres, chiffres et symboles.</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Mot de passe actuel</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={pwdShowCurrent ? 'text' : 'password'}
                        value={pwdForm.currentPassword}
                        onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-10 text-sm text-slate-900 transition-all focus:border-[#0f2557] focus:outline-none focus:ring-2 focus:ring-[#0f2557]/20"
                        placeholder="Votre mot de passe actuel"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setPwdShowCurrent(!pwdShowCurrent)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {pwdShowCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Nouveau mot de passe</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={pwdShowNew ? 'text' : 'password'}
                        value={pwdForm.newPassword}
                        onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-10 text-sm text-slate-900 transition-all focus:border-[#0f2557] focus:outline-none focus:ring-2 focus:ring-[#0f2557]/20"
                        placeholder="Minimum 6 caracteres"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setPwdShowNew(!pwdShowNew)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {pwdShowNew ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Confirmer le nouveau mot de passe</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        value={pwdForm.confirmPassword}
                        onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 transition-all focus:border-[#0f2557] focus:outline-none focus:ring-2 focus:ring-[#0f2557]/20"
                        placeholder="Retapez le mot de passe"
                        required
                      />
                    </div>
                  </div>
                </div>

                {pwdMsg.text && (
                  <div className={\`mt-4 flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold \${
                    pwdMsg.type === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-red-200 bg-red-50 text-red-700'
                  }\`}>
                    {pwdMsg.type === 'success' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                    {pwdMsg.text}
                  </div>
                )}

                <div className="mt-5 flex justify-end border-t border-slate-200 pt-4">
                  <button
                    type="submit"
                    disabled={pwdSaving}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e87722] to-[#f09050] px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-50"
                  >
                    {pwdSaving ? (
                      <>
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Modification...
                      </>
                    ) : (
                      <>
                        <Lock size={14} />
                        Changer le mot de passe
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* === SOUS-ONGLET : NOTIFICATIONS === */}
          {settingsTab === 'notifications' && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-[#0f2557] via-[#0f2557] to-[#1a3a8a] px-5 py-4">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
                <div className="absolute -left-4 -bottom-4 h-20 w-20 rounded-full bg-[#e87722]/20 blur-2xl" />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                    <Bell size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Preferences de notifications</h2>
                    <p className="text-xs text-blue-100">Choisissez les alertes que vous souhaitez recevoir</p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-200">
                {[
                  {
                    key: 'orderUpdates',
                    title: 'Suivi des commandes',
                    desc: 'Statut de vos commandes (confirmation, expedition, livraison).',
                    icon: Package,
                    color: 'blue',
                  },
                  {
                    key: 'promotions',
                    title: 'Offres promotionnelles',
                    desc: 'Recevez nos meilleures offres et reductions exclusives.',
                    icon: Sparkles,
                    color: 'orange',
                  },
                  {
                    key: 'newsletter',
                    title: 'Newsletter',
                    desc: 'Nouveautes produit, guides et actualites BNS Services.',
                    icon: Mail,
                    color: 'green',
                  },
                ].map((pref) => {
                  const Icon = pref.icon
                  const enabled = notifPrefs[pref.key]
                  return (
                    <div key={pref.key} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50">
                      <div className={\`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl \${
                        pref.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                        pref.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                        'bg-emerald-50 text-emerald-600'
                      }\`}>
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-slate-900">{pref.title}</div>
                        <div className="text-xs text-slate-500">{pref.desc}</div>
                      </div>
                      {/* Toggle switch */}
                      <button
                        type="button"
                        onClick={() => setNotifPrefs({ ...notifPrefs, [pref.key]: !enabled })}
                        className={\`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors \${
                          enabled ? 'bg-[#e87722]' : 'bg-slate-300'
                        }\`}
                      >
                        <span
                          className={\`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform \${
                            enabled ? 'translate-x-5' : 'translate-x-0.5'
                          }\`}
                        />
                      </button>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-slate-200 bg-gradient-to-br from-slate-50 to-white px-5 py-3.5">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck size={12} className="text-emerald-600" />
                  Vos preferences sont sauvegardees localement et restent privees.
                </div>
              </div>
            </div>
          )}

          {/* === SOUS-ONGLET : ZONE SENSIBLE === */}
          {settingsTab === 'danger' && (
            <div className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
              <div className="relative overflow-hidden border-b border-red-200 bg-gradient-to-r from-red-700 via-red-600 to-red-700 px-5 py-4">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
                <div className="absolute -left-4 -bottom-4 h-20 w-20 rounded-full bg-yellow-400/20 blur-2xl" />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                    <AlertTriangle size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Zone sensible</h2>
                    <p className="text-xs text-red-100">Actions irreversibles sur votre compte</p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                      <Trash2 size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-red-900">Supprimer definitivement mon compte</h3>
                      <p className="mt-1 text-xs text-red-700">
                        Toutes vos donnees personnelles, votre historique de commandes et vos favoris seront definitivement supprimes.
                        Cette action est <strong>irreversible</strong>.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="mt-3 flex items-center gap-2 rounded-xl border border-red-300 bg-white px-3.5 py-2 text-xs font-bold text-red-700 transition-all hover:bg-red-100"
                      >
                        <Trash2 size={14} />
                        Supprimer mon compte
                      </button>
                    </div>
                  </div>
                </div>

                {deleteMsg.text && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700">
                    <AlertTriangle size={14} />
                    {deleteMsg.text}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL DE CONFIRMATION DE SUPPRESSION DE COMPTE */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => !deleting && setShowDeleteModal(false)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-red-800 px-6 py-5 text-center">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-yellow-400/20 blur-2xl" />
              <div className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                <AlertTriangle size={26} className="text-white" />
              </div>
              <h3 className="relative text-lg font-bold text-white">Supprimer votre compte ?</h3>
              <p className="relative mt-1 text-xs text-red-100">Cette action est definitive et irreversible</p>
            </div>
            <div className="p-5">
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <XCircle size={14} className="mt-0.5 flex-shrink-0" />
                    <span>Votre profil et vos informations personnelles seront effaces</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle size={14} className="mt-0.5 flex-shrink-0" />
                    <span>Votre historique de commandes sera definitivement supprime</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle size={14} className="mt-0.5 flex-shrink-0" />
                    <span>Vos favoris et preferences seront perdus</span>
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Tapez <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-red-600">SUPPRIMER</span> pour confirmer
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="SUPPRIMER"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  disabled={deleting}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowDeleteModal(false); setDeleteConfirmText('') }}
                  disabled={deleting}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition-all hover:bg-slate-50 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleting || deleteConfirmText !== 'SUPPRIMER'}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:from-red-700 hover:to-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Suppression...
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      Supprimer definitivement
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

`

const before = content.slice(0, idx)
const after = content.slice(idx)
const newContent = before + settingsContent + after

fs.writeFileSync(file, newContent, 'utf8')
console.log('OK: Onglet parametres ajoute (' + (newContent.length - content.length) + ' caracteres)');
