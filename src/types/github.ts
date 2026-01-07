export interface GitHubLabel {
  id: number;
  name: string;
  color: string;
  description?: string;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubRepository {
  full_name: string;
  html_url: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  labels: GitHubLabel[];
  user: GitHubUser;
  repository_url: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  comments: number;
  score?: number;
}

export interface SearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubIssue[];
}

export type IssueState = 'open' | 'closed' | 'all';
