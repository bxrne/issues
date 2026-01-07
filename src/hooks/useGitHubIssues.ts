import { useState, useCallback } from 'react';
import { GitHubIssue, IssueState } from '@/types/github';

interface UseGitHubIssuesReturn {
  issues: GitHubIssue[];
  loading: boolean;
  error: string | null;
  fetchIssues: (repo: string, state: IssueState, page?: number) => Promise<void>;
  hasMore: boolean;
  page: number;
}

export function useGitHubIssues(): UseGitHubIssuesReturn {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchIssues = useCallback(async (repo: string, state: IssueState, pageNum: number = 1) => {
    if (!repo.includes('/')) {
      setError('Invalid format. Use owner/repo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const stateParam = state === 'all' ? 'all' : state;
      const response = await fetch(
        `https://api.github.com/repos/${repo}/issues?state=${stateParam}&per_page=30&page=${pageNum}`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Repository not found');
        }
        if (response.status === 403) {
          throw new Error('Rate limit exceeded. Try again later.');
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data: GitHubIssue[] = await response.json();
      
      // Filter out pull requests (they're returned in the issues endpoint)
      const issuesOnly = data.filter(issue => !('pull_request' in issue));
      
      if (pageNum === 1) {
        setIssues(issuesOnly);
      } else {
        setIssues(prev => [...prev, ...issuesOnly]);
      }
      
      setHasMore(data.length === 30);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch issues');
      if (pageNum === 1) {
        setIssues([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { issues, loading, error, fetchIssues, hasMore, page };
}
