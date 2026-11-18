import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import ProductTable from '../components/ProductTable';
export default function Products({ products, onAdd, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  return <section className="panel rounded-2xl p-4"><div className="mb-6 flex flex-wrap justify-between gap-4"><label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4"><Search size={20} className="text-slate-400"/><input aria-label="Search products" placeholder="Search products, SKU, category..." value={search} onChange={e => setSearch(e.target.value)} className="w-64 py-3 outline-none"/></label><button onClick={onAdd} className="primary-button"><Plus size={21}/>Add Product</button></div><ProductTable products={products.filter(p => `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(search.toLowerCase()))} onEdit={onEdit} onDelete={onDelete}/></section>;
}
