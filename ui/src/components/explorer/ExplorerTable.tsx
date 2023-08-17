import { useEffect, useState, useCallback } from 'react'
import { shortenString } from '../../utils'
import { getType } from '../../api/api'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'

export default function ExplorerTable(props: any) {
    const attestations = props.attestations || []
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
            <th>Transaction</th>
            <th>Type</th>
            <th>Attester</th>
            <th>Attestee</th>
            <th>Date</th>
            {attestations.map((a: any) => {
                const date = new Date(a.attestedDate * 1000);
                const meta = getType(a.schemaId)

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
                            <Link to={`/auditor/${a.attestee}`}>
                                <b style={{ color: '#2a2a72' }}>{shortenString(a.attestee, 16)}</b>
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


