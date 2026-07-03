import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import ImageUploadForm from '@/components/ImageUploadForm'
import AdminGalleryList from '@/components/AdminGalleryList'
import UserGalleryView from '@/components/UserGalleryView'
import { getSession, isAdmin, logout } from '@/lib/auth'
import { loadGalleryItems, saveGalleryItems } from '@/lib/galleryStorage'

export default function App() {
  const [items, setItems] = useState([])
  const [session, setSession] = useState(getSession())
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    const loadedItems = loadGalleryItems();
    console.log("💾 Xogta laga soo akhriyay LocalStorage:", loadedItems);
    setItems(loadedItems)
  }, [])

  useEffect(() => {
    console.log("💾 Xogta hadda loo save-gariyo dhanka LocalStorage:", items);
    saveGalleryItems(items)
  }, [items])

  const handleLogin = (newSession) => {
    setSession(newSession)
  }

  const handleLogout = () => {
    logout()
    setSession(null)
    setEditingItem(null)
  }

  const handleUploadOrUpdate = (payload) => {
    console.log("📥 App.js wuxuu helay payload-kan:", payload);
    if (editingItem) {
      setItems((prev) => prev.map((item) => (item.id === payload.id ? payload : item)))
      setEditingItem(null)
    } else {
      setItems((prev) => [payload, ...prev])
    }
  }

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    if (editingItem?.id === id) setEditingItem(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar session={session} onLogin={handleLogin} onLogout={handleLogout} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
        {isAdmin(session) ? (
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start">
            <div className="w-full">
              <ImageUploadForm 
                onUpload={handleUploadOrUpdate} 
                onDelete={handleDelete}
                initialData={editingItem}
                onCancel={() => setEditingItem(null)}
              />
            </div>
            <div className="w-full overflow-hidden">
              <AdminGalleryList 
                items={items} 
                onEditSelect={(item) => {
                  console.log("🔘 Badanka Edit ayaa la riixay sawirkan:", item);
                  setEditingItem(item);
                }} 
                onDelete={handleDelete} 
              />
            </div>
          </div>
        ) : (
          <div>
            <UserGalleryView items={items} />
          </div>
        )}
      </main>
    </div>
  )
}