import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  summary: string;
  details?: string;
  className?: string;
  summaryClassName?: string;
  detailsClassName?: string;
  initialExpanded?: boolean;
  expandLabel?: string;
  collapseLabel?: string;
}

export const ExpandableText: React.FC<Props> = ({
  summary,
  details,
  className = '',
  summaryClassName = 'text-slate-300',
  detailsClassName = 'text-slate-400 mt-1.5',
  initialExpanded = false,
  expandLabel = 'Show details',
  collapseLabel = 'Hide details',
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  if (!details) {
    return <p className={`${summaryClassName} ${className}`}>{summary}</p>;
  }

  return (
    <div className={`text-xs ${className}`}>
      <p className={`leading-relaxed ${summaryClassName}`}>
        {summary}
      </p>
      {isExpanded && (
        <p className={`leading-relaxed border-t border-slate-800/60 pt-1.5 ${detailsClassName}`}>
          {details}
        </p>
      )}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center space-x-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors mt-1 cursor-pointer focus:outline-none"
      >
        <span>{isExpanded ? collapseLabel : expandLabel}</span>
        {isExpanded ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </button>
    </div>
  );
};
