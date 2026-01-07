import { useState, useCallback } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { IssueList } from '@/components/IssueList';
import { useGitHubSearch } from '@/hooks/useGitHubSearch';
import { IssueState } from '@/types/github';

const Index = () => {
  const { issues, loading, error, totalCount, searchIssues, hasMore, page } = useGitHubSearch();
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentState, setCurrentState] = useState<IssueState>('open');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback((query: string, state: IssueState) => {
    setCurrentQuery(query);
    setCurrentState(state);
    setHasSearched(true);
    searchIssues(query, state, 1);
  }, [searchIssues]);

  const handleLoadMore = useCallback(() => {
    if (currentQuery) {
      searchIssues(currentQuery, currentState, page + 1);
    }
  }, [currentQuery, currentState, page, searchIssues]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-xl font-mono font-semibold text-foreground mb-1">
            issues
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            search github issues across all public repos
          </p>
        </header>

        <div className="mb-6">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {hasSearched && (
          <>
            {!loading && !error && totalCount > 0 && (
              <div className="mb-4 text-xs text-muted-foreground font-mono">
                {totalCount.toLocaleString()} result{totalCount !== 1 ? 's' : ''}
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
          <div className="border border-border bg-card p-8">
            <p className="text-muted-foreground font-mono text-sm mb-4">
              examples:
            </p>
            <div className="space-y-2 text-xs font-mono">
              <p><span className="text-foreground">good first issue</span> <span className="text-muted-foreground">— find beginner-friendly issues</span></p>
              <p><span className="text-foreground">repo:facebook/react bug</span> <span className="text-muted-foreground">— bugs in react</span></p>
              <p><span className="text-foreground">user:vercel label:help-wanted</span> <span className="text-muted-foreground">— vercel repos needing help</span></p>
              <p><span className="text-foreground">typescript error handling</span> <span className="text-muted-foreground">— issues about ts errors</span></p>
            </div>
          </div>
        )}

        <footer className="mt-12 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground font-mono text-center">
            github search api · 30 req/min · max 1000 results
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
