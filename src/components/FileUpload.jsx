import React, { useRef } from 'react'
import './FileUpload.css'

const FileUpload = ({ onFileUpload }) => {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'text/csv') {
      onFileUpload(file)
    } else {
      alert('Please upload a valid CSV file')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'text/csv') {
      onFileUpload(file)
    } else {
      alert('Please upload a valid CSV file')
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  return (
    <div className="file-upload-section">
      <div
        className="file-upload-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current.click()}
      >
        <div className="upload-icon">📁</div>
        <h3>Upload CSV File</h3>
        <p>Drag and drop your CSV file here, or click to browse</p>
        <div className="file-requirements">
          <p>Required columns: First Name, Last Name, Email, Title, Company Name, Company Domain, Industry, LinkedIn Profile, Disc Analysis</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}

export default FileUpload
