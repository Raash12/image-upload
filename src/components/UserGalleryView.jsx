import { useState } from 'react'
import { downloadImage, sanitizeFilename } from '@/lib/galleryStorage'

export default function UserGalleryView({ 
  items = [], 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange 
}) {
  const [selectedImage, setSelectedImage] = useState(null)

  const handleDownload = (item) => {
    const ext = item.image.startsWith('data:image/png') ? 'png' : 'jpg'
    const filename = `${sanitizeFilename(item.title || 'download')}.${ext}`
    downloadImage(item.image, filename)
  }

  return (
    <div className="space-y-6 p-6 flex flex-col justify-between min-h-[60vh]">
      <div className="space-y-6">
        <div className="flex flex-col space-y-1.5">
          <h2 className="text-3xl font-bold tracking-tight text-sky-950">Welcome to our Gallery</h2>
          <p className="text-sm text-sky-500">Browse and download beautiful images from our collection.</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 text-sky-400 text-sm border border-dashed border-sky-200 bg-white rounded-lg">
            No images available in the gallery.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-lg border border-sky-100 bg-white shadow-sm transition hover:shadow-md flex flex-col justify-between">
                <div>
                  {/* Waxaan halkan ku badalnay bg-slate-950 iyo object-contain si sawirku u soo wada baxo */}
                  <div className="aspect-square w-full overflow-hidden bg-slate-950 relative rounded-t-lg flex items-center justify-center">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="p-4 space-y-2">
                    <h4 className="font-bold text-sky-950 text-base break-words">
                      {item.title}
                    </h4>
                    <p className="text-xs font-medium text-sky-500 break-words">
                      <span className="font-semibold text-sky-600">Name:</span> {item.imageName || 'No Name'}
                    </p>
                  </div>
                </div>
                
                <div className="p-4 pt-0">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedImage(item)}
                      className="flex-1 inline-flex h-8 items-center justify-center rounded-md bg-sky-50 text-xs font-medium text-sky-700 hover:bg-sky-100 transition"
                    >
                      View Full
                    </button>
                    <button
                      onClick={() => handleDownload(item)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-sky-600 text-white hover:bg-sky-700 transition"
                      title="Download Image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination component */}
      <div className="mt-8 pt-4 border-t border-sky-100 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || items.length === 0}
          className="inline-flex h-8 items-center justify-center rounded-md border border-sky-200 bg-white px-4 text-xs font-medium text-sky-700 shadow-sm hover:bg-sky-50 disabled:opacity-40 disabled:hover:bg-white transition"
        >
          Previous
        </button>
        <span className="text-xs font-semibold text-sky-800">
          Page {items.length === 0 ? 0 : currentPage} of {items.length === 0 ? 0 : totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || items.length === 0}
          className="inline-flex h-8 items-center justify-center rounded-md border border-sky-200 bg-white px-4 text-xs font-medium text-sky-700 shadow-sm hover:bg-sky-50 disabled:opacity-40 disabled:hover:bg-white transition"
        >
          Next
        </button>
      </div>

      {/* Modal Popup for View Full */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-fade-in">
          <div className="relative max-w-3xl w-full bg-white rounded-lg overflow-hidden shadow-2xl">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 z-10 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img src={selectedImage.image} alt={selectedImage.title} className="w-full max-h-[70vh] object-contain bg-slate-950" />
            <div className="p-6 bg-white space-y-1">
              <h3 className="text-xl font-bold text-sky-950 break-words">{selectedImage.title}</h3>
              <p className="text-sm text-sky-500 break-words"><span className="font-semibold text-sky-600">Name:</span> {selectedImage.imageName || 'No Name'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}