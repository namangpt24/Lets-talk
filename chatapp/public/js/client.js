const socket=io();
let username;
let container=document.querySelector(".container");
let list=document.querySelector(".classlist");
let input=document.querySelector(".input");
let button=document.querySelector(".bt");
let audio=new Audio('/chatapp/public/js/ting_tong_sms.mp3');

 do{
    username=prompt("Enter your name to start the chat");
 }while(!username);



socket.emit('newuserjoined',username);

socket.on('userjoined',(joinedusername)=>{
    userjoinleft(joinedusername,'joined');
})
socket.on('userdisconnected',(name)=>{
    userjoinleft(name,'left');
})

function userjoinleft(name,status){
   let div=document.createElement("div");
   div.classList.add('userjoined');
   let content= `<p><b>${name}</b> ${status} the chat.</p>`;
   console.log(content);
   div.innerHTML=content;
   container.appendChild(div);
//    audio.play();
   container.scrollTop=container.scrollHeight;
}
socket.on('changelist',(users)=>{
    adduser(users);

})

function adduser(users){
list.innerHTML="";
arr=Object.values(users);
for(i=0;i<arr.length;i++)
{
    let listtag=document.createElement('li');
    listtag.innerHTML=arr[i];
    list.appendChild(listtag);

}
}

button.addEventListener('click',()=>{
    let data={
        name:username,
        message:input.value
    };
    if(input.value!='')
    {
        funcmessage(data,'rightside');
        socket.emit('message',data);
        input.value='';
    }
})
function funcmessage(data,status)
{
    let div=document.createElement('div');
    div.classList.add('message',status);
    let content;
    if(status=='rightside')
    {
        content=`<p><b>Me</b>: ${data.message}</p>`
    }
    else{

       content=`<p><b>${data.name}</b>: ${data.message}</p>`
       audio.play();
       
    }
    div.innerHTML=content;
    container.appendChild(div);
    
    container.scrollTop=container.scrollHeight;
}
socket.on('message',(data)=>{
    funcmessage(data,'leftside')

})