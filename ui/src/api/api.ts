// process.env.NODE_ENV === 'development'
// 
import masterRegistryAbi from './masterRegistry.json'
import karmaAttestorABI from './KarmaAuditAttestor.json'
import { ethers, hashMessage } from 'ethers'

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://nft-api.k3l.io/metamask'
// const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000/metamask'

const options = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	}
}

export const getType = (schema: string) => {
	let meta = {} as any
	switch (schema) {
		case process.env.REACT_APP_ATTESTATION_ATTESTOR_SCHEMA:
			meta.name = 'Audit'
			break;
		case process.env.REACT_APP_ATTESTATION_APPROVAL_ATTESTOR_SCHEMA:
			meta.name = 'Audit Approval'
			break;
		case process.env.REACT_APP_REVIEW_ATTESTOR_SCHEMA:
			meta.name = 'Review'
			break;
		case process.env.REACT_APP_REVIEW_APPROVAL_ATTESTOR_SCHEMA:
			meta.name = 'Review Approval'
			break;
		case process.env.REACT_APP_FOLLOWERS_ATTESTOR_SCHEMA:
			meta.name = 'Follow'
			break;
		default: throw new Error(`type ${schema} does not exist`)
	}

	return meta
}

export const createAttestation = (type: string, attestation: any) => {
	const extraDataField = "0x"
	let address
	let schema
	let extraData
	let meta = {} as any
	switch (type) {
		case 'audit':
			address = process.env.REACT_APP_ATTESTATION_ATTESTOR_ADDRESS
			schema = process.env.REACT_APP_ATTESTATION_ATTESTOR_SCHEMA
			extraData = [extraDataField, extraDataField]
			meta.name = 'Audit'
			break;
		case 'auditApprove':
			address = process.env.REACT_APP_ATTESTATION_APPROVAL_ATTESTOR_ADDRESS
			schema = process.env.REACT_APP_ATTESTATION_APPROVAL_ATTESTOR_SCHEMA
			extraData = [extraDataField]
			meta.name = 'Audit Approval'
			break;
		case 'review':
			address = process.env.REACT_APP_REVIEW_ATTESTOR_ADDRESS
			schema = process.env.REACT_APP_REVIEW_ATTESTOR_SCHEMA
			extraData = [extraDataField]
			meta.name = 'Review'
			break;
		case 'reviewApprove':
			address = process.env.REACT_APP_REVIEW_APPROVAL_ATTESTOR_ADDRESS
			schema = process.env.REACT_APP_REVIEW_APPROVAL_ATTESTOR_SCHEMA
			extraData = [extraDataField]
			meta.name = 'Review Approval'
			break;
		case 'follow':
			address = process.env.REACT_APP_FOLLOWERS_ATTESTOR_ADDRESS
			schema = process.env.REACT_APP_FOLLOWERS_ATTESTOR_SCHEMA
			extraData = [extraDataField]
			meta.name = 'Follow'
			break;
		default: throw new Error(`type ${type} does not exist`)
	}

	attestation.schemaId = schema
	attestation.attestor = address

	return { attestation, extraData, meta }
}

export const create = async (
	attestation: any, extraDataArray: any, signature: any
) => {
	const body = JSON.stringify({ attestation, extraDataArray, signature })
	const res = await fetch(`${backendUrl}/create`, { body, ...options }).then(r => r.json())
	return res
}

export const getAll = async () => {
	const res = await fetch(`${backendUrl}/getAll`).then(r => r.json())

	const events = res

		.map((r: any) => JSON.parse(r))
		.filter((r: any) => r.length && Array.isArray(r))
		.map((r: any) => {
			return {
				attestationId: r[0],
				schemaId: r[1],
				parentId: r[2],// The unique identifier of the parent attestation (see DAG).
				attester: r[3],
				attestor: r[4], // The Attestor smart contract address.
				attestee: r[5], // The Attestee address (receiving attestation).
				attestedDate: r[6], // The expiration date of the attestation.
				updatedDate: r[7], // The expiration date of the attestation.
				expirationDate: r[8], // The expiration date of the attestation.
				isPrivate: r[9],
				revoked: r[10],
				attestationData: r[11]
			}
		}).sort((a: any, b: any) => b.attestedDate - a.attestedDate)

	return events
}

export const getAllByType = async (type: string) => {
	const res = await getAll()

	let schema: any
	switch (type) {
		case 'audit':
			schema = process.env.REACT_APP_ATTESTATION_ATTESTOR_SCHEMA
			break;
		case 'auditApprove':
			schema = process.env.REACT_APP_ATTESTATION_APPROVAL_ATTESTOR_SCHEMA
			break;
		case 'review':
			schema = process.env.REACT_APP_REVIEW_ATTESTOR_SCHEMA
			break;
		case 'reviewApprove':
			schema = process.env.REACT_APP_REVIEW_APPROVAL_ATTESTOR_SCHEMA
			break;
		case 'follow':
			schema = process.env.REACT_APP_FOLLOWERS_ATTESTOR_SCHEMA
			break;
		default: throw new Error(`type ${type} does not exist`)
	}

	return res.filter((r: any) => r.schemaId === schema)
}

export const getAttestationHash = async (attestation: any) => {
	const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_PROVIDER_URL)
	const a = new ethers.Contract(process.env.REACT_APP_ATTESTATION_ATTESTOR_ADDRESS || '', karmaAttestorABI.abi, provider)

	console.log({ attestation })
	const hash = await a.getStructHash(attestation)
	return hash
}