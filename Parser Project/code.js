/* eslint-env browser */
var infile = document.getElementById("this");
var pin = document.getElementById("pinimg");
var fakeinfile = document.getElementById("fakeinfile");
var tree = document.getElementById("tree");
var submit = document.getElementById("submit");
var allsen = new Array ();
var count=0;
var ulhome=tree.getElementsByTagName("ul")[0];
var globalacces={ifs:0,assigns:0,reprats:0,kids:0,ops:0}
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
function parseLine(line,n,parentUL,parentAccess)
{
    if(n<allsen.length)
    {
        
        var key=GetKey(line),
        note=GetNote(line),pastKey,pastnote,nextKey,nextnote,myAccess={ifs:0,assigns:0,repeats:0,kids:0,ops:0};
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
            if(key.trim() ==="read"||key.trim() ==="write")
            {
             
                count++;   
                parseLine(allsen[count],count,parentUL);
                parentAccess.kids++;
                return;
            }
            else if (key.trim() ==="if")
            {   

                parentUL.innerHTML=parentUL.innerHTML+"<li id=\"ifparent\"><div> "+key+"</div><ul></ul></li>";
                count++;
                var TnewUl = parentUL.querySelectorAll('#ifparent')[parentAccess.ifs];
                var newUl = TnewUl.getElementsByTagName('ul')[0];
                parseLine(allsen[count],count,newUl,myAccess);
                while (GetKey(allsen[count]).trim()!="end")
                {
                    parseLine(allsen[count],count,newUl,myAccess);
                }
                parentAccess.ifs++;
                parentAccess.kids++;
                return;
            }
            else if (key.trim() ==="else"){count++;return;}
            else if (key.trim() ==="then"){count++;return;}
            else if (key.trim() ==="repeat")
            {
                parentUL.innerHTML=parentUL.innerHTML+"<li id=\"repeat\"><div> "+key+"</div><ul></ul></li>";
                count++;
                var TnewUl = parentUL.querySelectorAll('#repeat')[parentAccess.repeats];
                var newUl = TnewUl.getElementsByTagName('ul')[0];
                while (GetKey(allsen[count]).trim()!="until")
                {
                    parseLine(allsen[count],count,newUl,myAccess);
                }
                parseLine(allsen[count],count,newUl,myAccess);
                parentAccess.repeats++;
                parentAccess.kids++;
                return;
            }
            else if (key.trim() ==="until"){count++;parseLine(allsen[count],count,parentUL,parentAccess);return;}
            else if (key.trim() ==="end"){count++;return;}
        }
        else if(note.trim() ==="SPECIAL_SYMBOL") 
        {
            if     (key.trim() =="+"||key.trim() =="-"||key.trim() =="*"||key.trim() =="/")
            {
                parentUL.innerHTML=parentUL.innerHTML+"<li id=\"math\"><div> &nbsp&nbsp&nbsp OP("+key+ ")&nbsp&nbsp&nbsp </div><ul></ul></li>";
                var newUl =parentUL.querySelectorAll('#math ul')[0];
                newUl.innerHTML=newUl.innerHTML+"<li id=\"opkid\" ></li><li id=\"opkid\" ></li>";
                count++;
                parseLine(allsen[count],count,newUl);
                parentAccess.kids++;
                return;
            }
            else if (key.trim() ==">" || key.trim() =="<" || key.trim() =="=")
            {
                    parentUL.innerHTML=parentUL.innerHTML+"<li id=\"cond\"><div> &nbsp&nbsp&nbsp OP("+key+ ")&nbsp&nbsp&nbsp </div><ul></ul></li>";
                    var newUl =parentUL.querySelectorAll('#cond ul')[0];
                    newUl.innerHTML=newUl.innerHTML+"<li id=\"opkid\" ></li><li id=\"opkid\" ></li>";
                    count++;
                    parseLine(allsen[count],count,newUl);
                    parentAccess.kids++;
                    return;
            }
            else if (key.trim()  ==":=")      
            {
               if(pastnote.trim() ==="IDENTIFIER") 
               {
                parentUL.innerHTML=parentUL.innerHTML+"<li id=\"assign\"><div> Assign ["+pastKey+"] </div><ul></ul></li>";
                var TnewUl = parentUL.querySelectorAll('#assign')[parentAccess.assigns];
                var newUl = TnewUl.getElementsByTagName('ul')[0];
                count++;
                parseLine(allsen[count],count,newUl,myAccess);
                parentAccess.assigns++;
                parentAccess.kids++;
                return;
               }
            }
            else if (key.trim() ==";"){count++;return;}
            else{alert("else");}
        }
        else if(note.trim() ==="IDENTIFIER") 
        {
           
            if(pastKey=="read" || pastKey=="write")
            {
                parentUL.innerHTML=parentUL.innerHTML+"<li id=\""+pastKey+"\"><div> "+pastKey+" ("+key+") </div><ul></ul></li>";
                count++;
                return;
            }
            else if(pastKey=="if")
            { 
                count++;
                parseLine(allsen[count],count,parentUL,parentAccess);
                parentUL=parentUL.getElementsByTagName("li")[0].getElementsByTagName("ul")[0];
                var modify= parentUL.getElementsByTagName("li")[0];
                modify.innerHTML=modify.innerHTML+"<div> id ("+key+") </div>";
                parentAccess.ops++;
                return;
            }
            else if(pastKey=="until")
            { 
                count++;
                parseLine(allsen[count],count,parentUL,parentAccess);
                var TnewUl = parentUL.querySelectorAll('#cond')[parentAccess.ops];
                var newUl = TnewUl.getElementsByTagName('ul')[0];
                var modify= newUl.getElementsByTagName("li")[0];
                modify.innerHTML=modify.innerHTML+"<div> id ("+key+") </div>";
                parentAccess.ops++;
                return;
            }
            else if(pastKey=="<"||pastKey=="="||pastKey==">")
            {
                var modify= parentUL.getElementsByTagName("li")[1];
                modify.innerHTML=modify.innerHTML+"<div> id ("+key+") </div>";
                count++;
                return;
            }
            else if(pastKey=="+"||pastKey=="/"||pastKey=="-"||pastKey=="*")
                {
                    var modify= parentUL.getElementsByTagName("li")[1];
                    modify.innerHTML=modify.innerHTML+"<div> id ("+key+") </div>";
                    count++;
                    return;     
                }
            else if (pastKey==":=")
            {
                if(nextKey.trim()=="+"||nextKey=="/"||nextKey=="-"||nextKey=="*")
                {
                    count++;
                    parseLine(allsen[count],count,parentUL,parentAccess);
                    var TnewUl = parentUL.querySelectorAll('#math')[parentAccess.ops];
                    var newUl = TnewUl.getElementsByTagName('ul')[0];
                    var modify= newUl.getElementsByTagName("li")[0];
                    modify.innerHTML=modify.innerHTML+"<div> id ("+key+") </div>";
                    parentAccess.ops++;
                    return;
                }
                else
                {
                    parentUL.innerHTML=parentUL.innerHTML+"<li id=\"num\"><div> Const ("+key+") </div><ul></ul></li>";
                    count++;
                    return;
                }
            }
            else
            {
                count++;
                parseLine(allsen[count],count,parentUL,parentAccess);  
                return;
            }
        }
        else if(note.trim() ==="NUMBER") 
        {
            if(pastKey=="if")
            {
                count++;
                parseLine(allsen[count],count,parentUL,parentAccess);
                parentUL=parentUL.getElementsByTagName("li")[0].getElementsByTagName("ul")[0];
                var modify= parentUL.getElementsByTagName("li")[0];
                modify.innerHTML=modify.innerHTML+"<div> const ("+key+") </div>";
                parentAccess.ops++;
                return;
            }
            else if(pastKey=="until")
            { 
                count++;
                parseLine(allsen[count],count,parentUL,parentAccess);
                var TnewUl = parentUL.querySelectorAll('#cond')[parentAccess.ops];
                var newUl = TnewUl.getElementsByTagName('ul')[0];
                var modify= newUl.getElementsByTagName("li")[0];
                modify.innerHTML=modify.innerHTML+"<div> const ("+key+") </div>";
                parentAccess.ops++;
                return;
            }
            else if(pastKey=="<"||pastKey=="="||pastKey==">")
            {
                var modify= parentUL.getElementsByTagName("li")[1];
                modify.innerHTML=modify.innerHTML+"<div> const ("+key+") </div>";
                count++;
                return;
            }
            else if(pastKey=="+"||pastKey=="/"||pastKey=="-"||pastKey=="*")
                {
                    var modify= parentUL.getElementsByTagName("li")[1];
                    modify.innerHTML=modify.innerHTML+"<div> const ("+key+") </div>";
                    count++;
                    return;     
                }
            else if (pastKey==":=")
            {
                if(nextKey=="+"||nextKey=="/"||nextKey=="-"||nextKey=="*")
                {
                    count++;
                    parseLine(allsen[count],count,parentUL,parentAccess);
                    var TnewUl = parentUL.querySelectorAll('#math')[parentAccess.ops];
                    var newUl = TnewUl.getElementsByTagName('ul')[0];
                    var modify= newUl.getElementsByTagName("li")[0];
                    modify.innerHTML=modify.innerHTML+"<div> id ("+key+") </div>";
                    parentAccess.ops++;
                    return;
                }
                else
                {
                    parentUL.innerHTML=parentUL.innerHTML+"<li id=\"num\"><div> Const ("+key+") </div><ul></ul></li>";
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
              parseLine(allsen[count],count,ulhome,globalacces);
              }
              var uls = document.getElementsByTagName("ul");
              for(var i = 0; i < uls.length; i++)
              {
                   if(uls[i].innerHTML == ""){uls[i].parentElement.removeChild(uls[i]);}
              }
          };
         reader.readAsText(file);
        var uls=document.querySelectorAll("ul");
        
    };
   
}
infile.addEventListener('change',readSingleFile,false);
