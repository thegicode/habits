"use strict";

console.log('localStorage', localStorage);


/* Date */
const DATE_LIST = {
    year: [2019, 2020],
    month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
};



/* Global Variable */
let Global = {
    storageName: 'habits'
};



/* Template */
const template = {
    item: function( data, idx ){
        return(
            `<form class='list-form' onsubmit='return handleItemSubmit(this, ${idx});'>
                <input type='text' name='itemInput' value=${data} class='list-title' onblur='handleItemBlur(this, ${idx})'></input>
                <div class="list-actions">
                    <button type='button' class='list-button' onclick='handleView(${idx});'>보기</button>
                    <button type='button' class='list-button' onclick='handleDelete(${idx});'>삭제</button>
                </div>
            </form>`
        )
    },
    selectYear: function(year, cur){
        if(year === cur)
            return `<option value="${year}" selected>${year}년</option>`;
        return `<option value="${year}">${year}년</option>`;
    },
    selectMonth: function(month, cur){
        let m = month;
        if(month<10) m = `0${month}`;
        if( month === cur )
            return `<option value="${m}" selected>${m}월</option>`;
        return `<option value="${m}">${m}월</option>`;
    }
};



/* Call Function */
initial();
setDate();
drawSelect();
drawList();


/* Initial */
function initial(){
    if( !localStorage.getItem( Global.storageName )){
        let obj = {};
        localStorage.setItem(Global.storageName, JSON.stringify(obj));
        console.log('initial', localStorage);
    } 

    // let storage = JSON.parse(localStorage.getItem( Global.storageName ));
    // console.log('initial', storage);
    // let obj = {};
    // let arr = [];
    // for(let key in storage){
    //     let str = key.split('d_')[1];
    //     let year = str.substring(0, 4),
    //         month = str.substring(4, 6);
    //     console.log(year, month);
    // }
    // console.log(obj);
}



/* setDate */
function setDate(){
    const currentDate = new Date;
    Global.date = {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth()+1,
        fullName: function(){
            return `d_${this.year}${this.month}`
        }
    };
    Global.habitDate = {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth()+1,
        fullName: function(){
            return `d_${this.year}${this.month}`
        }
    };
    console.log(Global.habitDate);
}



/* Draw Template */
function drawSelect(){

    const formSelect = document.formSelect;

    let yearList, monthList,
        arrYear = [],
        arrMonth = [];

    if(!DATE_LIST || !DATE_LIST.year || !DATE_LIST.month || DATE_LIST.year.length===0 || DATE_LIST.month.length===0) {
        return;
    }

    yearList = DATE_LIST.year;
    monthList = DATE_LIST.month;

    arrYear = yearList.map( function( year ){
        return template.selectYear(year, Global.habitDate.year);
    });
    formSelect.year.innerHTML = arrYear && arrYear.join('');
    
    arrMonth = monthList.map( function( month ){
        return template.selectMonth(month, Global.habitDate.month);
    });
    formSelect.month.innerHTML = arrMonth && arrMonth.join('');

    formSelect.setAttribute('aria-hidden', 'false');
}

function drawList(){
    let storage, list;
    elHabitList.innerHTML = '';

    storage = JSON.parse(localStorage.getItem('habits'));
    if(!storage) return;

    list = storage[Global.habitDate.fullName()];
    if(!list || list.length === 0 ) {
        let tp = '<p>등록한 습관 목록이 없습니다.</p>';
        elHabitList.innerHTML = tp;
    } else{
        list.forEach( function(data, idx){
            drawItem(data, idx)
        });
    }
}


function drawItem( data, idx ){
    let el = document.createElement('li');
    el.setAttribute( 'data-index', idx );
    el.className = 'list-item';
    el.innerHTML = template.item(data, idx);
    elHabitList.appendChild( el );
}


/* Handle Data */
let handleData = {
    getData: function(){
        let storage = JSON.parse( localStorage.getItem(Global.storageName) );
        return storage;
    },
    getDataOfDate: function(){
        let storage = JSON.parse( localStorage.getItem(Global.storageName) );
        return storage[Global.habitDate.fullName()] || [];
    },
    setDataOfDate: function( arr ){
        let data = this.getData(), 
            date = Global.habitDate.fullName();
        data[date] = arr;
        localStorage.setItem(Global.storageName, JSON.stringify(data));
    },
    include: function( val ){
        let arr = this.getDataOfDate();
        return arr.indexOf(val) > -1;
    },
    add: function( val ){
        let arr = this.getDataOfDate();
        arr.push(val);

        this.setDataOfDate(arr);

        console.log('add', localStorage);
    },
    delete: function( idx ){
        let arr = this.getDataOfDate();
        arr.splice(idx, 1);

        this.setDataOfDate(arr);

        console.log('delete', localStorage);
    },
    update: function(val, idx){
        let arr = this.getDataOfDate();
        arr[idx] =  val;

        this.setDataOfDate(arr);

        console.log('add', localStorage);

    }
}



/* Event Function */
function handleSelect( form ){
    Global.habitDate.year = form.year.value;
    Global.habitDate.month = form.month.value;

    let isShow = Global.habitDate.year > Global.date.year || (Global.habitDate.year == Global.date.year && Global.habitDate.month >= Global.date.month) 

    if( isShow ){
        formInput.setAttribute('aria-hidden', "false");
        drawList();
        console.log(Global.habitDate.fullName());
    } else{
        drawList();
        formInput.setAttribute('aria-hidden', "true");
    }
    
    
    return false;
}

function handleInput( form ){
    let elTitle = form.title,
        val = elTitle.value;
    if(!val)
        elTitle.focus();
    else{
            
        if( handleData.include(val) ){
            alert('이미 등록된 습관입니다.')
        } else{
            handleData.add(val); 
            drawList();
        }
        elTitle.value = '';
    }
    return false;
}

function handleItemSubmit( form, idx ){
    let val = form.itemInput.value;
    let list = handleData.getDataOfDate();
    if( val && val !== list[idx] ){
        if( handleData.include(val) ){
            alert('이미 등록된 타이틀입니다.')
            form.itemInput.value = list[idx];
        } else{
            handleData.update(val, idx);
        }
    } else if(!val){
        alert("타이틀을 입력해주세요.")
    }
    return false;
}

function handleItemBlur( input, idx ){
    handleItemSubmit( input.parentElement, idx )
}

function handleView(idx){
    location.href = `/view?date=${Global.habitDate.fullName()}&idx=${idx}`;
}

function handleDelete( idx ){
    handleData.delete(idx);
    drawList();
    // let node = elHabitList.querySelector('li[data-index="' + idx + '"]');
    // node.remove();
    // console.log(HABIT_LIST[Global.habitDate.fullName()]);
}




