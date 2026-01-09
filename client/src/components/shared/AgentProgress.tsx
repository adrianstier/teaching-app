import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  ArrowPathIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

export type AgentStatus = 'pending' | 'running' | 'completed' | 'error';

export interface AgentInfo {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  progress?: number;
  result?: any;
  error?: string;
}

interface AgentProgressProps {
  agents: AgentInfo[];
  layout?: 'horizontal' | 'vertical';
}

const AgentProgress: React.FC<AgentProgressProps> = ({ agents, layout = 'vertical' }) => {
  const getStatusConfig = (status: AgentStatus) => {
    switch (status) {
      case 'pending':
        return {
          icon: ClockIcon,
          color: 'text-gray-400',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-200',
          label: 'Pending',
        };
      case 'running':
        return {
          icon: ArrowPathIcon,
          color: 'text-brand-gold',
          bgColor: 'bg-brand-gold/10',
          borderColor: 'border-brand-gold/30',
          label: 'Running',
        };
      case 'completed':
        return {
          icon: CheckCircleIcon,
          color: 'text-scholarly-sage',
          bgColor: 'bg-scholarly-sage/10',
          borderColor: 'border-scholarly-sage/30',
          label: 'Completed',
        };
      case 'error':
        return {
          icon: ExclamationCircleIcon,
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          label: 'Error',
        };
    }
  };

  if (layout === 'horizontal') {
    return (
      <div className="flex space-x-4 overflow-x-auto py-2">
        {agents.map((agent) => {
          const config = getStatusConfig(agent.status);
          const IconComponent = config.icon;

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex-shrink-0 flex items-center space-x-3 px-4 py-3 rounded-xl border ${config.bgColor} ${config.borderColor}`}
            >
              <IconComponent
                className={`h-5 w-5 ${config.color} ${agent.status === 'running' ? 'animate-spin' : ''}`}
              />
              <div>
                <p className="text-sm font-medium text-brand-navy">{agent.name}</p>
                <p className="text-xs text-brand-text-light">{config.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {agents.map((agent, index) => {
        const config = getStatusConfig(agent.status);
        const IconComponent = config.icon;

        return (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border transition-all ${config.bgColor} ${config.borderColor}`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-lg ${config.bgColor}`}>
                <IconComponent
                  className={`h-5 w-5 ${config.color} ${agent.status === 'running' ? 'animate-spin' : ''}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-brand-navy">{agent.name}</h4>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${config.bgColor} ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                <p className="text-xs text-brand-text-light">{agent.description}</p>

                {/* Progress bar for running agents */}
                {agent.status === 'running' && agent.progress !== undefined && (
                  <div className="mt-3">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-brand-gold rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${agent.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-[10px] text-brand-text-light mt-1">{agent.progress}% complete</p>
                  </div>
                )}

                {/* Error message */}
                {agent.status === 'error' && agent.error && (
                  <p className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                    {agent.error}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AgentProgress;
