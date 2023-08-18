import React, { useState, useEffect } from 'react';
import { getSnaps } from '../../api/registry'
import { create as saveRecordToBackend, getAll, schemas } from '../../api/api'
import { useAttestations } from './UseAttestations'
import { useSnaps } from './UseSnaps'
import { ethers } from 'ethers'

const initialCount = {
    audits: 0,
    reviews: 0,
    auditApprovals: 0,
    auditDisapprovals: 0,
    reviewApprovals: 0,
    reviewDisapprovals: 0,
    following: 0
}

export function UseCounts() {
    const { attestations } = useAttestations()
    const [counts, setCounts] = useState({} as any)
    const { snaps } = useSnaps()

    const getSnapId = (shasum: string) => {
        const snap = Object.values(snaps).find((s: any) => s.versionList.includes(shasum)) as any
        if (!snap) {
            return -1
        }

        return snap.meta.id
    }
    const getCounts = (key: any) => {
        if (!counts['' + key]) {
            return initialCount
        }

        return counts['' + key]
    }

    useEffect(() => {
        if (!snaps || !Object.keys(snaps).length) {
            return
        }
        if (!attestations.length) {
            return
        }
        const o = {} as any

        attestations.forEach((a: any) => {
            const address = a.attester.toLowerCase()
            const d = a.attestationData.map((a: any) => ethers.toUtf8String(a))

            if (a.schemaId === schemas.KarmaAuditAttestorSchemaId) {
                const shasum = d[0]
                const snapId = getSnapId(shasum)
                o[snapId] = o[snapId] || { ...initialCount }
                o[snapId].audits = o[snapId].audits + 1
                o[shasum] = o[shasum] || { ...initialCount }
                o[shasum].audits = o[shasum].audits + 1
                o[address] = o[address] || { ...initialCount }
                o[address].audits++
                return
            }

            if (a.schemaId === schemas.KarmaReviewAttestorSchemaId) {
                const shasum = d[0]
                const snapId = getSnapId(shasum)
                o[snapId] = o[snapId] || { ...initialCount }
                o[snapId].reviews++
                o[shasum] = o[shasum] || { ...initialCount }
                o[shasum].reviews++
                o[address] = o[address] || { ...initialCount }
                o[address].reviews++
                return
            }

            if (a.schemaId === schemas.KarmaAuditApprovalAttestorSchemaId) {
                const attestationId = d[0]
                const upvote = +d[1]

                o[attestationId] = o[attestationId] || { ...initialCount }
                o[address] = o[address] || { ...initialCount }

                if (upvote === 1) {
                    o[attestationId].auditApprovals++
                    o[address].auditApprovals++
                } else {
                    o[attestationId].auditDisapprovals++
                    o[address].auditDisapprovals++
                }
                return
            }

            if (a.schemaId === schemas.KarmaReviewApprovalAttestorSchemaId) {
                const attestationId = d[0]
                const upvote = +d[1]

                o[attestationId] = o[attestationId] || { ...initialCount }
                o[address] = o[address] || { ...initialCount }
                if (upvote === 1) {
                    o[attestationId].reviewApprovals++
                    o[address].reviewApprovals++
                } else {
                    o[attestationId].reviewDisapprovals++
                    o[address].reviewDisapprovals++
                }
                return
            }

            if (a.schemaId === schemas.KarmaFollowersAttestorSchemaId) {
                // todo
                o[address] = o[address] || { ...initialCount }
                o[address].following++
                return
            }
        })

        console.log({ o })
        setCounts(o)
    }, [attestations, snaps])

    return { counts, getCounts }
}




