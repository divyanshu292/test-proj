import * as React from 'react'
import { useRef, useEffect } from 'react'
import * as Prism from 'prismjs'
import CopyButton from './CopyButton'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-scss'
//import 'prismjs/components/prism-html'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-yaml'

interface MessageFormatterProps {
  content: string;
}

const MessageFormatter: React.FC<MessageFormatterProps> = ({ content }) => {
  const codeBlocksRegex = /```(\w+)?\s*\n([\s\S]*?)\n```/g;
  const inlineCodeRegex = /`([^`]+)`/g;
  const formattedContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Highlight code blocks after the component mounts
    if (formattedContentRef.current) {
      Prism.highlightAllUnder(formattedContentRef.current);
    }
  }, [content]);

  // Function to format the message content with code highlighting
  const formatContent = () => {
    let formattedText = content;
    let parts: Array<{ type: 'text' | 'code' | 'inlineCode', content: string, language?: string }> = [];
    let lastIndex = 0;

    // Extract code blocks
    let match;
    while ((match = codeBlocksRegex.exec(formattedText)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: formattedText.substring(lastIndex, match.index)
        });
      }

      // Add code block
      const language = match[1] || 'plaintext';
      parts.push({
        type: 'code',
        content: match[2],
        language
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < formattedText.length) {
      parts.push({
        type: 'text',
        content: formattedText.substring(lastIndex)
      });
    }

    // Process inline code in text parts
    const processedParts: Array<{ type: 'text' | 'code' | 'inlineCode', content: string, language?: string }> = [];
    
    parts.forEach(part => {
      if (part.type === 'text') {
        let textPart = part.content;
        let inlineLastIndex = 0;
        let inlineParts: Array<{ type: 'text' | 'inlineCode', content: string }> = [];
        
        // Extract inline code
        let inlineMatch;
        while ((inlineMatch = inlineCodeRegex.exec(textPart)) !== null) {
          // Add text before inline code
          if (inlineMatch.index > inlineLastIndex) {
            inlineParts.push({
              type: 'text',
              content: textPart.substring(inlineLastIndex, inlineMatch.index)
            });
          }

          // Add inline code
          inlineParts.push({
            type: 'inlineCode',
            content: inlineMatch[1]
          });

          inlineLastIndex = inlineMatch.index + inlineMatch[0].length;
        }

        // Add remaining text
        if (inlineLastIndex < textPart.length) {
          inlineParts.push({
            type: 'text',
            content: textPart.substring(inlineLastIndex)
          });
        }

        // Add processed inline parts
        processedParts.push(...inlineParts);
      } else {
        // Add code blocks as-is
        processedParts.push(part);
      }
    });

    // Render formatted content
    return (
      <div className="whitespace-pre-wrap" ref={formattedContentRef}>
        {processedParts.map((part, index) => {
          if (part.type === 'code') {
            return (
              <div key={index} className="my-4 rounded-lg overflow-hidden border border-gray-700 shadow-sm">
                <div className="bg-gray-800 text-gray-300 px-4 py-2 text-xs font-mono border-b border-gray-700 flex justify-between items-center">
                  <span className="font-medium">{part.language}</span>
                  <CopyButton text={part.content} className="hover:bg-gray-700/70" />
                </div>
                <pre className="bg-gray-800/60 p-4 overflow-x-auto rounded-b-lg">
                  <code className={`language-${part.language}`}>{part.content}</code>
                </pre>
              </div>
            );
          } else if (part.type === 'inlineCode') {
            return (
              <code key={index} className="px-1 py-0.5 mx-0.5 bg-gray-800 text-gray-200 rounded font-mono text-sm">
                {part.content}
              </code>
            );
          } else {
            return <span key={index}>{part.content}</span>;
          }
        })}
      </div>
    );
  };

  return formatContent();
};

export default MessageFormatter