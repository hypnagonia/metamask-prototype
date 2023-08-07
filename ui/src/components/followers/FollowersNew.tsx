import { useEffect, useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { ethers } from "ethers"
import { createAttestation, create, getAttestationHash } from '../../api/api'

export default function FollowersNew(props: any) {
	const [inputValue, setInputValue] = useState('')
	const [attestation, setAttestation] = useState({} as any)
	const { data: signatureReceived, error, isLoading, signMessage, variables, ...rest } = useSignMessage()
	const account = useAccount()

	const handleInputChange = useCallback((event: any) => {
		setInputValue(event.target.value)
	}, [])

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
			attestationData: ["shasum", "", ""].map(e => ethers.hexlify(ethers.toUtf8Bytes(e)))
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

		signMessage({ message })
		setAttestation({
			attestation, extraData, hash: message
		})

	}, [inputValue])

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

			const recoveredAddress = ethers.verifyMessage(attestation.hash, signatureReceived)
			const recoveredAddress2 = ethers.verifyMessage(attestation.hash, signature)
			alert(recoveredAddress + ' ' + recoveredAddress2 + ' ' + attestation.hash)


			console.log({ signature, hash: attestation.hash })

			const res = await create(attestation.attestation, attestation.extraData, signature)
			console.log({ res })
			window.alert(JSON.stringify(res))
		}

		run()
	}, [signatureReceived, attestation])

	return (
		<>
			<div className="container" style={{ marginTop: 30 }}>
				<div className="post-full small-font" >
					<b>Create Follow Attestation</b>
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
							className="strategy-btn"
							style={{ marginRight: 10 }}
							onClick={() => {
								newAttestation()
							}}>Create</span>
					</div>

				</div></div>
		</>
	)
}


