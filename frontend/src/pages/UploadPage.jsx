import Sidebar from '../components/Sidebar'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadFile, getMyFiles, deleteFile } from '../api/files'

function UploadPage() {
  const navigate     = useNavigate()
  const fileInputRef = useRef(null)
  const [dragOver, setDragOver]   = useState(false)
  const [files, setFiles]         = useState([])       // selected files ready to upload
  const [myFiles, setMyFiles]     = useState([])       // already uploaded files from DB
  const [uploading, setUploading] = useState(false)
  const [message, setMessage]     = useState('')
  const [loadingFiles, setLoadingFiles] = useState(true)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // Fetch already uploaded files on page load
  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const res = await getMyFiles()
      setMyFiles(res.data)
    } catch (err) {
      if (err.response?.status === 401) { localStorage.clear(); navigate('/') }
    } finally {
      setLoadingFiles(false)
    }
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileType = (name) => name.split('.').pop().toUpperCase()

  const typeColor = (type) => {
    const map = {
      PDF: 'bg-red-100 text-red-600', ZIP: 'bg-yellow-100 text-yellow-600',
      PNG: 'bg-green-100 text-green-600', JPG: 'bg-green-100 text-green-600',
      SQL: 'bg-blue-100 text-blue-600', MP4: 'bg-purple-100 text-purple-600',
    }
    return map[type] || 'bg-gray-100 text-gray-600'
  }

  const addFiles = (incoming) => {
    const newFiles = Array.from(incoming).map(f => ({
      id: Math.random().toString(36).slice(2),
      file: f, name: f.name, size: f.size,
    }))
    setFiles(prev => [...prev, ...newFiles])
    setMessage('')
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    addFiles(e.dataTransfer.files)
  }

  const removeSelected = (id) => setFiles(prev => prev.filter(f => f.id !== id))

  const handleUpload = async () => {
    if (files.length === 0) return
    setUploading(true)
    setMessage('')
    let successCount = 0

    for (const f of files) {
      try {
        const formData = new FormData()
        formData.append('file', f.file)
        await uploadFile(formData)
        successCount++
      } catch (err) {
        console.error('Upload error for', f.name, err)
      }
    }

    setFiles([])
    setMessage(`✅ ${successCount} file(s) uploaded successfully!`)
    fetchFiles()   // refresh the uploaded files list
    setUploading(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return
    try {
      await deleteFile(id)
      setMyFiles(prev => prev.filter(f => f._id !== id))
      setMessage('🗑️ File deleted successfully.')
    } catch (err) {
      setMessage('❌ Failed to delete file.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">File Upload</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 text-sm font-bold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-sm text-gray-600 hidden sm:block">{user?.name || 'User'}</span>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 max-w-3xl w-full mx-auto">

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
              dragOver ? 'border-violet-400 bg-violet-50' : 'border-gray-300 bg-white hover:border-violet-300 hover:bg-violet-50'
            }`}
          >
            <input ref={fileInputRef} type="file" multiple className="hidden"
              onChange={e => addFiles(e.target.files)} />
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-violet-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-gray-700 font-semibold">{dragOver ? 'Drop files here!' : 'Drag & drop files here'}</p>
                <p className="text-sm text-gray-400 mt-1">or click to browse</p>
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Max 50 MB per file</span>
            </div>
          </div>

          {/* Selected files ready to upload */}
          {files.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">{files.length} file(s) ready to upload</span>
                <button onClick={() => setFiles([])} className="text-xs text-red-400 hover:underline">Clear all</button>
              </div>
              <div className="divide-y divide-gray-50">
                {files.map(f => (
                  <div key={f.id} className="px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${typeColor(getFileType(f.name))}`}>
                        {getFileType(f.name)}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{f.name}</p>
                        <p className="text-xs text-gray-400">{formatSize(f.size)}</p>
                      </div>
                    </div>
                    <button onClick={() => removeSelected(f.id)} className="text-gray-300 hover:text-red-400">✕</button>
                  </div>
                ))}
              </div>
              <div className="px-5 py-4 border-t border-gray-100">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-colors ${
                    uploading ? 'bg-violet-300 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'
                  }`}
                >
                  {uploading ? 'Uploading...' : `Upload ${files.length} File(s)`}
                </button>
              </div>
            </div>
          )}

          {/* Success/error message */}
          {message && (
            <div className="text-center text-sm font-medium py-3 px-5 rounded-xl bg-green-50 text-green-600">
              {message}
            </div>
          )}

          {/* Already uploaded files from DB */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-700">Your Uploaded Files ({myFiles.length})</span>
            </div>
            {loadingFiles ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm animate-pulse">Loading files...</div>
            ) : myFiles.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">No files uploaded yet.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {myFiles.map(file => (
                  <div key={file._id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${typeColor(getFileType(file.originalName))}`}>
                        {getFileType(file.originalName)}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{file.originalName}</p>
                        <p className="text-xs text-gray-400">
                          {formatSize(file.size)} · {new Date(file.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="text-xs text-red-400 hover:text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}

export default UploadPage