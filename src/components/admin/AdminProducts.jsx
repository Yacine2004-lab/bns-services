import { useRef, useState } from 'react'
import { Plus, Pencil, Trash2, X, Package, ExternalLink, ImagePlus, Camera, Sparkles, Loader2, Upload, ImageIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../../context/ProductContext'
import { uploadApi } from '../../lib/api'
import { resolveImageUrl } from '../../lib/resolveImageUrl'
import { categories } from '../../data/categories'

// Composant image avec fallback si erreur de chargement
function ProductImage({ src, alt, className }) {
  const [errored, setErrored] = useState(false)
  const resolved = resolveImageUrl(src)

  if (!resolved || errored) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-800 text-slate-600`}>
        <ImageIcon size={16} />
      </div>
    )
  }

  return (
    <img
      src={resolved}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
    />
  )
}

const emptyForm = {
  name: '',
  description: '',
  category: categories[0]?.name || '',
  subCategory: categories[0]?.subCategories[0]?.name || '',
  price: '',
  image: '',
  images: [],
  stock: '',
  featured: false,
}

const formatPrice = (value) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(value)

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const selectedCategory = categories.find((c) => c.name === form.category)
  const subOptions = selectedCategory?.subCategories || []

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setShowForm(true)
  }

  const openEdit = (product) => {
    const productImages = product.images && product.images.length ? product.images : [product.image].filter(Boolean)
    setEditingId(product.id)
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      subCategory: product.subCategory,
      price: String(product.price),
      image: productImages[0] || '',
      images: productImages,
      stock: String(product.stock),
      featured: product.featured,
    })
    setError('')
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    setError('')
  }

  const handleCategoryChange = (categoryName) => {
    const cat = categories.find((c) => c.name === categoryName)
    setForm((f) => ({
      ...f,
      category: categoryName,
      subCategory: cat?.subCategories[0]?.name || '',
    }))
  }

  const handleImageFiles = async (files) => {
    const validFiles = Array.from(files || []).filter((file) => file.type.startsWith('image/')).slice(0, 8)

    if (!validFiles.length) {
      setError('Sélectionnez au moins une image valide.')
      return
    }

    // Vérifier la limite de 8 images
    const currentCount = (form.images || []).length
    const remaining = 8 - currentCount
    if (remaining <= 0) {
      setError('Maximum 8 images par produit.')
      return
    }

    const filesToUpload = validFiles.slice(0, remaining)
    setUploading(true)
    setError('')

    try {
      // Upload vers le serveur (compression + optimisation automatiques)
      const res = await uploadApi.images(filesToUpload)
      const newUrls = res.data.map((img) => img.full)

      setForm((current) => {
        const nextImages = [...(current.images || []), ...newUrls].slice(0, 8)
        return {
          ...current,
          images: nextImages,
          image: nextImages[0] || current.image,
        }
      })
    } catch (err) {
      setError(err.message || "Erreur lors de l'upload des images.")
    } finally {
      setUploading(false)
      // Réinitialiser l'input file pour pouvoir re-sélectionner le même fichier
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeImage = async (index) => {
    const imageToRemove = (form.images || [])[index]
    setForm((current) => {
      const nextImages = (current.images || []).filter((_, i) => i !== index)
      return {
        ...current,
        images: nextImages,
        image: nextImages[0] || '',
      }
    })
    // Supprimer aussi du serveur si c'est une image locale uploadée
    if (imageToRemove && imageToRemove.startsWith('/uploads/')) {
      try {
        await uploadApi.delete(imageToRemove.replace('/uploads/products/', ''))
      } catch {}
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) return setError('Le nom du produit est requis.')
    if (!form.description.trim()) return setError('La description est requise.')
    if (!form.price || Number(form.price) <= 0) return setError('Indiquez un prix valide.')
    if (form.stock === '' || Number(form.stock) < 0) return setError('Indiquez un stock valide.')
    if ((!form.images || form.images.length === 0) && !form.image.trim()) {
      return setError('Ajoutez au moins une photo du produit.')
    }

    const selectedCat = categories.find((c) => c.name === form.category)
    const selectedSub = selectedCat?.subCategories?.find((s) => s.name === form.subCategory)

    const payload = {
      ...form,
      categoryId: selectedCat?.id,
      subCategoryId: selectedSub?.id,
      image: form.image || form.images?.[0] || '',
      images: form.images?.length ? form.images : [form.image].filter(Boolean),
    }

    try {
      if (editingId) {
        await updateProduct(editingId, payload)
      } else {
        await addProduct(payload)
      }
      closeForm()
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de l\'enregistrement.')
    }
  }

  const handleDelete = (product) => {
    if (window.confirm(`Supprimer « ${product.name} » ?`)) {
      deleteProduct(product.id)
    }
  }

  const inputClass =
    'w-full rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 px-4 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Gestion des produits</h2>
          <p className="text-sm text-slate-400 mt-1">
            {products.length} produit{products.length > 1 ? 's' : ''} — visibles par les clients sur le catalogue
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-[#e87722] px-5 py-2.5 text-sm font-bold text-[#0f2557] transition hover:bg-[#e87722]"
        >
          <Plus size={18} />
          Ajouter un produit
        </button>
      </div>

      {/* Formulaire modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <h3 className="text-lg font-bold text-white">
                {editingId ? 'Modifier le produit' : 'Nouveau produit'}
              </h3>
              <button type="button" onClick={closeForm} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Nom du matériel *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: Laptop Pro 14"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Décrivez le matériel, ses caractéristiques, usages..."
                  rows={4}
                  className={`${inputClass} resize-y`}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Catégorie *</label>
                  <select
                    value={form.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className={inputClass}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Sous-catégorie *</label>
                  <select
                    value={form.subCategory}
                    onChange={(e) => setForm((f) => ({ ...f, subCategory: e.target.value }))}
                    className={inputClass}
                  >
                    {subOptions.map((sub) => (
                      <option key={sub.id} value={sub.name}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Prix (FCFA) *</label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="349000"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Stock *</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    placeholder="10"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-300">Photos du produit *</label>
                  <span className="text-xs text-slate-400">{(form.images || []).length}/8</span>
                </div>

                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragActive(true)
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragActive(false)
                    handleImageFiles(e.dataTransfer.files)
                  }}
                  className={`rounded-2xl border border-dashed p-4 transition ${
                    dragActive ? 'border-[#e87722] bg-[#e87722]/10' : 'border-slate-600 bg-slate-950/40'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e87722]/15 text-[#e87722]">
                      {uploading ? <Loader2 size={22} className="animate-spin" /> : <Camera size={22} />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {uploading ? 'Upload et optimisation en cours...' : 'Glissez vos photos ici'}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">ou</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
                    >
                      <ImagePlus size={16} />
                      {uploading ? 'Envoi...' : 'Ajouter des photos'}
                    </button>
                    <p className="text-[10px] text-slate-500">JPG, PNG, WebP — max 5 Mo — auto-compressé</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="hidden"
                      onChange={(e) => handleImageFiles(e.target.files)}
                    />
                  </div>
                </div>

                {(form.images || []).length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {(form.images || []).map((image, index) => (
                      <div key={`${image}-${index}`} className="group relative overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
                        <img src={resolveImageUrl(image)} alt={`Produit ${index + 1}`} className="h-24 w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/80 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-500"
                          aria-label="Supprimer image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label className="flex items-center gap-3 cursor-pointer rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-2">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  className="h-4 w-4 rounded accent-[#e87722]"
                />
                <span className="inline-flex items-center gap-2 text-sm text-slate-300">
                  <Sparkles size={14} className="text-[#e87722]" />
                  Mettre en vedette (page d'accueil)
                </span>
              </label>

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#e87722] py-3 text-sm font-bold text-[#0f2557] transition hover:bg-[#e87722]"
                >
                  {editingId ? 'Enregistrer' : 'Publier le produit'}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-slate-600 px-6 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des produits */}
      {products.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
          <Package size={40} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400">Aucun produit. Ajoutez votre premier matériel.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-left text-slate-400">
                <th className="px-4 py-3 font-medium">Produit</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Catégorie</th>
                <th className="px-4 py-3 font-medium">Prix</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Stock</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-slate-800/60 bg-slate-900/40 hover:bg-slate-800/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ProductImage
                        src={product.image}
                        alt=""
                        className="h-10 w-10 rounded-lg object-cover bg-slate-800"
                      />
                      <div>
                        <p className="font-semibold text-white">{product.name}</p>
                        <p className="text-xs text-slate-500 line-clamp-1 max-w-[200px]">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400 hidden md:table-cell">
                    {product.subCategory}
                  </td>
                  <td className="px-4 py-3 text-white font-medium">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3 text-slate-400 hidden sm:table-cell">
                    {product.stock}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`${window.location.origin}/produit/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
                        title="Voir côté client"
                      >
                        <ExternalLink size={16} />
                      </a>
                      <button
                        type="button"
                        onClick={() => openEdit(product)}
                        className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-[#e87722]"
                        title="Modifier"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        className="p-2 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
