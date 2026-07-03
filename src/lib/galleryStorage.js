export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export function createGalleryItem({ title, imageName, image, id }) {
  return {
    id: id || Date.now().toString(), 
    title: title,
    imageName: imageName || 'No Name', 
    image: image,
    createdAt: new Date().toISOString()
  }
}

export function loadGalleryItems() {
  if (typeof window === 'undefined') return []
  const saved = localStorage.getItem('gallery_items')
  return saved ? JSON.parse(saved) : []
}

export function saveGalleryItems(items) {
  if (typeof window === 'undefined') return
  localStorage.setItem('gallery_items', JSON.stringify(items))
}

export function sanitizeFilename(name) {
  return name ? name.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'image'
}

export function downloadImage(base64Data, filename) {
  const link = document.createElement('a')
  link.href = base64Data
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}