'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import MermaidChart from './MermaidChart';

interface MarkdownWithMermaidProps {
  content: string;
  className?: string;
}

export default function MarkdownWithMermaid({ content, className = '' }: MarkdownWithMermaidProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
        // Handle Mermaid code blocks
        code: ({ className, children, ...props }: any) => {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';
          const inline = props.inline;

          if (!inline && language === 'mermaid') {
            const chartCode = String(children).replace(/\n$/, '');

            // Determine language from chart content for appropriate title
            const isEnglish = chartCode.includes('Menstrual Pain Onset') || chartCode.includes('Pain Relief Achieved');

            return (
              <div className="my-8">
                <MermaidChart
                  chart={chartCode}
                  title={isEnglish ? "Menstrual Pain Medication Decision Tree" : "痛经用药决策流程图"}
                  description={isEnglish
                    ? "Scientific medication guidance process based on pain severity, including safety checks and effectiveness evaluation steps"
                    : "基于疼痛程度的科学用药指导流程，包含安全检查和效果评估步骤"
                  }
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                />
              </div>
            );
          }
          
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        
        // Enhanced table styling
        table: ({ children }) => (
          <div className="overflow-x-auto my-6">
            <table className="min-w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-sm">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-primary-50">
            {children}
          </thead>
        ),
        th: ({ children }) => (
          <th className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 bg-primary-100 font-semibold text-left text-primary-800 text-sm sm:text-base">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-neutral-700 text-sm sm:text-base">
            {children}
          </td>
        ),
        tr: ({ children }) => (
          <tr className="even:bg-gray-50 hover:bg-primary-25">
            {children}
          </tr>
        ),
        
        // Enhanced blockquote styling
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary-400 pl-4 py-2 my-4 bg-primary-50 rounded-r-lg">
            <div className="text-primary-800 font-medium">
              {children}
            </div>
          </blockquote>
        ),
        
        // Enhanced list styling
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-2 my-4 text-neutral-700">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-2 my-4 text-neutral-700">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed">
            {children}
          </li>
        ),
        
        // Enhanced heading styling
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold text-neutral-800 mb-6 mt-8 first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4 mt-8 first:mt-0">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold text-neutral-800 mb-3 mt-6 first:mt-0">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-lg font-semibold text-neutral-800 mb-2 mt-4 first:mt-0">
            {children}
          </h4>
        ),
        
        // Enhanced paragraph styling
        p: ({ children }) => (
          <p className="text-neutral-700 leading-relaxed mb-4">
            {children}
          </p>
        ),
        
        // Enhanced link styling
        a: ({ href, children }) => (
          <a 
            href={href}
            className="text-primary-600 hover:text-primary-800 underline decoration-primary-300 hover:decoration-primary-500 transition-colors"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        ),
        
        // Enhanced strong/em styling
        strong: ({ children }) => (
          <strong className="font-semibold text-neutral-800">
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em className="italic text-neutral-700">
            {children}
          </em>
        ),
      }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
