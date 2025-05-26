import React from 'react';
import { Trophy, User, Users } from 'lucide-react';

interface ScoreBoardProps {
  scores: {
    X: number;
    O: number;
    draws: number;
  };
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ scores }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <Trophy className="h-5 w-5" style={{ color: '#CFC493' }} />
        Score Board
      </h2>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center p-2 rounded" style={{ backgroundColor: '#f1efe5' }}>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" style={{ color: '#006747' }} />
            <span className="font-medium" style={{ color: '#006747' }}>User 1</span>
          </div>
          <span className="text-lg font-bold" style={{ color: '#006747' }}>{scores.X}</span>
        </div>
        
        <div className="flex justify-between items-center p-2 rounded" style={{ backgroundColor: '#e5e3da' }}>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" style={{ color: '#CFC493' }} />
            <span className="font-medium" style={{ color: '#CFC493' }}>User 2</span>
          </div>
          <span className="text-lg font-bold" style={{ color: '#CFC493' }}>{scores.O}</span>
        </div>
        
        <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-gray-600">Draws</span>
          </div>
          <span className="text-lg font-bold text-gray-600">{scores.draws}</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
