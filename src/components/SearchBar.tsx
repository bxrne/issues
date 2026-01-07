import { useState, FormEvent } from 'react';
import { Search } from 'lucide-react';
import { IssueState } from '@/types/github';

interface SearchBarProps {
  onSearch: (query: string, state: IssueState) => void;
  loading: boolean;
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<IssueState>('open');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), state);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search issues..."
            className="w-full bg-input border border-border px-10 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors font-mono text-sm"
            disabled={loading}
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="flex border border-border">
            {(['open', 'closed', 'all'] as IssueState[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setState(s)}
                className={`px-3 py-1.5 text-xs font-mono transition-colors ${
                  state === s
                    ? 'bg-foreground text-background'
                    : 'bg-input text-muted-foreground hover:text-foreground'
                }`}
                disabled={loading}
              >
                {s}
              </button>
            ))}
          </div>
          
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-foreground text-background px-4 py-1.5 font-mono text-xs hover:bg-muted-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          >
            {loading ? '...' : 'go'}
          </button>
        </div>

        <div className="text-xs text-muted-foreground font-mono space-y-1">
          <p>syntax: <span className="text-foreground/70">repo:owner/name</span> <span className="text-foreground/70">user:owner</span> <span className="text-foreground/70">label:bug</span></p>
        </div>
      </div>
    </form>
  );
}
