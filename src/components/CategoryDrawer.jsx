import { useState } from 'react'
import { X, ChevronDown } from 'lucide-react'
import { categories } from '../data/categories'
import { resolveImageUrl } from '../lib/resolveImageUrl'

function CategoryDrawer({ isOpen, onClose, onSelectCategory, onSelectSubCategory }) {
  const [openGroups, setOpenGroups] = useState(() =>
    categories.reduce((acc, category) => {
      acc[category.id] = false
      return acc
    }, {}),
  )

  const toggleGroup = (categoryId) => {
    setOpenGroups((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 transition"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform overflow-y-auto bg-white shadow-2xl transition duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="sticky top-0 border-b border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-[#0f2557]">Catégories</h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-2 p-4 sm:p-5">
          {categories.map((category) => {
            const Icon = category.icon
            const isOpen = openGroups[category.id]

            return (
              <div key={category.id} className="overflow-hidden rounded-2xl border border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory(category.id)
                    toggleGroup(category.id)
                  }}
                  className="flex w-full items-center justify-between gap-3 bg-slate-50 px-3 py-3 text-left font-bold text-[#0f2557] transition hover:bg-slate-100"
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} />
                    {category.name}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transform transition ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="space-y-1 bg-white p-2">
                    {category.subCategories.map((subCategory) => (
                      <button
                        key={subCategory.id}
                        type="button"
                        onClick={() => {
                          onSelectSubCategory(subCategory.id)
                          onClose()
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-[#0f2557]"
                      >
                        <div className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 p-0.5 border border-slate-200/60">
                          {subCategory.image ? (
                            <img
                              src={resolveImageUrl(subCategory.image)}
                              alt={subCategory.name}
                              className="h-full w-full object-cover rounded"
                            />
                          ) : (
                            <subCategory.icon size={14} className="m-auto text-slate-600" />
                          )}
                        </div>
                        <span className="truncate font-medium">{subCategory.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default CategoryDrawer
