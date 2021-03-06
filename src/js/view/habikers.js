import { createNewNode, isInputEmpty, isInputInclues, getCurrentMonth } from './helpers.js'

const template = document.querySelector('[data-template=habiker]')
let showedAlert = false
let activeIndex;

const updateName = (inputEl, index, events, oldName, isPermanent) => {
    const { includes, 
            includesPermanent, 
            updateItemName, 
            updateItemPermanent } =  events

    if (isInputEmpty(inputEl)) {
        if(showedAlert) {
            return
        }
        window.alert('습관명을 입력하세요.')
        showedAlert = true
        return 
    }

    const isIncludes = isPermanent ? includesPermanent : includes;
    if (isInputInclues(isIncludes, inputEl, index)) {
        window.alert('이미 있는 습관명입니다.')
        return
    }

    const updateFn = isPermanent ? updateItemPermanent : updateItemName;
    const isUpdate = updateFn(index, inputEl.value)
    if (isUpdate) {
        inputEl.setAttribute('readonly', true)
    } else {
        inputEl.value = oldName
        console.log('이름이 변경되지 않았습니다.')
    } 

    inputEl.blur()
}


const addEvents = (element, index, events, isPermanent) => {

    const { deleteItem, 
            deleteItemPermanent } = events

    const inputEl = element.querySelector('input[name=name]')

    if (isPermanent) {
        // inputEl.setAttribute('readonly', true)
        return
    }

    element
        .querySelector('[data-header=habiker]')
        .addEventListener('dblclick', function(e) {
            inputEl.removeAttribute('readonly')
            inputEl.focus()

            if( activeIndex === index) {
                return
            }

            if (activeIndex > -1){
                document
                    .querySelectorAll('[data-item=habiker')[activeIndex]
                    .querySelector('input[type=text]')
                    .setAttribute('readonly', true)
            }

            activeIndex = index
        });

    inputEl
        .addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                updateName(this, index, events, this.value, isPermanent)
            }
        })

    inputEl.addEventListener('focus', function(e){
        showedAlert = false
    })

    inputEl.addEventListener('blur', function(e){
        updateName(this, index, events, this.value, isPermanent)
    })

    element
        .querySelector('[data-button=delete]')
        .addEventListener('click', function(e) {
            const deleteFn = isPermanent ? deleteItemPermanent : deleteItem
            deleteFn(index)
        })

    // const dragButton = element.querySelector('[data-button=drag]')

    // dragButton
    //     .addEventListener('dragstart', function(e) {
    //     })

    // dragButton
    //     .addEventListener('dragend', function(e) {
    //     })

    element
        .addEventListener('dragend', function(e){
            console.log(this, e)
        })
}

const getElements = (habit, index, events) => {
    const { name } = habit
    const element = createNewNode(template)
    const inputEl = element.querySelector('input[name=name]')
    const trackersEl = element.querySelector('[data-component=trackers]')

    element.dataset.index = index
    inputEl.value = name
    trackersEl.dataset.index = index
     
    addEvents(element, index, events)

    return element
}

const getElementsPermanent = (permanent, index, events) => {
    const element = createNewNode(template)
    const { name } = permanent
    const inputEl = element.querySelector('input[name=name]')
    const trackersEl = element.querySelector('[data-component=trackers]')

    element.dataset.pIndex = index
    inputEl.value = name
    trackersEl.dataset.pIndex = index

    element.querySelector('[data-button=delete]').remove()
    element.querySelector('[data-button=drag]').remove()

    addEvents(element, index, events, true)

    return element
}

export default (targetElement, state, events) => {
    const { habits, permanents } = state
    const { activeMonth } = events
    const newHabikerList = targetElement.cloneNode(true)

    newHabikerList.innerHTML = ''

    const month = activeMonth.value

    if (month >= getCurrentMonth()) {
        permanents
            .map( (permanent, index) => 
                getElementsPermanent(permanent, index, events)
            )
            .forEach( element => {
                newHabikerList.appendChild(element)
            })
    }

    if (!habits) {
        return newHabikerList
    }
    const thisHabits = habits[month]

    if (!thisHabits) {
        return newHabikerList
    }
    if (thisHabits.length < 1) {
        return newHabikerList
    }
    thisHabits
        .map( (habit, index) => getElements(habit, index, events))
        .forEach( element => {
            newHabikerList.appendChild(element)
        })

    return newHabikerList
}
