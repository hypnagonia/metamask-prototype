import React, { useState, useEffect } from 'react';
import { getIdentity } from '../../api/api'

export const getEns = (identity: any) => {
    if (!identity || !identity.Domains) {
        return null
    }

    try {
        const { name: profileName, dappName } = identity.Domains.Domain[0]
        return { profileName, dappName }
    } catch (e) {
        return null
    }
}

export const getSocial = (identity: any) => {
    const socials = getSocials(identity)
    return socials ? socials[0] : null
}

export const getSocials = (identity: any) => {
    if (!identity || !identity.Wallet) {
        return []
    }

    try {
        const socials = identity.Wallet.socials
        return socials || []
    } catch (e) {
        return []
    }
}

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