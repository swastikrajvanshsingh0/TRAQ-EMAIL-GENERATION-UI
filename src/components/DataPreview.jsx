import React, { useState } from 'react'
import './DataPreview.css'

const DataPreview = ({ data, onGenerate, isProcessing, currentRow }) => {
  const [showAll, setShowAll] = useState(false)
  const displayData = showAll ? data : data.slice(0, 5)

  const getColumns = () => {
    if (data.length === 0) return []
    return Object.keys(data[0])
  }

  const columns = getColumns()

  return (
    <div className="data-preview-section">
      <div className="preview-header">
        <div>
          <h2>Data Preview</h2>
          <p className="preview-subtitle">
            {data.length} row{data.length !== 1 ? 's' : ''} will be processed
          </p>
        </div>
          <button
            className="generate-btn"
            onClick={onGenerate}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="spinner"></span>
                Processing {currentRow}/{data.length}...
              </>
            ) : (
              <>
                Generate Personalized Emails
              </>
            )}
          </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              {columns.map((col, idx) => (
                <th key={idx}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.map((row, rowIdx) => (
              <tr key={rowIdx}>
                <td className="row-number">{rowIdx + 1}</td>
                {columns.map((col, colIdx) => (
                  <td key={colIdx} title={row[col]}>
                    {row[col] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length > 5 && (
        <div className="show-more-section">
          <button
            className="show-more-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show All ${data.length} Rows`}
          </button>
        </div>
      )}
    </div>
  )
}

export default DataPreview
