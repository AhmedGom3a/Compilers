#include <iostream>
#include<fstream>
#include<string>
#include <ctype.h>
using namespace std;
bool Reserved(string token){
if(token=="if"||token=="else"||token=="read"||token=="then"||token=="end"||token=="repeat"||token=="until"||token=="write")
    return true;
else return false;
}
bool number(char check){}
void scan(string line,ofstream &opfile)
{
    string token="",type;
for (int i=0;i<line.length();i++)
    {
    char temp=line[i];
    if(temp==' '){}
    else if(temp=='{')
        {
            while(temp!='}'&&i<line.length())
                {
                    i++;
                    temp=line[i];
                    if(temp!='}')
                    {
                        token=token+temp;
                    }
                }
            type="COMMENT";
            opfile<<token<<","<<type<<endl;
            cout<<token<<","<<type<<endl;
            token="";
        }
    else if(isalpha(temp))
        {
            while(isalpha(temp)||isdigit(temp))//or number
            {
                temp=line[i];
                if(isalpha(temp)||isdigit(temp))
                {
                    token=token+temp;

                }
                temp=line[i+1];
                if((isalpha(temp)||isdigit(temp))){i++;}

            }
            if(Reserved(token)){type="RESERVED_KEYWORD";}
            else {type="IDENTIFIER";}
            opfile<<token<<","<<type<<endl;cout<<token<<","<<type<<endl;
            token="";
        }
    else if(isdigit(temp)){
            while(isdigit(temp)||temp=='.')
                {
                    temp=line[i];
                    if(isdigit(temp)||temp=='.')
                    {
                        token=token+temp;
                    }
                    temp=line[i+1];
                if((isdigit(temp))){i++;}
                }
            type="NUMBER";
            opfile<<token<<","<<type<<endl;cout<<token<<","<<type<<endl;
            token="";
    }
    else{
        if(temp==':'&&line[i+1]=='=')
            {
                token=":=";
                i++;
            }
        else
            {
                token=token+temp;
            }
        type="SPECIAL_SYMBOL";
        opfile<<token<<","<<type<<endl;
        cout<<token<<","<<type<<endl;
        token="";
        }

    }
}

int main()
{
    string alltext="",line,token,type;
    ifstream myfile;
    ofstream opfile;
    opfile.open("output.txt");
    myfile.open("input.txt");
    if (myfile.is_open())
      {
        while (getline(myfile,line))
        {
            alltext=alltext+" "+line;
        }
        myfile.close();
        scan(alltext,opfile);
      }
    else cout<< "Unable to open file";

}
