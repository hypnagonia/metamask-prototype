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
			<div className="container" style={{ marginTop: 30, width: 800 }}>
				<div className="post-full2 small-font" >

				<div>
					<div style={{ height: 100, marginTop: -20 }}>
						<div className="color2" style={{
							fontSize: 26, fontWeight: 'bold', cursor: 'pointer',
							lineHeight: 1
						}}>
							<br />
							<span style={{ fontSize: 36 }}><b>New Review for {shasum}</b></span><br />
							
						</div>
					</div>
				</div>


					
					<div className="" style={{ marginTop: 15, marginBottom: 15 }}></div>
					<br />
					<div>
						
						{/*<b>Score</b><br /><br />*/}
						{[1, 2, 3, 4, 5].map((s: number) => {
							return <span
								key={s}
								className={'strategy-btn ' + (score === s ? ' primary' : '')}
								style={{ marginRight: 10, width: 42, padding: 0 }}
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
							placeholder="Enter Review Notes..."
							className="normal-input"
							style={{ width: 400 }}
						/>
					</div>
					<br />
					<div className="" style={{ marginTop: 15, marginBottom: 15 }}></div>
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


