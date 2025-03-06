/*
 * COPYRIGHT (c) Siemens AG 2018-2025 ALL RIGHTS RESERVED.
 */

let parser: any = null;

export const errorSymbol =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'><path fill-rule='evenodd' d='M384,0 L384,384 L0,384 L0,0 L384,0 Z M192,207.085 L57.751,341.333 L326.248,341.333 L192,207.085 Z M42.666,57.751 L42.666,326.248 L176.915,192 L42.666,57.751 Z M341.333,57.751 L207.085,192 L341.333,326.248 L341.333,57.751 Z M326.248,42.666 L57.751,42.666 L192,176.915 L326.248,42.666 Z' transform='translate(64 64)'/></svg>";

export function parseSVGDataContent(content: string, element?: HTMLElement): string {
  if (typeof window['DOMParser'] === 'undefined') {
    console.error('DOMParser not supported by your browser.');
    return '';
  }

  if (parser === null) {
    parser = new window['DOMParser']();
  }

  const svgDocument = parser.parseFromString(content, 'text/html');
  const svgElement = svgDocument.querySelector('svg') as HTMLElement;

  if (!svgElement) {
    if (element) {
      console.error('No valid svg data provided', element);
    } else {
      console.error('No valid svg data provided');
    }
    return '';
  }

  return svgElement.outerHTML;
}
