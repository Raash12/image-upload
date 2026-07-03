export default function AdminGalleryList({ items = [], onEditSelect, onDelete }) {
  
  const handleDeleteConfirm = (id) => {
    if (window.confirm('Ma hubaal inaad rabto inaad tirtirto sawirkan?')) {
      onDelete(id)
    }
  }

  return (
    <div className="w-full rounded-lg border border-sky-200 bg-white text-sky-950 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-sky-100 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-sky-800">Admin Dashboard: Gallery Items</h3>
          <p className="text-[11px] sm:text-xs text-sky-500 mt-0.5">Manage, update, or remove pictures from the public view.</p>
        </div>
        <span className="self-start sm:self-center bg-sky-100 text-sky-800 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
          Total: {items.length} Images
        </span>
      </div>

      {items.length === 0 ? (
        <div className="p-8 text-center text-sky-400 text-sm">No items found. Upload an image to start.</div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm text-sky-900">
            <thead className="bg-sky-50 text-xs uppercase text-sky-700 font-semibold">
              <tr>
                <th className="px-4 py-3 w-20">Preview</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Image Name</th>
                <th className="px-4 py-3 text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-sky-50/50 transition">
                  <td className="px-4 py-3">
                    <div className="h-10 w-10 rounded-md overflow-hidden bg-sky-100 border border-sky-200 flex-shrink-0">
                      <img src={item.image} alt="" className="h-full w-full object-cover" />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-sky-950 max-w-[150px] truncate">
                    {item.title}
                  </td>
                  <td className="px-4 py-3 text-sky-600 max-w-[200px] truncate">
                    {item.imageName && item.imageName.trim() !== "" ? (
                      item.imageName
                    ) : (
                      <span className="text-sky-300 italic">No Name</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => onEditSelect(item)}
                        className="inline-flex h-7 items-center justify-center rounded-md border border-sky-300 bg-white px-2.5 text-xs font-medium text-sky-700 hover:bg-sky-50 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm(item.id)}
                        className="inline-flex h-7 items-center justify-center rounded-md bg-rose-50 px-2.5 text-xs font-medium text-rose-600 hover:bg-rose-100 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}