import { useEffect, useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { shortenString } from '../../utils'
import { getType } from '../../api/api'
import { UseCreateAttestations } from '../hooks/UseCreateAttestation'
import { ethers } from 'ethers'
import { UseCounts } from '../hooks/UseCounts'
import { Address } from '../common/Address'
import { Avatar } from '../common/Avatar'
import moment from 'moment'

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
			<span
				className="strategy-btn small-btn"
				style={{}}
				onClick={() => {
					createAttestation(meta.name, data.attestationId, true)
				}}>👍&nbsp;{(meta.name === 'Audit'
					? getCounts(data.attestationId).auditApprovals
					: getCounts(data.attestationId).reviewApprovals) || ''
				}</span>
			&nbsp;&nbsp;

			<span
				className="strategy-btn small-btn"
				style={{}}
				onClick={() => {
					createAttestation(meta.name, data.attestationId, false)
				}}>👎&nbsp;{(meta.name === 'Audit'
					? getCounts(data.attestationId).auditDisapprovals
					: getCounts(data.attestationId).reviewDisapprovals) || ''
				}</span>

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

	const attester = data.attester.toLowerCase()

	let text = null

	const d = data.attestationData.map((a: any) => ethers.toUtf8String(a))

	if (meta.name === 'Follow') {
		text = <><b>
			<Address shorten={true} address={data.attester} /></b>&nbsp;followed&nbsp;<b><Address shorten={true} address={data.attestee} /></b>
		</>
	}

	if (meta.name === 'Audit') {
		text = <><b>
			<Address shorten={true} address={data.attester} /></b>&nbsp;audited&nbsp;<b>{shortenString(d[0], 20)}</b>&nbsp;as&nbsp;<b>
				{+d[3] ? 'Safe' : 'Unsafe'}</b><br />
			{d[1]}
		</>
	}

	if (meta.name === 'Review Approval') {
		text = <><b>
			<Address shorten={true} address={data.attester} /></b> gives {+d[1] ? '👍' : '👎'} to&nbsp;
			<b>{shortenString(d[0], 20)}</b>
			</>

	}
	if (meta.name === 'Audit Approval') {
		text = <><b>
			<Address shorten={true} address={data.attester} /></b> gives {+d[1] ? '👍' : '👎'} to&nbsp;
			<b>{shortenString(d[0], 20)}</b>
			</>
	}

	if (meta.name === 'Review') {
		text = <><b>
			<Address shorten={true} address={data.attester} /></b>&nbsp;reviewed&nbsp;<b>{shortenString(d[0], 20)}</b>&nbsp;as&nbsp;<b>
				{d[2]}/5</b><br />
			{d[1]}
		</>
	}

	const ago = moment(date).fromNow(true)

	return (
		<>
			<div style={{ marginBottom: 30 }}>
				<div style={{
					display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
					marginBottom: 10,
					alignItems: 'center', width: '100%'
				}}>
					<div style={{width: '100px'}}>
						<Link to={`/audit/${data.attestationId}`}>
							<Avatar id={attester}></Avatar>
						</Link>
					</div>
					<div style={{ fontSize: 14, color: '#543A69', textAlign: 'left', width: '700px', marginLeft: 10 }}>
						{text}
						
					</div>
					<div style={{ justifyContent: 'flex-end', alignItems: 'center',
					width: '200px',
					display: 'flex', fontSize: 14, color: '#543A69', textAlign: 'right' }}>
						{/*date.toLocaleString()*/}
						{ago}&nbsp;ago&nbsp;&nbsp;<a href={`https://explorer.testnet.harmony.one/tx/${data.transactionHash}`} target='blank'>
							<img src='/explorerLogo.svg'  />
						</a>
					</div>
					{/*
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
				*/}
				</div>
				<div style={{ textAlign: 'left', marginLeft: 90 }}>
							{extraCard && <>
								{extraCard}
							</>}
						</div>
			</div>
		</>
	)
}


