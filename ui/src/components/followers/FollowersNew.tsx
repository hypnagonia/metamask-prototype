import { useEffect, useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { ethers } from "ethers"
import { createAttestation, create, getAttestationHash } from '../../api/api'
import { UseCreateAttestations } from '../hooks/UseCreateAttestation'

const pk = '0xb60ea7fb50fe0cbccd48c5da92a9f9aefced0bbbd1a4f88392eff4f57372df5f'
const addr = '0x033f61b44Bc0AEcA559E16864481B45e2B0DC73b'

export default function FollowersNew(props: any) {
	const [inputValue, setInputValue] = useState('')
	const [attestation, setAttestation] = useState({} as any)
	const { data: signatureReceived, error, isLoading, signMessage, variables, ...rest } = useSignMessage()
	const account = useAccount()

	const handleInputChange = useCallback((event: any) => {
		setInputValue(event.target.value)
	}, [])

	const { issueAttestation } = UseCreateAttestations()

    const createFollowAttestation = () => {
        issueAttestation('follow', inputValue, ["1"])
    }

	/*
	const newAttestation = useCallback(async () => {
		if (!ethers.isAddress(inputValue.toLowerCase())) {
			alert('invalid address ' + inputValue)
			return
		}

		const attestee = ethers.getAddress(inputValue)

		const attestationInit = {
			attestee,
			// attester: account.address,
			parentId: '0x0000000000000000000000000000000000000000000000000000000000000000',
			expirationDate: 0,
			attestationData: ["1"].map(e => ethers.hexlify(ethers.toUtf8Bytes(e)))
		}

		const { attestation: a, extraData } = createAttestation('follow', attestationInit)

		const attestation = {
			schemaId: a.schemaId,
			parentId: a.parentId,
			attestor: a.attestor,
			attestee: a.attestee,
			expirationDate: a.expirationDate,
			attestationData: a.attestationData
		}

		const message = await getAttestationHash(attestation)

		const message2 = ethers.keccak256(ethers.solidityPacked(
			["bytes32", "bytes32", "address", "address", "uint64", "bytes[]"],
			[attestation.schemaId, attestation.parentId, attestation.attestor, attestation.attestee, attestation.expirationDate, attestation.attestationData]
		))


		// implements toEthSignedMessageHash
		const prefixedMessageHash = ethers.keccak256(ethers.solidityPacked(
			["string", "bytes32"],
			["\x19Ethereum Signed Message:\n32", message]
		))

		
		const w = new ethers.Wallet(pk)

		const signatureLocal = await w.signMessage(message)
		const recoveredAddress = ethers.verifyMessage(message, signatureLocal)
		console.log({ signatureLocal, recoveredAddress })
		

		// alert(message + ' ----- ' + prefixedMessageHash)
		console.log({ message, prefixedMessageHash })

		// alert(message + ' '+ prefixedMessageHash)

		signMessage({ message: prefixedMessageHash })
		setAttestation({
			attestation, extraData, hash: prefixedMessageHash
		})

	}, [inputValue])

	useEffect(() => {
		const run = async () => {
			if (!signatureReceived || !account.address) {
				return
			}
			console.log('signatureReceived', signatureReceived.length, signatureReceived)
			const ethersSig = ethers.Signature.from(signatureReceived)

			const signature = {
				signer: account.address,
				r: ethersSig.r,
				s: ethersSig.s,
				v: ethersSig.v
			}

			
			const recoveredAddress2 = ethers.verifyMessage(attestation.hash, signature)
			console.log({ recoveredAddress2 })
			// alert(recoveredAddress + ' ' + recoveredAddress2 + ' ' + attestation.hash)


			console.log({ signature, hash: attestation.hash })

			const res = await create(attestation.attestation, attestation.extraData, signature)
			console.log({ res })
			window.alert(JSON.stringify(res))
		}

		run()
	}, [signatureReceived, attestation])
	*/

	return (
		<>
			<div className="container" style={{ marginTop: 30 }}>
				<div className="post-full small-font" >
					<b>New Follow Attestation</b>
					<div className="delimiter" style={{ marginTop: 15, marginBottom: 15 }}></div>
					<div>
						<input
							value={inputValue}
							onChange={handleInputChange}
							placeholder="Address"
							className="normal-input"
							style={{ width: 400 }}
						/>
					</div>
					<br />
					<div>
						<span
							className="strategy-btn primary"
							style={{ marginRight: 10 }}
							onClick={() => {
								createFollowAttestation()
							}}>Follow</span>
					</div>

				</div></div>
		</>
	)
}


