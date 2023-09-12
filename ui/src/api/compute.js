
const jobId = 2
const url = 'https://snaps-eigentrust.k3l.io'


const auditMocks = { "previous": "Fri, 18 Aug 2023 13:34:26 GMT", "score_sets": [{ "scores": { "did:ethr:0x033f61b44Bc0AEcA559E16864481B45e2B0DC73b": 0.010476801368398547, "did:ethr:0x166c0300BB0e77Cb0DcCc228d59Df2d000cf2649": 0.4562078432893007, "did:ethr:0x1f3BAb762FC6232b5019aE0CB2E3f31d36a157eE": 0.010476801368398547, "did:ethr:0x3F0b24BBAC34759572b5Aa168F19B9e803df01B3": 0.008552490912978406, "did:ethr:0x5999930a629A698EB79B55AFBB7cc95BE454f792": 0.008552490912978406, "did:ethr:0x75dacF475Fc74A7310Ac782e3760C29BdD0fCECb": 0.010476801368398547, "did:snapaudit:05dd467a49fb093bae7da152cc4048ee3e8ccf894a822e5e92c143586fd9c04d": 0.054173280995318464, "did:snapaudit:4fd70bbf7b76cf56e9b39e3c66d16f62278a56dbf00ae7964d61afb27aa6e80e": 0.054173280995318464, "did:snapaudit:52b5bc517d2ae18449e82b17f0c519e39b90d0c4388a14f404600a234c9e0a60": 0.058021901906158746, "did:snapaudit:6827876b4065ee7abdf22668c01fa406e315d556fcf69edc25f4f71b75c1aa6c": 0.054173280995318464, "did:snapaudit:808fc12116d583db2ace331d0998d9535765cf465b306ef0857495191068b1f8": 0.054173280995318464, "did:snapaudit:8383dcb54de2341e77752d838c0d38b304bab14bb0defdd87ba9450df9cdd010": 0.058021901906158746, "did:snapaudit:994342e058c9bd5732809e4f37b8b5a752e1f092c6c093c24b34af7a55116e4e": 0.054173280995318464, "did:snapaudit:a1a4c1adecb0c24387a9fe798bb9fcebe0a5768fcbb6ec95a5aa6a13e292615a": 0.054173280995318464, "did:snapaudit:f73a4a4c2ad049c8fd1d143b72d750ce33249f9737652f02214bba0799621023": 0.054173280995318464, "did:snapver:0x52b5bc517d2ae18449e82b17f0c519e39b90d0c4388a14f404600a234c9e0a60": 1.0, "did:snapver:0x994342e058c9bd5732809e4f37b8b5a752e1f092c6c093c24b34af7a55116e4e": 0.0, "did:snapver:shasum": 1.0, "did:snapver:shasum100": 1.0, "did:snapver:shasum2": 1.0 }, "timestamp": "2023-08-18T13:35:26" }] }
const reviewMocks = { "previous": "Fri, 18 Aug 2023 13:34:26 GMT", "score_sets": [{ "scores": { "did:ethr:0x033f61b44Bc0AEcA559E16864481B45e2B0DC73b": 0.016139657444005272, "did:ethr:0x166c0300BB0e77Cb0DcCc228d59Df2d000cf2649": 0.016139657444005272, "did:ethr:0x1f3BAb762FC6232b5019aE0CB2E3f31d36a157eE": 0.016139657444005272, "did:ethr:0x2919d51212Fb3b137F34D3418d1e65834a723d87": 0.013175230566534916, "did:ethr:0x3F0b24BBAC34759572b5Aa168F19B9e803df01B3": 0.013175230566534916, "did:ethr:0x526e062610bD0e04cF4b80f5ef517b3FC1001d00": 0.437556374920897, "did:ethr:0x75dacF475Fc74A7310Ac782e3760C29BdD0fCECb": 0.016139657444005272, "did:snapreview:1bb3fff44db7b2541ea7eb7ce01feeb975bacdcdb463d48beace115add9a25b9": 0.097864219086967, "did:snapreview:81024ffedede849271344247d76c8697fae5dd63fad22a5f7500a97b2437d96a": 0.09193536533202629, "did:snapreview:9c0a13a66b644c3ade9fe59a38b236a5d446aff42095bd8743a9a90135cbdab9": 0.09193536533202629, "did:snapreview:cf74d32104d9d03713e575bec6f61869662de68b08574dd4cb166b964682134a": 0.09193536533202629, "did:snapreview:ed206fedabf6c5e99e60f3a2ee2244b705ffee37acbd59bf10ac2a009526680f": 0.097864219086967, "did:snapver:shasum": 5.0, "did:snapver:shasum100": 3.0, "did:snapver:shasum2": 5.0 }, "timestamp": "2023-08-18T13:35:26" }] }

let getAllPromise
export const getAll = async () => {
    if (getAllPromise) {
        return getAllPromise
    }
    
    const run = async () => {
        const auditUrl = `${url}/audit/downstream/compute-job/${jobId}/result`
        const reviewUrl = `${url}/review/downstream/compute-job/${jobId}/result`

        const audits = await fetch(auditUrl).then(r => r.json())
        const reviews = await fetch(reviewUrl).then(r => r.json())
        return {
            audits: audits.score_sets[0].scores,
            reviews: reviews.score_sets[0].scores
        }
    }

    getAllPromise = run()

    return getAllPromise

    return {
        audits: auditMocks.score_sets[0].scores,
        reviews: reviewMocks.score_sets[0].scores
    }
}