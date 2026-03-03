import React, { useEffect, useState, useRef, useMemo } from 'react'
import './ProcessingScreen.css'

const NODE_H = 28
const NODE_H_SM = 24

const stages = [
  { id: 'normalize', label: 'Normalize Data', icon: '🔄', row: 0, col: 'center' },
  { id: 'branch1', label: 'Parallel Branch', icon: '🔀', row: 1, col: 'center' },
  { id: 'linkedin', label: 'LinkedIn Enrich', icon: '💼', row: 2, col: 'left' },
  { id: 'firecrawl', label: 'Website Scrape', icon: '🔍', row: 2, col: 'right' },
  { id: 'persona', label: 'AI Persona', icon: '🧠', row: 3, col: 'center' },
  { id: 'branch2', label: 'Email Branch', icon: '✉️', row: 4, col: 'center' },
  { id: 'email1', label: 'V1', icon: '1', row: 5, col: 'v1', variant: true },
  { id: 'email2', label: 'V2', icon: '2', row: 5, col: 'v2', variant: true },
  { id: 'email3', label: 'V3', icon: '3', row: 5, col: 'v3', variant: true },
  { id: 'email4', label: 'V4', icon: '4', row: 5, col: 'v4', variant: true },
  { id: 'email5', label: 'V5', icon: '5', row: 5, col: 'v5', variant: true },
  { id: 'email6', label: 'V6', icon: '6', row: 5, col: 'v6', variant: true },
  { id: 'merge', label: 'Finalize', icon: '✅', row: 6, col: 'center' }
]

const rowY = [20, 80, 140, 200, 260, 320, 380]
const colX = {
  center: 350, left: 180, right: 520,
  v1: 75, v2: 175, v3: 275, v4: 425, v5: 525, v6: 625
}

const getNodePos = (id) => {
  const s = stages.find(st => st.id === id)
  if (!s) return { x: 350, y: 20 }
  return { x: colX[s.col], y: rowY[s.row] }
}

const getNodeH = (id) => {
  const s = stages.find(st => st.id === id)
  return s?.variant ? NODE_H_SM : NODE_H
}

const makePath = (fromId, toId) => {
  const from = getNodePos(fromId)
  const to = getNodePos(toId)
  const fromBottom = from.y + getNodeH(fromId)
  const toTop = to.y
  if (from.x === to.x) return `M${from.x} ${fromBottom} L${to.x} ${toTop}`
  const midY = Math.round((fromBottom + toTop) / 2)
  return `M${from.x} ${fromBottom} L${from.x} ${midY} L${to.x} ${midY} L${to.x} ${toTop}`
}

