// step-by-step.js 文件步驟導覽功能
// 若要看 demo, 請在 bootstrap 範例網頁點選綠色按鈕
// 1.指定元件 class 設置 [prefix]0 ~ [prefix]N 並設置 aria-label
// 2.設置導覽觸發按鈕，onclick=()=>goTourByPrefix([prefix])

function goTourByPrefix(prefix) {

	function collectTourElements(prefix) {
		let steps = 1000
		let i = 0
		let tourElements = []
		for (i = 0; i < steps; i++) {
			let step = document.getElementsByClassName(prefix + i)[0]
			if (!step) break;
			step.styleClone = step.style;
			tourElements.push(step)
		}
		return tourElements
	}

	const elements = collectTourElements(prefix)

	let stepIndex = 0
	const stepEvent = (elements) => {
		window.removeEventListener('resize', resizeWin)
		const tip = document.getElementById('tip')
		tip && (tip.for = null, tip.remove())
		elements.forEach(ele => ele.style = ele.styleClone)
		let selectElement = elements[stepIndex]
		if (!selectElement) return
		let rect = selectElement.getBoundingClientRect()
		selectElement.style = `
			${selectElement.styleClone};
			position:relative;
			box-shadow: 0px 0px 0px 5000px rgba(0,0,0,.5),0px 0px 50px rgba(0,0,0,.5);
			border: 3px solid yellowgreen;
			z-index: 5000;
			border-radius: 5px;
		`
		// calculate scroll position, and scroll to the position
		let sy = rect.top + window.scrollY - 100
		if (sy < 0) sy = 0
		let height = parseInt(getComputedStyle(document.body).height) - window.innerHeight
		if (sy > height) sy = height
		setTimeout(() => window.scrollTo({ top: sy, behavior: "smooth" }), 1);

		const update = () => {
			if (Math.abs(~~window.scrollY - ~~sy) < 2) {
				// popup tip when scroll finished
				let rect = selectElement.getBoundingClientRect()
				let tip = document.createElement('div')
				tip.for = selectElement
				tip.id = 'tip'
				tip.innerHTML = `
					<style>
						#tip {
							position: absolute;
							top: ${rect.top + scrollY - 10}px;
							left: ${rect.left}px;
							transform: translate(0, -100%);
							z-index: 5001;
							pointer-events: none;
							padding: 8px 10px;
							line-height: 15px;
							white-space: nowrap;
							text-decoration: none;
							text-indent: 0;
							overflow: visible;
							font-size: .9em;
							font-weight: normal;
							color: #fff;
							text-shadow: 1px 0 1px #888;
							background-color: rgba(0,0,0,.5);
							border: 1px solid gray;
							border-left: 6px solid yellowgreen;
							border-radius: 4px;
							box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.3);
						}
						#tip button:hover{
							border:1px solid yellowgreen !important;
							color: yellowgreen !important;
						}
					</style>
					<div>
						step ${stepIndex + 1} / ${elements.length} - ${selectElement.ariaLabel} 
						<button class='backBtn' style='pointer-events:auto; border:1px solid white; border-radius:2px;background-color: transparent; color:white; display:${stepIndex == 0 ? 'none' : ''}'>Back</button>
						<button class='nextBtn' style='pointer-events:auto; border:1px solid white; border-radius:2px;background-color: transparent; color:white'>${stepIndex == (elements.length - 1) ? 'Done' : 'Next'}</button>
					</div>
				`
				document.body.append(tip)
				tip.getElementsByClassName('backBtn')[0].onclick = () => { stepIndex--; stepEvent(elements) };
				tip.getElementsByClassName('nextBtn')[0].onclick = () => { stepIndex++; stepEvent(elements) };
				window.addEventListener('resize', resizeWin)
				return
			}
			requestAnimationFrame(update)
		}
		requestAnimationFrame(update)
	}

	stepEvent(elements);

	return

	function resizeWin() {
		const tip = document.getElementById('tip')
		const rect = tip.for.getBoundingClientRect()
		tip.style.left = rect.left + 'px'
	}
}