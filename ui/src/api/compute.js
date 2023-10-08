
const jobId = process.env.REACT_APP_EIGENTRUST_JOB_NUMBER = 3
const url = 'https://snaps-eigentrust.k3l.io'

const normalizeUserScore = (index, total) => {
    const percent = ~~((index + 1) / total * 100)
    const rounded10 = ~~(percent / 10) + 1
    return rounded10 > 10 ? 10 : rounded10
}

const auditUrl = `${url}/audit/downstream/compute-job/${jobId}/result`
const reviewUrl = `${url}/review/downstream/compute-job/${jobId}/result`

const fetchCompute = async () => {
    const audits = await fetch(auditUrl).then(r => r.json())
    const reviews = await fetch(reviewUrl).then(r => r.json())
    const res = {
        audits: audits.score_sets[0].scores,
        reviews: reviews.score_sets[0].scores,
    }

    return res
}

const mapCompute = (data) => {
    const usersReviewsRaw = Object.keys(data.reviews)
        .filter((a) => a.indexOf('did:ethr:') !== -1)
    const usersReviewsLength = usersReviewsRaw.length

    const usersReviews = usersReviewsRaw
        .map((key) => ({ address: key.split('ethr:')[1], score: data.reviews[key] }))
        .sort((a, b) => a.score - b.score)
        .map((o, i) => ({ ...o, score: normalizeUserScore(i, usersReviewsLength) }))


    const usersAuditsRaw = Object.keys(data.audits)
        .filter((a) => a.indexOf('did:ethr:') !== -1)
    const usersAuditsRawLength = usersAuditsRaw.length

    const usersAudits = usersAuditsRaw
        .map((key) => ({ address: key.split('ethr:')[1], score: data.audits[key] }))
        .sort((a, b) => a.score - b.score)
        .map((o, i) => ({ ...o, score: normalizeUserScore(i, usersAuditsRawLength) }))


    usersReviews.forEach((a) => { data.reviews['did:ethr:' + a.address] = a.score })
    usersAudits.forEach((a) => { data.audits['did:ethr:' + a.address] = a.score })

    return data
}

let getAllPromise
export const getAll = async () => {
    if (getAllPromise) {
        return getAllPromise
    }

    const run = async () => {
        const res = await fetchCompute()
        const res2 = mapCompute(res)
        return res2
    }

    getAllPromise = run()

    return getAllPromise
}

let getAllWithHistoryPromise
export const getAllWithHistory = async (computeId) => {
    if (getAllWithHistoryPromise) {
       // return getAllWithHistoryPromise
    }

    const run = async () => {
        const res = await fetchCompute()
        const auditsArr = await fetch(auditUrl + '?limit=1000000').then(r => r.json())
        const reviewsArr = await fetch(reviewUrl + '?limit=1000000').then(r => r.json())

        console.log({ computeId, res })
        const length = auditsArr.score_sets.length

        const res2 = []
        for (let i = 0; i < length; i++) {
            const audits = auditsArr.score_sets[i] ? auditsArr.score_sets[i].scores : {}
            const reviews = reviewsArr.score_sets[i] ? reviewsArr.score_sets[i].scores : {}
            const normalized = mapCompute({ audits, reviews })

            const filteredAudits = normalized.audits[computeId]
            const filteredReviews = normalized.reviews[computeId]
            const timestamp = auditsArr.score_sets[i]
                ? auditsArr.score_sets[i].timestamp
                : reviewsArr.score_sets[i]
                    ? reviewsArr.score_sets[i].timestamp
                    : '?'
            res2.push({ audits: filteredAudits, reviews: filteredReviews, timestamp })
        }
        console.log(res2)

        return res2
    }

    // getAllWithHistoryPromise = run()

    return run()
}