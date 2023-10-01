
const jobId = process.env.REACT_APP_EIGENTRUST_JOB_NUMBER = 2
const url = 'https://snaps-eigentrust.k3l.io'

let getAllPromise
let topUsersReviews = {}
let topUsersAudits = {}

export const getTopUsers = () => {
    return { topUsersReviews, topUsersAudits }
}

export const getAll = async () => {
    if (getAllPromise) {
        return getAllPromise
    }

    const run = async () => {
        const auditUrl = `${url}/audit/downstream/compute-job/${jobId}/result`
        const reviewUrl = `${url}/review/downstream/compute-job/${jobId}/result`

        const audits = await fetch(auditUrl).then(r => r.json())
        const reviews = await fetch(reviewUrl).then(r => r.json())
        const res = {
            audits: audits.score_sets[0].scores,
            reviews: reviews.score_sets[0].scores,
        }

        const usersReviews = Object.keys(res.reviews)
            .filter((a) => a.indexOf('did:ethr:') !== -1)
            .map((key) => ({ address: key.split('ethr:')[1], score: res.reviews[key] }))
            .sort((a, b) => a.value - b.value)
            .map((o, i) => ({ ...o, score: i % 10 + 1 }))

        const top10Persent = usersReviews.length * 0.1 < 1
        topUsersReviews = usersReviews
            .filter((a, i) => i + 1 <= top10Persent)
            .map((a) => ({ ...a, address: a.address.toLowerCase() }))

        const usersAudits = Object.keys(res.audits)
            .filter((a) => a.indexOf('did:ethr:') !== -1)
            .map((key) => ({ address: key.split('ethr:')[1], score: res.audits[key] }))
            .sort((a, b) => a.value - b.value)
            .map((o, i) => ({ ...o, score: i % 10 + 1 }))

        topUsersAudits = usersAudits
            .filter((a, i) => i + 1 <= top10Persent)
            .map((a) => ({ ...a, address: a.address.toLowerCase() }))

        usersReviews.forEach((a) => { res.reviews['did:ethr:' + a.address] = a.score })
        usersAudits.forEach((a) => { res.audits['did:ethr:' + a.address] = a.score })

        return res
    }

    getAllPromise = run()

    return getAllPromise
}