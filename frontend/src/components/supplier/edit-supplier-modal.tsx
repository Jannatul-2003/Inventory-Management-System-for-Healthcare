import React from "react"
import { X } from "lucide-react"
// import type { SupplierUpdate, SupplierResponse } from "../../types/index.ts"

interface EditSupplierModalProps {
  showEditModal: boolean
  setShowEditModal: (show: boolean) => void
  editSupplierId: number | null
  setEditSupplierId: (id: number | null) => void
  editSupplierError: string | null
  editSupplierName: string | null
  setEditSupplierName: (name: string | null) => void
  editSupplierContact: string | null
  setEditSupplierContact: (contact: string | null) => void
  handleUpdateSupplier: () => void
}

const EditSupplierModal: React.FC<EditSupplierModalProps> = ({
  showEditModal,
  setShowEditModal,
  editSupplierId,
  setEditSupplierId,
  editSupplierError,
  editSupplierName,
  setEditSupplierName,
  editSupplierContact,
  setEditSupplierContact,
  handleUpdateSupplier,
}) => {
  if (!showEditModal) return null

  return (
    <div className="p-4 bg-gray-50 border border-gray-200">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 h-auto max-h-screen overflow-y-auto">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white">
      <h3 className="text-lg font-semibold ">Edit Supplier - #{editSupplierId}</h3>
          <button
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => {
              setShowEditModal(false)
              setEditSupplierId(null)
            }}
          >
            <X size={20} />
          </button>
        </div>

        {editSupplierError && (
          <div className="mx-4 mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
            {editSupplierError}
          </div>
        )}

<div className="p-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 ">
              Supplier Name 
            </label>
            <div className="mt-5" >
              <input
                type="text"
                value={editSupplierName || ""}
                onChange={(e) => setEditSupplierName(e.target.value)}
                className="input w-128"
                required
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Info
            </label>
            <div className="mt-5">
              <input
                type="text"
                value={editSupplierContact || ""}
                onChange={(e) => setEditSupplierContact(e.target.value)}
                className="input w-64"
                required
              />
            </div>
          </div>
        </div>

        <div className="px-5 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200 sticky bottom-0 rounded-b-lg">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setShowEditModal(false)
              setEditSupplierId(null)
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleUpdateSupplier}
          >
            Update Supplier
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditSupplierModal

// import React from "react"
// import { X } from "lucide-react"
// // import type { SupplierUpdate, SupplierResponse } from "../../types/index.ts"

// interface EditSupplierModalProps {
//   showEditModal: boolean
//   setShowEditModal: (show: boolean) => void
//   editSupplierId: number | null
//   setEditSupplierId: (id: number | null) => void
//   editSupplierError: string | null
//   editSupplierName: string | null
//   setEditSupplierName: (name: string | null) => void
//   editSupplierContact: string | null
//   setEditSupplierContact: (contact: string | null) => void
//   handleUpdateSupplier: () => void
// }

// const EditSupplierModal: React.FC<EditSupplierModalProps> = ({
//   showEditModal,
//   setShowEditModal,
//   editSupplierId,
//   setEditSupplierId,
//   editSupplierError,
//   editSupplierName,
//   setEditSupplierName,
//   editSupplierContact,
//   setEditSupplierContact,
//   handleUpdateSupplier,
// }) => {
//   if (!showEditModal) return null

//   return (
//     <div className="p-4 bg-gray-50 bSupplier-b bSupplier-gray-200">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 h-auto max-h-screen overflow-y-auto">
//         <div className="flex justify-between items-center p-4 bSupplier-b bSupplier-gray-200 sticky top-0 bg-white">
//           <h3 className="text-lg font-semibold text-gray-800">Edit Supplier - #{editSupplierId}</h3>
//           <button
//             className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
//             onClick={() => {
//               setShowEditModal(false)
//               setEditSupplierId(null)
//             }}
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {editSupplierError && (
//           <div className="mx-4 mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm bSupplier bSupplier-red-200">
//             {editSupplierError}
//           </div>
//         )}

//         <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Supplier Name 
//             </label>
//             <div className="relative">
//               <input
//                 type="text"
//                 value={editSupplierName || ""}
//                 onChange={(e) => setEditSupplierName(e.target.value)}
//                 className="input"
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Contact Info
//             </label>
//             <div className="relative">
//               <input
//                 type="text"
//                 value={editSupplierContact || ""}
//                 onChange={(e) => setEditSupplierContact(e.target.value)}
//                 className="input"
//                 required
//               />
//             </div>
//           </div>
//         </div>

//         <div className="px-5 py-4 bg-gray-50 flex justify-end space-x-3 bSupplier-t bSupplier-gray-200 sticky bottom-0 rounded-b-lg">
//           <button
//             type="button"
//             className="btn btn-secondary"
//             onClick={() => {
//               setShowEditModal(false)
//               setEditSupplierId(null)
//             }}
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             className="btn btn-primary"
//             onClick={handleUpdateSupplier}
//           >
//             Update Supplier
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EditSupplierModal

