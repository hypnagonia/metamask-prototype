import { useEffect, useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { ethers } from "ethers"
import { createAttestation, create, getAttestationHash } from '../../api/api'
import { UseCreateAttestations } from '../hooks/UseCreateAttestation'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'

export default function ReviewNew(props: any) {
	const [inputValue, setInputValue] = useState('')
	const [score, setScore] = useState(5)
	const { shasum } = useParams() as any

	const handleInputChange = useCallback((event: any) => {
		setInputValue(event.target.value)
	}, [])

	const { issueAttestation } = UseCreateAttestations()

	const createAttestation = () => {
		issueAttestation('review', "", [shasum, inputValue, '' + score])
	}

	return (
		<>
			<div className="container" style={{ marginTop: 30 }}>
				<div className="post-full small-font" >
					<b>New Review for {shasum}</b>
					<div className="delimiter" style={{ marginTop: 15, marginBottom: 15 }}></div>
					<br />
					<div><b>Score</b><br /><br />
						{[1, 2, 3, 4, 5].map((s: number) => {
							return <span
								key={s}
								className={'strategy-btn ' + (score === s ? ' secondary' : '')}
								style={{ marginRight: 10 }}
								onClick={() => {
									setScore(s)
								}}>{s}</span>
						})}

						<br />
						<br />
						<br />
						<input
							value={inputValue}
							onChange={handleInputChange}
							placeholder="Report"
							className="normal-input"
							style={{ width: '100%' }}
						/>
					</div>
					<br />
					<div className="delimiter" style={{ marginTop: 15, marginBottom: 15 }}></div>
					<div>
						<span
							className="strategy-btn primary"
							style={{ marginRight: 10 }}
							onClick={() => {
								createAttestation()
							}}>Create</span>
					</div>

				</div></div>
		</>
	)
}


