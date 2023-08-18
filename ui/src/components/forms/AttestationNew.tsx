import { useEffect, useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { ethers } from "ethers"
import { createAttestation, create, getAttestationHash } from '../../api/api'
import { UseCreateAttestations } from '../hooks/UseCreateAttestation'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'

export default function AttestationNew(props: any) {
	const [inputValue, setInputValue] = useState('')
	const [safe, setSafe] = useState(true)
	const { shasum } = useParams() as any

	const handleInputChange = useCallback((event: any) => {
		setInputValue(event.target.value)
	}, [])

	const { issueAttestation } = UseCreateAttestations()

	const createAttestation = () => {
		issueAttestation('audit', "", [shasum, inputValue, "", safe ? '1' : '0'])
	}

	return (
		<>
			<div className="container" style={{ marginTop: 30 }}>
				<div className="post-full small-font" >
					<b>New Attestation for {shasum}</b>
					<div className="delimiter" style={{ marginTop: 15, marginBottom: 15 }}></div>
					<br />
					<div>
						<span
							className="strategy-btn"
							style={{ marginRight: 10, backgroundColor: safe ? 'lightgreen' : 'white' }}
							onClick={() => {
								setSafe(true)
							}}>Safe</span>
						<span
							className="strategy-btn"
							style={{ marginRight: 10, backgroundColor: !safe ? '#FFCCCB' : 'white' }}
							onClick={() => {
								setSafe(false)
							}}>Unsafe</span>
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
							className="strategy-btn"
							style={{ marginRight: 10 }}
							onClick={() => {
								createAttestation()
							}}>Create</span>
					</div>

				</div></div>
		</>
	)
}


