import { useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink, MessageSquare } from 'lucide-react';
import { GitHubIssue } from '@/types/github';
import { formatDistanceToNow } from 'date-fns';

interface IssueCardProps {
  issue: GitHubIssue;
}

export function IssueCard({ issue }: IssueCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-border bg-card hover:border-muted-foreground transition-colors">
      <div
        className="flex items-start gap-3 p-4 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <button className="mt-0.5 text-muted-foreground hover:text-foreground transition-colors">
          {expanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-muted-foreground text-sm">#{issue.number}</span>
            <span
              className={`text-xs px-1.5 py-0.5 border ${
                issue.state === 'open'
                  ? 'text-state-open border-state-open'
                  : 'text-state-closed border-state-closed'
              }`}
            >
              {issue.state}
            </span>
          </div>

          <h3 className="text-foreground font-medium leading-tight mb-2 break-words">
            {issue.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{issue.user.login}</span>
            <span>·</span>
            <span>{formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}</span>
            {issue.comments > 0 && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {issue.comments}
                </span>
              </>
            )}
          </div>

          {issue.labels.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {issue.labels.map((label) => (
                <span
                  key={label.id}
                  className="text-xs px-1.5 py-0.5 bg-secondary text-secondary-foreground border border-border"
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <a
          href={issue.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
          onClick={(e) => e.stopPropagation()}
          title="Open on GitHub"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {expanded && issue.body && (
        <div className="px-4 pb-4 pl-11">
          <div className="border-t border-border pt-4">
            <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono break-words leading-relaxed">
              {issue.body}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
