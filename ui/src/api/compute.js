
const jobId = process.env.REACT_APP_EIGENTRUST_JOB_NUMBER = 3
const url = 'https://snaps-eigentrust.k3l.io'

let getAllPromise
let topUsersReviews = {}
let topUsersAudits = {}

export const getTopUsers = () => {
    return { topUsersReviews, topUsersAudits }
}


// todo
const normalizeScore = (index, total) => {
    const percent = ~~((index + 1) / total * 100)
    const rounded10 = ~~(percent / 10) + 1
    return rounded10 > 10 ? 10 : rounded10
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


        const usersReviewsRaw = Object.keys(res.reviews)
            .filter((a) => a.indexOf('did:ethr:') !== -1)
        const usersReviewsLength = usersReviewsRaw.length

        const usersReviews = usersReviewsRaw
            .map((key) => ({ address: key.split('ethr:')[1], score: res.reviews[key] }))
            .sort((a, b) => b.score - a.score)
            .map((o, i) => ({ ...o, score: normalizeScore(i, usersReviewsLength) }))

        console.log({ usersReviews })

        const top10Persent = usersReviews.length * 0.1 < 1
        topUsersReviews = usersReviews
            .filter((a, i) => i + 1 <= top10Persent)
            .map((a) => ({ ...a, address: a.address.toLowerCase() }))


        const usersAuditsRaw = Object.keys(res.audits)
            .filter((a) => a.indexOf('did:ethr:') !== -1)
        const usersAuditsRawLength = usersAuditsRaw.length

        const usersAudits = usersAuditsRaw
            .map((key) => ({ address: key.split('ethr:')[1], score: res.audits[key] }))
            .sort((a, b) => b.score - a.score)
            .map((o, i) => ({ ...o, score: normalizeScore(i, usersAuditsRawLength) }))

        console.log({ usersAudits })

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