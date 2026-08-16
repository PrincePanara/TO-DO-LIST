import React from 'react';

function inline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
    return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
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
        code = [];
      }
      return;
    }
    if (code) {
      code.push(raw);
      return;
    }
    if (/^#{1,3}\s/.test(line)) {
      flushList();
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
      return;
    }
    flushList();
    blocks.push(
      <p key={blocks.length} className="text-sm leading-relaxed">
        {inline(line)}
      </p>
    );
  });
  flushList();

  if (blocks.length === 0) {
    return <p className="muted text-sm">Nothing to preview yet — start writing.</p>;
  }

  return <div className="space-y-3">{blocks}</div>;
}