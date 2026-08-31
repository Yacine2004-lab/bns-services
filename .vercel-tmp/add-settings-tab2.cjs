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
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
            {[
              { id: 'profile', label: 'Mon profil', icon: User },
              { id: 'password', label: 'Mot de passe', icon: Lock },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'danger', label: 'Zone danger', icon: AlertTriangle },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSettingsTab(id)}
                className={\`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all sm:text-sm \${settingsTab === id ? 'bg-[#0f2557] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}\`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {settingsTab === 'profile' && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <User size={18} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-black text-[#0f2557] sm:text-lg">Informations personnelles</h3>
                    <p className="text-xs text-slate-500 sm:text-sm">Mettez a jour vos informations de profil.</p>
                  </div>
                  {!profileEditing && (
                    <button type="button" onClick={() => setProfileEditing(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#0f2557] transition hover:border-[#e87722] hover:text-[#e87722]">
                      <Edit3 size={12} /> Modifier
                    </button>
                  )}
                </div>
              </div>

              {profileMsg.text && (
                <div className={\`mx-5 mt-4 rounded-lg border p-3 text-sm sm:mx-6 \${profileMsg.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}\`}>
                  {profileMsg.text}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 p-5 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#0f2557]">Prenom</label>
                    <input type="text" required disabled={!profileEditing} value={profileForm.firstName} onChange={(e) => setProfileForm((f) => ({ ...f, firstName: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-2.5 text-sm outline-none transition focus:border-[#e87722] focus:bg-white focus:ring-4 focus:ring-[#e87722]/10 disabled:opacity-60" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#0f2557]">Nom</label>
                    <input type="text" required disabled={!profileEditing} value={profileForm.lastName} onChange={(e) => setProfileForm((f) => ({ ...f, lastName: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-2.5 text-sm outline-none transition focus:border-[#e87722] focus:bg-white focus:ring-4 focus:ring-[#e87722]/10 disabled:opacity-60" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#0f2557]">Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" disabled value={user?.email || ''} className="w-full rounded-xl border border-slate-200 bg-slate-100 pl-9 pr-4 py-2.5 text-sm text-slate-500 cursor-not-allowed" />
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400">L'email ne peut pas etre modifie. Contactez le support si necessaire.</p>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#0f2557]">Telephone</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="tel" disabled={!profileEditing} value={profileForm.phone} onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+221 77 123 45 67" className="w-full rounded-xl border border-slate-200 bg-slate-50/30 pl-9 pr-4 py-2.5 text-sm outline-none transition focus:border-[#e87722] focus:bg-white focus:ring-4 focus:ring-[#e87722]/10 disabled:opacity-60" />
                  </div>
                </div>

                {profileEditing && (
                  <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                    <button type="button" onClick={() => { setProfileEditing(false); setProfileForm({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' }) }} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                      Annuler
                    </button>
                    <button type="submit" disabled={profileSaving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e87722] to-[#f09050] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:scale-[1.02] disabled:opacity-50">
                      <Save size={14} />
                      {profileSaving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {settingsTab === 'password' && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <Lock size={18} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-black text-[#0f2557] sm:text-lg">Mot de passe</h3>
                    <p className="text-xs text-slate-500 sm:text-sm">Modifiez votre mot de passe pour securiser votre compte.</p>
                  </div>
                </div>
              </div>

              {pwdMsg.text && (
                <div className={\`mx-5 mt-4 rounded-lg border p-3 text-sm sm:mx-6 \${pwdMsg.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}\`}>
                  {pwdMsg.text}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 p-5 sm:p-6">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#0f2557]">Mot de passe actuel</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type={pwdShowCurrent ? 'text' : 'password'} required value={pwdForm.currentPassword} onChange={(e) => setPwdForm((f) => ({ ...f, currentPassword: e.target.value }))} placeholder="••••••••" className="w-full rounded-xl border border-slate-200 bg-slate-50/30 pl-9 pr-10 py-2.5 text-sm outline-none transition focus:border-[#e87722] focus:bg-white focus:ring-4 focus:ring-[#e87722]/10" />
                    <button type="button" onClick={() => setPwdShowCurrent((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0f2557]">
                      {pwdShowCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#0f2557]">Nouveau mot de passe</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type={pwdShowNew ? 'text' : 'password'} required minLength={6} value={pwdForm.newPassword} onChange={(e) => setPwdForm((f) => ({ ...f, newPassword: e.target.value }))} placeholder="Minimum 6 caracteres" className="w-full rounded-xl border border-slate-200 bg-slate-50/30 pl-9 pr-10 py-2.5 text-sm outline-none transition focus:border-[#e87722] focus:bg-white focus:ring-4 focus:ring-[#e87722]/10" />
                    <button type="button" onClick={() => setPwdShowNew((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0f2557]">
                      {pwdShowNew ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#0f2557]">Confirmer le nouveau mot de passe</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type={pwdShowNew ? 'text' : 'password'} required minLength={6} value={pwdForm.confirmPassword} onChange={(e) => setPwdForm((f) => ({ ...f, confirmPassword: e.target.value }))} placeholder="Retapez le mot de passe" className="w-full rounded-xl border border-slate-200 bg-slate-50/30 pl-9 pr-4 py-2.5 text-sm outline-none transition focus:border-[#e87722] focus:bg-white focus:ring-4 focus:ring-[#e87722]/10" />
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                  <button type="button" onClick={() => { setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); setPwdMsg({ type: '', text: '' }) }} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                    Reinitialiser
                  </button>
                  <button type="submit" disabled={pwdSaving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:scale-[1.02] disabled:opacity-50">
                    <ShieldCheck size={14} />
                    {pwdSaving ? 'Modification...' : 'Modifier le mot de passe'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {settingsTab === 'notifications' && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <Bell size={18} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-black text-[#0f2557] sm:text-lg">Preferences de notifications</h3>
                    <p className="text-xs text-slate-500 sm:text-sm">Choisissez les notifications que vous souhaitez recevoir.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 p-5 sm:p-6">
                {[
                  { key: 'orderUpdates', label: 'Mises a jour des commandes', description: 'Statut, expedition, livraison.', icon: Package, color: 'blue' },
                  { key: 'promotions', label: 'Promotions et offres', description: 'Recevez nos meilleures offres.', icon: Sparkles, color: 'orange' },
                  { key: 'newsletter', label: 'Newsletter', description: 'Nouveautes et conseils tech.', icon: Mail, color: 'purple' },
                ].map(({ key, label, description, icon: Icon, color }) => (
                  <div key={key} className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-slate-300 hover:bg-slate-50/50 sm:p-4">
                    <div className={\`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-\${color}-100 text-\${color}-600\`}>
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[#0f2557]">{label}</p>
                      <p className="text-[11px] text-slate-500 sm:text-xs">{description}</p>
                    </div>
                    <button type="button" onClick={() => setNotifPrefs((p) => ({ ...p, [key]: !p[key] }))} className={\`relative h-6 w-11 shrink-0 rounded-full transition-colors \${notifPrefs[key] ? 'bg-gradient-to-r from-[#e87722] to-[#f09050]' : 'bg-slate-300'}\`} role="switch" aria-checked={notifPrefs[key]}>
                      <span className={\`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform \${notifPrefs[key] ? 'translate-x-5' : 'translate-x-0.5'}\`} />
                    </button>
                  </div>
                ))}

                <p className="mt-3 rounded-lg bg-blue-50 border border-blue-200 p-2.5 text-[11px] text-blue-700">
                  <Globe size={11} className="mr-1 inline" />
                  Les preferences sont sauvegardees sur votre appareil.
                </p>
              </div>
            </div>
          )}

          {settingsTab === 'danger' && (
            <div className="overflow-hidden rounded-2xl border-2 border-red-200 bg-white shadow-sm">
              <div className="border-b border-red-100 bg-gradient-to-r from-red-50 to-white p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                    <AlertTriangle size={18} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-black text-red-700 sm:text-lg">Zone danger</h3>
                    <p className="text-xs text-slate-600 sm:text-sm">Actions irreversibles. Procedez avec precaution.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-5 sm:p-6">
                <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                      <Trash2 size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-red-700">Supprimer mon compte</p>
                      <p className="mt-1 text-xs text-slate-600">Cette action est definitive. Toutes vos donnees, commandes et preferences seront supprimees.</p>
                      <button type="button" onClick={() => setShowDeleteModal(true)} className="mt-3 inline-flex items-center gap-1.5 rounded-lg border-2 border-red-300 bg-white px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-600 hover:text-white">
                        <Trash2 size={12} />
                        Supprimer mon compte
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-600">
                      <LogOut size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-[#0f2557]">Se deconnecter</p>
                      <p className="mt-1 text-xs text-slate-600">Vous deconnecter de votre compte sur cet appareil.</p>
                      <button type="button" onClick={logout} className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100">
                        <LogOut size={12} />
                        Se deconnecter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL DE CONFIRMATION DE SUPPRESSION DE COMPTE */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => !deleting && setShowDeleteModal(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-[#0f2557]">Supprimer definitivement votre compte ?</h3>
                <p className="mt-1 text-sm text-slate-600">Cette action est irreversible. Tapez SUPPRIMER pour confirmer.</p>
              </div>
            </div>

            {deleteMsg.text && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {deleteMsg.text}
              </div>
            )}

            <div className="mt-4">
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#0f2557]">Tapez SUPPRIMER pour confirmer</label>
              <input type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} placeholder="SUPPRIMER" className="w-full rounded-xl border border-red-200 bg-red-50/30 px-4 py-2.5 text-sm font-bold uppercase tracking-wider outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-500/10" />
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => { setShowDeleteModal(false); setDeleteConfirmText('') }} disabled={deleting} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">
                Annuler
              </button>
              <button type="button" onClick={handleDeleteAccount} disabled={deleting || deleteConfirmText !== 'SUPPRIMER'} className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50">
                {deleting ? 'Suppression...' : 'Supprimer definitivement'}
              </button>
            </div>
          </div>
        </div>
      )}

      `

content = content.slice(0, idx) + settingsContent + '\n' + content.slice(idx)
fs.writeFileSync(file, content, 'utf8')
console.log('OK: onglet settings ajoute')
