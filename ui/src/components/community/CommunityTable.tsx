import { useEffect, useState, useCallback } from 'react'
import { shortenString } from '../../utils'
import { getType, schemas } from '../../api/api'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { ethers } from 'ethers'
import { useAttestations } from '../hooks/UseAttestations'

export default function CommunityTable(props: any) {

    const { attestations } = useAttestations()

    const users = new Set() as any
    attestations.forEach((a: any) => {
        if (a.schemaId !== schemas.KarmaAuditAttestorSchemaId) {
            users.add(a.attestee)
        }
        users.add(a.attester)
    })

    const u = [...users]
    return (<>
        <div className="post-full small-font" style={{ marginTop: 30 }}>
            <table className="table-1">
                <tr>
                    <th>Address</th>
                    <th></th>

                </tr>
                {u.map((a: any) => {


                    return <>
                        <tr>
                            <td>
                                <Link to={`/auditor/${a}`}>
                                    <b style={{ color: '#2a2a72' }}>
                                        {(a)}</b>
                                </Link>
                            </td>
                            <td>

                            </td>

                        </tr>
                    </>
                })

                }
            </table>

        </div>
    </>
    )
}


