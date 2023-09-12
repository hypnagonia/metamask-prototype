import React, { useState, useEffect } from 'react';
import { getIdentity } from '../../api/api'


export function UseIdentity(address: string) {
    const [identities, setIdentities] = useState({} as any)

    const loadAttestations = async (address: string) => {
        if (identities[address]) {
            return 
        }
        const result = await getIdentity(address)

        const newState = { ...identities, [address]: result }
        setIdentities(newState)

        return 
    }

    useEffect(() => {
        loadAttestations(address)
    }, [address])

    return { identities, loadAttestations }
}