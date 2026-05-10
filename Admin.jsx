import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  // Product Form State
  const [editingProduct, setEditingProduct] = useState(null)
  const [productForm, setProductForm] = useState({
    name: '', size: '', description: '', mrp: '', offer_price: '', special_price: '',
    is_offer_active: false, stock_status: 'in_stock', images: ''
  })
  const [productFiles, setProductFiles] = useState([])
  const [heroFile, setHeroFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: pData } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (pData) setProducts(pData)

      const { data: oData } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
      if (oData) setOrders(oData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (loginId === 'karunayaherbalproduct' && password === 'Karunya@#499') {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Invalid ID or Password')
    }
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    try {
      let finalImages = productForm.images ? productForm.images.split(',').map(s => s.trim()).filter(Boolean) : []
      
      if (productFiles.length > 0) {
        const uploadedUrls = []
        for (const file of productFiles) {
          const fileExt = file.name.split('.').pop()
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
          const filePath = `products/${fileName}`
          
          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file)
            
          if (uploadError) throw uploadError
          
          const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath)
            
          uploadedUrls.push(data.publicUrl)
        }
        finalImages = uploadedUrls // Replace existing images if new ones are uploaded
      }

      const payload = {
        ...productForm,
        mrp: Number(productForm.mrp),
        offer_price: productForm.offer_price ? Number(productForm.offer_price) : null,
        special_price: productForm.special_price ? Number(productForm.special_price) : null,
        images: finalImages
      }

      if (editingProduct) {
        await supabase.from('products').update(payload).eq('id', editingProduct.id)
      } else {
        await supabase.from('products').insert([payload])
      }
      setEditingProduct(null)
      setProductFiles([])
      fetchData()
    } catch (err) {
      console.error(err)
      alert('Error saving product: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const editProduct = (p) => {
    setEditingProduct(p)
    setProductForm({
      ...p,
      images: p.images ? p.images.join(', ') : ''
    })
    setProductFiles([])
  }

  const handleHeroUpload = async () => {
    if (!heroFile) return
    setUploading(true)
    try {
      const { error } = await supabase.storage
        .from('product-images')
        .upload('hero-bg.jpg', heroFile, { upsert: true, cacheControl: '0' })
        
      if (error) throw error
      alert('Hero image updated successfully! Refresh the home page to see changes.')
      setHeroFile(null)
    } catch (err) {
      console.error(err)
      alert('Error uploading hero image: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const deleteProduct = async (id) => {
    if (confirm('Are you sure?')) {
      await supabase.from('products').delete().eq('id', id)
      fetchData()
    }
  }

  const updateOrderStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    fetchData()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="card p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🌿</div>
            <h1 className="font-display text-2xl font-bold text-forest">Karunya Admin</h1>
          </div>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center font-medium">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-forest mb-1">Admin ID</label>
              <input type="text" value={loginId} onChange={e => setLoginId(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-forest" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-forest mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-forest" required />
            </div>
            <button type="submit" className="btn-primary w-full py-3">Login</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container-max p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-display text-3xl font-bold text-forest">Admin Dashboard</h1>
          <button onClick={() => setIsAuthenticated(false)} className="btn-outline py-2 px-4 text-sm">Logout</button>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab('products')} className={`px-6 py-2.5 rounded-full font-medium transition-all ${activeTab === 'products' ? 'bg-forest text-white shadow-md' : 'bg-white text-gray-600 hover:bg-green-50'}`}>Products</button>
          <button onClick={() => setActiveTab('orders')} className={`px-6 py-2.5 rounded-full font-medium transition-all ${activeTab === 'orders' ? 'bg-forest text-white shadow-md' : 'bg-white text-gray-600 hover:bg-green-50'}`}>Orders</button>
          <button onClick={() => setActiveTab('settings')} className={`px-6 py-2.5 rounded-full font-medium transition-all ${activeTab === 'settings' ? 'bg-forest text-white shadow-md' : 'bg-white text-gray-600 hover:bg-green-50'}`}>Settings</button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500">Loading data...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {activeTab === 'products' && (
              <>
                <div className="lg:col-span-2 space-y-4">
                  {products.map(p => (
                    <div key={p.id} className="card p-4 flex flex-wrap gap-4 items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          {p.images?.[0] && <img src={p.images[0]} className="w-full h-full object-cover aspect-square" alt="" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-forest">{p.name} <span className="text-xs text-amber-600 ml-2">{p.size}</span></h3>
                          <p className="text-sm text-gray-600">MRP: ₹{p.mrp} | Offer: ₹{p.offer_price || '-'} | Stock: {p.stock_status}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => editProduct(p)} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100">Edit</button>
                        <button onClick={() => deleteProduct(p.id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="lg:col-span-1">
                  <div className="card p-5 sticky top-24">
                    <h2 className="font-display text-xl font-bold text-forest mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                    <form onSubmit={handleProductSubmit} className="space-y-4 text-sm">
                      <div>
                        <label className="block mb-1 font-semibold text-gray-700">Name</label>
                        <input type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full p-2.5 border rounded-lg" required />
                      </div>
                      <div>
                        <label className="block mb-1 font-semibold text-gray-700">Size</label>
                        <input type="text" value={productForm.size} onChange={e => setProductForm({...productForm, size: e.target.value})} className="w-full p-2.5 border rounded-lg" required placeholder="e.g. 100ml" />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block mb-1 font-semibold text-gray-700">MRP</label>
                          <input type="number" value={productForm.mrp} onChange={e => setProductForm({...productForm, mrp: e.target.value})} className="w-full p-2.5 border rounded-lg" required />
                        </div>
                        <div>
                          <label className="block mb-1 font-semibold text-gray-700">Offer Price</label>
                          <input type="number" value={productForm.offer_price} onChange={e => setProductForm({...productForm, offer_price: e.target.value})} className="w-full p-2.5 border rounded-lg" />
                        </div>
                        <div>
                          <label className="block mb-1 font-semibold text-gray-700">Special Price</label>
                          <input type="number" value={productForm.special_price} onChange={e => setProductForm({...productForm, special_price: e.target.value})} className="w-full p-2.5 border rounded-lg" />
                        </div>
                      </div>
                      <div>
                        <label className="flex items-center gap-2 font-semibold text-gray-700 cursor-pointer">
                          <input type="checkbox" checked={productForm.is_offer_active} onChange={e => setProductForm({...productForm, is_offer_active: e.target.checked})} className="w-4 h-4 accent-forest" />
                          Offer is Active
                        </label>
                      </div>
                      <div>
                        <label className="block mb-1 font-semibold text-gray-700">Stock Status</label>
                        <select value={productForm.stock_status} onChange={e => setProductForm({...productForm, stock_status: e.target.value})} className="w-full p-2.5 border rounded-lg bg-white">
                          <option value="in_stock">In Stock</option>
                          <option value="out_of_stock">Out of Stock</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-1 font-semibold text-gray-700">Description</label>
                        <textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full p-2.5 border rounded-lg h-24 resize-none" required />
                      </div>
                      <div>
                        <label className="block mb-1 font-semibold text-gray-700">Product Images</label>
                        <input type="file" multiple accept="image/*" onChange={e => setProductFiles(Array.from(e.target.files))} className="w-full p-2 border rounded-lg bg-white" />
                        {editingProduct && productForm.images && productFiles.length === 0 && (
                          <p className="text-xs text-gray-500 mt-1">Currently has {productForm.images.split(',').filter(Boolean).length} image(s). Uploading new ones will replace them.</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" disabled={uploading} className="flex-1 btn-primary py-2.5 disabled:opacity-50">{uploading ? 'Saving...' : 'Save Product'}</button>
                        {editingProduct && (
                          <button type="button" onClick={() => { setEditingProduct(null); setProductFiles([]); setProductForm({ name: '', size: '', description: '', mrp: '', offer_price: '', special_price: '', is_offer_active: false, stock_status: 'in_stock', images: '' }) }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-colors">Cancel</button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'orders' && (
              <div className="lg:col-span-3">
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="p-4 font-semibold text-forest">Order ID</th>
                          <th className="p-4 font-semibold text-forest">Date</th>
                          <th className="p-4 font-semibold text-forest">Customer</th>
                          <th className="p-4 font-semibold text-forest">Location</th>
                          <th className="p-4 font-semibold text-forest">Total</th>
                          <th className="p-4 font-semibold text-forest">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {orders.map(o => (
                          <tr key={o.id} className="hover:bg-gray-50/50">
                            <td className="p-4 font-mono text-xs text-gray-500">{String(o.id).slice(0, 8)}</td>
                            <td className="p-4 text-gray-600">{new Date(o.created_at).toLocaleDateString()}</td>
                            <td className="p-4">
                              <p className="font-medium text-gray-800">{o.mobile}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{o.items.length} items</p>
                            </td>
                            <td className="p-4 text-gray-600">
                              <p>{o.village}, {o.district}</p>
                            </td>
                            <td className="p-4 font-bold text-forest">₹{o.total}</td>
                            <td className="p-4">
                              <select 
                                value={o.status} 
                                onChange={e => updateOrderStatus(o.id, e.target.value)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold border-0 cursor-pointer ${
                                  o.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                  o.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                  o.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                                  'bg-green-100 text-green-700'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="lg:col-span-3">
                <div className="card p-6 max-w-2xl">
                  <h2 className="font-display text-2xl font-bold text-forest mb-6">Website Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                      <h3 className="font-bold text-lg text-gray-800 mb-2">Hero Background Image</h3>
                      <p className="text-sm text-gray-600 mb-4">Upload a high-quality image for the top banner of the home page. This will replace the existing background.</p>
                      
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={e => setHeroFile(e.target.files[0])} 
                          className="w-full sm:w-auto p-2 border rounded-lg bg-white flex-1" 
                        />
                        <button 
                          onClick={handleHeroUpload} 
                          disabled={!heroFile || uploading}
                          className="btn-primary py-2 px-6 whitespace-nowrap disabled:opacity-50"
                        >
                          {uploading ? 'Uploading...' : 'Update Background'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
