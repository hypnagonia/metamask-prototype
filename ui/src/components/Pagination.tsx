import { Fragment } from 'react'

export default function Pagination({
	numberOfPages,
	currentPage,
	cb
}: {
	numberOfPages: number
	currentPage: number,
	cb: (page: number) => void
}) {
	const searchParams = new URLSearchParams(window.location.search)

	const goTo = (n: number) => {
		const sp = new URLSearchParams(searchParams.toString())
		if (String(n) === sp.get('page')) {
			return
		}

		searchParams.set('page', '' + n)

		const updatedQueryString = searchParams.toString();

		const newUrl = `${window.location.pathname}?${updatedQueryString}`;
		window.history.pushState({ path: newUrl }, '', newUrl);

		cb(n)
	}

	const pages = [
		1,
		2,
		currentPage - 1,
		currentPage,
		currentPage + 1,
		numberOfPages - 1,
		numberOfPages,
	]
		// min max
		.filter((n) => {
			return n > 0 && n <= numberOfPages
		})
		// unique
		.filter((n, idx, list) => list.indexOf(n) === idx)

	if (numberOfPages < 2) {
		return null
	}			
	
	return (
		<div>
			<section className="pagination">
				<button
					disabled={currentPage === 1}
					onClick={() => goTo(currentPage - 1)}
				>
					Previous
				</button>

				{pages.map((p, idx, list) => {
					const showDivider = idx > 0 && list[idx] - list[idx - 1] > 1

					return (
						<Fragment key={p}>
							{showDivider && <span>...</span>}
							<button
								style={{
									fontWeight:
										p === currentPage ? 'bold' : 'normal',
								}}
								onClick={() => goTo(p)}
							>
								{p}
							</button>
						</Fragment>
					)
				})}

				<button
					disabled={currentPage === numberOfPages}
					onClick={() => goTo(currentPage + 1)}
				>
					Next
				</button>
			</section>

		</div>
	)
}
