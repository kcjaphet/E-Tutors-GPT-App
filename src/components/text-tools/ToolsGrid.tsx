
import React from 'react';
import { Link } from 'react-router-dom';
import ToolCard from '../ToolCard';
import { ToolsGridProps } from './types';

const ToolsGrid: React.FC<ToolsGridProps> = ({ tools, onToolSelect, selectedTool }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {tools.map((tool) => (
        tool.linkTo ? (
          <Link to={tool.linkTo} key={tool.id}>
            <ToolCard
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              onClick={() => {}}
              isSelected={false}
            />
          </Link>
        ) : (
          <ToolCard
            key={tool.id}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            onClick={() => onToolSelect(tool.id)}
            isSelected={selectedTool === tool.id}
          />
        )
      ))}
    </div>
  );
};

export default ToolsGrid;
