import {
	ASCII_SET,
	BRAILLE_SPACE,
	LEFT_PAD,
	type WeightedAsciiArt,
} from './ascii-art';
import { FIRST_TIME_CONTRIBUTOR_ASCII } from './first-commit';

export type BrandingConfig = {
	firstContributorTitle?: string;
	firstContributorMessage?: string;
	firstContributorAuthor?: string;
	shareTextTemplate?: string;
	shareUrlDefault?: string;
	docsUrl?: string;
	communityUrl?: string;
	twitterHandle?: string;
	footerText?: string;
};

export type RenderCommentOptions = {
	debug?: boolean;
	seed?: string;
	firstContribution?: boolean;
	status?: string;
	branding?: BrandingConfig;
};

function pickWeightedAscii(
	choices: readonly WeightedAsciiArt[],
	seed?: string
): string {
	let total = 0;
	for (const c of choices) {
		const w = Math.max(0, c.weight);
		total += w;
	}
	if (total <= 0) {
		if (choices[0]?.art) {
			return choices[0].art;
		}
		return '';
	}
	// Deterministic fallback when a seed is provided (FNV-1a style hash)
	let r: number;
	if (seed) {
		let h = 2166136261 >>> 0;
		for (let i = 0; i < seed.length; i++) {
			h ^= seed.charCodeAt(i);
			// h *= 16777619 (using shifts to avoid bigint)
			h = (h + (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)) >>> 0;
		}
		// Map uniformly to [0, total) using 32-bit range (avoids modulo bias)
		r = (h / 0x100000000) * total;
	} else {
		r = Math.random() * total;
	}
	let acc = 0;
	for (const c of choices) {
		const w = Math.max(0, c.weight);
		acc += w;
		if (r < acc) {
			return c.art;
		}
	}
	const lastChoice = choices.at(-1);
	if (lastChoice?.art) {
		return lastChoice.art;
	}
	return '';
}

/**
 * Render a deterministic, branded Markdown block for docs-preview comments.
 *
 * - When `firstContribution` is true, a special ASCII art banner is shown.
 * - When `debug` is true, renders all available ASCII variants.
 * - `seed` ensures deterministic ASCII selection for the same input.
 *
 * @param url - The preview URL to include in the comment.
 * @param options - Rendering options.
 * @returns The complete Markdown string.
 * @internal
 * @example
 * renderCommentMarkdown('https://example.vercel.app', { seed: 'abc123' });
 */
export function renderCommentMarkdown(
	url: string,
	options?: RenderCommentOptions
): string {
	const updated = new Date().toUTCString();
	let status = 'Ready';
	if (options?.status) {
		status = options.status;
	}

	const formatArt = (ascii: string) => {
		const asciiWithBrailleSpaces = ascii.replace(/ /g, BRAILLE_SPACE);
		const pad = LEFT_PAD;

		return asciiWithBrailleSpaces
			.split('\n')
			.map((l) => `${pad}${l}`)
			.join('\n');
	};

	const branding = options?.branding || {};
	const firstTimeContributorTitle =
		branding.firstContributorTitle || '🎉 **Your first contribution!**';
	const firstTimeContributorMessageText =
		branding.firstContributorMessage ||
		"This is your first contribution, and I just wanted to say thank you. You're helping us build something great. Here's to many more commits ahead! 🚀";
	const firstTimeContributorAuthorText =
		branding.firstContributorAuthor || '';

	const firstTimeContributorMessage = [
		'<br/>',
		`> ${firstTimeContributorTitle}`,
		'> ',
		`> ${firstTimeContributorMessageText}`,
		...(firstTimeContributorAuthorText
			? ['> ', `> ${firstTimeContributorAuthorText}`, '']
			: ['']),
	];

	const previewMessage = [
		'### Docs Preview',
		'| Preview | Status | Updated (UTC) |',
		'| - | - | - |',
		`| [Open Preview](${url}) | ${status} | ${updated} |`,
	];

	const messageTemplate = ({
		art,
		url,
		updated,
		firstContribution,
	}: {
		art: string;
		url?: string;
		updated?: string;
		firstContribution?: boolean;
	}) => {
		const lines: string[] = [];
		lines.push('```');
		let artBlock = art;
		if (firstContribution) {
			artBlock = FIRST_TIME_CONTRIBUTOR_ASCII;
		}
		lines.push(formatArt(artBlock));
		lines.push('```');
		lines.push('');
		if (firstContribution) {
			lines.push(firstTimeContributorMessage.join('\n'));
		}
		if (url && updated) {
			lines.push(previewMessage.join('\n'));
		}
		// Share section (inspired by CodeRabbit share block)
		if (branding.shareTextTemplate || branding.shareUrlDefault) {
			lines.push('<details>');
			lines.push('<summary>💙 Share your contribution on social media</summary>');
			lines.push('');
			const shareBase = branding.shareTextTemplate || 'I just made a contribution!';
			const shareText = url
				? shareBase.replace(/\{\{url\}\}/g, url)
				: shareBase.replace(/\{\{url\}\}/g, '');
			const shareTextEncoded = encodeURIComponent(shareText);
			const shareUrlParam = encodeURIComponent(
				url ?? branding.shareUrlDefault ?? ''
			);
			if (shareUrlParam) {
				lines.push(
					`- [X](https://twitter.com/intent/tweet?text=${shareTextEncoded})`
				);
				lines.push(
					`- [Mastodon](https://mastodon.social/share?text=${shareTextEncoded})`
				);
				lines.push(
					`- [Reddit](https://www.reddit.com/submit?text=${shareTextEncoded})`
				);
				lines.push(
					`- [LinkedIn](https://www.linkedin.com/sharing/share-offsite/?url=${shareUrlParam}&mini=true&text=${shareTextEncoded})`
				);
			}
			lines.push('');
			lines.push('</details>');
			lines.push('');
		}
		// Documentation and Community section
		if (branding.docsUrl || branding.communityUrl || branding.twitterHandle) {
			lines.push('<details>');
			lines.push('<summary>🪧 Documentation and Community</summary>');
			lines.push('');
			if (branding.docsUrl) {
				lines.push(`- Visit our [Documentation](${branding.docsUrl}) for detailed information.`);
			}
			if (branding.communityUrl) {
				lines.push(`- Join our [Community](${branding.communityUrl}) to get help, request features, and share feedback.`);
			}
			if (branding.twitterHandle) {
				const twitterUrl = branding.twitterHandle.startsWith('http')
					? branding.twitterHandle
					: `https://twitter.com/${branding.twitterHandle.replace('@', '')}`;
				lines.push(`- Follow us on [X](${twitterUrl}) for updates and announcements.`);
			}
			lines.push('');
			lines.push('</details>');
			lines.push('');
		}
		// Footer
		if (branding.footerText) {
			lines.push('---');
			lines.push(branding.footerText);
			lines.push('');
		}
		return lines.join('\n');
	};

	if (options?.debug) {
		return ASCII_SET.map((a) =>
			messageTemplate({ art: a.art, url, updated })
		).join('\n\n');
	}

	const inner = messageTemplate({
		art: pickWeightedAscii(ASCII_SET, options?.seed ?? url),
		url,
		updated,
		firstContribution: options?.firstContribution,
	});
	return inner;
}
