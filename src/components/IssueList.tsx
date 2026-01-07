import { GitHubIssue } from '@/types/github';
import { IssueCard } from './IssueCard';

interface IssueListProps {
  issues: GitHubIssue[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function IssueList({ issues, loading, error, hasMore, onLoadMore }: IssueListProps) {
  if (error) {
    return (
      <div className="border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground font-mono text-sm">error: {error}</p>
      </div>
    );
  }

  if (!loading && issues.length === 0) {
    return (
      <div className="border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground font-mono text-sm">no issues found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}

      {loading && (
        <div className="border border-border bg-card p-4 text-center">
          <p className="text-muted-foreground font-mono text-sm animate-pulse">loading...</p>
        </div>
      )}

      {!loading && hasMore && issues.length > 0 && (
        <button
          onClick={onLoadMore}
          className="w-full border border-border bg-card p-3 text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors font-mono text-sm"
        >
          load more
        </button>
      )}
    </div>
  );
}
