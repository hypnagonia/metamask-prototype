import React, { useState, useEffect, useCallback } from 'react';
import { getSnaps } from '../../api/registry'
import { create as saveRecordToBackend, getAll } from '../../api/api'
import { useSignMessage, useAccount } from 'wagmi'
import { createAttestation, create, getAttestationHash } from '../../api/api'
import { ethers } from "ethers"
import { useAttestations } from './UseAttestations';
// @ts-ignore
import {NotificationContainer, NotificationManager} from 'react-notifications'

export function UseCreateAttestations() {
    const [attestation, setAttestation] = useState({} as any)
    const { data: signatureReceived, error, isLoading, signMessage, variables } = useSignMessage()
    const account = useAccount()
    const { loadAttestations } = useAttestations()

    const issueAttestation = useCallback((type: string, attestee: string, attestationData: string[]) => {
        if (!ethers.isAddress(attestee.toLowerCase()) && type === 'follow') {
            console.error('invalid address', type)
            return
        }

        const attestationInit = {
            attestee: attestee || account.address,
            // attester: account.address,
            parentId: '0x0000000000000000000000000000000000000000000000000000000000000000',
            expirationDate: 0,
            attestationData: attestationData.map(e => ethers.hexlify(ethers.toUtf8Bytes(e)))
        }
        const { attestation: a, extraData } = createAttestation(type, attestationInit)
        const attestationFullStructure = {
            schemaId: a.schemaId,
            parentId: a.parentId,
            attestor: a.attestor,
            attestee: a.attestee,
            expirationDate: a.expirationDate,
            attestationData: a.attestationData
        }

        console.log({attestationFullStructure})
        // todo get hash of the structure from the contract's method or geenrate offchain
        const message = ethers.keccak256(ethers.solidityPacked(
            ["bytes32", "bytes32", "address", "address", "uint64", "bytes[]"],
            [attestationFullStructure.schemaId, attestationFullStructure.parentId, attestationFullStructure.attestor, attestationFullStructure.attestee, attestationFullStructure.expirationDate, attestationFullStructure.attestationData]
        ))

        signMessage({ message: JSON.stringify(message) })

        setAttestation({
            attestation: attestationFullStructure, extraData, hash: message
        })
    }, [])


    useEffect(() => {
        const run = async () => {
            if (!signatureReceived || !account.address) {
                return
            }
            const ethersSig = ethers.Signature.from(signatureReceived)

            const signature = {
                signer: account.address,
                r: ethersSig.r,
                s: ethersSig.s,
                v: ethersSig.v
            }

            const res = await create(attestation.attestation, attestation.extraData, signature)

            // window.alert(JSON.stringify(res))
            console.log('new attestation',{res})
            NotificationManager.success('Attestation created')
            await new Promise((r) => setTimeout(r, 1000))
            loadAttestations()
        }

        run()
    }, [signatureReceived])

    return { issueAttestation }
}




