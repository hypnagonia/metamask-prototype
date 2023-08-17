import { useEffect, useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { shortenString } from '../../utils'
import { getType } from '../../api/api'

export default function NewAudit(props: any) {
	const data = props.data
	const date = new Date(data.attestedDate * 1000);
	console.log({ data })
	const meta = getType(data.schemaId)


	return (
		<>
			<div className="post-full small-font" >
				<b>{meta.name + ' ' + shortenString(data.attestationId, 20)}</b>&nbsp;{date.toLocaleString()}<br />
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


			</div>
		</>
	)
}


