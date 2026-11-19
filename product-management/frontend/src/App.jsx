import { useEffect, useState } from 'react';
import { CalendarDays, ChevronDown, Menu, Tag, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import { initialProducts } from './data';
import { productAPI } from './services/api';

function readSaved(key, fallback) { try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; } }
export default function App() {
  const [products, setProducts] = useState([]);
  const [profile, setProfile] = useState(() => readSaved('pm-profile-v1', { name: 'Alex Johnson', email: 'admin@store.com' }));
  const [page, setPage] = useState('Dashboard');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      try {
        const data = await productAPI.getAll();
        if (active) setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        if (active) setNotice('Unable to load products. Check that the backend is running.');
      }
    };
    fetchProducts();
    return () => { active = false; };
  }, []);
  useEffect(() => { try { localStorage.setItem('pm-profile-v1', JSON.stringify(profile)); } catch { setNotice('Browser storage is unavailable. Changes will last for this session.'); } }, [profile]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 5000); return () => clearTimeout(timer); }, [notice]);
  useEffect(() => { const close = e => { if (e.key === 'Escape') { setDeleting(null); setOpen(false); } }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, []);
  const actions = { products, onAdd: () => setPage('Add Product'), onEdit: p => { setEditing(p); setPage('Edit Product'); }, onDelete: setDeleting };
  const save = product => { if (products.some(p => p.sku?.toLowerCase() === product.sku.toLowerCase() && p.id !== product.id)) { setNotice('That SKU already exists. Please use a unique SKU.'); return; } setProducts(old => product.id ? old.map(p => p.id === product.id ? product : p) : [{ ...product, id: crypto.randomUUID() }, ...old]); setPage('Products'); setNotice('Product saved successfully.'); };
  const changes = { count: products.length - 5, low: products.filter(p => p.stock < 10).length - 2, categories: new Set(products.map(p => p.category)).size - 4, value: products.reduce((n,p) => n + p.price*p.stock,0) - initialProducts.reduce((n,p) => n + p.price*p.stock,0) };
  const descriptions = { Dashboard: `Welcome back, ${profile.name.split(' ')[0]}! Here's what's happening with your store today.`, Products: 'View and manage your product inventory.', Categories: 'Organize your products by category.', Settings: 'Manage your store profile.', 'Add Product': 'Add a new product to your inventory.', 'Edit Product': 'Update your product details.' };
  return <div className="min-h-screen bg-[linear-gradient(125deg,#f7f8fe,#edf2ff)]"><Sidebar page={page.includes('Product') ? 'Products' : page} onNavigate={setPage} open={open} onClose={() => setOpen(false)} profile={profile}/><main className="px-5 py-7 lg:ml-[302px] lg:px-[26px] lg:pt-[50px] lg:pb-12"><header className="mb-10 flex flex-wrap items-center justify-between gap-5 px-2"><div><div className="flex items-center gap-3"><button aria-label="Open navigation" onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-blue-100 lg:hidden"><Menu/></button><h1 className="text-4xl leading-tight font-bold tracking-[-1.5px] lg:text-[42px]">{page}</h1></div><p className="mt-1 text-lg text-[#5b6f9d] lg:text-[20px]">{descriptions[page]}</p></div>{page === 'Dashboard' && <div title="Demo dashboard shows a fixed 30-day reporting period" className="flex items-center gap-3 rounded-xl border border-[#cbd5ed] bg-white/70 px-3 py-3 text-base text-[#172a51] shadow-sm"><CalendarDays size={22} className="text-[#6075a1]"/><span>Last 30 Days</span><ChevronDown size={19} className="ml-7 text-[#6075a1]"/></div>}</header>
  {page === 'Dashboard' && <Dashboard {...actions} changes={changes} onViewAll={() => setPage('Products')}/>}
  {page === 'Products' && <Products {...actions}/>}
  {page === 'Add Product' && <AddProduct onSave={save} onCancel={() => setPage('Products')}/>}
  {page === 'Edit Product' && <EditProduct product={editing} onSave={save} onCancel={() => setPage('Products')}/>}
  {page === 'Categories' && <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{['Electronics', 'Wearables', 'Fashion', 'Accessories'].map(category => <section key={category} className="panel rounded-2xl p-6"><Tag className="mb-5 text-blue-600"/><h2 className="text-xl font-bold">{category}</h2><p className="mt-2 text-slate-500">{products.filter(p => p.category === category).length} products</p></section>)}</div>}
  {page === 'Settings' && <form className="panel max-w-xl space-y-5 rounded-2xl p-7" onSubmit={e => { e.preventDefault(); const data = Object.fromEntries(new FormData(e.currentTarget)); if (!data.name.trim()) return; setProfile({ name: data.name.trim(), email: data.email }); setNotice('Profile updated.'); }}><label className="block text-slate-700">Full name<input required name="name" defaultValue={profile.name} className="field"/></label><label className="block text-slate-700">Email address<input required type="email" name="email" defaultValue={profile.email} className="field"/></label><button className="primary-button">Save Changes</button></form>}
  </main>{notice && <div role="status" className="fixed right-6 bottom-6 z-50 flex max-w-sm items-center gap-4 rounded-xl bg-slate-900 px-5 py-4 text-white shadow-xl">{notice}<button aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={18}/></button></div>}
  {deleting && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-5" onClick={() => setDeleting(null)}><section role="dialog" aria-modal="true" aria-labelledby="delete-title" className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl" onClick={e => e.stopPropagation()}><h2 id="delete-title" className="text-2xl font-bold">Delete product?</h2><p className="my-4 text-slate-600">Remove {deleting.name} from your inventory?</p><div className="flex justify-end gap-3"><button autoFocus className="secondary-button" onClick={() => setDeleting(null)}>Cancel</button><button className="rounded-xl bg-red-600 px-5 py-3 text-white hover:bg-red-700" onClick={() => { setProducts(products.filter(p => p.id !== deleting.id)); setDeleting(null); setNotice('Product deleted.'); }}>Delete Product</button></div></section></div>}</div>;
}
