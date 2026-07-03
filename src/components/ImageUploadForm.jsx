import { useRef, useState, useEffect } from 'react'
import { createGalleryItem, fileToBase64 } from '@/lib/galleryStorage'

export default function ImageUploadForm({ 
  onUpload, 
  onDelete, 
  initialData = null,
  onCancel 
}) {
  const fileInputRef = useRef(null)
  const [title, setTitle] = useState('')
  const [imageName, setImageName] = useState('') 
  const [preview, setPreview] = useState('')
  const [imageData, setImageData] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isEditing = !!initialData

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setImageName(initialData.imageName || '') 
      setPreview(initialData.image || '')
      setImageData(initialData.image || '')
      setError('')
      setSuccess('')
    } else {
      resetForm()
    }
  }, [initialData])

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      setError('Only JPG and PNG allowed.')
      return
    }
    const base64 = await fileToBase64(file)
    setImageData(base64)
    setPreview(base64)
    setImageName(file.name) // Halkan wuxuu si toos ah u qabanayaa magaca file-ka sawirka
  }

  const resetForm = () => {
    setTitle('')
    setImageName('')
    setPreview('')
    setImageData('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!imageData || !title.trim()) {
      setError('Please provide an image and a title.')
      return
    }

    setSubmitting(true)
    try {
      let payload;
      if (isEditing) {
        payload = {
          id: initialData.id, 
          title: title.trim(),
          imageName: imageName.trim(), 
          image: imageData
        }
      } else {
        payload = createGalleryItem({ 
          title: title.trim(),
          imageName: imageName.trim(), 
          image: imageData 
        })
      }
      
      onUpload(payload)
      setSuccess(isEditing ? 'Updated successfully!' : 'Uploaded successfully!')
      if (!isEditing) resetForm()
    } catch (err) {
      setError('Failed to save.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full rounded-lg border border-sky-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-sky-700">{isEditing ? 'Edit Image' : 'Upload Image'}</h3>
        {isEditing && (
          <button type="button" onClick={onCancel} className="text-xs text-sky-500 hover:underline">
            Cancel Edit
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full aspect-video border-2 border-dashed border-sky-300 rounded-md flex items-center justify-center bg-sky-50 overflow-hidden">
          {preview ? <img src={preview} className="h-full w-full object-cover" alt="Preview" /> : <span>Select Image</span>}
        </button>
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleImageChange} />

        <div>
          <label className="text-xs font-medium text-sky-600 block mb-1">Image Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter Title" className="w-full p-2 border rounded text-sm focus:outline-sky-500" />
        </div>

        <div>
          <label className="text-xs font-medium text-sky-600 block mb-1">Image File Name</label>
          <input value={imageName} onChange={(e) => setImageName(e.target.value)} placeholder="Image Name" className="w-full p-2 border rounded text-sm bg-slate-50 focus:outline-sky-500" />
        </div>

        {error && <p className="text-rose-600 text-sm">{error}</p>}
        {success && <p className="text-sky-600 text-sm">{success}</p>}

        <div className="flex gap-2">
          {isEditing && <button type="button" onClick={() => onDelete(initialData.id)} className="bg-rose-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-rose-700 transition">Delete</button>}
          <button type="submit" disabled={submitting} className="bg-sky-600 text-white px-6 py-2 rounded flex-1 text-sm font-medium hover:bg-sky-700 transition">
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}