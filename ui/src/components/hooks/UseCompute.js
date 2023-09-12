import React, { useState, useEffect } from 'react';
import { getAll } from '../../api/compute'

export function UseCompute() {
    const [attestations, setAttestations] = useState({reviews: {}, audits: {}})

    const loadAttestations = async () => {
        const result = await getAll()
        console.log('---', { result })
        setAttestations(result)

    }

    useEffect(() => {
        loadAttestations()
    }, [])

    return { attestations, loadAttestations }
}

export const getSnapScore = (checksum = '', attestations) => {
    const initialState = { audit: 0, review: 0 }
    if (!attestations) {
        return initialState
    }
    // todo

    const str = `did:snapver:${checksum}`

    const audit = attestations.audits[str] || 0
    const review = attestations.reviews[str] || 0

    return { audit, review }
}



export const getAddressScore = (address, attestations) => {
    const str = `did:ethr:${address}`

    const score = attestations.audits[str] || 0
    
    return score
}

