//cols and rows
const COLS=26;
const ROWS=100;

//table
const tHeadRow= document.getElementById('table-heading-row');
const tBody=document.getElementById('table-body');
const currentCellHeading = document.getElementById('current-cell');
const sheetNo = document.getElementById('sheet-no');
const buttonContainer = document.getElementById('button-container');
//btns
const boldbtn=document.getElementById('bold-btn');
const italicsbtn=document.getElementById('italic-btn');
const Underlinebtn=document.getElementById('underline-btn');
const leftbtn=document.getElementById('left-btn');
const centerbtn=document.getElementById('center-btn');
const rightbtn=document.getElementById('right-btn');
const cutBtn=document.getElementById('cut-btn');
const pasteBtn=document.getElementById('paste-btn');
const cpyBtn=document.getElementById('copy-btn');
const uploadInput = document.getElementById('upload-input');
const addSheetBtn = document.getElementById('add-sheet-btn');
const saveSheetBtn = document.getElementById('save-sheet-btn');
//dropdown
const fontStyleDropdown=document.getElementById('fontStyleDropdown');
const fontSizeDropdown=document.getElementById('fontSizeDropdown');
//colors
const bgColor=document.getElementById('bgColor');
const fontColor=document.getElementById('fontColor');



//declarations
let currentCell;
let previousCell;
let cutCell; //this cutcell will store my Cell data;
let lastPressBtn;
let numSheets=1;
let currentSheet=1;
let prevSheet;
const transparent="transparent";
const transparentBlue="#ddddff";
let matrix=new Array(ROWS);



function createNewMatrix(){
for(let row=0;row<ROWS;row++){
    matrix[row]=new Array(COLS);
    //matrix[0]->1st
    //matrix[1]->2nd
    for(let col=0;col<COLS;col++){
        matrix[row][col]={}; //matrix[row][col] is reprsenting cell
    }
}
}
// this is creating matrix for the first time
createNewMatrix();

function downloadMatrix(){
    //2d matrix into a memory tahts accessible outside
    const matrixString =JSON.stringify(matrix);
    //matrixString -> into a blob
    const blob =new Blob([matrixString],{type:'application/json'});
    const link = document.createElement('a');
    
    link.href=URL.createObjectURL(blob);
    link.download='table.json';
    link.click();
}



//1.creating rows
function tableBodyGen(){
tBody.innerHTML='';
for(let row=1;row<=ROWS;row++){
    const tr=document.createElement("tr");
    const th=document.createElement("th");
    th.innerText=row;
    th.setAttribute("id",row);
    tr.append(th);
    colGen('td',tr,false,row);
    tBody.append(tr);
}
}
tableBodyGen();
//passing th to get headers
colGen("th",tHeadRow,true);


//colRow -->row,col
//A1 --> 0,0
//A2 --> 1,0

function updateObjectInMatrix(){
    let id= currentCell.id;
    //65 id[0] ->'A' -> 'A'.charCharAt(0) -> 65  
    let col=id[0].charCodeAt(0) -65;
    let row=id.substring(1)-1;
    matrix[row][col]={
        text:currentCell.innerText,
        style:currentCell.style.cssText,
        id:id, //why we are storing ids,we will see that later
    };
}

//2.creating columns(A,B,C) and empty cells or td's
function colGen(typeOfCell,tableRow,isInnerText,rowNumber){
    for(let col=0;col<COLS;col++){
        const cell=document.createElement(typeOfCell);
       //targetiing or creating headers and appending A,B,C etc to them
        if(isInnerText){
            cell.innerText=String.fromCharCode(col+65);
            cell.setAttribute('id',String.fromCharCode(col+65));
        }
        //targetting / creating empty cells
        else{
            //COL ->A,B,C,D
            cell.setAttribute('id',`${String.fromCharCode(col+65)}${rowNumber}`)
            cell.setAttribute('contenteditable',true);
            cell.addEventListener('input',updateObjectInMatrix);
            
            cell.addEventListener('focus',(event)=>{
                 console.log(event.target);
                 //sending my cell which is focused or cliked by user for example A4:-colname and rownumb
                focusHandler(event.target);
            })
        }
        //0+65 --> A , 1+65 --> B. fromCharcode converts number to charcter 
        //the td will be appended to tr(inside tbody) :-tableRow or my th
        // will be appended to thead's tr
        tableRow.append(cell);
    }
}



