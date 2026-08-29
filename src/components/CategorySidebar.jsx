import { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { categories } from '../data/categories'

function CategorySidebar({ activeCategory, activeSubCategory, onSelectCategory, onSelectSubCategory, counts, categoryCounts = {} }) {
  const [openGroups, setOpenGroups] = useState(() =>
    categories.reduce((acc, category) => {
      acc[category.id] = true
      return acc
    }, {}),
  )

  const categoryList = useMemo(() => categories, [])

  const toggleGroup = (categoryId) => {
    setOpenGroups((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(11,31,58,0.08)] lg:p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-black text-[#0b1f3a]">Catégories</h2>
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          className="text-xs font-semibold text-[#0b1f3a] hover:text-[#f5a623]"
        >
          Tout
        </button>
      </div>

      <div className="space-y-3">
        {categoryList.map((category) => {
          const Icon = category.icon
          const isOpen = openGroups[category.id]
          const isActiveCategory = activeCategory === category.id

          return (
            <div key={category.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
              <button
                type="button"
                onClick={() => {
                  onSelectCategory(category.id)
                  toggleGroup(category.id)
                }}
                className={`flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition ${
                  isActiveCategory ? 'bg-[#0b1f3a] text-white' : 'text-[#0b1f3a] hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${isActiveCategory ? 'bg-white/10 text-[#f9b448]' : 'bg-white text-[#0b1f3a]'}`}>
                    <Icon size={18} />
                  </span>
                  <span className="text-sm font-bold">{category.name}</span>
                </span>

                <span className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${isActiveCategory ? 'bg-white/10 text-white' : 'bg-white text-[#0b1f3a]'}`}>
                    {categoryCounts[category.id] ?? 0}
                  </span>
                  {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
              </button>

              {isOpen && (
                <div className="space-y-1 p-2">
                  {category.subCategories.map((subCategory) => {
                    const isActiveSub = activeSubCategory === subCategory.id
                    const count = counts[subCategory.id] || 0

                    return (
                      <button
                        key={subCategory.id}
                        type="button"
                        onClick={() => onSelectSubCategory(subCategory.id)}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${
                          isActiveSub
                            ? 'bg-[#f8f1e7] text-[#0b1f3a] ring-1 ring-[#f5a623]/20'
                            : 'text-slate-600 hover:bg-white hover:text-[#0b1f3a]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <subCategory.icon size={15} />
                          <span>{subCategory.name}</span>
                        </span>
                        <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-[#0b1f3a]">
                          {count}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

export default CategorySidebar
