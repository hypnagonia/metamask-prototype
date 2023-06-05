export const getAuditorScore = (address: string) => {
    const score = +address % 10
    return score
}

export const computeSnapScore = (snapId: number, reviews: any) => {


    const scores = reviews.map((a: any) => a.scheme[0][1])
    const weights = reviews.map((a: any) => getAuditorScore(a.address))

    /*return reviews.filter((r: any) => r.scheme[1][1] === snapId).reduce((a: any, b: any) => {

        return a + getAuditorScore(b.address) * b.scheme[0][1]
    }, 0)*/
    return calculateWeightedAverage(scores, weights)
}

const calculateWeightedAverage = (scores: any, weights: any) => {
    
    if (scores.length !== weights.length) {
        throw new Error('The number of scores must be equal to the number of weights.');
    }

    const weightedSum = scores.reduce((sum: any, score: any, index: any) => {
        return sum + score * weights[index];
    }, 0);

    const totalWeight = weights.reduce((sum: any, weight: any) => {
        return sum + weight;
    }, 0);

    const average = weightedSum / totalWeight
    
    return average || 0
}