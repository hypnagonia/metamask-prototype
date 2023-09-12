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


export const schemas = {
	KarmaAuditAttestorSchemaId: process.env.REACT_APP_ATTESTATION_ATTESTOR_SCHEMA || '0x8ec3f8cea0dbf766e5867704ca5d40fd150b77dc24f0cfa67d5b32ba15899e8c',
	KarmaAuditApprovalAttestorSchemaId: process.env.REACT_APP_ATTESTATION_APPROVAL_ATTESTOR_SCHEMA || '0x00413b97266b39391c1096e2382acb8bcf02bb8ddcd76fadd83f7fadb570bc4c',
	KarmaReviewAttestorSchemaId: process.env.REACT_APP_REVIEW_ATTESTOR_SCHEMA || '0xa441f5cadbdf1734d712dd2fac3349b8f202d88a6b296191fb52e2121539036b',
	KarmaReviewApprovalAttestorSchemaId: process.env.REACT_APP_REVIEW_APPROVAL_ATTESTOR_SCHEMA || '0x74301e44c78bb3d82e6c93dd78dffcbc58ec424c4ff0d9a9fc5be2cc522b13d1',
	KarmaFollowersAttestorSchemaId: process.env.REACT_APP_FOLLOWERS_ATTESTOR_SCHEMA || '0x01699f6044e8d50455877de61a800dab739d66151ce3891bccf583bcf0203290'
}

export const getType = (schema: string) => {
	let meta = {} as any
	switch (schema) {
		case schemas.KarmaAuditAttestorSchemaId:
			meta.name = 'Audit'
			break;
		case schemas.KarmaAuditApprovalAttestorSchemaId:
			meta.name = 'Audit Approval'
			break;
		case schemas.KarmaReviewAttestorSchemaId:
			meta.name = 'Review'
			break;
		case schemas.KarmaReviewApprovalAttestorSchemaId:
			meta.name = 'Review Approval'
			break;
		case schemas.KarmaFollowersAttestorSchemaId:
			meta.name = 'Follow'
			break;
		default: throw new Error(`type ${schema} does not exist`)
	}

	return meta
}


const cacheIdentity = new Map()
export const getIdentity = async (address: string) => {
	if (cacheIdentity.has(address)) {
		return cacheIdentity.get(address)
	}
	
	const res = await fetch(`${backendUrl}/identity/${address}`).then(r => r.json())
	if (res.error) {
		console.error({res})
	}

	cacheIdentity.set(address, res.data)
	return res.data
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
			schema = schemas.KarmaAuditAttestorSchemaId
			extraData = [extraDataField, extraDataField]
			meta.name = 'Audit'
			break;
		case 'auditApprove':
			address = process.env.REACT_APP_ATTESTATION_APPROVAL_ATTESTOR_ADDRESS
			schema = schemas.KarmaAuditApprovalAttestorSchemaId
			extraData = [extraDataField]
			meta.name = 'Audit Approval'
			break;
		case 'review':
			address = process.env.REACT_APP_REVIEW_ATTESTOR_ADDRESS
			schema = schemas.KarmaReviewAttestorSchemaId
			extraData = [extraDataField]
			meta.name = 'Review'
			break;
		case 'reviewApprove':
			address = process.env.REACT_APP_REVIEW_APPROVAL_ATTESTOR_ADDRESS
			schema = schemas.KarmaReviewApprovalAttestorSchemaId
			extraData = [extraDataField]
			meta.name = 'Review Approval'
			break;
		case 'follow':
			address = process.env.REACT_APP_FOLLOWERS_ATTESTOR_ADDRESS
			schema = schemas.KarmaFollowersAttestorSchemaId
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

let cachedEvents: any

export const getAll = async (ignoreCache = false) => {
	if (cachedEvents) {
		return cachedEvents
	}

	const res = await fetch(`${backendUrl}/getAll`).then(r => r.json())

	console.log({ res })
	const events = res
		.map((r: any) => {
			try {
			const o = JSON.parse(r)
			// console.log({ o })
			
				o.attestation = JSON.parse(o.attestation)
				return o
			} catch (e) {
				return {
					attestation: []
				}
			}
		})
		.filter((r: any) => r.attestation.length && Array.isArray(r.attestation))
		.map((res: any) => {
			const r = res.attestation
			return {
				attestationId: r[0],
				schemaId: r[1],
				parentId: r[2],// The unique identifier of the parent attestation (see DAG).
				attester: r[3],
				attestee: r[4], // The Attestee address (receiving attestation).
				attestor: r[5], // The Attestor smart contract address.
				attestedDate: r[6], // The expiration date of the attestation.
				updatedDate: r[7], // The expiration date of the attestation.
				expirationDate: r[8], // The expiration date of the attestation.
				isPrivate: r[9],
				revoked: r[10],
				attestationData: r[11],
				attestationDataHex: r[11].map((a: any) => ethers.toUtf8String(a)),
				transactionHash: res.data.transactionHash
			}
		}).sort((a: any, b: any) => b.attestedDate - a.attestedDate)

	
	setTimeout(() => cachedEvents = null, 5000)
	cachedEvents = events
	return events
}



export const getAllByType = async (type: string) => {
	const res = await getAll()

	let schema: any
	switch (type) {
		case 'audit':
			schema = schemas.KarmaAuditAttestorSchemaId
			break;
		case 'auditApprove':
			schema = schemas.KarmaAuditApprovalAttestorSchemaId
			break;
		case 'review':
			schema = schemas.KarmaReviewAttestorSchemaId
			break;
		case 'reviewApprove':
			schema = schemas.KarmaFollowersAttestorSchemaId
			break;
		case 'follow':
			schema = schemas.KarmaReviewApprovalAttestorSchemaId
			break;
		default: throw new Error(`type ${type} does not exist`)
	}

	return res.filter((r: any) => r.schemaId === schema)
}

export const getAttestationHash = async (attestation: any) => {
	const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_PROVIDER_URL)
	const a = new ethers.Contract(process.env.REACT_APP_ATTESTATION_ATTESTOR_ADDRESS || '', karmaAttestorABI.abi, provider)


	const hash = await a.getStructHash(attestation)
	return hash
}