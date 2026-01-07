import { useState, useCallback } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { IssueList } from '@/components/IssueList';
import { useGitHubIssues } from '@/hooks/useGitHubIssues';
import { IssueState } from '@/types/github';

const Index = () => {
  const { issues, loading, error, fetchIssues, hasMore, page } = useGitHubIssues();
  const [currentRepo, setCurrentRepo] = useState('');
  const [currentState, setCurrentState] = useState<IssueState>('open');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback((repo: string, state: IssueState) => {
    setCurrentRepo(repo);
    setCurrentState(state);
    setHasSearched(true);
    fetchIssues(repo, state, 1);
  }, [fetchIssues]);

  const handleLoadMore = useCallback(() => {
    if (currentRepo) {
      fetchIssues(currentRepo, currentState, page + 1);
    }
  }, [currentRepo, currentState, page, fetchIssues]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-xl font-mono font-semibold text-foreground mb-1">
            issues
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            find github issues to work on
          </p>
        </header>

        <div className="mb-6">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {hasSearched && (
          <>
            {!loading && !error && issues.length > 0 && (
              <div className="mb-4 text-xs text-muted-foreground font-mono">
                {issues.length} issue{issues.length !== 1 ? 's' : ''} · {currentRepo}
              </div>
            )}
            <IssueList
              issues={issues}
              loading={loading}
              error={error}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
            />
          </>
        )}

        {!hasSearched && (
          <div className="border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground font-mono text-sm">
              enter a repository to search for issues
            </p>
            <p className="text-muted-foreground/60 font-mono text-xs mt-2">
              examples: facebook/react · vercel/next.js · microsoft/vscode
            </p>
          </div>
        )}

        <footer className="mt-12 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground font-mono text-center">
            uses github public api · rate limited to 60 req/hr
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
