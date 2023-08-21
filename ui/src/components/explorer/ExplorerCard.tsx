import { useEffect, useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { shortenString } from '../../utils'
import { getType } from '../../api/api'
import { UseCreateAttestations } from '../hooks/UseCreateAttestation'
import { ethers } from 'ethers'
import { UseCounts } from '../hooks/UseCounts'
import {Address} from '../common/Address'

export default function ExplorerCard(props: any) {
	const { issueAttestation } = UseCreateAttestations()
	const { getCounts } = UseCounts()

	const createAttestation = (name: string, attestationId: string, upvote = true) => {
		issueAttestation(name.toLowerCase() + 'Approve', "", [attestationId, upvote ? '1' : '0'])
	}

	const data = props.data
	const date = new Date(data.attestedDate * 1000);

	const meta = getType(data.schemaId)

	let extraCard: any = null

	if (meta.name === 'Audit' || meta.name === 'Review') {
		extraCard = <>
			<b>({meta.name === 'Audit'
				? getCounts(data.attestationId).auditApprovals
				: getCounts(data.attestationId).reviewApprovals
			})&nbsp;&nbsp;&nbsp;</b>
			<span
				className="strategy-btn"
				style={{}}
				onClick={() => {
					createAttestation(meta.name, data.attestationId, true)
				}}>👍</span>
			&nbsp;&nbsp;
			<b>({meta.name === 'Audit'
				? getCounts(data.attestationId).auditDisapprovals
				: getCounts(data.attestationId).reviewDisapprovals
			})&nbsp;&nbsp;&nbsp;</b>
			<span
				className="strategy-btn"
				style={{}}
				onClick={() => {
					createAttestation(meta.name, data.attestationId, false)
				}}>👎</span>

		</>
	}

	const displayData = (data: string[]) => {
		const d = data.map((a: any) => ethers.toUtf8String(a))
		if (meta.name === 'Follow') {
			return <>Weight: <b>{d[0]}</b></>
		}

		if (meta.name === 'Audit') {
			return <>
				Snap Checksum: <b>{d[0]}</b><br />
				Report: <b>{d[1]}</b><br />
				Safe: <b>{+d[3] ? 'Yes' : 'No'}</b>
			</>
		}
		if (meta.name === 'Review') {
			return <>
				Snap Checksum: <b>{d[0]}</b><br />
				Report: <b>{d[1]}</b><br />
				Score: <b>{d[2]}</b>
			</>
		}

		return <>
			Attestation Id: <b>{shortenString(d[0], 20)}</b><br />
			<b>{+d[1] ? 'Upvote' : 'Downvote'}</b>
		</>
	}

	return (
		<>
			<div className="post-full small-font" >
				<b>{meta.name}&nbsp;<Link to={`/audit/${data.attestationId}`}>
					<b style={{ color: '#2a2a72' }}>{shortenString(data.attestationId, 20)}</b>
				</Link>
				</b>&nbsp;{date.toLocaleString()}<br />
				Transaction Hash: <b>{shortenString(data.transactionHash, 20)}</b>
				<div className="delimiter" style={{ marginTop: 15, marginBottom: 15 }}></div>
				<div>
					{meta.name !== 'Follow' && <>Attester:&nbsp;</>}
					<Link to={`/auditor/${data.attester}`}>
						<b style={{ color: '#2a2a72' }}><Address address={data.attester}/></b>
					</Link>
					{meta.name === 'Follow' && <>&nbsp;&rarr;&nbsp;
						<Link to={`/auditor/${data.attestee}`}>
							<b style={{ color: '#2a2a72' }}><Address address={data.attestee}/></b>
						</Link></>}
				</div>
				<div className="delimiter" style={{ marginTop: 15, marginBottom: 15 }}></div>
				<div>
					{displayData(data.attestationData)}
				</div>

				{extraCard && <>
					<div className="delimiter" style={{ marginTop: 15, marginBottom: 15 }}></div>
					{extraCard}
				</>}
			</div>
		</>
	)
}


