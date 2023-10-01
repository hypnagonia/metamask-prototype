import { useEffect, useState, useCallback } from 'react'
import { explorerNFTURL, formatPrice, setWindowParam, getWindowParam, tweet } from '../utils'
import { getSnaps } from '../api/registry'
import { useSignMessage, useAccount } from 'wagmi'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { Search } from './Search'
import { SnapCard } from './SnapCard'
import { Select } from '../components/common/Select'
import { UseCompute, getSnapScore } from './hooks/UseCompute'
import { UseCounts } from './hooks/UseCounts'
import { shortenString } from '../utils'
import { computeSnapScore } from '../api/mockCompute'

const dateToString = (d: string) => {
	if (!d) {
		return ''
	}


	const date = new Date(d)
	return date.toLocaleString('en-US', { month: '2-digit', year: '2-digit' }).replace(',', '/')
}


const getInitialPage = () => {
	return +getWindowParam('page') || 1
}


export default function List(props: any) {
	const { data: dataSign, error, isLoading, signMessage, variables } = useSignMessage()
	const reviews = props.reviews

	const [d, setData] = useState([] as any)
	const [sortBy, setSortBy] = useState('Audit Score')
	const [search, setSearch] = useState('')
	const { attestations: computeAttestations } = UseCompute()
	const { getCounts } = UseCounts()

	const onSelectSortBy = useCallback((option: any) => {
		setSortBy(option)
	}, [sortBy])

	const data = d.sort((a: any, b: any) => {
		const checksumA = a.versionList[a.versionList.length - 1]
		const checksumB = b.versionList[b.versionList.length - 1]
		const scoreA = getSnapScore(checksumA, computeAttestations)
		const scoreB = getSnapScore(checksumB, computeAttestations)

		if (sortBy === 'Audit Score') {
			return scoreB.audit - scoreA.audit
		}
		if (sortBy === 'Review Score') {
			return scoreB.review - scoreA.review
		}

		if (sortBy === 'Most Reviews') {
			return getCounts(checksumB).reviews - getCounts(checksumA).reviews
		}
		if (sortBy === 'Most Audits') {
			return getCounts(checksumB).audits - getCounts(checksumA).audits
		}
		return 0
	})

	useEffect(() => {
		const run = async () => {
			const d = await getSnaps()
			const data = Object.values(d)
			setData(data)
		}

		run()
	}, [])

	useEffect(() => {

	}, [variables?.message])

	return (
		<>
			<div className="container">


				<div>
					<div style={{ height: 130, marginTop: -30 }}>
						<div className="color2" style={{
							fontSize: 26, fontWeight: 'bold', cursor: 'pointer',
							lineHeight: 1
						}}>
							<br />
							<span style={{ fontSize: 36 }}>Permissionless Snaps Store</span><br />
							<span style={{ fontSize: 18, fontWeight: 'normal', color: '#491789A6' }}
							>Powered by <b>Karma3Labs</b></span>
						</div>
					</div>
				</div>

				<div style={{ marginBottom: 30, marginTop: 15, width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
					<div style={{
						alignItems: 'center',
						width: '200px',
						display: 'flex'
					}}>
						<Search onSearch={setSearch} />
					</div>
					<div style={{
						justifyContent: 'flex-end', alignItems: 'center',
						width: '200px',
						display: 'flex'
					}}>
						<Select currentOption={sortBy} options={['Audit Score', 'Review Score', 'Most Audits', 'Most Reviews']}
							onSelect={(o: any) => { onSelectSortBy(o) }} />
					</div>
				</div>

				<div className="scroll2">
					<div className="profiles-container" style={{ paddingBottom: 100 }}>


						{data.length === 0 && <>Loading...</>}

						{data
							.filter((e: any) => {
								if (!search) {
									return true
								}

								return e.meta.name.toLowerCase().indexOf(search) !== -1
							})
							.map((e: any) => {
								const score = getSnapScore(e.versionList[0], computeAttestations)

								const component = () => {
									return <><SnapCard id={e.meta.id} snapData={e} /></>
								}

								return {
									score,
									component
								}
							})
							.map((a: any) => a.component())}

						<div>
							{data.length === 0 && <div></div>}
						</div>
						{/*<Pagination
							numberOfPages={Math.ceil(data.count / PER_PAGE)}
							currentPage={data.page}
							cb={p => setPage(p)}
					/>*/}
					</div>
				</div>
			</div>
		</ >
	)
}

export function ErrorBoundary({ error }: { error: Error }) {
	return (
		<>
			<div className="container">
				<h1>Error</h1>
				<p>{error.message}</p>
				<p>The stack trace is:</p>
				<pre>{error.stack}</pre>
			</div>
		</>
	)
}
