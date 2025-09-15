import React from 'react';
import html2canvas from 'html2canvas';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createRoot } from 'react-dom/client';
import { FONT_FAMILY } from '../constants/typography';
import { NotecardData, CARD_COLORS } from '../types';

interface MarkdownImageCacheEntry {
  content: string;
  width: number;
  height: number;
  image: HTMLImageElement;
  timestamp: number;
}

class MarkdownToImageService {
  private cache = new Map<string, MarkdownImageCacheEntry>();
  private maxCacheSize = 100;
  private maxCacheAge = 5 * 60 * 1000; // 5 minutes

  private generateCacheKey(content: string, width: number, height: number, backgroundColor: string): string {
    return `${content.slice(0, 100)}_${width}_${height}_${backgroundColor}`;
  }

  private cleanCache(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());

    // Remove expired entries
    entries.forEach(([key, entry]) => {
      if (now - entry.timestamp > this.maxCacheAge) {
        this.cache.delete(key);
      }
    });

    // If still over limit, remove oldest entries
    if (this.cache.size > this.maxCacheSize) {
      const sortedEntries = entries
        .filter(([key]) => this.cache.has(key))
        .sort((a, b) => a[1].timestamp - b[1].timestamp);

      const toRemove = sortedEntries.slice(0, this.cache.size - this.maxCacheSize);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  private createOffscreenMarkdown(
    content: string,
    width: number,
    height: number,
    scale: number,
    card: NotecardData
  ): Promise<HTMLDivElement> {
    return new Promise((resolve, reject) => {
      try {
        // Calculate content area position and size (matching MarkdownRenderer logic)
        // Content should start right after the key field
        const keyFieldY = card.date ? 56 : 40; // Same as key icon position in Notecard
        const keyFieldHeight = 16; // Height needed for key field
        const baseContentY = keyFieldY + keyFieldHeight + 8; // 8px padding after key field
        const baseBottomSpace = 35; // Extra padding between content area and tags
        const TITLE_PADDING = 10;

        const scaledContentY = baseContentY;
        const scaledBottomSpace = baseBottomSpace;
        const scaledTitlePadding = TITLE_PADDING;

        const contentHeight = height - scaledContentY - scaledBottomSpace;
        const contentWidth = width - scaledTitlePadding * 2;

        // Create container div
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '-9999px';
        container.style.left = '-9999px';
        container.style.width = `${contentWidth}px`;
        container.style.minHeight = `${contentHeight}px`;
        container.style.height = 'auto'; // Allow content to expand naturally
        container.style.backgroundColor = card.backgroundColor || CARD_COLORS.DEFAULT;
        container.style.fontFamily = FONT_FAMILY;
        container.style.fontSize = '14px';
        container.style.lineHeight = '1.4';
        container.style.color = '#333';
        container.style.padding = '0';
        container.style.margin = '0';
        container.style.boxSizing = 'border-box';
        container.style.overflow = 'visible'; // Allow content to expand naturally
        container.style.border = 'none';

        // Create markdown wrapper
        const markdownWrapper = document.createElement('div');
        markdownWrapper.style.width = '100%';
        markdownWrapper.style.height = '100%';
        markdownWrapper.style.margin = '0';
        markdownWrapper.style.padding = '0';

        container.appendChild(markdownWrapper);
        document.body.appendChild(container);

        // Render React markdown into the wrapper
        const root = createRoot(markdownWrapper);
        root.render(
          React.createElement(ReactMarkdown, {
            remarkPlugins: [remarkGfm],
            children: content
          })
        );

        // Wait for rendering to complete
        setTimeout(() => {
          resolve(container);
        }, 100);
      } catch (error) {
        reject(error);
      }
    });
  }

  async convertMarkdownToImage(
    content: string,
    width: number,
    height: number,
    scale: number,
    card: NotecardData
  ): Promise<HTMLImageElement> {
    // Check cache first
    const cacheKey = this.generateCacheKey(content, width, height, card.backgroundColor || CARD_COLORS.DEFAULT);
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached.image;
    }

    try {
      // Clean cache periodically
      this.cleanCache();

      // Don't render if content is empty
      if (!content || content.trim() === '') {
        const emptyImage = new Image();
        emptyImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        return emptyImage;
      }

      // Create off-screen HTML element
      const container = await this.createOffscreenMarkdown(content, width, height, scale, card);

      // Convert to canvas using html2canvas
      const canvas = await html2canvas(container, {
        logging: false,
        allowTaint: true,
        useCORS: true,
        width: container.offsetWidth,
        height: container.offsetHeight
      });

      // Clean up DOM
      document.body.removeChild(container);

      // Convert canvas to image
      const image = new Image();
      image.src = canvas.toDataURL('image/png');

      // Cache the result
      this.cache.set(cacheKey, {
        content,
        width,
        height,
        image,
        timestamp: Date.now()
      });

      return image;
    } catch (error) {
      console.error('Failed to convert markdown to image:', error);
      // Return empty image on error
      const errorImage = new Image();
      errorImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      return errorImage;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

// Export singleton instance
export const markdownToImageService = new MarkdownToImageService();