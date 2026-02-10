import { ProgressBar } from './ProgressBar';

interface ScoreDisplayProps {
  score: number; // 1-10
  showProgressBar?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreDisplay({ score, showProgressBar = true, size = 'md' }: ScoreDisplayProps) {
  const getScoreLabel = (score: number) => {
    if (score <= 4) return { label: 'Weak Match', color: 'text-red-600', variant: 'danger' as const };
    if (score <= 7) return { label: 'Potential Match', color: 'text-amber-600', variant: 'warning' as const };
    return { label: 'Strong Match', color: 'text-green-600', variant: 'success' as const };
  };

  const { label, color, variant } = getScoreLabel(score);

  const sizes = {
    sm: { score: 'text-2xl', label: 'text-xs' },
    md: { score: 'text-3xl', label: 'text-sm' },
    lg: { score: 'text-5xl', label: 'text-base' },
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className={`font-bold ${color} ${sizes[size].score}`}>
          {score.toFixed(1)}
        </div>
        <div>
          <div className="text-gray-500 text-sm">out of 10</div>
          <div className={`font-semibold ${color} ${sizes[size].label}`}>
            {label}
          </div>
        </div>
      </div>
      {showProgressBar && (
        <ProgressBar value={score} max={10} variant={variant} />
      )}
    </div>
  );
}
