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
			<div className="container" style={{ marginTop: 30, width: 800 }}>
				<div className="post-full2 small-font" >

				<div>
					<div style={{ height: 80, marginTop: -20 }}>
						<div className="color2" style={{
							fontSize: 26, fontWeight: 'bold', cursor: 'pointer',
							lineHeight: 1
						}}>
							<br />
							<span style={{ fontSize: 36 }}><b>New Attestation for {shasum}</b></span><br />
							
						</div>
					</div>
				</div>
					
					<div className="" style={{ marginTop: 15, marginBottom: 15 }}></div>
					<br />
					<div>
						<span
							className="strategy-btn"
							style={{ marginRight: 10, backgroundColor: safe ? 'lightgreen' : 'white' }}
							onClick={() => {
								setSafe(true)
							}}>
								<img src='/shield.svg' style={{width:20,height:20}}/>&nbsp;
								Safe</span>
						<span
							className="strategy-btn"
							style={{ marginRight: 10, backgroundColor: !safe ? '#FFCCCB' : 'white' }}
							onClick={() => {
								setSafe(false)
							}}>
								<img src='/unsafe.svg' style={{width:20,height:20}}/>&nbsp;
								Unsafe</span>
						<br />
						<br />
						<br />
						<input
							value={inputValue}
							onChange={handleInputChange}
							placeholder="Enter audit notes..."
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