const ProcessingScreen = ({ isProcessing, totalRows, completedCount }) => {
  const [elapsed, setElapsed] = useState(0)
  const [activeNodes, setActiveNodes] = useState(new Set())
  const [completedNodes, setCompletedNodes] = useState(new Set())
  const [visibleNodes, setVisibleNodes] = useState(new Set())
  const [activeConnections, setActiveConnections] = useState(new Set())
  const [currentStage, setCurrentStage] = useState('')
  const timerRef = useRef(null)
  const startTimeRef = useRef(null)
  const flowUrl = import.meta.env.VITE_LAMATIC_FLOW_URL || 'https://lamatic.ai'

  const connections = useMemo(() => [
    { id: 'c1', from: 'normalize', to: 'branch1' },
    { id: 'c2a', from: 'branch1', to: 'linkedin' },
    { id: 'c2b', from: 'branch1', to: 'firecrawl' },
    { id: 'c3a', from: 'linkedin', to: 'persona' },
    { id: 'c3b', from: 'firecrawl', to: 'persona' },
    { id: 'c4', from: 'persona', to: 'branch2' },
    { id: 'c5a', from: 'branch2', to: 'email1' },
    { id: 'c5b', from: 'branch2', to: 'email2' },
    { id: 'c5c', from: 'branch2', to: 'email3' },
    { id: 'c5d', from: 'branch2', to: 'email4' },
    { id: 'c5e', from: 'branch2', to: 'email5' },
    { id: 'c5f', from: 'branch2', to: 'email6' },
    { id: 'c6a', from: 'email1', to: 'merge' },
    { id: 'c6b', from: 'email2', to: 'merge' },
    { id: 'c6c', from: 'email3', to: 'merge' },
    { id: 'c6d', from: 'email4', to: 'merge' },
    { id: 'c6e', from: 'email5', to: 'merge' },
    { id: 'c6f', from: 'email6', to: 'merge' },
  ], [])

  useEffect(() => {
    if (isProcessing) {
      startTimeRef.current = Date.now()
      setElapsed(0)
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = null
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isProcessing])

  useEffect(() => {
    if (!isProcessing) {
      setActiveNodes(new Set())
      setCompletedNodes(new Set())
      setVisibleNodes(new Set())
      setActiveConnections(new Set())
      setCurrentStage('')
      return
    }

    const sequence = [
      { nodes: ['normalize'], conns: [], stage: 'Normalizing prospect data...', completeDelay: 800, nextDelay: 200 },
      { nodes: ['branch1'], conns: ['c1'], stage: 'Branching to parallel enrichment...', completeDelay: 600, nextDelay: 200 },
      { nodes: ['linkedin', 'firecrawl'], conns: ['c2a', 'c2b'], stage: 'Enriching from LinkedIn & website...', completeDelay: 4000, nextDelay: 500 },
      { nodes: ['persona'], conns: ['c3a', 'c3b'], stage: 'AI analyzing persona & strategy...', completeDelay: 3500, nextDelay: 500 },
      { nodes: ['branch2'], conns: ['c4'], stage: 'Branching to 6 email generators...', completeDelay: 700, nextDelay: 200 },
      { nodes: ['email1', 'email2', 'email3', 'email4', 'email5', 'email6'], conns: ['c5a', 'c5b', 'c5c', 'c5d', 'c5e', 'c5f'], stage: 'Generating 6 unique email variants...', completeDelay: 25000, nextDelay: 500 },
      { nodes: ['merge'], conns: ['c6a', 'c6b', 'c6c', 'c6d', 'c6e', 'c6f'], stage: 'Finalizing and formatting results...', completeDelay: 2000, nextDelay: 0 }
    ]

    const timers = []
    let cumulativeDelay = 0

    sequence.forEach(({ nodes, conns, stage, completeDelay, nextDelay }) => {
      timers.push(setTimeout(() => {
        setCurrentStage(stage)
        setActiveConnections(prev => { const s = new Set(prev); conns.forEach(c => s.add(c)); return s })
        setVisibleNodes(prev => { const s = new Set(prev); nodes.forEach(n => s.add(n)); return s })
        setActiveNodes(prev => { const s = new Set(prev); nodes.forEach(n => s.add(n)); return s })
      }, cumulativeDelay))

      cumulativeDelay += completeDelay

      timers.push(setTimeout(() => {
        setCompletedNodes(prev => { const s = new Set(prev); nodes.forEach(n => s.add(n)); return s })
        setActiveNodes(prev => { const s = new Set(prev); nodes.forEach(n => s.delete(n)); return s })
      }, cumulativeDelay))

      cumulativeDelay += nextDelay
    })

    return () => timers.forEach(t => clearTimeout(t))
  }, [isProcessing])

  if (!isProcessing) return null

  const pct = totalRows > 0 ? Math.round((completedCount / totalRows) * 100) : 0
  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const secs = String(elapsed % 60).padStart(2, '0')

  return (
    <div className="ps-overlay">
      <div className="ps-backdrop" />
      <div className="ps-modal">
        {/* Header */}
        <div className="ps-header">
          <div>
            <h2 className="ps-title">AI Email Generation Pipeline</h2>
            <p className="ps-sub">
              Processing {totalRows} prospect{totalRows !== 1 ? 's' : ''} in parallel
            </p>
          </div>
          <div className="ps-header-right">
            <a
              href={flowUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ps-flow-link"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              View Workflow
            </a>
            <div className="ps-timer-badge">
              <div className="ps-spinner" />
              <span>{mins}:{secs}</span>
            </div>
          </div>
        </div>

        {/* Flow Visualization */}
        <div className="ps-flow-canvas">
          <svg viewBox="0 0 700 410" className="ps-flow-svg" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            {connections.map(conn => {
              const path = makePath(conn.from, conn.to)
              const isActive = activeConnections.has(conn.id)
              const el = document.createElementNS('http://www.w3.org/2000/svg', 'path')
              el.setAttribute('d', path)
              const pathLen = el.getTotalLength ? el.getTotalLength() : 300
              return (
                <g key={conn.id}>
                  <path d={path} className="ps-conn-bg" />
                  {isActive && (
                    <>
                      <path d={path} className="ps-conn-active" style={{ strokeDasharray: pathLen, strokeDashoffset: pathLen }} />
                      <circle r="2.5" className="ps-conn-dot">
                        <animateMotion dur="2.5s" repeatCount="indefinite" path={path} />
                      </circle>
                    </>
                  )}
                </g>
              )
            })}
          </svg>
          <div className="ps-flow-nodes">
            {stages.map(stage => {
              const isActive = activeNodes.has(stage.id)
              const isCompleted = completedNodes.has(stage.id)
              const isVisible = visibleNodes.has(stage.id)
              const pos = getNodePos(stage.id)
              return (
                <div
                  key={stage.id}
                  className={`ps-fnode ${stage.variant ? 'sm' : ''} ${isVisible ? 'show' : ''} ${isActive ? 'active' : ''} ${isCompleted ? 'done' : ''}`}
                  style={{ left: `${(pos.x / 700) * 100}%`, top: `${(pos.y / 410) * 100}%` }}
                >
                  <span className="ps-fnode-icon">{stage.icon}</span>
                  <span className="ps-fnode-label">{stage.label}</span>
                  {isCompleted && <span className="ps-fnode-check">✓</span>}
                  {isActive && <div className="ps-fnode-bar-wrap"><div className="ps-fnode-bar" /></div>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Progress Section */}
        <div className="ps-progress-section">
          <div className="ps-progress-info">
            <div className="ps-progress-stats">
              <span className="ps-progress-count">{completedCount} of {totalRows}</span>
              <span className="ps-progress-label">rows completed</span>
            </div>
            <span className="ps-progress-pct">{pct}%</span>
          </div>
          <div className="ps-progress-wrap">
            <div className="ps-progress-bar" style={{ width: `${pct}%` }}>
              <div className="ps-progress-glow" />
            </div>
          </div>
          <div className="ps-rows">
            {Array.from({ length: totalRows }, (_, i) => (
              <div key={i} className={`ps-row-dot ${i < completedCount ? 'done' : 'pending'}`} title={`Row ${i + 1}`} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="ps-footer">
          <div className="ps-footer-left">
            <div className="ps-pulse" />
            <span>{currentStage || 'Initializing pipeline...'}</span>
          </div>
          <span className="ps-footer-hint">All rows processing simultaneously</span>
        </div>
      </div>
    </div>
  )
}

export default ProcessingScreen
