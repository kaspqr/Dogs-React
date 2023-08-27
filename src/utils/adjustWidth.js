export function adjustWidth() {
    const hasScrollbar = window.innerWidth > document.documentElement.clientWidth
  
    const adjustedThreeHundredWidth = hasScrollbar
        ? window.innerWidth > 440
            ? "300px"
            : `calc(100vw - ${window.innerWidth - document.documentElement.clientWidth}px - 40px)`
        : window.innerWidth > 440
            ? "300px"
            : `calc(100vw - 40px)`
  
    const elementsThreeHundred = document.querySelectorAll(".three-hundred, select, .react-calendar")
    elementsThreeHundred.forEach((element) => {
        element.style.width = adjustedThreeHundredWidth
    })
}
