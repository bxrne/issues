import { useState, FormEvent } from 'react';
import { Search } from 'lucide-react';
import { IssueState } from '@/types/github';

interface SearchBarProps {
  onSearch: (repo: string, state: IssueState) => void;
  loading: boolean;
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [repo, setRepo] = useState('');
  const [state, setState] = useState<IssueState>('open');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (repo.trim()) {
      onSearch(repo.trim(), state);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="owner/repo"
            className="w-full bg-input border border-border px-10 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors font-mono text-sm"
            disabled={loading}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={state}
            onChange={(e) => setState(e.target.value as IssueState)}
            className="bg-input border border-border px-3 py-2.5 text-foreground focus:outline-none focus:border-foreground transition-colors font-mono text-sm cursor-pointer"
            disabled={loading}
          >
            <option value="open">open</option>
            <option value="closed">closed</option>
            <option value="all">all</option>
          </select>
          
          <button
            type="submit"
            disabled={loading || !repo.trim()}
            className="bg-foreground text-background px-6 py-2.5 font-mono text-sm hover:bg-muted-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'loading...' : 'search'}
          </button>
        </div>
      </div>
    </form>
  );
}