//3.once after clicking on any cell headers get highlighted and when you clicked on any other cell the prevoius highlighted headers color 
//should go away
function focusHandler(cell){
    currentCell=cell;
    //A1 -->A,1 TO Z100-->Z,100 my ids can go
    //A ->Cell.id(0); use substrings to get further id
    if(previousCell){
        //set header 
        setHeaderColor(previousCell.id[0],previousCell.id.substring(1),"transparent");
    }
//3.1for setting color for rowhead,col head
function setHeaderColor(colId,rowId,color){
    const colHead=document.getElementById(colId);
    const rowHead =document.getElementById(rowId);
    colHead.style.backgroundColor=color;
    rowHead.style.backgroundColor=color;
} 
//3.2 btn highlighrt
    //typeOfButton -->button
    //typeOfStyle -->styleProperty , fontweight,tetxdecoration
    //style ->bold,italic,underline
function buttonHighlighter(button,styleProperty,textstyle){
     //checking my cell is bold or not
     if(currentCell.style[styleProperty]===textstyle){
        button.style.backgroundColor="#ddddff";
       
    }
    else{
        button.style.backgroundColor=transparent;
        
    }
}   
    buttonHighlighter(boldbtn,'fontWeight',"bold");
    buttonHighlighter(italicsbtn,'fontStyle',"italic");
    buttonHighlighter(Underlinebtn,'textDecoration',"underline");
   
    setHeaderColor(cell.id[0],cell.id.substring(1),"#ddddff");
    currentCellHeading.innerText=cell.id+' '+'selected';
    previousCell=currentCell;
}


//to make the font bold and button bg colored but when we click the other cell the butn bg 
//shuld get back to normal so for that go to buttonHighlighter function
boldbtn.addEventListener('click' , ()=>{
    if(currentCell.style.fontWeight==="bold"){
        currentCell.style.fontWeight="normal";
        boldbtn.style.backgroundColor=transparent;
    }else{
        currentCell.style.fontWeight="bold";
        boldbtn.style.backgroundColor='#ddddff';

    } 
});
italicsbtn.addEventListener('click',()=>{
    if(currentCell.style.fontStyle==='italic'){
        currentCell.style.fontStyle="normal";
        italicsbtn.style.backgroundColor=transparent;
    }else{
        currentCell.style.fontStyle="italic";
        italicsbtn.style.backgroundColor='#ddddff';
    } 
});
Underlinebtn.addEventListener('click',()=>{
    if(currentCell.style.textDecoration==='underline'){
        currentCell.style.textDecoration="none";
        Underlinebtn.style.backgroundColor=transparent;
    }else{
        currentCell.style.textDecoration="underline";
        Underlinebtn.style.backgroundColor='#ddddff';
    } 
});


//homework ,make these 3 functions as 1
leftbtn.addEventListener('click',()=>{
    currentCell.style.textAlign='left';
});
centerbtn.addEventListener('click',()=>{
    currentCell.style.textAlign='center';
});
rightbtn.addEventListener('click',()=>{
    currentCell.style.textAlign='right';
});

// can we use button highlighters for left,right, center

//dropdown
fontStyleDropdown.addEventListener('change',()=>{
    currentCell.style.fontFamily=fontStyleDropdown.value;
    updateObjectInMatrix();
})
fontSizeDropdown.addEventListener('change',()=>{
    currentCell.style.fontSize=fontSizeDropdown.value;
    updateObjectInMatrix();
})

//https://stackoverflow.com/questions/2141357/editable-select-element
//coloring
bgColor.addEventListener('input',()=>{
        currentCell.style.backgroundColor=bgColor.value;
        updateObjectInMatrix();
    });
//font color
fontColor.addEventListener('input',()=>{
    currentCell.style.color=fontColor.value;
    updateObjectInMatrix();
})

//cell data --> cell2 data
//empty -->this will be having cell data --> in case of cut
//celldata --> celldata in case of copy

