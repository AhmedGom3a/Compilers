/* eslint-env browser */
var infile = document.getElementById("this");
var pin = document.getElementById("pinimg");
var fakeinfile = document.getElementById("fakeinfile");
var tree = document.getElementById("tree");
var submit = document.getElementById("submit");
var allsen = new Array ();
var count=0;
var ulhome=tree.getElementsByTagName("ul")[0];
var globalacces={ifs:0,assigns:0,reprats:0,kids:0,ops:0,read:0,write:0}
var grand1acces={ifs:0,assigns:0,reprats:0,kids:0,ops:0,read:0,write:0}
// Reset Every Thing on load
window.onload=function(){infile.value="";fakeinfile.value="";};

// Change Colors
infile.onchange = infile.onmouseout = function () {
    'use strict';
    fakeinfile.value = infile.value;
    fakeinfile.style.backgroundColor = "white";
    fakeinfile.style.borderRadius = "5px";
};
infile.onmouseout = function () { pin.style.backgroundColor = "white"; };
infile.onmouseover = function () { pin.style.backgroundColor = "#15242b"; };
infile.onclick = function () { pin.style.backgroundColor = "#2098D1"; };

function GetKey(line)
{
    line=line.replace(/ /g,"");
        var details=new Array();
        details=line.split(',');
     return details[0]; 
}
function GetNote(line,note,key)
{
    line=line.replace(/ /g,"");
        var details=new Array();
        details=line.split(',');
     return details[1]; 
}
// Parse each line 
function parseLine(line,n,parentUL,parentAccess,grandAccess)
{
    if(n<allsen.length)
    {
        
        var key=GetKey(line),
        note=GetNote(line),pastKey,pastnote,nextKey,nextnote,myAccess={ifs:0,assigns:0,repeats:0,kids:0,ops:0,read:0,write:0};
        if(n>0)
        {
            pastKey=GetKey(allsen[count-1]);
            pastnote=GetNote(allsen[count-1]);
        }
        if(count+1<allsen.length)
        {
            nextKey=GetKey(allsen[count+1]);
            nextnote=GetNote(allsen[count+1]);
        }
        if(note.trim() !== "COMMENT"){console.log(note+"( "+key+" )");}
        
        if     (note.trim() === "COMMENT"){count++;return;}
        else if(note.trim() ==="RESERVED_KEYWORD") 
        {
               if(key.trim()=="read") 
            {
                parentUL.innerHTML=parentUL.innerHTML+"<li id=\"read\" class=\"dummy\" ><div> read</div><ul id=\"dummy\" ></ul></li>";
                var TnewUl =parentUL.querySelectorAll('#read')[parentAccess.read];
                var newUl = TnewUl.getElementsByTagName('ul')[0];
                newUl.setAttribute("id","ok");
                newUl.parentElement.setAttribute("class","ok");
                count++;
                while (GetKey(allsen[count-1]).trim()!=";")
                {
                    newUl.innerHTML=newUl.innerHTML+"<li id=\"opkid\" class=\"dummy\" ></li>";
                    parseLine(allsen[count],count,newUl,myAccess,parentAccess);
                    myAccess.kids++;
                }
                console.log("leaving read");
                count--;
                parentAccess.kids++;
                parentAccess.read++;
                grandAccess.read++;
                return;
            }
            else if(key.trim()=="write")
            {
                parentUL.innerHTML=parentUL.innerHTML+"<li id=\"write\" class=\"dummy\"><div> write</div><ul id=\"dummy\"></ul></li>";
                var TnewUl =parentUL.querySelectorAll('#write')[parentAccess.write];
                var newUl = TnewUl.getElementsByTagName('ul')[0];                
                newUl.setAttribute("id","ok");
                newUl.parentElement.setAttribute("class","ok");
                count++;
                while (GetKey(allsen[count-1]).trim()!=";")
                {
                    newUl.innerHTML=newUl.innerHTML+"<li id=\"opkid\" class=\"dummy\"></li>";
                    parseLine(allsen[count],count,newUl,myAccess,parentAccess);
                    myAccess.kids++;
                }
                console.log("leaving write");
                count--;
                parentAccess.kids++;
                parentAccess.write++;
                grandAccess.write++;
                return;   
            }
            else if (key.trim() ==="if")
            {   

                parentUL.innerHTML=parentUL.innerHTML+"<li id=\"ifparent\" class=\"dummy\"><div> "+key+"</div><ul id=\"dummy\"></ul></li>";
                count++;
                var TnewUl = parentUL.querySelectorAll('#ifparent')[parentAccess.ifs];
                var newUl = TnewUl.getElementsByTagName('ul')[0];
                newUl.setAttribute("id","ok");
                newUl.parentElement.setAttribute("class","ok");
                parseLine(allsen[count],count,newUl,myAccess,parentAccess);
                while (GetKey(allsen[count]).trim()!="end")
                {
                    parseLine(allsen[count],count,newUl,myAccess,parentAccess);
                }
                parentAccess.ifs++;
                parentAccess.kids++;
                grandAccess.ifs++;
                return;
            }
            else if (key.trim() ==="else"){count++;return;}
            else if (key.trim() ==="then"){count++;return;}
            else if (key.trim() ==="repeat")
            {
                parentUL.innerHTML=parentUL.innerHTML+"<li id=\"repeat\" class=\"dummy\"><div> "+key+"</div><ul id=\"dummy\"></ul></li>";
                count++;
                var TnewUl = parentUL.querySelectorAll('#repeat')[parentAccess.repeats];
                var newUl = TnewUl.getElementsByTagName('ul')[0];                 
                newUl.setAttribute("id","ok");
                newUl.parentElement.setAttribute("class","ok");
                while (GetKey(allsen[count]).trim()!="until")
                {
                    parseLine(allsen[count],count,newUl,myAccess,grandAccess);
                }
                parseLine(allsen[count],count,newUl,myAccess);
                parentAccess.repeats++;
                grandAccess.repeats++;
                parentAccess.kids++;
                return;
            }
            else if (key.trim() ==="until"){count++;parseLine(allsen[count],count,parentUL,parentAccess,grandAccess);return;}
            else if (key.trim() ==="end"){count++;return;}
        }
        else if(note.trim() ==="SPECIAL_SYMBOL") 
        {
            if(key.trim() =="+"||key.trim() =="-"||key.trim() =="*"||key.trim() =="/")
            {
                parentUL.innerHTML=parentUL.innerHTML+"<li id=\"math\" class=\"dummy\"><div> &nbsp&nbsp&nbsp OP("+key+ ")&nbsp&nbsp&nbsp </div><ul id=\"dummy\"></ul></li>";
                var newUl =parentUL.querySelectorAll('#math ul')[0];
                newUl.setAttribute("id","ok");
                newUl.parentElement.setAttribute("class","ok");
                count++;
                newUl.innerHTML=newUl.innerHTML+"<li id=\"opkid\" class=\"dummy\"></li>";
                myAccess.kids++;
                while (GetKey(allsen[count]).trim()!=";")
                {
                    newUl.innerHTML=newUl.innerHTML+"<li id=\"opkid\" class=\"dummy\"></li>";
                    parseLine(allsen[count],count,newUl,myAccess,parentAccess);
                    myAccess.kids++;
                }
                parentAccess.kids++;
                return;
            }
            else if (key.trim() ==">" || key.trim() =="<" || key.trim() =="=")
            {
                    parentUL.innerHTML=parentUL.innerHTML+"<li id=\"cond\" class=\"dummy\"><div> &nbsp&nbsp&nbsp OP("+key+ ")&nbsp&nbsp&nbsp </div><ul id=\"dummy\"></ul></li>";
                    var newUl =parentUL.querySelectorAll('#cond ul')[0];
                    newUl.setAttribute("id","ok");
                    newUl.parentElement.setAttribute("class","ok");
                    newUl.innerHTML=newUl.innerHTML+"<li id=\"opkid\" class=\"dummy\"> <li id=\"opkid\" class=\"dummy\">";
                    count++;
                    parseLine(allsen[count],count,newUl);
                    parentAccess.kids++;
                    return;
            }
            else if (key.trim()  ==":=")      
            {
               if(pastnote.trim() ==="IDENTIFIER") 
               {
                parentUL.innerHTML=parentUL.innerHTML+"<li id=\"assign\" class=\"dummy\" ><div> Assign ["+pastKey+"] </div><ul id=\"dummy\"></ul></li>";
                var TnewUl = parentUL.querySelectorAll('#assign')[parentAccess.assigns];
                var newUl = TnewUl.getElementsByTagName('ul')[0];                 
                newUl.setAttribute("id","ok");
                newUl.parentElement.setAttribute("class","ok");
                count++;
                parseLine(allsen[count],count,newUl,myAccess,parentAccess);
                grandAccess.assigns++;
                parentAccess.assigns++;
                parentAccess.kids++;
                return;
               }
            }
            else if (key.trim() ==";"){count++;return;}
            else{console.log("ambigious");count++;return;}
        }
        else if(note.trim() ==="IDENTIFIER") 
        {
           
            if(pastKey=="read"||pastKey=="write") 
            {
                parentUL.innerHTML=parentUL.innerHTML+"<li><div> &nbsp&nbsp&nbsp&nbsp"+key+"&nbsp&nbsp&nbsp</div><ul id=\"dummy\"></ul></li>";
                count++;
                parentAccess.kids++;
                return;
            }
            else if(pastKey=="if")
            { 
                count++;
                parseLine(allsen[count],count,parentUL,parentAccess,grandAccess);
                parentUL=parentUL.getElementsByTagName("li")[0].getElementsByTagName("ul")[0];
                parentUL.setAttribute("id","ok");
                var modify= parentUL.getElementsByTagName("li")[0];
                modify.setAttribute("class","ok");
                modify.innerHTML=modify.innerHTML+"<div> id ("+key+") </div>";
                parentAccess.ops++;
                 
                return;
            }
            else if(pastKey=="until")
            { 
                count++;
                parseLine(allsen[count],count,parentUL,parentAccess,grandAccess);
                var TnewUl = parentUL.querySelectorAll('#cond')[parentAccess.ops];
                var newUl = TnewUl.getElementsByTagName('ul')[0];                 
                newUl.setAttribute("id","ok");
                var modify= newUl.getElementsByTagName("li")[0];
                modify.setAttribute("class","ok");
                modify.innerHTML=modify.innerHTML+"<div> id ("+key+") </div>";
                parentAccess.ops++;
                 
                return;
            }
            else if(pastKey=="<"||pastKey=="="||pastKey==">")
            {
                var modify= parentUL.getElementsByTagName("li")[1];
                modify.setAttribute("class","ok");
                modify.innerHTML=modify.innerHTML+"<div> id ("+key+") </div>";
                count++;
                return;
            }
            else if(pastKey=="+"||pastKey=="/"||pastKey=="-"||pastKey=="*")
                {
                    var modify= parentUL.getElementsByTagName("li")[parentAccess.kids];
                    modify.setAttribute("class","ok");
                    modify.innerHTML=modify.innerHTML+"<div> id ("+key+") </div>";
                    count++;
                    return;     
                }
            if(pastKey!=":=" && nextKey=="+"||nextKey=="/"||nextKey=="-"||nextKey=="*")
                {
                    count++;
                    parseLine(allsen[count],count,parentUL,parentAccess,grandAccess);
                    var TnewUl = parentUL.querySelectorAll('#math')[parentAccess.ops];
                    var newUl = TnewUl.getElementsByTagName('ul')[0];                 newUl.setAttribute("id","ok");
                    var modify= newUl.getElementsByTagName("li")[0];
                    modify.setAttribute("class","ok");
                    modify.innerHTML=modify.innerHTML+"<div> id ("+key+") </div>";
                    parentAccess.ops++;
                     
                    return;
                }
            else if (pastKey==":=")
            {
                if(nextKey=="+"||nextKey=="/"||nextKey=="-"||nextKey=="*")
                {
                    count++;
                    parseLine(allsen[count],count,parentUL,parentAccess,grandAccess);
                    var TnewUl = parentUL.querySelectorAll('#math')[parentAccess.ops];
                    var newUl = TnewUl.getElementsByTagName('ul')[0];                 newUl.setAttribute("id","ok");
                    var modify= newUl.getElementsByTagName("li")[0];
                    modify.setAttribute("class","ok");
                    modify.innerHTML=modify.innerHTML+"<div> id ("+key+") </div>";
                    parentAccess.ops++;
                     
                    return;
                }
                else
                {
                    parentUL.innerHTML=parentUL.innerHTML+"<li id=\"num\"><div> Const ("+key+") </div><ul id=\"dummy\"></ul></li>";
                    count++;
                    return;
                }
            }
            else
            {
                count++;
                parseLine(allsen[count],count,parentUL,parentAccess,grandAccess); 
                return;
            }
        }
        else if(note.trim() ==="NUMBER") 
        {
            if(pastKey=="if")
            {
                count++;
                parseLine(allsen[count],count,parentUL,parentAccess,grandAccess);
                parentUL=parentUL.getElementsByTagName("li")[0].getElementsByTagName("ul")[0];
                parentUL.setAttribute("id","ok");
                var modify= parentUL.getElementsByTagName("li")[0];
                modify.setAttribute("class","ok");
                modify.innerHTML=modify.innerHTML+"<div> const ("+key+") </div>";
                parentAccess.ops++;
                 
                return;
            }
            else if(pastKey=="until")
            { 
                count++;
                parseLine(allsen[count],count,parentUL,parentAccess,grandAccess);
                var TnewUl = parentUL.querySelectorAll('#cond')[parentAccess.ops];
                var newUl = TnewUl.getElementsByTagName('ul')[0];                 newUl.setAttribute("id","ok");
                var modify= newUl.getElementsByTagName("li")[0];
                modify.setAttribute("class","ok");
                modify.innerHTML=modify.innerHTML+"<div> const ("+key+") </div>";
                parentAccess.ops++;
                 
                return;
            }
            else if(pastKey=="<"||pastKey=="="||pastKey==">")
            {
                var modify= parentUL.getElementsByTagName("li")[1];
                modify.setAttribute("class","ok");
                modify.innerHTML=modify.innerHTML+"<div> const ("+key+") </div>";
                count++;
                return;
            }
            else if(pastKey=="+"||pastKey=="/"||pastKey=="-"||pastKey=="*")
                {
                    var modify= parentUL.getElementsByTagName("li")[1];
                    modify.setAttribute("class","ok");
                    modify.innerHTML=modify.innerHTML+"<div> const ("+key+") </div>";
                    count++;
                    return;     
                }
            else if (pastKey==":=")
            {
                if(nextKey=="+"||nextKey=="/"||nextKey=="-"||nextKey=="*")
                {
                    count++;
                    parseLine(allsen[count],count,parentUL,parentAccess,grandAccess);
                    var TnewUl = parentUL.querySelectorAll('#math')[parentAccess.ops];
                    var newUl = TnewUl.getElementsByTagName('ul')[0];                 newUl.setAttribute("id","ok");
                    var modify= newUl.getElementsByTagName("li")[0];
                    modify.setAttribute("class","ok");
                    modify.innerHTML=modify.innerHTML+"<div> id ("+key+") </div>";
                    parentAccess.ops++;
                     
                    return;
                }
                else
                {
                    parentUL.innerHTML=parentUL.innerHTML+"<li id=\"num\"><div> Const ("+key+") </div><ul id=\"dummy\"></ul></li>";
                    count++;
                    return;
                }
            }
        }
        else{alert("none");count++;return;}
    }
    else
    {
        count++; return;
    }
    
}

