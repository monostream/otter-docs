import MarkdownIt from 'markdown-it'
import { nanoid } from 'nanoid'
import { htmlEscape } from '@vuepress/shared'

export const markdownItPlugin = (md: MarkdownIt) => {
	const originalRule = md.renderer.rules.fence.bind(md.renderer.rules);

	md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
		const token = tokens[idx];
		
		if (token.info !== 'mermaid') {
			// Other languages
			return originalRule(tokens, idx, options, env, slf);
		}

		const id = `mermaid_${nanoid(4)}`
		const code = token.content.trim();

		return `<Suspense><Mermaid id="${id}" code="${htmlEscape(code)}"></Mermaid></Suspense>`;
	};
}
