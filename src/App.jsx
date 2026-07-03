import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import ImageUploadForm from '@/components/ImageUploadForm'
import AdminGalleryList from '@/components/AdminGalleryList'
import UserGalleryView from '@/components/UserGalleryView'
import { getSession, isAdmin, logout } from '@/lib/auth'
import { 
  loadGalleryItemsFromFirebase, 
  addGalleryItemToFirebase, 
  updateGalleryItemInFirebase, 
  deleteGalleryItemFromFirebase 
} from '@/lib/galleryStorage'

export default function App() {
  const [items, setItems] = useState([])
  const [session, setSession] = useState(getSession())
  const [editingItem, setEditingItem] = useState(null)
  const [loading, setLoading] = useState(true)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  useEffect(() => {
    let isMounted = true;
    
    async function fetchItems() {
      try {
        // Waxaan u oggolaanaynaa kaliya 2 ilbiriqsi inuu isku dayo
        const fetchPromise = loadGalleryItemsFromFirebase();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Timeout")), 2500)
        );

        // Kii soo hortaasma ayaa guulaysanaya
        const firebaseItems = await Promise.race([fetchPromise, timeoutPromise]);
        
        if (isMounted && firebaseItems) {
          setItems(firebaseItems);
        }
      } catch (err) {
        console.error("Cilad dhanka network-ga ah ama Firebase:", err);
      } finally {
        // Qasab in loading-ku uu halkan ku damo mar walba!
        if (isMounted) setLoading(false);
      }
    }

    fetchItems();
    return () => { isMounted = false; };
  }, [])

  const handleLogin = (newSession) => {
    setSession(newSession)
  }

  const handleLogout = () => {
    logout()
    setSession(null)
    setEditingItem(null)
  }

  const handleUploadOrUpdate = async (payload) => {
    try {
      if (editingItem) {
        await updateGalleryItemInFirebase(payload.id, payload);
        setItems((prev) => prev.map((item) => (item.id === payload.id ? payload : item)));
        setEditingItem(null);
      } else {
        const result = await addGalleryItemToFirebase(payload);
        const newItem = { ...payload, id: result.id, createdAt: new Date().toISOString() };
        setItems((prev) => [newItem, ...prev]);
      }
    } catch (err) {
      alert("Cilad ayaa dhacday marka xogta la kaydinayay!");
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteGalleryItemFromFirebase(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (editingItem?.id === id) setEditingItem(null);
    } catch (err) {
      alert("Waa lariqi waayay in la tirtiro!");
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(items.length / itemsPerPage)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar session={session} onLogin={handleLogin} onLogout={handleLogout} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent"></div>
            <div className="text-sky-600 font-medium text-sm animate-pulse">Xogta si dhakhso ah ayaa loo soo rarayaa...</div>
          </div>
        ) : isAdmin(session) ? (
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
                onEditSelect={(item) => setEditingItem(item)} 
                onDelete={handleDelete} 
              />
            </div>
          </div>
        ) : (
          <div>
            <UserGalleryView 
              items={currentItems} 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </main>
    </div>
  )
}