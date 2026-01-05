import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ConceptNode {
  id: string;
  concept: string;
  week: number;
  prerequisites?: string[];
  bloomLevel?: string;
}

interface ConceptEdge {
  from: string;
  to: string;
  type: 'prerequisite' | 'builds-on' | 'related';
}

interface ConceptMapVisualizationProps {
  nodes: ConceptNode[];
  edges?: ConceptEdge[];
}

const ConceptMapVisualization: React.FC<ConceptMapVisualizationProps> = ({ nodes, edges = [] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Group nodes by week
  const nodesByWeek = nodes.reduce((acc, node) => {
    if (!acc[node.week]) acc[node.week] = [];
    acc[node.week].push(node);
    return acc;
  }, {} as Record<number, ConceptNode[]>);

  const weeks = Object.keys(nodesByWeek).map(Number).sort((a, b) => a - b);

  const getBloomColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'remember': return 'bg-blue-100 border-blue-400 text-blue-800';
      case 'understand': return 'bg-green-100 border-green-400 text-green-800';
      case 'apply': return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'analyze': return 'bg-orange-100 border-orange-400 text-orange-800';
      case 'evaluate': return 'bg-red-100 border-red-400 text-red-800';
      case 'create': return 'bg-purple-100 border-purple-400 text-purple-800';
      default: return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  // Draw connections between concepts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || edges.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    edges.forEach(edge => {
      const fromElement = document.getElementById(`concept-${edge.from}`);
      const toElement = document.getElementById(`concept-${edge.to}`);

      if (fromElement && toElement) {
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        const fromX = fromRect.left + fromRect.width / 2 - canvasRect.left;
        const fromY = fromRect.top + fromRect.height / 2 - canvasRect.top;
        const toX = toRect.left + toRect.width / 2 - canvasRect.left;
        const toY = toRect.top + toRect.height / 2 - canvasRect.top;

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);

        // Style based on edge type
        switch (edge.type) {
          case 'prerequisite':
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.setLineDash([]);
            break;
          case 'builds-on':
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            break;
          case 'related':
            ctx.strokeStyle = '#9ca3af';
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 2]);
            break;
        }

        ctx.stroke();

        // Draw arrow head
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const arrowLength = 10;
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
          toX - arrowLength * Math.cos(angle - Math.PI / 6),
          toY - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(toX, toY);
        ctx.lineTo(
          toX - arrowLength * Math.cos(angle + Math.PI / 6),
          toY - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      }
    });
  }, [nodes, edges]);

  if (nodes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No concepts to visualize</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Canvas for drawing connections */}
      {edges.length > 0 && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        />
      )}

      {/* Concept nodes organized by week */}
      <div className="space-y-8 relative" style={{ zIndex: 1 }}>
        {weeks.map((week, weekIndex) => (
          <motion.div
            key={week}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: weekIndex * 0.1 }}
            className="border-l-4 border-primary-600 pl-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Week {week}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nodesByWeek[week].map((node, nodeIndex) => (
                <motion.div
                  key={node.id}
                  id={`concept-${node.id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: weekIndex * 0.1 + nodeIndex * 0.05 }}
                  className={`p-4 rounded-lg border-2 shadow-sm hover:shadow-md transition-all ${getBloomColor(node.bloomLevel)}`}
                >
                  <div className="font-medium text-sm mb-2">{node.concept}</div>
                  {node.bloomLevel && (
                    <div className="text-xs opacity-75 capitalize">
                      {node.bloomLevel}
                    </div>
                  )}
                  {node.prerequisites && node.prerequisites.length > 0 && (
                    <div className="mt-2 text-xs opacity-60">
                      Requires: {node.prerequisites.length} concept(s)
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      {edges.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Concept Relationships</h4>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-8 h-0.5 bg-red-500 mr-2"></div>
              <span className="text-gray-600">Prerequisite</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-0.5 bg-blue-500 border-dashed mr-2"></div>
              <span className="text-gray-600">Builds Upon</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-0.5 bg-gray-400 border-dotted mr-2"></div>
              <span className="text-gray-600">Related</span>
            </div>
          </div>
        </div>
      )}

      {/* Bloom's Taxonomy Legend */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Bloom's Taxonomy Levels</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          <div className={`p-2 rounded border ${getBloomColor('remember')}`}>Remember</div>
          <div className={`p-2 rounded border ${getBloomColor('understand')}`}>Understand</div>
          <div className={`p-2 rounded border ${getBloomColor('apply')}`}>Apply</div>
          <div className={`p-2 rounded border ${getBloomColor('analyze')}`}>Analyze</div>
          <div className={`p-2 rounded border ${getBloomColor('evaluate')}`}>Evaluate</div>
          <div className={`p-2 rounded border ${getBloomColor('create')}`}>Create</div>
        </div>
      </div>
    </div>
  );
};

export default ConceptMapVisualization;
