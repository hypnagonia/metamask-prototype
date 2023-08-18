import { useEffect, useState, useCallback } from 'react'
import { shortenString } from '../../utils'
import { getType } from '../../api/api'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { ethers } from 'ethers'
import { useSnaps } from '../hooks/UseSnaps'

export default function ExplorerTable(props: any) {
    const attestations = props.attestations || []
    const { snaps } = useSnaps()
    const [inputValue, setInputValue] = useState('')
    const handleInputChange = useCallback((event: any) => {
        setInputValue(event.target.value)
    }, [])

    const filteredAttestations =
        inputValue ?
            attestations.filter((a: any) => {
                return true
            })
            : attestations

    return (<>
        <table className="table-1">
            <tr>
                <th>Transaction</th>
                <th>Type</th>
                <th>Attester</th>
                <th>Attestee</th>
                <th>Date</th>
            </tr>
            {attestations.map((a: any) => {
                const date = new Date(a.attestedDate * 1000);
                const meta = getType(a.schemaId)
                let attestee = shortenString(a.attestee, 16)
                let attesteeLink = `/auditor/${a.attestee}`


                if (meta.name === 'Audit') {
                    const shasum = ethers.toUtf8String(a.attestationData[0])

                    const snap = Object.values(snaps).find((s: any) => s.versionList.includes(shasum)) as any
                    if (snap) {
                        const version = snap.versions[shasum]

                        attestee = snap.meta.name + ' ' + version.versionNumber
                        attesteeLink = `/snap/${snap.meta.id}`
                    }
                }

                return <>
                    <tr>
                        <td>
                            {shortenString(a.transactionHash, 20)}
                        </td>
                        <td>
                            <b> {meta.name}</b>
                        </td>
                        <td>
                            <Link to={`/auditor/${a.attester}`}>
                                <b style={{ color: '#2a2a72' }}>
                                    {shortenString(a.attester, 16)}</b>
                            </Link>
                        </td>
                        <td>
                            <Link to={attesteeLink}>
                                <b style={{ color: '#2a2a72' }}>{attestee}</b>
                            </Link>
                        </td>
                        <td>
                            {date.toLocaleString()}</td>
                    </tr>
                </>
            })

            }
        </table>


    </>
    )
}


