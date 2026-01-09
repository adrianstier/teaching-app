import React from 'react';
import { motion } from 'framer-motion';

type DiagramType =
  | 'forgettingCurve'
  | 'cognitiveLoadBars'
  | 'learningPyramid'
  | 'growthMindsetComparison'
  | 'transferBridge'
  | 'feedbackLoop'
  | 'spacingEffect'
  | 'zoneOfProximalDevelopment';

interface ConceptDiagramProps {
  type: DiagramType;
  className?: string;
  showLabels?: boolean;
  animated?: boolean;
}

const ConceptDiagram: React.FC<ConceptDiagramProps> = ({
  type,
  className = '',
  showLabels = true,
  animated = true,
}) => {
  const diagrams: Record<DiagramType, React.ReactElement> = {
    // The Forgetting Curve with Spaced Repetition
    forgettingCurve: (
      <svg viewBox="0 0 400 200" className={`w-full ${className}`}>
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E5E7EB" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="200" fill="url(#grid)" />

        {/* Axes */}
        <line x1="50" y1="170" x2="380" y2="170" stroke="#6B7280" strokeWidth="2" />
        <line x1="50" y1="170" x2="50" y2="20" stroke="#6B7280" strokeWidth="2" />

        {/* Axis labels */}
        {showLabels && (
          <>
            <text x="215" y="195" textAnchor="middle" className="text-xs fill-gray-500">Time</text>
            <text x="25" y="95" textAnchor="middle" transform="rotate(-90, 25, 95)" className="text-xs fill-gray-500">Memory</text>
          </>
        )}

        {/* Original forgetting curve (dashed) */}
        <motion.path
          d="M 50 30 Q 100 100, 150 140 Q 200 155, 250 160 Q 300 165, 380 168"
          fill="none"
          stroke="#DC6B6B"
          strokeWidth="2"
          strokeDasharray="5,5"
          initial={animated ? { pathLength: 0 } : {}}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Spaced repetition curve */}
        <motion.path
          d="M 50 30 Q 70 60, 90 80 L 90 35 Q 110 55, 130 70 L 130 40 Q 160 55, 190 65 L 190 45 Q 240 55, 290 60 L 290 50 Q 340 55, 380 58"
          fill="none"
          stroke="#5B8A72"
          strokeWidth="2.5"
          initial={animated ? { pathLength: 0 } : {}}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
        />

        {/* Review markers */}
        {[90, 130, 190, 290].map((x, i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={35 + i * 5}
            r="4"
            fill="#5B8A72"
            initial={animated ? { scale: 0 } : {}}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 + i * 0.3 }}
          />
        ))}

        {/* Legend */}
        {showLabels && (
          <>
            <line x1="250" y1="15" x2="280" y2="15" stroke="#DC6B6B" strokeWidth="2" strokeDasharray="5,5" />
            <text x="285" y="18" className="text-[10px] fill-gray-600">Without review</text>
            <line x1="250" y1="30" x2="280" y2="30" stroke="#5B8A72" strokeWidth="2" />
            <text x="285" y="33" className="text-[10px] fill-gray-600">With spacing</text>
          </>
        )}
      </svg>
    ),

    // Cognitive Load Bars
    cognitiveLoadBars: (
      <svg viewBox="0 0 400 180" className={`w-full ${className}`}>
        {/* Working Memory Container */}
        <rect x="20" y="20" width="360" height="80" rx="8" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="2" />
        {showLabels && (
          <text x="200" y="115" textAnchor="middle" className="text-xs fill-gray-500">Working Memory Capacity</text>
        )}

        {/* Intrinsic Load */}
        <motion.rect
          x="30"
          y="30"
          width="100"
          height="60"
          rx="4"
          fill="#6B7280"
          initial={animated ? { scaleX: 0 } : {}}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
          style={{ transformOrigin: 'left' }}
        />
        {showLabels && (
          <text x="80" y="65" textAnchor="middle" className="text-[10px] fill-white font-medium">Intrinsic</text>
        )}

        {/* Extraneous Load */}
        <motion.rect
          x="135"
          y="30"
          width="80"
          height="60"
          rx="4"
          fill="#DC6B6B"
          initial={animated ? { scaleX: 0 } : {}}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ transformOrigin: 'left' }}
        />
        {showLabels && (
          <text x="175" y="65" textAnchor="middle" className="text-[10px] fill-white font-medium">Extraneous</text>
        )}

        {/* Germane Load */}
        <motion.rect
          x="220"
          y="30"
          width="90"
          height="60"
          rx="4"
          fill="#5B8A72"
          initial={animated ? { scaleX: 0 } : {}}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ transformOrigin: 'left' }}
        />
        {showLabels && (
          <text x="265" y="65" textAnchor="middle" className="text-[10px] fill-white font-medium">Germane</text>
        )}

        {/* Remaining capacity */}
        <motion.rect
          x="315"
          y="30"
          width="55"
          height="60"
          rx="4"
          fill="#E5E7EB"
          stroke="#D1D5DB"
          strokeWidth="1"
          strokeDasharray="4,4"
          initial={animated ? { opacity: 0 } : {}}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        />
        {showLabels && (
          <text x="342" y="65" textAnchor="middle" className="text-[10px] fill-gray-400">Free</text>
        )}

        {/* Labels below */}
        {showLabels && (
          <>
            <circle cx="50" cy="140" r="6" fill="#6B7280" />
            <text x="62" y="144" className="text-[10px] fill-gray-600">Inherent complexity</text>

            <circle cx="170" cy="140" r="6" fill="#DC6B6B" />
            <text x="182" y="144" className="text-[10px] fill-gray-600">Poor design (reduce)</text>

            <circle cx="300" cy="140" r="6" fill="#5B8A72" />
            <text x="312" y="144" className="text-[10px] fill-gray-600">Learning effort (good)</text>
          </>
        )}
      </svg>
    ),

    // Growth Mindset Comparison
    growthMindsetComparison: (
      <svg viewBox="0 0 400 200" className={`w-full ${className}`}>
        {/* Fixed Mindset Side */}
        <rect x="10" y="10" width="180" height="180" rx="12" fill="#FEE2E2" />
        {showLabels && (
          <text x="100" y="35" textAnchor="middle" className="text-sm fill-red-800 font-semibold">Fixed Mindset</text>
        )}

        {/* Fixed mindset behaviors */}
        <motion.g
          initial={animated ? { opacity: 0, x: -20 } : {}}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <text x="25" y="60" className="text-[10px] fill-red-700">• Avoids challenges</text>
          <text x="25" y="80" className="text-[10px] fill-red-700">• Gives up easily</text>
          <text x="25" y="100" className="text-[10px] fill-red-700">• Ignores feedback</text>
          <text x="25" y="120" className="text-[10px] fill-red-700">• Feels threatened by</text>
          <text x="30" y="133" className="text-[10px] fill-red-700">others' success</text>
        </motion.g>

        {/* Result */}
        <rect x="25" y="150" width="150" height="30" rx="6" fill="#DC6B6B" />
        <text x="100" y="170" textAnchor="middle" className="text-[10px] fill-white font-medium">Plateaus early</text>

        {/* Growth Mindset Side */}
        <rect x="210" y="10" width="180" height="180" rx="12" fill="#D1FAE5" />
        {showLabels && (
          <text x="300" y="35" textAnchor="middle" className="text-sm fill-green-800 font-semibold">Growth Mindset</text>
        )}

        {/* Growth mindset behaviors */}
        <motion.g
          initial={animated ? { opacity: 0, x: 20 } : {}}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <text x="225" y="60" className="text-[10px] fill-green-700">• Embraces challenges</text>
          <text x="225" y="80" className="text-[10px] fill-green-700">• Persists through setbacks</text>
          <text x="225" y="100" className="text-[10px] fill-green-700">• Learns from criticism</text>
          <text x="225" y="120" className="text-[10px] fill-green-700">• Inspired by others'</text>
          <text x="230" y="133" className="text-[10px] fill-green-700">success</text>
        </motion.g>

        {/* Result */}
        <rect x="225" y="150" width="150" height="30" rx="6" fill="#5B8A72" />
        <text x="300" y="170" textAnchor="middle" className="text-[10px] fill-white font-medium">Reaches higher potential</text>
      </svg>
    ),

    // Feedback Loop
    feedbackLoop: (
      <svg viewBox="0 0 400 200" className={`w-full ${className}`}>
        {/* Center circle */}
        <circle cx="200" cy="100" r="30" fill="#0A1A2A" />
        <text x="200" y="105" textAnchor="middle" className="text-[10px] fill-white font-medium">Learning</text>

        {/* Teach */}
        <motion.g
          initial={animated ? { opacity: 0 } : {}}
          animate={{ opacity: 1 }}
          transition={{ delay: 0 }}
        >
          <circle cx="80" cy="60" r="25" fill="#C6A667" />
          <text x="80" y="65" textAnchor="middle" className="text-[9px] fill-white font-medium">Teach</text>
        </motion.g>

        {/* Check */}
        <motion.g
          initial={animated ? { opacity: 0 } : {}}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <circle cx="320" cy="60" r="25" fill="#5B8A72" />
          <text x="320" y="65" textAnchor="middle" className="text-[9px] fill-white font-medium">Check</text>
        </motion.g>

        {/* Adjust */}
        <motion.g
          initial={animated ? { opacity: 0 } : {}}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <circle cx="320" cy="140" r="25" fill="#6B7280" />
          <text x="320" y="145" textAnchor="middle" className="text-[9px] fill-white font-medium">Adjust</text>
        </motion.g>

        {/* Reteach */}
        <motion.g
          initial={animated ? { opacity: 0 } : {}}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <circle cx="80" cy="140" r="25" fill="#9B6B9E" />
          <text x="80" y="145" textAnchor="middle" className="text-[9px] fill-white font-medium">Reteach</text>
        </motion.g>

        {/* Connecting arrows */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#9CA3AF" />
          </marker>
        </defs>

        {/* Arrows connecting the cycle */}
        <motion.path
          d="M 105 60 L 165 75"
          stroke="#9CA3AF"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
          initial={animated ? { pathLength: 0 } : {}}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        />
        <motion.path
          d="M 235 85 L 295 65"
          stroke="#9CA3AF"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
          initial={animated ? { pathLength: 0 } : {}}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
        />
        <motion.path
          d="M 320 85 L 320 110"
          stroke="#9CA3AF"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
          initial={animated ? { pathLength: 0 } : {}}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 1.2 }}
        />
        <motion.path
          d="M 295 140 L 235 120"
          stroke="#9CA3AF"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
          initial={animated ? { pathLength: 0 } : {}}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 1.4 }}
        />
        <motion.path
          d="M 165 115 L 105 135"
          stroke="#9CA3AF"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
          initial={animated ? { pathLength: 0 } : {}}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 1.6 }}
        />
        <motion.path
          d="M 80 115 L 80 90"
          stroke="#9CA3AF"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
          initial={animated ? { pathLength: 0 } : {}}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 1.8 }}
        />
      </svg>
    ),

    // Zone of Proximal Development
    zoneOfProximalDevelopment: (
      <svg viewBox="0 0 400 200" className={`w-full ${className}`}>
        {/* Outer circle - Cannot do alone */}
        <motion.circle
          cx="200"
          cy="100"
          r="85"
          fill="#FEE2E2"
          stroke="#DC6B6B"
          strokeWidth="2"
          initial={animated ? { scale: 0 } : {}}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Middle circle - ZPD */}
        <motion.circle
          cx="200"
          cy="100"
          r="55"
          fill="#FEF3C7"
          stroke="#C6A667"
          strokeWidth="2"
          initial={animated ? { scale: 0 } : {}}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />

        {/* Inner circle - Can do alone */}
        <motion.circle
          cx="200"
          cy="100"
          r="30"
          fill="#D1FAE5"
          stroke="#5B8A72"
          strokeWidth="2"
          initial={animated ? { scale: 0 } : {}}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        />

        {/* Labels */}
        {showLabels && (
          <>
            <text x="200" y="105" textAnchor="middle" className="text-[9px] fill-green-800 font-medium">Can do</text>
            <text x="200" y="115" textAnchor="middle" className="text-[9px] fill-green-800 font-medium">alone</text>

            <text x="200" y="60" textAnchor="middle" className="text-[9px] fill-yellow-800 font-medium">Zone of Proximal</text>
            <text x="200" y="70" textAnchor="middle" className="text-[9px] fill-yellow-800 font-medium">Development</text>

            <text x="200" y="25" textAnchor="middle" className="text-[9px] fill-red-700">Cannot do</text>

            {/* Right side legend */}
            <rect x="310" y="50" width="12" height="12" fill="#D1FAE5" stroke="#5B8A72" />
            <text x="328" y="60" className="text-[9px] fill-gray-600">Independent</text>

            <rect x="310" y="70" width="12" height="12" fill="#FEF3C7" stroke="#C6A667" />
            <text x="328" y="80" className="text-[9px] fill-gray-600">With support</text>

            <rect x="310" y="90" width="12" height="12" fill="#FEE2E2" stroke="#DC6B6B" />
            <text x="328" y="100" className="text-[9px] fill-gray-600">Not yet ready</text>
          </>
        )}
      </svg>
    ),

    // Spacing Effect Comparison
    spacingEffect: (
      <svg viewBox="0 0 400 180" className={`w-full ${className}`}>
        {/* Massed practice */}
        <rect x="20" y="20" width="170" height="140" rx="8" fill="#FEE2E2" fillOpacity="0.5" />
        {showLabels && (
          <text x="105" y="40" textAnchor="middle" className="text-[11px] fill-red-800 font-semibold">Massed (Cramming)</text>
        )}

        {/* Massed study sessions */}
        {[55, 75, 95, 115].map((y, i) => (
          <motion.rect
            key={i}
            x="40"
            y={y}
            width="130"
            height="15"
            rx="3"
            fill="#DC6B6B"
            initial={animated ? { scaleX: 0 } : {}}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            style={{ transformOrigin: 'left' }}
          />
        ))}

        {showLabels && (
          <text x="105" y="150" textAnchor="middle" className="text-[9px] fill-gray-500">Day 1</text>
        )}

        {/* Spaced practice */}
        <rect x="210" y="20" width="170" height="140" rx="8" fill="#D1FAE5" fillOpacity="0.5" />
        {showLabels && (
          <text x="295" y="40" textAnchor="middle" className="text-[11px] fill-green-800 font-semibold">Spaced (Distributed)</text>
        )}

        {/* Spaced study sessions */}
        {[55, 75, 95, 115].map((y, i) => (
          <motion.rect
            key={i}
            x={230 + i * 35}
            y={y}
            width="25"
            height="15"
            rx="3"
            fill="#5B8A72"
            initial={animated ? { scale: 0 } : {}}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.15 }}
          />
        ))}

        {showLabels && (
          <>
            <text x="242" y="150" textAnchor="middle" className="text-[8px] fill-gray-500">D1</text>
            <text x="277" y="150" textAnchor="middle" className="text-[8px] fill-gray-500">D3</text>
            <text x="312" y="150" textAnchor="middle" className="text-[8px] fill-gray-500">D7</text>
            <text x="347" y="150" textAnchor="middle" className="text-[8px] fill-gray-500">D14</text>
          </>
        )}

        {/* Results */}
        <motion.g
          initial={animated ? { opacity: 0 } : {}}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <text x="105" y="175" textAnchor="middle" className="text-[10px] fill-red-600 font-medium">Quick to forget</text>
          <text x="295" y="175" textAnchor="middle" className="text-[10px] fill-green-600 font-medium">Long-term retention</text>
        </motion.g>
      </svg>
    ),

    // Transfer Bridge
    transferBridge: (
      <svg viewBox="0 0 400 160" className={`w-full ${className}`}>
        {/* Left platform - Learning context */}
        <motion.rect
          x="20"
          y="80"
          width="100"
          height="60"
          rx="8"
          fill="#C6A667"
          initial={animated ? { x: -50, opacity: 0 } : {}}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        {showLabels && (
          <>
            <text x="70" y="105" textAnchor="middle" className="text-[10px] fill-white font-medium">Learning</text>
            <text x="70" y="118" textAnchor="middle" className="text-[10px] fill-white font-medium">Context</text>
          </>
        )}

        {/* Right platform - New context */}
        <motion.rect
          x="280"
          y="80"
          width="100"
          height="60"
          rx="8"
          fill="#5B8A72"
          initial={animated ? { x: 50, opacity: 0 } : {}}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        {showLabels && (
          <>
            <text x="330" y="105" textAnchor="middle" className="text-[10px] fill-white font-medium">New</text>
            <text x="330" y="118" textAnchor="middle" className="text-[10px] fill-white font-medium">Context</text>
          </>
        )}

        {/* Bridge */}
        <motion.path
          d="M 120 90 Q 200 30, 280 90"
          fill="none"
          stroke="#0A1A2A"
          strokeWidth="4"
          strokeLinecap="round"
          initial={animated ? { pathLength: 0 } : {}}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Bridge label */}
        {showLabels && (
          <motion.text
            x="200"
            y="45"
            textAnchor="middle"
            className="text-[10px] fill-brand-navy font-medium"
            initial={animated ? { opacity: 0 } : {}}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Transfer
          </motion.text>
        )}

        {/* Knowledge dot moving across */}
        <motion.circle
          cx="120"
          cy="90"
          r="8"
          fill="#0A1A2A"
          initial={animated ? { cx: 120, cy: 90 } : {}}
          animate={{
            cx: [120, 200, 280],
            cy: [90, 50, 90],
          }}
          transition={{
            duration: 2,
            delay: 1.5,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />

        {/* Decorative lines on bridge */}
        {[140, 160, 180, 200, 220, 240, 260].map((x, i) => (
          <motion.line
            key={i}
            x1={x}
            y1={90 - Math.sin((x - 120) * Math.PI / 160) * 50}
            x2={x}
            y2={90 - Math.sin((x - 120) * Math.PI / 160) * 50 + 10}
            stroke="#0A1A2A"
            strokeWidth="2"
            initial={animated ? { opacity: 0 } : {}}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          />
        ))}
      </svg>
    ),

    // Learning Pyramid (simplified)
    learningPyramid: (
      <svg viewBox="0 0 400 200" className={`w-full ${className}`}>
        {/* Pyramid sections from bottom to top */}
        <motion.polygon
          points="30,180 200,30 370,180"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="2"
          initial={animated ? { opacity: 0 } : {}}
          animate={{ opacity: 1 }}
        />

        {/* Teaching others - bottom */}
        <motion.polygon
          points="45,170 200,135 355,170"
          fill="#5B8A72"
          initial={animated ? { opacity: 0 } : {}}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        />
        {showLabels && (
          <text x="200" y="162" textAnchor="middle" className="text-[9px] fill-white font-medium">Teaching Others: 90%</text>
        )}

        {/* Practice */}
        <motion.polygon
          points="65,130 200,95 335,130"
          fill="#7BA392"
          initial={animated ? { opacity: 0 } : {}}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        />
        {showLabels && (
          <text x="200" y="122" textAnchor="middle" className="text-[9px] fill-white font-medium">Practice: 75%</text>
        )}

        {/* Discussion */}
        <motion.polygon
          points="95,95 200,65 305,95"
          fill="#C6A667"
          initial={animated ? { opacity: 0 } : {}}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        />
        {showLabels && (
          <text x="200" y="87" textAnchor="middle" className="text-[9px] fill-white font-medium">Discussion: 50%</text>
        )}

        {/* Reading */}
        <motion.polygon
          points="130,65 200,40 270,65"
          fill="#9CA3AF"
          initial={animated ? { opacity: 0 } : {}}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        />
        {showLabels && (
          <text x="200" y="58" textAnchor="middle" className="text-[8px] fill-white font-medium">Reading: 10%</text>
        )}

        {/* Lecture - top */}
        <motion.polygon
          points="165,40 200,30 235,40"
          fill="#6B7280"
          initial={animated ? { opacity: 0 } : {}}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />

        {/* Labels */}
        {showLabels && (
          <>
            <text x="200" y="195" textAnchor="middle" className="text-[10px] fill-gray-500">Average Retention Rate</text>
            <text x="30" y="140" textAnchor="start" className="text-[9px] fill-green-600 font-medium">Active</text>
            <text x="30" y="80" textAnchor="start" className="text-[9px] fill-gray-500 font-medium">Passive</text>
          </>
        )}
      </svg>
    ),
  };

  return diagrams[type] || null;
};

export default ConceptDiagram;
