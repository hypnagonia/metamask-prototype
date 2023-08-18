import React, { useState, useEffect } from 'react';
import { getSnaps } from '../../api/registry'
import { create as saveRecordToBackend, getAll } from '../../api/api'

export function useAttestations() {
    const [attestations, setAttestations] = useState([])

    const loadAttestations = async (ignoreCache = false) => {
        const result = await getAll(ignoreCache)
        setAttestations(result)
    }

    useEffect(() => {
        loadAttestations()
    }, [])

    return { attestations, loadAttestations: () => loadAttestations(true) }
}




