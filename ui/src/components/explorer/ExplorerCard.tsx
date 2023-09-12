import { useEffect, useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { shortenString } from '../../utils'
import { getType, schemas } from '../../api/api'
import { UseCreateAttestations } from '../hooks/UseCreateAttestation'
import { ethers } from 'ethers'
import { UseCounts } from '../hooks/UseCounts'
import { Address } from '../common/Address'
import { Avatar } from '../common/Avatar'
import moment from 'moment'
import { Tooltip } from '../Tooltip'
import { useAttestations } from '../hooks/UseAttestations'

export default function ExplorerCard(props: any) {
	const { issueAttestation } = UseCreateAttestations()
	const { getCounts, getGroups } = UseCounts()
	const { attestations } = useAttestations()

	const createAttestation = (name: string, attestationId: string, upvote = true) => {
		issueAttestation(name.toLowerCase() + 'Approve', "", [attestationId, upvote ? '1' : '0'])
	}

	const data = props.data
	const date = new Date(data.attestedDate * 1000);

	const meta = getType(data.schemaId)

	let extraCard: any = null

	if (meta.name === 'Audit' || meta.name === 'Review') {

		const list = attestations.filter((a: any) => {

			if (data.attestationId !== a.attestationDataHex[0]) {
				return false
			}

			if (meta.name === 'Audit') {
				return a.schemaId === schemas.KarmaAuditApprovalAttestorSchemaId
			}


			if (meta.name === 'Review') {
				return a.schemaId === schemas.KarmaReviewApprovalAttestorSchemaId
			}
		}).map((a: any) => { return { attester: a.attester, vote: a.attestationDataHex[1] } })
		const listUpvotes = list.filter((a: any) => a.vote === '1').map((a: any) => <div><Address address={a.attester}/></div>)
		const listDownvotes =list.filter((a: any) => a.vote === '0').map((a: any) => <div><Address address={a.attester}/></div>)

		const listUpvotesDisplay = listUpvotes.length ? <>{listUpvotes}</>: null
		const listDownvotesDisplay = listDownvotes.length ? <>{listDownvotes}</>: null

		extraCard = <>
			<Tooltip text={listUpvotesDisplay}>
				<span
					className="strategy-btn small-btn"
					style={{}}
					onClick={() => {
						createAttestation(meta.name, data.attestationId, true)
					}}>👍&nbsp;{(meta.name === 'Audit'
						? getCounts(data.attestationId).auditApprovals
						: getCounts(data.attestationId).reviewApprovals) || ''
					}</span>

			</Tooltip>
			&nbsp;&nbsp;
			<Tooltip text={listDownvotesDisplay}>
				<span
					className="strategy-btn small-btn"
					style={{}}
					onClick={() => {
						createAttestation(meta.name, data.attestationId, false)
					}}>👎&nbsp;{(meta.name === 'Audit'
						? getCounts(data.attestationId).auditDisapprovals
						: getCounts(data.attestationId).reviewDisapprovals) || ''
					}</span>
			</Tooltip>
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
			<Address shorten={true} address={data.attester} /></b> rated <b>{shortenString(d[0], 20)}</b> review as {+d[1] ? '👍' : '👎'}
		</>

	}
	if (meta.name === 'Audit Approval') {
		text = <><b>
			<Address shorten={true} address={data.attester} /></b> rated <b>{shortenString(d[0], 20)}</b> audit as {+d[1] ? '👍' : '👎'}
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
					<div style={{ width: '100px' }}>
						<Link to={`/auditor/${data.attester.toLowerCase()}`}>
							<Avatar id={attester}></Avatar>
						</Link>
					</div>
					<div style={{ fontSize: 14, color: '#543A69', textAlign: 'left', width: '700px', marginLeft: 10 }}>
						{text}

					</div>
					<div style={{
						justifyContent: 'flex-end', alignItems: 'center',
						width: '200px',
						display: 'flex', fontSize: 14, color: '#543A69', textAlign: 'right'
					}}>
						{/*date.toLocaleString()*/}
						{ago}&nbsp;ago&nbsp;&nbsp;<a href={`https://explorer.testnet.harmony.one/tx/${data.transactionHash}`} target='blank'>
							<img src='/explorerLogo.svg' />
						</a>
					</div>

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


