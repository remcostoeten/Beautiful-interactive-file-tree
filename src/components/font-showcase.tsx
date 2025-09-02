type TProps = {
  className?: string;
};

export function FontShowcase({ className }: TProps) {
  return (
    <div className={`space-y-8 p-6 ${className}`}>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Font Showcase</h2>
        <p className="text-muted-foreground">
          Beautiful typography with Inter & JetBrains Mono
        </p>
      </div>

      {/* Sans-serif fonts */}
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-inter text-lg font-semibold">Inter (Primary)</h3>
          <div className="font-inter space-y-2">
            <p className="text-3xl font-light text-pretty">
              Beautiful, functional typography
            </p>
            <p className="text-lg">
              Inter is designed for user interfaces with excellent readability at small sizes.
            </p>
            <p className="text-sm text-muted-foreground">
              The quick brown fox jumps over the lazy dog. 0123456789
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-geist-sans text-lg font-semibold">Geist Sans (Fallback)</h3>
          <div className="font-geist-sans space-y-2">
            <p className="text-3xl font-light text-balance">
              Clean, modern design language
            </p>
            <p className="text-lg">
              Geist Sans offers a clean, modern aesthetic perfect for technical content.
            </p>
            <p className="text-sm text-muted-foreground">
              The quick brown fox jumps over the lazy dog. 0123456789
            </p>
          </div>
        </div>
      </div>

      {/* Monospace fonts */}
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">JetBrains Mono (Primary Code)</h3>
          <div className="font-jetbrains-mono space-y-3">
            <div className="bg-card border rounded-lg p-4">
              <pre className="text-sm leading-relaxed">
{`function createComponent() {
  const [state, setState] = useState(false);
  
  return (
    <div className="flex items-center gap-4">
      <Button onClick={() => setState(!state)}>
        Toggle: {state ? 'ON' : 'OFF'}
      </Button>
    </div>
  );
}`}
              </pre>
            </div>
            <p className="text-sm text-muted-foreground">
              Features: Ligatures, contextual alternates, and excellent code readability
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Geist Mono (Fallback Code)</h3>
          <div className="font-geist-mono space-y-3">
            <div className="bg-card border rounded-lg p-4">
              <pre className="text-sm leading-relaxed">
{`export type TProps = {
  className?: string;
  variant?: 'default' | 'compact';
  children: React.ReactNode;
};`}
              </pre>
            </div>
            <p className="text-sm text-muted-foreground">
              Clean, minimal monospace design for code and data
            </p>
          </div>
        </div>
      </div>

      {/* Typography features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Typography Features</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-medium">Font Features</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Contextual ligatures</li>
              <li>• Stylistic alternates</li>
              <li>• Optimized for screens</li>
              <li>• Variable font weights</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Performance</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Preloaded for speed</li>
              <li>• Display: swap</li>
              <li>• Proper fallbacks</li>
              <li>• Layout-shift prevention</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabular numbers example */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Tabular Numbers</h3>
        <div className="font-feature-tabular font-jetbrains-mono bg-card border rounded-lg p-4">
          <div className="space-y-1 text-sm">
            <div>  1,234.56</div>
            <div> 12,345.67</div>
            <div>123,456.78</div>
            <div>  1,000.00</div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Perfect alignment for financial data and tables
        </p>
      </div>
    </div>
  );
}
