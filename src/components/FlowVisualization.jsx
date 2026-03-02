import React, { useEffect, useState, useMemo } from 'react'
import './FlowVisualization.css'

const NODE_H = 28
const NODE_H_SM = 24

const FlowVisualization = ({ isProcessing, onComplete, totalRows, currentRow }) => {
  const [activeNodes, setActiveNodes] = useState(new Set())
  const [completedNodes, setCompletedNodes] = useState(new Set())
  const [visibleNodes, setVisibleNodes] = useState(new Set())
  const [activeConnections, setActiveConnections] = useState(new Set())
  const [currentStage, setCurrentStage] = useState('')

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

    if (from.x === to.x) {
      return `M${from.x} ${fromBottom} L${to.x} ${toTop}`
    }
    const midY = Math.round((fromBottom + toTop) / 2)
    return `M${from.x} ${fromBottom} L${from.x} ${midY} L${to.x} ${midY} L${to.x} ${toTop}`
  }

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
      const activateTimer = setTimeout(() => {
        setCurrentStage(stage)
        setActiveConnections(prev => {
          const newSet = new Set(prev)
          conns.forEach(c => newSet.add(c))
          return newSet
        })
        setVisibleNodes(prev => {
          const newSet = new Set(prev)
          nodes.forEach(node => newSet.add(node))
          return newSet
        })
        setActiveNodes(prev => {
          const newSet = new Set(prev)
          nodes.forEach(node => newSet.add(node))
          return newSet
        })
      }, cumulativeDelay)
      timers.push(activateTimer)

      cumulativeDelay += completeDelay

      const completeTimer = setTimeout(() => {
        setCompletedNodes(prev => {
          const newSet = new Set(prev)
          nodes.forEach(node => newSet.add(node))
          return newSet
        })
        setActiveNodes(prev => {
          const newSet = new Set(prev)
          nodes.forEach(node => newSet.delete(node))
          return newSet
        })
      }, cumulativeDelay)
      timers.push(completeTimer)

      cumulativeDelay += nextDelay
    })

    return () => timers.forEach(timer => clearTimeout(timer))
  }, [isProcessing])

  if (!isProcessing) return null

  return (
    <div className="flow-overlay">
      <div className="flow-backdrop"></div>
      <div className="flow-modal">
        <div className="flow-header">
          <div>
            <h2 className="flow-title">AI Email Generation Pipeline</h2>
            <p className="flow-sub">Processing {totalRows} prospect{totalRows !== 1 ? 's' : ''} &middot; Row {currentRow} of {totalRows}</p>
          </div>
          <div className="flow-badge">
            <div className="flow-spinner"></div>
            <span>Processing...</span>
          </div>
        </div>

        <div className="flow-canvas">
          <svg viewBox="0 0 700 410" className="flow-svg" preserveAspectRatio="xMidYMid meet">
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
                  <path d={path} className="conn-bg" />
                  {isActive && (
                    <>
                      <path
                        d={path}
                        className="conn-active"
                        style={{ strokeDasharray: pathLen, strokeDashoffset: pathLen }}
                      />
                      <circle r="2.5" className="conn-dot">
                        <animateMotion dur="2.5s" repeatCount="indefinite" path={path} />
                      </circle>
                    </>
                  )}
                </g>
              )
            })}
          </svg>

          <div className="flow-nodes">
            {stages.map(stage => {
              const isActive = activeNodes.has(stage.id)
              const isCompleted = completedNodes.has(stage.id)
              const isVisible = visibleNodes.has(stage.id)
              const pos = getNodePos(stage.id)

              return (
                <div
                  key={stage.id}
                  className={`fnode ${stage.variant ? 'sm' : ''} ${isVisible ? 'show' : ''} ${isActive ? 'active' : ''} ${isCompleted ? 'done' : ''}`}
                  style={{ left: `${(pos.x / 700) * 100}%`, top: `${(pos.y / 410) * 100}%` }}
                >
                  <span className="fnode-icon">{stage.icon}</span>
                  <span className="fnode-label">{stage.label}</span>
                  {isCompleted && <span className="fnode-check">✓</span>}
                  {isActive && <div className="fnode-bar-wrap"><div className="fnode-bar"></div></div>}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flow-footer">
          <div className="flow-stage-text">
            <span className="flow-bolt">⚡</span>
            {currentStage}
          </div>
          <span className="flow-eta">Est. 40-60s</span>
        </div>
      </div>
    </div>
  )
}

export default FlowVisualization