cutBtn.addEventListener('click',()=>{
    lastPressBtn='cut';
    cutCell={
        text:currentCell.innerText,
        style:currentCell.style.cssText,//cssText is basically 
        //inLine css
    }
    //deleting current cell
    currentCell.innerText='';
    currentCell.style.cssText='';
    updateObjectInMatrix();

})
cpyBtn.addEventListener('click',()=>{
    lastPressBtn='copy';
    cutCell={
        text:currentCell.innerText,
        style:currentCell.style.cssText,//cssText is basically 
    }
})
pasteBtn.addEventListener('click',()=>{
    currentCell.innerText=cutCell.text;
    currentCell.style=cutCell.style;
    // currentCell.style.cssText=cutCell.style;
    if(lastPressBtn==="cut"){
        //cutCell={};
        cutCell=undefined;
    }
    updateObjectInMatrix();
})
//emptyObject.property =>undefined

function uploadMatrix(event){
    const file=event.target.files[0];
    //FileReader helps me to ready my blod
    if(file){
        const reader=new FileReader();
        reader.readAsText(file);
        //this will trigger onload method of reader instance
        reader.onload=function(event){
            console.log(event.target);
            const fileContent=JSON.parse(event.target.result);
            console.log(fileContent);
            matrix=fileContent;
            renderMatrix();
        }
    }
    }
    uploadInput.addEventListener('input',uploadMatrix);
    //26 local storage
    if(localStorage.getItem(arrMatrix)){
        matrix=JSON.parse(localStorage.getItem(arrMatrix))[0];
        renderMatrix();
    }

    function genNextSheetButton(){
        const btn =document.createElement('button');
        numSheets++;
        currentSheet=numSheets;
        btn.innerText=`Sheet ${currentSheet}`;
        btn.setAttribute('id' ,`sheet-${currentSheet}`);
        btn.sheetAttribute('onclick','viewSheet(event');
        buttonContainer.append(btn);
    }

    addSheetBtn.addEventListener('click',()=>{
        genNextSheetButton();
        sheetNo.innerText=`Sheet No - ${currentSheet}`;
        // add nextSheetButton
  //    Save Matrix 
        saveMatrix();
        //clean Matrix
        createNewMatrix();// it's creating matrix again (sort of used as cleaner fn)
        //clean html
        tableBodyGen();
    })
    // saveMatrix
// arrMatrix -> array for matrix
// I should keep my arrMatrix in localStorage
function saveMatrix() {
    if (localStorage.getItem(arrMatrix)) {
        // pressing add sheet not for the first time
        let tempArrMatrix = JSON.parse(localStorage.getItem(arrMatrix));
        tempArrMatrix.push(matrix);
        localStorage.setItem(arrMatrix, JSON.stringify(tempArrMatrix));
      } else {
        //assuming there is no matrix stored previously in the local storage so creating oen for it
        // pressing add sheet for the first time
        let tempArrMatrix = [matrix];
        localStorage.setItem(arrMatrix, JSON.stringify(tempArrMatrix));
      }
}
function viewSheet(event){
    // save prev sheet before doing anything
    prevSheet=currentSheet;
    currentSheet=event.target.id.split('-')[1];
    let matrixArr = JSON.parse(localStorage.getItem(arrMatrix));
    // save my matrix in local storage
    matrixArr[prevSheet-1] = matrix;
    localStorage.setItem(arrMatrix,JSON.stringify(matrixArr));
  
    // I have updated my virtual memory
    matrix = matrixArr[currentSheet-1];
    // clean my html table
    tableBodyGen();
    // render the matrix in html
    renderMatrix();
  }

  // you are trying to save matrix in arrMatrix

// how can you clean up matrix
// option a -> 2d iteration and clean every object
// obtion b -> make 2d matrix



// I have sheet 1, sheet 2, sheet 3 buttons
// get matrix from localStorage
// and render it

// id of button -> sheet-{number}

// [matrix1,matrix2,matrix3]
// sheet-1 -> matrix1
// sheet-2 -> matrix2
// sheet-3 -> matrix3


// arrMatrix -> [matrix1,matrix2,matrix3];

// matrix2 -> that is virtual memory of my table 2

// matrix = matrix2