import { useDropzone } from 'react-dropzone'
import { useCallback, useRef } from 'react'
import axios from 'axios'

function Sidebar({ isOpen, onClose }) {
  const fileInputRef = useRef(null)

  const onDrop = useCallback(acceptedFiles => {
    // Handle file drop (if needed)
    console.log('Files dropped:', acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true, // Disable click-to-select behavior since we'll handle it manually
    noKeyboard: true
  })

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileUpload = async event => {
    const file = event.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log(response.data)
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  return (
    <div
      className={`fixed left-0 top-0 w-64 h-full bg-gray-900 text-white transition-transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <button onClick={onClose} className='absolute top-4 right-4 text-white'>
        X
      </button>
      <div className='p-4 my-12'>
        <div
          {...getRootProps()}
          className='border-2 border-dashed border-gray-600 p-4 text-center cursor-pointer'
        >
          <input
            {...getInputProps()}
            type='file'
            accept='.pdf'
            ref={fileInputRef}
            onChange={handleFileUpload} // Handle file selection and upload
            style={{ display: 'none' }} // Hide the default file input
          />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
          <button
            className='mt-2 bg-blue-600 text-white px-4 py-2 rounded'
            onClick={handleFileSelect} // Open file picker on button click
          >
            Browse File
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
