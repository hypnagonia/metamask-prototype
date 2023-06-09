



// process.env.NODE_ENV === 'development'
// 

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://nft-api.k3l.io/metamask'
// const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000/metamask'

const options = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	}
}


export const create = async (scheme: any) => {
	const key = scheme.signature
	const body = JSON.stringify({ key, value: scheme })
	const res = await fetch(`${backendUrl}/create`, { body, ...options }).then(r => r.json())
	return res
}

export const getAll = async () => {
	const res = await fetch(`${backendUrl}/getAll`).then(r => r.json())
	return res.map((r: any) => {

		return r
	})
}

export const voteCreate = async (scheme: any) => {
	const key = scheme.signature
	const body = JSON.stringify({ key, value: scheme })
	const res = await fetch(`${backendUrl}/vote/create`, { body, ...options }).then(r => r.json())
	return res
}

export const voteGetAll = async () => {
	const res = await fetch(`${backendUrl}/vote/getAll`).then(r => r.json())
	return res.map((r: any) => {

		return r
	})
}

export const reviewIndexes = {
	score: 0,
	snapId: 1,
	version: 2
}