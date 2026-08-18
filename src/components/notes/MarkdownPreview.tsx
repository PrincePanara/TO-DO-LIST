import React from 'react';

function inline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
    return <strong key={i}>{inline(part.slice(2, -2))}</strong>;
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{inline(part.slice(1, -1))}</em>;
    if (part.startsWith('`') && part.endsWith('`'))
    return (
      <code key={i} className="border-[2px] border-ink bg-sun px-1 font-mono text-[0.9em] text-ink">
          {part.slice(1, -1)}
        </code>);
    return <span key={i}>{part}</span>;
  });
}

export function MarkdownPreview({ content }: {content: string;}) {
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let list: string[] | null = null;
  let ordered = false;
  let code: string[] | null = null;
  let table: string[][] | null = null;

  const flushTable = () => {
    if (!table) return;
    const [header, ...rows] = table;
    blocks.push(
      <div key={blocks.length} className="overflow-x-auto mb-4 border-2 border-ink dark:border-white">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-ink text-white dark:bg-white dark:text-ink border-b-2 border-ink dark:border-white">
            <tr>
              {header.map((cell, i) => (
                <th key={i} className="px-4 py-2 font-bold font-display uppercase tracking-wider">{inline(cell)}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-ink/20 dark:divide-white/20">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-ink/5 dark:hover:bg-white/5">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3">{inline(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    table = null;
  };

  const flushList = () => {
    if (!list) return;
    const items = list;
    blocks.push(
      ordered ?
      <ol key={blocks.length} className="ml-5 list-decimal space-y-1 text-sm">
          {items.map((l, i) =>
        <li key={i}>{inline(l)}</li>
        )}
        </ol> :

      <ul key={blocks.length} className="ml-5 list-disc space-y-1 text-sm">
          {items.map((l, i) =>
        <li key={i}>{inline(l)}</li>
        )}
        </ul>

    );
    list = null;
  };

  lines.forEach((raw) => {
    const line = raw.trimEnd();
    if (line.startsWith('```')) {
      if (code) {
        blocks.push(
          <pre
            key={blocks.length}
            className="overflow-x-auto border-3 border-ink bg-ink p-3 font-mono text-xs text-white dark:border-white">
            
            <code>{code.join('\n')}</code>
          </pre>
        );
        code = null;
      } else {
        flushList();
        flushTable();
        code = [];
      }
      return;
    }
    if (code) {
      code.push(raw);
      return;
    }
    
    // Table Parsing Logic
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      flushList();
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      // Ignore markdown separator row (e.g. |---|---|)
      if (cells.every(c => /^[-:\s]+$/.test(c))) {
        return;
      }
      if (!table) table = [];
      table.push(cells);
      return;
    } else if (table) {
      flushTable();
    }

    if (/^#{1,3}\s/.test(line)) {
      flushList();
      flushTable();
      const level = line.match(/^#+/)![0].length;
      const text = line.replace(/^#+\s/, '');
      const size =
      level === 1 ?
      'text-2xl' :
      level === 2 ?
      'text-xl' :
      'text-lg';
      blocks.push(
        <p key={blocks.length} className={`font-display font-bold uppercase tracking-tight ${size}`}>
          {text}
        </p>
      );
      return;
    }
    if (/^>\s/.test(line)) {
      flushList();
      flushTable();
      blocks.push(
        <p
          key={blocks.length}
          className="border-l-[6px] border-brand bg-brand-soft px-4 py-2 text-sm text-ink">
          
          {inline(line.replace(/^>\s/, ''))}
        </p>
      );
      return;
    }
    if (/^[-*]\s/.test(line)) {
      if (!list || ordered) {
        flushList();
        flushTable();
        ordered = false;
        list = [];
      }
      const current = list ?? [];
      current.push(line.replace(/^[-*]\s/, ''));
      list = current;
      return;
    }
    if (/^\d+\.\s/.test(line)) {
      if (!list || !ordered) {
        flushList();
        flushTable();
        ordered = true;
        list = [];
      }
      const current = list ?? [];
      current.push(line.replace(/^\d+\.\s/, ''));
      list = current;
      return;
    }
    if (line.trim() === '') {
      flushList();
      flushTable();
      return;
    }
    flushList();
    flushTable();
    blocks.push(
      <p key={blocks.length} className="text-sm leading-relaxed">
        {inline(line)}
      </p>
    );
  });
  flushList();
  flushTable();

  if (blocks.length === 0) {
    return <p className="muted text-sm">Nothing to preview yet — start writing.</p>;
  }

  return <div className="space-y-3">{blocks}</div>;
}