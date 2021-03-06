import React, { FC } from 'react'
import Highlight, { defaultProps, Language } from 'prism-react-renderer'
import { CodeViewWrap } from './style'
import { CopyIcon, CopyOk } from './icon'
import { useCopy } from './hooks'

interface CodeBlockProps {
	code: string
	language: Language
	lineNumbers: number[][]
}

export const CodeView: FC<CodeBlockProps> = ({ code, language, lineNumbers }) => {
	const [copy, status] = useCopy()
	return (
		<CodeViewWrap>
			<span className="copy-icon">
				{status === 'ready' ? <CopyIcon onClick={() => copy(code)} /> : <CopyOk />}
			</span>
			<Highlight {...defaultProps} code={code} language={language} theme={undefined}>
				{({ className, style, tokens, getLineProps, getTokenProps }) => (
					<pre className={className} style={{ ...style }}>
						{tokens.map((line, i) => {
							const inRange = lineNumbers.some(([start, end]) => {
								if (start && end) {
									return i + 1 >= start && i + 1 <= end
								}
								return i + 1 === start
							})

							const { className: cls, ...res } = getLineProps({ line, key: i })
							return (
								<div key={i} className={`${inRange ? 'highlighted ' + cls : cls}`} {...res}>
									{line.map((token, key) => (
										<span key={key} {...getTokenProps({ token, key })} />
									))}
								</div>
							)
						})}
					</pre>
				)}
			</Highlight>
		</CodeViewWrap>
	)
}
