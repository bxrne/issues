import { useState, useCallback } from 'react';
import { GitHubIssue, IssueState, SearchResponse } from '@/types/github';

interface UseGitHubSearchReturn {
  issues: GitHubIssue[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  searchIssues: (query: string, state: IssueState, page?: number) => Promise<void>;
  hasMore: boolean;
  page: number;
}

export function useGitHubSearch(): UseGitHubSearchReturn {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const searchIssues = useCallback(async (query: string, state: IssueState, pageNum: number = 1) => {
    if (!query.trim()) {
      setError('Enter a search query');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build search query
      // GitHub search syntax: query is:issue state:open/closed
      let searchQuery = `${query} is:issue`;
      if (state !== 'all') {
        searchQuery += ` state:${state}`;
      }

      const response = await fetch(
        `https://api.github.com/search/issues?q=${encodeURIComponent(searchQuery)}&per_page=30&page=${pageNum}&sort=updated&order=desc`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Rate limit exceeded. Try again later.');
        }
        if (response.status === 422) {
          throw new Error('Invalid search query');
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data: SearchResponse = await response.json();
      
      if (pageNum === 1) {
        setIssues(data.items);
        setTotalCount(data.total_count);
      } else {
        setIssues(prev => [...prev, ...data.items]);
      }
      
      setHasMore(data.items.length === 30 && (pageNum * 30) < Math.min(data.total_count, 1000));
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search issues');
      if (pageNum === 1) {
        setIssues([]);
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { issues, loading, error, totalCount, searchIssues, hasMore, page };
}
