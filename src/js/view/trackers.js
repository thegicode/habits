let template

const createNewNode = () => {
    if( !template ){
        template = document.querySelector('[data-template=tracker-item]')
    }

    return template
        .content
        .firstElementChild
        .cloneNode(true)
}

const getElements = (checkedDate, index, updateChecked) => {
    let elements = []

    const date = new Date(),
        fullDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    let days = []
    for(let i = 0 ; i < fullDay ; i++){
        days.push(i+1)
    }

    const today = new Date().getDate()
    elements = days.map( date => {
        const el = createNewNode()
        const inputEl = el.querySelector('input[name=check]')
        const textEl = el.querySelector('.__text')
        
        if (checkedDate.includes(date)) {
            inputEl.checked = true
        }
        if (date > today) {
            inputEl.disabled = true
        }
        textEl.textContent = date

        const oldChecked = inputEl.checked
        inputEl
            .addEventListener('change', function(e) {
                const isUpdated = updateChecked(date, this.checked, index)
                if (!isUpdated) {
                    console.log('Not changed')
                    this.checked = oldChecked
                }
            })
        return el
    })

    return elements
}

export default (targetElement, state, events) => {
    const { habits } = state
    const { updateChecked } = events
    const newTrackerList = targetElement.cloneNode(true)

    newTrackerList.innerHTML = ''

    const index = targetElement.dataset.index
    if( !habits[index] ) {
        return targetElement
    }

    const habit = habits[index]
    const checkedDate = habit.checked
    const elements = getElements(checkedDate, index, updateChecked)
    elements.forEach( el => {
         newTrackerList.appendChild(el)
    })

    return newTrackerList
}