// Read text file and save all lines to an array
function readSingleFile(e) {
    submit.onclick = function() 
    {
          var file = e.target.files[0],
              l=0,
          reader = new FileReader();
          if (!file) {return;}
          reader.onload = function(e) 
          {
              var contents = e.target.result;
              allsen = contents.split('\n');
              while(count<allsen.length){
              parseLine(allsen[count],count,ulhome,globalacces,grand1acces);
              }
              var uls = document.getElementsByTagName("ul");
              for(var i = 0; i < uls.length; i++)
              {
                   if(uls[i].getAttribute("id")=="dummy"){uls[i].parentElement.removeChild(uls[i]);}
              }
              uls = document.getElementsByTagName("li");
              for(var i = 0; i < uls.length; i++)
              {
                   if(uls[i].getAttribute("class")=="dummy")
                   {
                    var temp=uls[i].parentElement;
                    for(var j=0;j<temp.childElementCount;j++)
                    {
                        if (temp.childNodes[j].getAttribute("class")=="dummy"){temp.removeChild(temp.childNodes[j]);}
                    }
                   }
              }
              uls = document.getElementsByTagName("li");
              for(var i = 0; i < uls.length; i++)
              {
                   if(uls[i].getAttribute("class")=="dummy")
                   {
                    var temp=uls[i].parentElement;
                    for(var j=0;j<temp.childElementCount;j++)
                    {
                        if (temp.childNodes[j].getAttribute("class")=="dummy"){temp.removeChild(temp.childNodes[j]);}
                    }
                   }
              }
          };
         reader.readAsText(file);
        
    };
   
}
infile.addEventListener('change',readSingleFile,false);
