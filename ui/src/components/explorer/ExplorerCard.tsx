import { useEffect, useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { shortenString } from '../../utils'
import { getType } from '../../api/api'

export default function ExplorerCard(props: any) {
	const data = props.data
	const date = new Date(data.attestedDate * 1000);

	const meta = getType(data.schemaId)

	let extraCard: any = null

	if (meta.name === 'Audit') {
		extraCard = <>
			<span
				className="strategy-btn"
				style={{}}
				onClick={() => {
				}}>Review</span>
			&nbsp;&nbsp;
			<span
				className="strategy-btn"
				style={{}}
				onClick={() => {
				}}>👍</span>
			&nbsp;&nbsp;
			<span
				className="strategy-btn"
				style={{}}
				onClick={() => {
				}}>👎</span>

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

					<Link to={`/auditor/${data.attester}`}>
						<b style={{ color: '#2a2a72' }}>{data.attester}</b>
					</Link>
					&nbsp;&rarr;&nbsp;
					<Link to={`/auditor/${data.attestee}`}>
						<b style={{ color: '#2a2a72' }}>{data.attestee}</b>
					</Link>
				</div>
				<div className="delimiter" style={{ marginTop: 15, marginBottom: 15 }}></div>
				<div>
					{data.attestationData.join(', ')}
				</div>

				{extraCard && <>
					<div className="delimiter" style={{ marginTop: 15, marginBottom: 15 }}></div>
					{extraCard}
				</>}
			</div>
		</>
	)
}


