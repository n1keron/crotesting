reqProtocol=location.protocol;

var error=0;
var curItem=0;
var findStrInVoc='';

function Convert(fromChar,toChar,inVar)
{
	newInVar="";
	var from=0;
	var i;
	var next;
	for ( i=0; (next=inVar.indexOf(fromChar,from)) != -1; )
	{
		newInVar+=inVar.substring(from,next)+toChar;
		from=next+fromChar.length;
	}
	newInVar+=inVar.substring(from,inVar.length);
	return newInVar;
}

function SaveCompValue(fieldIndex,fieldNumber,logic,fieldName,checkName,compNames,selectedCompName,compValue,selectedCompValue,compValue2,selectedCompValue2,selectedLinkedBase,linkedBaseName,linkedRequestNumber,vocBase)
{
	vocBase=parseInt(vocBase,10);
	compValues=parent.invisible.document.forms[1].elements[0].name;
	from=0;
	next=compValues.indexOf('\x1e',from);
	firstLevel=compValues.substring(from,next);
	from=next+1;
	next=compValues.indexOf('\x1e',from);
	compValuesCount=compValues.substring(from,next);
	if ( fieldIndex == -1 )
	{
		if ( selectedCompValue.length )
		{
			compValuesCount=parseInt(compValuesCount,10)+selectedCompValue.length;
		} else
		{
			if ( vocBase != 0 && selectedCompName != 2 && selectedCompName != 3 )
			{
				compValuesCount=parseInt(compValuesCount,10)+compValue.length;
			} else
			{
				compValuesCount++;
			}
		}
		newCompValues=firstLevel.toString()+'\x1e'+compValuesCount.toString()+'\x1e';
		newCompValues+=compValues.substring(next+1,compValues.length);
		if ( selectedCompValue.length )
		{
			for ( i=0; i < selectedCompValue.length; i++ )
			{
				newCompValues+=fieldNumber+'\x1e';
				if ( i )
				{
					newCompValues+=1;
				} else
				{
					newCompValues+=parseInt(logic,10);
				}
				newCompValues+='\x1e'+fieldName+'\x1e'+checkName+'\x1e'+selectedCompName+'\x1e'+compNames+'\x1e'+vocBase+'\x1e'+selectedCompValue[i]+'\x1e'+compValue+'\x1e'+selectedCompValue2+'\x1e'+compValue2+'\x1e'+selectedLinkedBase+'\x1e'+linkedBaseName+'\x1e'+linkedRequestNumber+'\x1e';
			}
		} else
		{
			if ( vocBase != 0 && selectedCompName != 2 && selectedCompName != 3 )
			{
				for ( i=0; i < compValue.length; i++ )
				{
					newCompValues+=fieldNumber+'\x1e';
					if ( i )
					{
						newCompValues+=1;
					} else
					{
						newCompValues+=parseInt(logic,10);
					}
					newCompValues+='\x1e'+fieldName+'\x1e'+checkName+'\x1e'+selectedCompName+'\x1e'+compNames+'\x1e'+vocBase+'\x1e'+compValue.options[i].value+'\x1e'+compValue.options[i].text+'\x1e';
					if ( compValue2.type.substring(0,6) == 'select' )
					{
						newCompValues+=compValue2.options[i].value+'\x1e'+compValue2.options[i].text+'\x1e';
					} else
					{
						newCompValues+=selectedCompValue2+'\x1e'+compValue2+'\x1e';
					}
					newCompValues+=selectedLinkedBase+'\x1e'+linkedBaseName+'\x1e'+linkedRequestNumber+'\x1e';
				}
			} else
			{
				newCompValues+=fieldNumber+'\x1e'+parseInt(logic,10)+'\x1e'+fieldName+'\x1e'+checkName+'\x1e'+selectedCompName+'\x1e'+compNames+'\x1e'+vocBase+'\x1e'+selectedCompValue+'\x1e'+compValue+'\x1e'+selectedCompValue2+'\x1e'+compValue2+'\x1e'+selectedLinkedBase+'\x1e'+linkedBaseName+'\x1e'+linkedRequestNumber+'\x1e';
			}
		}
	} else
	{
		from=next+1;
		for ( i=0; i < fieldIndex; i++ )
		{
			for ( iMarker=0; iMarker < 14; iMarker++ )
			{
				next=compValues.indexOf('\x1e',from);
				from=next+1;
			}
		}
		newCompValues=compValues.substring(0,from);
		newCompValues+=fieldNumber+'\x1e'+parseInt(logic,10)+'\x1e'+fieldName+'\x1e'+checkName+'\x1e'+selectedCompName+'\x1e'+compNames+'\x1e'+vocBase+'\x1e';
		if ( vocBase != 0 && selectedCompName != 2 && selectedCompName != 3 )
		{
			newCompValues+=compValue.options[0].value+'\x1e'+compValue.options[0].text+'\x1e';
			if ( compValue2.type.substring(0,6) == 'select' )
			{
				newCompValues+=compValue2.options[0].value+'\x1e'+compValue2.options[0].text+'\x1e';
			} else
			{
				newCompValues+=selectedCompValue2+'\x1e'+compValue2+'\x1e';
			}
		} else
		{
			newCompValues+=selectedCompValue+'\x1e'+compValue+'\x1e'+selectedCompValue2+'\x1e'+compValue2+'\x1e';
		}
		newCompValues+=selectedLinkedBase+'\x1e'+linkedBaseName+'\x1e'+linkedRequestNumber+'\x1e';
		for ( iMarker=0; iMarker < 14; iMarker++ )
		{
			next=compValues.indexOf('\x1e',from);
			from=next+1;
		}
		newCompValues+=compValues.substring(next+1,compValues.length);
	}
	parent.invisible.document.forms[1].elements[0].name=newCompValues;
	ViewCompValues();
}

function DeleteCompValue(fieldIndex)
{
	if ( confirm("Вы действительно хотите удалить условие поиска ?") )
	{
		compValues=parent.invisible.document.forms[1].elements[0].name;
		from=0;
		next=compValues.indexOf('\x1e',from);
		firstLevel=compValues.substring(from,next);
		from=next+1;
		next=compValues.indexOf('\x1e',from);
		compValuesCount=compValues.substring(from,next);
		if ( fieldIndex >= 0 && fieldIndex < compValuesCount )
		{
			compValuesCount--;
			newCompValues=firstLevel.toString()+'\x1e'+compValuesCount.toString()+'\x1e';
			from=next+1;
			fromCompValuesCount=from;
			for ( i=0; i < fieldIndex; i++ )
			{
				for ( iMarker=0; iMarker < 14; iMarker++ )
				{
					next=compValues.indexOf('\x1e',from);
					from=next+1;
				}
			}
			newCompValues+=compValues.substring(fromCompValuesCount,from);
			for ( iMarker=0; iMarker < 14; iMarker++ )
			{
				next=compValues.indexOf('\x1e',from);
				from=next+1;
			}
			newCompValues+=compValues.substring(next+1,compValues.length);
		}
		parent.invisible.document.forms[1].elements[0].name=newCompValues;
	}
	ViewCompValues();
}

function ViewCompValues()
{
	compValues=parent.invisible.document.forms[1].elements[0].name;
	from=0;
	next=compValues.indexOf('\x1e',from);
	firstLevel=parseInt(compValues.substring(from,next),10);
	from=next+1;
	next=compValues.indexOf('\x1e',from);
	compValuesCount=compValues.substring(from,next);
	from=next+1;
	body="";
	body+="<FORM action=\""+parent.invisible.document.forms[3].elements[0].name+"\" target=\"_top\" method=\"post\">";
	body+="<INPUT type=\"hidden\" name=\"WorkingDirectory\" value=\""+parent.invisible.document.forms[3].elements[1].name+"\">";
	body+="<INPUT type=\"hidden\" name=\"CompValuesCount\" value=\""+compValuesCount+"\">";
	body+="<TABLE BORDER=4 CELLSPACING=2 CELLPADDING=2 WIDTH=\"100%\">";
	body+="<CAPTION>Условия поиска</CAPTION>";
	body+="<TR><TH class=\"small\">Связка<TH class=\"small\">Поле";
	body+="<TH class=\"small\">Вид сравнения<TH class=\"small\">Поисковое значение";
	for ( i=0; i < compValuesCount; i++ )
	{
		body+="<INPUT type=\"hidden\" name=\"FieldIndex"+i+"\" value=\""+i+"\">";
		
		next=compValues.indexOf('\x1e',from);
		fieldNumber=compValues.substring(from,next);
		from=next+1;
		body+="<INPUT type=\"hidden\" name=\"FieldNumber"+i+"\" value=\""+fieldNumber+"\">";
		
		next=compValues.indexOf('\x1e',from);
		logic=compValues.substring(from,next);
		from=next+1;
		body+="<tr><td class=\"small\">";
		if ( i )
		{
			if ( logic == 0 )
			{
				body+="И";
				body+="<INPUT type=\"hidden\" name=\"Logic"+i+"\" value=\"0\">";
			} else
			{
				body+="ИЛИ";
				body+="<INPUT type=\"hidden\" name=\"Logic"+i+"\" value=\"1\">";
			}
		} else
		{
			body+="<INPUT type=\"hidden\" name=\"Logic"+i+"\" value=\"0\">";
		}

		next=compValues.indexOf('\x1e',from);
		fieldName=compValues.substring(from,next);
		from=next+1;
		
		next=compValues.indexOf('\x1e',from);
		checkName=compValues.substring(from,next);
		from=next+1;
		
		next=compValues.indexOf('\x1e',from);
		selectedCompName=compValues.substring(from,next);
		from=next+1;
		curString="<INPUT type=\"hidden\" name=\"CompNumber"+i+"\" value=\""+selectedCompName+"\">";

		next=compValues.indexOf('\x1e',from);
		compNames=compValues.substring(from,next);
		compNamesValue=parent.invisible.document.forms[compNames].elements[0].name;
		from=next+1;
		fromCompNames=0;
		for ( iCompNames=0; (nextCompNames=compNamesValue.indexOf('\x1d',fromCompNames)) != -1; iCompNames++ )
		{
			temp=compNamesValue.substring(fromCompNames,nextCompNames);
			marker=temp.indexOf('\x1c',0);
			if ( iCompNames == selectedCompName )
			{
				compare=temp.substring(0,marker);
				compareName=temp.substring(marker+1,temp.length);
				curString+="<TD class=\"small\">"+compareName;
				break;
			}
			fromCompNames=nextCompNames+1;
		}

		next=compValues.indexOf('\x1e',from);
		vocBase=parseInt(compValues.substring(from,next),10);
		from=next+1;

		next=compValues.indexOf('\x1e',from);
		selectedValue=compValues.substring(from,next);
		from=next+1;

		next=compValues.indexOf('\x1e',from);
		compValue=compValues.substring(from,next);
		from=next+1;
		if ( selectedValue == -1 )
		{
			curString+="<TD class=\"small\">"+compValue;
			newCompValue="";
			charCount=compValue.length;
			for ( iChar=0; iChar < charCount; iChar++ )
			{
				curChar=compValue.charAt(iChar);
				if ( curChar == '\x22' )
				{
					curChar='\x1e';
				} else
				{
					if ( curChar == '\x27' )
					{
						curChar='\x1d';
					}
				}
				newCompValue+=curChar;
			}
			compValue=newCompValue;
			curString+="<INPUT type=\"hidden\" name=\"CompValue"+i+"\" value=\""+compValue+"\">";
		} else
		{
			if ( vocBase != 0 && compare != 'РП' && compare != 'НП' )
			{
				curString+="<TD class=\"small\">"+compValue;
				curString+="<INPUT type=\"hidden\" name=\"CompValue"+i+"\" value=\""+selectedValue+"\">";
			} else
			{
				vocValues=parent.invisible.document.forms[compValue].elements[0].name;
				fromVocValues=0;
				for ( iVocValues=0; (nextVocValues=vocValues.indexOf('\x1d',fromVocValues)) != -1; iVocValues++ )
				{
					temp=vocValues.substring(fromVocValues,nextVocValues);
					marker=temp.indexOf('\x1c',0);
					if ( iVocValues == selectedValue )
					{
						curString+="<TD class=\"small\">"+temp.substring(marker+1,temp.length);
						curString+="<INPUT type=\"hidden\" name=\"CompValue"+i+"\" value=\""+temp.substring(0,marker)+"\">";
						break;
					}
					fromVocValues=nextVocValues+1;
				}
			}
		}

		next=compValues.indexOf('\x1e',from);
		selectedValue2=compValues.substring(from,next);
		from=next+1;

		next=compValues.indexOf('\x1e',from);
		compValue2=compValues.substring(from,next);
		from=next+1;
		if ( compare == 'ВИ' || compare == 'НИ' )
		{
			if ( selectedValue2 == -1 )
			{
				curString+="<class=\"small\"> - "+compValue2;
				newCompValue="";
				charCount=compValue2.length;
				for ( iChar=0; iChar < charCount; iChar++ )
				{
					curChar=compValue2.charAt(iChar);
					if ( curChar == '\x22' )
					{
						curChar='\x1e';
					} else
					{
						if ( curChar == '\x27' )
						{
							curChar='\x1d';
						}
					}
					newCompValue+=curChar;
				}
				compValue2=newCompValue;
				curString+="<INPUT type=\"hidden\" name=\"Comp2Value"+i+"\" value=\""+compValue2+"\">";
			} else
			{
				if ( vocBase != 0 && compare != 'РП' && compare != 'НП' )
				{
					curString+="<class=\"small\"> - "+compValue2;
					curString+="<INPUT type=\"hidden\" name=\"Comp2Value"+i+"\" value=\""+selectedValue2+"\">";
				} else
				{
					vocValues=parent.invisible.document.forms[compValue].elements[0].name;
					fromVocValues=0;
					for ( iVocValues=0; (nextVocValues=vocValues.indexOf('\x1d',fromVocValues)) != -1; iVocValues++ )
					{
						temp=vocValues.substring(fromVocValues,nextVocValues);
						marker=temp.indexOf('\x1c',0);
						if ( iVocValues == selectedValue2 )
						{
							curString+="<class=\"small\"> - "+temp.substring(marker+1,temp.length);
							curString+="<INPUT type=\"hidden\" name=\"Comp2Value"+i+"\" value=\""+temp.substring(0,marker)+"\">";
							break;
						}
						fromVocValues=nextVocValues+1;
					}
				}
			}
		}

		next=compValues.indexOf('\x1e',from);
		selectedLinkedBase=compValues.substring(from,next);
		from=next+1;
		curString+="<INPUT type=\"hidden\" name=\"LinkedBase"+i+"\" value=\""+selectedLinkedBase+"\">";

		next=compValues.indexOf('\x1e',from);
		linkedBaseName=compValues.substring(from,next);
		from=next+1;

		next=compValues.indexOf('\x1e',from);
		linkedRequestNumber=compValues.substring(from,next);
		from=next+1;
		curString+="<INPUT type=\"hidden\" name=\"LinkedRequestNumber"+i+"\" value=\""+linkedRequestNumber+"\">";

		body+="<TD>";
		body+="<TABLE BORDER=0 CELLSPACING=0 WIDTH=\"100%\">";
		body+="<TR><TD class=\"small\" ALIGN=LEFT>"+fieldName;
		if ( linkedBaseName != "" )
		{
			body+="->"+linkedBaseName;
		}
		body+="<TD class=\"small\" ALIGN=RIGHT>";
		if ( selectedLinkedBase > 0 )
		{
			body+="<a href=\"javascript:document.forms[0].ComplexFind.click();\" onFocus=\"document.forms[0].ItemIndex.value="+i+";\" onMouseOver=\"document.forms[0].ItemIndex.value="+i+";window.status='Изменить условия поиска связанной базы';return true;\" onMouseOut=\"window.status='';return true;\"><IMG src=\""+reqProtocol+"//"+parent.invisible.document.forms[3].elements[2].name+"/Link.gif\" BORDER=\"0\" ALT=\"Связанная база\"></a>&nbsp;&nbsp;";
		}
		if ( compare == 'ВИ' || compare == 'НИ' )
		{
			body+="<a href=\"javascript:FieldSelect("+i+",'"+fieldNumber+"',"+logic+",'"+fieldName+"','"+checkName+"','"+compNames+"',"+selectedCompName+",'"+compValue+"','"+selectedValue+"','"+compValue2+"','"+selectedValue2+"',-1,"+selectedLinkedBase+",'"+linkedBaseName+"',"+linkedRequestNumber+","+vocBase+");\" onMouseOver=\"window.status='Изменить условие поиска';return true;\" onMouseOut=\"window.status='';return true;\"><IMG src=\""+reqProtocol+"//"+parent.invisible.document.forms[3].elements[2].name+"/Select.gif\" BORDER=\"0\" ALT=\"Изменить\"></a>";
		} else
		{
			body+="<a href=\"javascript:FieldSelect("+i+",'"+fieldNumber+"',"+logic+",'"+fieldName+"','"+checkName+"','"+compNames+"',"+selectedCompName+",'"+compValue+"','"+selectedValue+"','',0,-1,"+selectedLinkedBase+",'"+linkedBaseName+"',"+linkedRequestNumber+","+vocBase+");\" onMouseOver=\"window.status='Изменить условие поиска';return true;\" onMouseOut=\"window.status='';return true;\"><IMG src=\""+reqProtocol+"//"+parent.invisible.document.forms[3].elements[2].name+"/Select.gif\" BORDER=\"0\" ALT=\"Изменить\"></a>";
		}
		if ( selectedLinkedBase > 0 )
		{
			body+="&nbsp;&nbsp;<a href=\"javascript:if ( confirm('Вы действительно хотите удалить условие поиска ?') ) document.forms[0].ComplexFind.click();\" onFocus=\"document.forms[0].ItemIndex.value="+(-i-3)+";\" onMouseOver=\"document.forms[0].ItemIndex.value="+(-i-3)+";window.status='Удалить условие поиска';return true;\" onMouseOut=\"window.status='';return true;\"><IMG src=\""+reqProtocol+"//"+parent.invisible.document.forms[3].elements[2].name+"/Delete.gif\" BORDER=\"0\" ALT=\"Удалить\"></a>";
		} else
		{
			body+="&nbsp;&nbsp;<a href=\"javascript:DeleteCompValue("+i+");\" onMouseOver=\"window.status='Удалить условие поиска';return true;\" onMouseOut=\"window.status='';return true;\"><IMG src=\""+reqProtocol+"//"+parent.invisible.document.forms[3].elements[2].name+"/Delete.gif\" BORDER=\"0\" ALT=\"Удалить\"></a>";
		}
		body+="</TABLE>";
		body+=curString;
	}
	complexRight=parent.invisible.document.forms[2].elements[0].name;
	newcomplexRight="";
	from=0;
	for ( i=0; (next=complexRight.indexOf('\x1b',from)) != -1; )
	{
		newcomplexRight+=complexRight.substring(from,next)+'\x22';
		from=next+1;
	}
	newcomplexRight+=complexRight.substring(from,complexRight.length);
	from=0;
	next=newcomplexRight.indexOf('</body>',from);
	body+="</table>";
	body+="<INPUT type=\"hidden\" name=\"ItemIndex\" value=\"-1\">";
	body+="<TABLE BORDER=0 CELLSPACING=0 WIDTH=\"100%\">";
	body+="<tr><td><hr>";
	body+="<tr><td ALIGN=CENTER>";
	if ( firstLevel == 0 )
	{
//		body+="<tr><td ALIGN=CENTER><INPUT type=\"button\" name=\"ComplexUp\" value=\"На уровень выше\" onSubmit=\"document.forms[0].ItemIndex.value=-2;alert(document.forms[0].ItemIndex.value);document.forms[0].ComplexFind.click();return true;\">";
//		body+="<a href=\"javascript:document.forms[0].ComplexFind.click();\" onMouseOver=\"window.status='Возврат на предыдущий уровень запроса';return true;\" onMouseOut=\"window.status='';return true;\">На уровень выше</a>&nbsp;&nbsp;";
		body+="<INPUT type=\"submit\" name=\"ComplexFind\" value=\"На уровень выше\" onFocus=\"document.forms[0].ItemIndex.value=-2;\" onMouseOver=\"document.forms[0].ItemIndex.value=-2;\" onClick=\"return true;\">";
	} else
	{
		body+="<INPUT type=\"submit\" name=\"ComplexFind\" value=\"Выполнить запрос\">";
	}
	body+="</table></FORM>";
//	var OpenWindow=window.open("","right","width=500,height=300");
	var OpenWindow=parent.right;
	OpenWindow.document.open();
	temp=newcomplexRight.substring(from,next);
	fromScript=temp.indexOf("<SCRIPT LANGUAGE=",0);
	nextScript=temp.indexOf("/SCRIPT>",temp);
	OpenWindow.document.write(temp.substring(0,fromScript));
	OpenWindow.document.write("<SCRIPT LANGUAGE=\"javascript\">\r\n");
	OpenWindow.document.write("<!-- Скрыть от браузеров, не читающих Javascript\r\n");
	javaScripts=parent.invisible.document.forms[0].elements[0].name;
	newScripts="";
	fromFm=0;
	for ( i=0; (nextFm=javaScripts.indexOf('\x1b',fromFm)) != -1; )
	{
		newScripts+=javaScripts.substring(fromFm,nextFm)+'\x22';
		fromFm=nextFm+1;
	}
	newScripts+=javaScripts.substring(fromFm,javaScripts.length);
	OpenWindow.document.write(newScripts);
	OpenWindow.document.write("// не скрывать -->\r\n");
	OpenWindow.document.write(temp.substring(nextScript-1,temp.length));
	OpenWindow.document.write("<SCRIPT LANGUAGE=\"javascript\">\r\n");
	OpenWindow.document.write("curSelect='';\r\n");
	OpenWindow.document.write('\x3c'+"/SCRIPT>\r\n");
	OpenWindow.document.write(body);
//	OpenWindow.document.write(newcomplexRight.substring(next,newcomplexRight.length));
	OpenWindow.document.write("</body></html>\r\n");
	OpenWindow.document.close();
}

function CompareChange(compare,parametersForm)
{
	FieldSelect(parametersForm.fieldIndex.value,parametersForm.fieldNumber.value,parametersForm.logic.value,parametersForm.fieldName.value,parametersForm.checkName.value,parametersForm.compNames.value,parametersForm.selectedCompName.value,parametersForm.compValue.value,parametersForm.selectedCompValue.value,parametersForm.compValue2.value,parametersForm.selectedCompValue2.value,parametersForm.linkedBase.value,parametersForm.selectedLinkedBase.value,parametersForm.linkedBaseName.value,parametersForm.linkedRequestNumber.value,parametersForm.vocBase.value);
}

function FieldSelect(fieldIndex,fieldNumber,logic,fieldName,checkName,compNames,selectedCompName,compValue,selectedCompValue,compValue2,selectedCompValue2,linkedBase,selectedLinkedBase,linkedBaseName,linkedRequestNumber,vocBase)
{
	selectedCompValue=parseInt(selectedCompValue,10);
	selectedCompValue2=parseInt(selectedCompValue2,10);
	vocBase=parseInt(vocBase,10);
//	var OpenWindow=window.open("","right","width=500,height=300");
	var OpenWindow=parent.right;
	OpenWindow.document.open();
	complexRight=parent.invisible.document.forms[2].elements[0].name;
	newComplexRight="";
	from=0;
	for ( i=0; (next=complexRight.indexOf('\x1b',from)) != -1; )
	{
		newComplexRight+=complexRight.substring(from,next)+'\x22';
		from=next+1;
	}
	newComplexRight+=complexRight.substring(from,complexRight.length);
	complexRight=newComplexRight;
	from=0;
	next=complexRight.indexOf("<SCRIPT LANGUAGE=",from-1);
	OpenWindow.document.write(complexRight.substring(from,next));
	OpenWindow.document.write("<SCRIPT LANGUAGE=\"javascript\">\r\n");
	OpenWindow.document.write("<!-- Скрыть от браузеров, не читающих Javascript\r\n");
	javaScripts=parent.invisible.document.forms[0].elements[0].name;
	newScripts="";
	from=0;
	for ( i=0; (next=javaScripts.indexOf('\x1b',from)) != -1; )
	{
		newScripts+=javaScripts.substring(from,next)+'\x22';
		from=next+1;
	}
	newScripts+=javaScripts.substring(from,javaScripts.length);
	OpenWindow.document.write(newScripts);
	OpenWindow.document.write("// не скрывать -->\r\n");
	from=0;
	next=complexRight.indexOf("/SCRIPT>",from);
	from=next-1;
	next=complexRight.indexOf("</body>",from);
	OpenWindow.document.write(complexRight.substring(from,next));
	OpenWindow.document.write("<SCRIPT LANGUAGE=\"javascript\">\r\n");
	OpenWindow.document.write("curSelect='';\r\n");
	OpenWindow.document.write("function CloseVocFind()\r\n");
	OpenWindow.document.write("{\r\n");
		OpenWindow.document.write("if ( curSelect != '' )\r\n");
		OpenWindow.document.write("{\r\n");
			OpenWindow.document.write("vocFind=window.open('','VocFind','');\r\n");
			OpenWindow.document.write("vocFind.close();\r\n");
		OpenWindow.document.write("}\r\n");
	OpenWindow.document.write("}\r\n");
	OpenWindow.document.write('\x3c'+"/SCRIPT>\r\n");
	OpenWindow.document.write("<head><title>Условие поиска</title></head>\r\n");

	OpenWindow.document.write("<form name=\"Parameters\">");
	OpenWindow.document.write("<INPUT type=\"hidden\" name=\"fieldIndex\" value=\""+fieldIndex+"\">");
	OpenWindow.document.write("<INPUT type=\"hidden\" name=\"fieldNumber\" value=\""+fieldNumber+"\">");
	OpenWindow.document.write("<INPUT type=\"hidden\" name=\"logic\" value=\""+logic+"\">");
	OpenWindow.document.write("<INPUT type=\"hidden\" name=\"fieldName\" value=\""+fieldName+"\">");
	OpenWindow.document.write("<INPUT type=\"hidden\" name=\"checkName\" value=\""+checkName+"\">");
	OpenWindow.document.write("<INPUT type=\"hidden\" name=\"compNames\" value=\""+compNames+"\">");
	OpenWindow.document.write("<INPUT type=\"hidden\" name=\"selectedCompName\" value=\""+selectedCompName+"\">");
	OpenWindow.document.write("<INPUT type=\"hidden\" name=\"compValue\" value=\""+compValue+"\">");
	if ( isNaN(selectedCompValue) )
	{
		OpenWindow.document.write("<INPUT type=\"hidden\" name=\"selectedCompValue\" value=\"-1\">");
	} else
	{
		OpenWindow.document.write("<INPUT type=\"hidden\" name=\"selectedCompValue\" value=\""+selectedCompValue+"\">");
	}
	OpenWindow.document.write("<INPUT type=\"hidden\" name=\"compValue2\" value=\""+compValue2+"\">");
	OpenWindow.document.write("<INPUT type=\"hidden\" name=\"selectedCompValue2\" value=\""+selectedCompValue2+"\">");
	if ( linkedBase == -1 )
	{
		OpenWindow.document.write("<INPUT type=\"hidden\" name=\"linkedBase\" value=\""+linkedBase+"\">");
		OpenWindow.document.write("<INPUT type=\"hidden\" name=\"selectedLinkedBase\" value=\""+selectedLinkedBase+"\">");
	} else
	{
		OpenWindow.document.write("<INPUT type=\"hidden\" name=\"linkedBase\" value=\""+linkedBase+"\">");
		OpenWindow.document.write("<INPUT type=\"hidden\" name=\"selectedLinkedBase\" value=\""+parent.left.document.forms[linkedBase].elements[0].value+"\">");
	}
	OpenWindow.document.write("<INPUT type=\"hidden\" name=\"linkedBaseName\" value=\""+linkedBaseName+"\">");
	OpenWindow.document.write("<INPUT type=\"hidden\" name=\"linkedRequestNumber\" value=\""+linkedRequestNumber+"\">");
	OpenWindow.document.write("<INPUT type=\"hidden\" name=\"vocBase\" value=\""+vocBase+"\">");
	OpenWindow.document.write("</form>");

	OpenWindow.document.write("<TABLE BORDER=0 CELLSPACING=2 CELLPADDING=2 WIDTH='100%'>\r\n");
	OpenWindow.document.write("<TR><td ALIGN=CENTER><h3>Поле "+fieldName+"</h3>\r\n");
	OpenWindow.document.write("</TABLE>\r\n");
	compValues=parent.invisible.document.forms[1].elements[0].name;
	from=0;
	next=compValues.indexOf('\x1e',from);
	firstLevel=compValues.substring(from,next);
	from=next+1;
	next=compValues.indexOf('\x1e',from);
	compValuesCount=parseInt(compValues.substring(from,next),10);
	compValueTable="<TABLE BORDER=0 CELLSPACING=2 CELLPADDING=2 WIDTH='100%'>\r\n";
	compValueTable+="<CAPTION>Вид сравнения</CAPTION>\r\n";
	compValueTable+="<TR><td ALIGN=CENTER class='small'><SELECT class='smallinput' name='Compare' onChange=\"document.Parameters.selectedCompName.value=document.Save.Compare.selectedIndex;CompareChange(this[this.selectedIndex].value,document.Parameters);\">\r\n";
	compNamesValue=parent.invisible.document.forms[compNames].elements[0].name;
	from=0;
	for ( i=0; (next=compNamesValue.indexOf('\x1d',from)) != -1; i++ )
	{
		temp=compNamesValue.substring(from,next);
		marker=temp.indexOf('\x1c',0);
		compValueTable+="<OPTION \r\n";
		if ( i == selectedCompName )
		{
			compValueTable+="SELECTED \r\n";
			compare=temp.substring(0,marker);
		}
		compValueTable+="value='"+temp.substring(0,marker)+"'>"+temp.substring(marker+1,temp.length);
		from=next+1;
	}
	compValueTable+="</SELECT>\r\n";
	compValueTable+="</TABLE>\r\n";

	OpenWindow.document.write("<form name=\"Save\" method=\"post\" onSubmit=\"");
	OpenWindow.document.write("if ( !"+checkName+"(document.Save.Compare.value,document.Save.CompValue,true) )return false;");
	if ( compare == 'ВИ' || compare == 'НИ' )
	{
		OpenWindow.document.write("if ( !"+checkName+"(document.Save.Compare.value,document.Save.CompValue2,true) )return false;");
	}
	OpenWindow.document.write("var selectedCompValue=new Array();\r\n");
	if ( compare != 'ВИ' && compare != 'НИ' && !selectedCompValue && selectedCompValue != -1 )
	{
		OpenWindow.document.write("for ( i=0,j=0; i < document.Save.CompValue.length; i++ )\r\n");
		OpenWindow.document.write("{\r\n");
		OpenWindow.document.write("if ( document.Save.CompValue.options[i].selected )\r\n");
		OpenWindow.document.write("{\r\n");
		OpenWindow.document.write("selectedCompValue[j++]=i+1;\r\n");
		OpenWindow.document.write("}\r\n");
		OpenWindow.document.write("}\r\n");
	} else
	{
		if ( selectedCompValue != -1 )
		{
			OpenWindow.document.write("selectedCompValue[0]=document.Save.CompValue.selectedIndex;\r\n");
		}
	}
	if ( compValuesCount && fieldIndex != 0 )
	{
		OpenWindow.document.write("logicValue=0;if(document.Save.Logic[1].checked)logicValue=1;SaveCompValue("+fieldIndex+",'"+fieldNumber+"',logicValue,'"+fieldName+"','"+checkName+"','"+compNames+"',document.Save.Compare.selectedIndex,");
	} else
	{
		OpenWindow.document.write("SaveCompValue("+fieldIndex+",'"+fieldNumber+"',document.Save.Logic.value,'"+fieldName+"','"+checkName+"','"+compNames+"',document.Save.Compare.selectedIndex,");
	}
	if ( selectedCompValue == -1 )
	{
		OpenWindow.document.write("document.Save.CompValue.value,-1,document.Save.CompValue2.value,-1");
	} else
	{
		if ( vocBase != 0 && compare != 'РП' && compare != 'НП' )
		{
			OpenWindow.document.write("document.Save.CompValue,0,document.Save.CompValue2,0");
		} else
		{
			if ( compare == 'ВИ' || compare == 'НИ' )
			{
				OpenWindow.document.write(compValue+",selectedCompValue,"+compValue2+",document.Save.CompValue2.selectedIndex");
			} else
			{
				OpenWindow.document.write(compValue+",selectedCompValue,"+compValue+",0");
			}
		}
	}
	OpenWindow.document.write(",document.Parameters.selectedLinkedBase.value,document.Parameters.linkedBaseName.value,document.Parameters.linkedRequestNumber.value,document.Parameters.vocBase.value);return false;\">\r\n");
	OpenWindow.document.write("<TABLE BORDER=0 CELLSPACING=2 CELLPADDING=2 WIDTH='100%'>\r\n");
	OpenWindow.document.write("<CAPTION>Поисковое значение</CAPTION>\r\n");
	if ( selectedCompValue == -1 )
	{
		OpenWindow.document.write("<TR><td ALIGN=CENTER class='small'><INPUT class='smallinput' name='CompValue'");
		OpenWindow.document.write(" value='"+compValue+"' onFocus=\"Focus(this);\" onBlur=\"document.Parameters.compValue.value=this.value;"+checkName+"(this.form.Compare.value,this,false);\">");
		if ( compare == 'ВИ' || compare == 'НИ' )
		{
			OpenWindow.document.write("<class=\"small\"> - <INPUT class='smallinput' name='CompValue2'");
			OpenWindow.document.write(" value='"+compValue2+"' onFocus=\"Focus(this);\" onBlur=\""+checkName+"(this.form.Compare.value,this,false);\">");
		} else
		{
			OpenWindow.document.write("<INPUT type='hidden' name='CompValue2'>");
		}
	} else
	{
		if ( vocBase != 0 && compare != 'РП' && compare != 'НП' )
		{
			OpenWindow.document.write("<SCRIPT LANGUAGE=\"javascript\">\r\n");
			OpenWindow.document.write("curDelete='';\r\n");
			OpenWindow.document.write("function DeleteCurSel()\r\n");
			OpenWindow.document.write("{\r\n");
				OpenWindow.document.write("curSelect.options[curSelect.selectedIndex]=null;\r\n");
				OpenWindow.document.write("if ( curSelect.length )\r\n");
				OpenWindow.document.write("{\r\n");
					OpenWindow.document.write("curSelect.style.display=''\r\n");
					OpenWindow.document.write("curDelete.style.display=''\r\n");
					OpenWindow.document.write("curSelect.focus();\r\n");
				OpenWindow.document.write("}else\r\n");
				OpenWindow.document.write("{\r\n");
					OpenWindow.document.write("curSelect.style.display='none'\r\n");
					OpenWindow.document.write("curDelete.style.display='none'\r\n");
				OpenWindow.document.write("}\r\n");
			OpenWindow.document.write("}\r\n");
			OpenWindow.document.write("function VocFindSet(code,termin)\r\n");
			OpenWindow.document.write("{\r\n");
				OpenWindow.document.write("for ( i=curSelect.length-1; i >= 0; i-- )\r\n");
				OpenWindow.document.write("{\r\n");
					OpenWindow.document.write("curSelect.options[i]=null;\r\n");
				OpenWindow.document.write("}\r\n");
				OpenWindow.document.write("for ( i=0; i < code.length; i++ )\r\n");
				OpenWindow.document.write("{\r\n");
					OpenWindow.document.write("var newOption=new Option(termin[i],code[i]);\r\n");
					OpenWindow.document.write("curSelect.options[i]=newOption;\r\n");
				OpenWindow.document.write("}\r\n");
				OpenWindow.document.write("if ( code.length )\r\n");
				OpenWindow.document.write("{\r\n");
					OpenWindow.document.write("curSelect.style.display=''\r\n");
					OpenWindow.document.write("curDelete.style.display=''\r\n");
					OpenWindow.document.write("curSelect.focus();\r\n");
				OpenWindow.document.write("}else\r\n");
				OpenWindow.document.write("{\r\n");
					OpenWindow.document.write("curSelect.style.display='none'\r\n");
					OpenWindow.document.write("curDelete.style.display='none'\r\n");
				OpenWindow.document.write("}\r\n");
				OpenWindow.document.write("curSelect='';\r\n");
				OpenWindow.document.write("curDelete='';\r\n");
			OpenWindow.document.write("}\r\n");
			OpenWindow.document.write('\x3c'+"/SCRIPT>\r\n");
			OpenWindow.document.write("<TR><td ALIGN=CENTER class='small'><SELECT class='smallinput' name='CompValue'");
			if ( selectedCompValue == "" )
			{
				OpenWindow.document.write(" style='display:none'");
			}
			OpenWindow.document.write(">");
			if ( selectedCompValue != "" )
			{
				OpenWindow.document.write("<OPTION \r\n");
				OpenWindow.document.write("value='"+selectedCompValue+"'>"+compValue);
			}
			OpenWindow.document.write("</SELECT>\r\n");
			OpenWindow.document.write("&nbsp;&nbsp;<a name=\"DeleteCurrentSelect\"");
			if ( selectedCompValue == "" )
			{
				OpenWindow.document.write(" style=\"display:none\"");
			}
			OpenWindow.document.write(" href=\"javascript:curSelect=document.all.CompValue;curDelete=document.all.DeleteCurrentSelect;DeleteCurSel();\" onMouseOver=\"window.status='Удалить текущее значение';return true;\" onMouseOut=\"window.status='';return true;\"><img src=\""+reqProtocol+"//"+parent.invisible.document.forms[3].elements[2].name+"/Delete.gif\" BORDER=\"0\" ALT=\"Удалить\"></a>");
			workingDirectory=Convert('\\','\\\\',parent.invisible.document.forms[3].elements[1].name);
			OpenWindow.document.write("&nbsp;&nbsp;<INPUT type=\"button\" name=\"VocFindButton\" value=\"Словарь\" onClick=\"curSelect=this.form.CompValue;curDelete=document.all.DeleteCurrentSelect;window.open('"+parent.invisible.document.forms[3].elements[0].name+"?WorkingDirectory="+workingDirectory+"&VocBase="+vocBase);
			if ( compare != 'ВИ' && compare != 'НИ' && selectedCompValue == "" )
			{
				OpenWindow.document.write("&Multiple=1");
			}
			OpenWindow.document.write("&VocFind=Поиск','VocFind','');\">");
			if ( compare == 'ВИ' || compare == 'НИ' )
			{
				OpenWindow.document.write("<class=\"small\"> - <SELECT class='smallinput' name='CompValue2'");
				if ( selectedCompValue2 == "" )
				{
					OpenWindow.document.write(" style='display:none'");
				}
				OpenWindow.document.write(">");
				if ( selectedCompValue2 != "" )
				{
					OpenWindow.document.write("<OPTION \r\n");
					OpenWindow.document.write("value='"+selectedCompValue2+"'>"+compValue2);
				}
				OpenWindow.document.write("</SELECT>\r\n");
				OpenWindow.document.write("&nbsp;&nbsp;<a name=\"DeleteCurrentSelect2\"");
				if ( selectedCompValue2 == "" )
				{
					OpenWindow.document.write(" style=\"display:none\"");
				}
				OpenWindow.document.write(" href=\"javascript:curSelect=document.all.CompValue2;curDelete=document.all.DeleteCurrentSelect2;DeleteCurSel();\" onMouseOver=\"window.status='Удалить текущее значение';return true;\" onMouseOut=\"window.status='';return true;\"><img src=\""+reqProtocol+"//"+parent.invisible.document.forms[3].elements[2].name+"/Delete.gif\" BORDER=\"0\" ALT=\"Удалить\"></a>");
				workingDirectory=Convert('\\','\\\\',parent.invisible.document.forms[3].elements[1].name);
				OpenWindow.document.write("&nbsp;&nbsp;<INPUT type=\"button\" name=\"VocFindButton2\" value=\"Словарь\" onClick=\"curSelect=this.form.CompValue2;curDelete=document.all.DeleteCurrentSelect2;window.open('"+parent.invisible.document.forms[3].elements[0].name+"?WorkingDirectory="+workingDirectory+"&VocBase="+vocBase+"&VocFind=Поиск','VocFind','');\">");
			} else
			{
				OpenWindow.document.write("<INPUT type='hidden' name='CompValue2'>");
			}
		} else
		{
			if ( compare == 'РП' || compare == 'НП' )
			{
				OpenWindow.document.write("<INPUT type='hidden' name='CompValue'>");
			} else
			{
				OpenWindow.document.write("<TR><td ALIGN=CENTER class='small'><SELECT class='smallinput' name='CompValue'");
				if ( compare != 'ВИ' && compare != 'НИ' && !selectedCompValue )
				{
					OpenWindow.document.write(" MULTIPLE size=5");
				}
				OpenWindow.document.write(" onChange=\"document.Parameters.selectedCompValue.value=this.selectedIndex;\">");
				compValues=parent.invisible.document.forms[compValue].elements[0].name;
				from=0;
				for ( i=0; (next=compValues.indexOf('\x1d',from)) != -1; i++ )
				{
					temp=compValues.substring(from,next);
					marker=temp.indexOf('\x1c',0);
					if ( i || compare == 'ВИ' || compare == 'НИ' || selectedCompValue )
					{
						OpenWindow.document.write("<OPTION \r\n");
						if ( i == selectedCompValue )
						{
							OpenWindow.document.write("SELECTED \r\n");
						}
						OpenWindow.document.write("value='"+temp.substring(0,marker)+"'>"+temp.substring(marker+1,temp.length));
					}
					from=next+1;
				}
				OpenWindow.document.write("</SELECT>\r\n");
			}
			if ( compare == 'ВИ' || compare == 'НИ' )
			{
				OpenWindow.document.write("<class=\"small\"> - <SELECT class='smallinput' name='CompValue2'>");
				compValues=parent.invisible.document.forms[compValue].elements[0].name;
				from=0;
				for ( i=0; (next=compValues.indexOf('\x1d',from)) != -1; i++ )
				{
					temp=compValues.substring(from,next);
					marker=temp.indexOf('\x1c',0);
					OpenWindow.document.write("<OPTION \r\n");
					if ( i == selectedCompValue2 )
					{
						OpenWindow.document.write("SELECTED \r\n");
					}
					OpenWindow.document.write("value='"+temp.substring(0,marker)+"'>"+temp.substring(marker+1,temp.length));
					from=next+1;
				}
				OpenWindow.document.write("</SELECT>\r\n");
			} else
			{
				OpenWindow.document.write("<INPUT type='hidden' name='CompValue2'>");
			}
		}
	}
	OpenWindow.document.write("</TABLE>\r\n");
	OpenWindow.document.write(compValueTable);
	if ( compValuesCount && fieldIndex != 0 )
	{
		OpenWindow.document.write("<TABLE BORDER=0 CELLSPACING=2 CELLPADDING=2 WIDTH='100%'>\r\n");
		if ( logic == 0 )
		{
			OpenWindow.document.write("<tr><td ALIGN=CENTER>Логическая связка:<INPUT type=\"radio\" name=\"Logic\" value=\"0\" checked>И<INPUT type=\"radio\" name=\"Logic\" value=\"1\">ИЛИ");
		} else
		{
			OpenWindow.document.write("<tr><td ALIGN=CENTER>Логическая связка:<INPUT type=\"radio\" name=\"Logic\" value=\"0\">И<INPUT type=\"radio\" name=\"Logic\" value=\"1\" checked>ИЛИ");
		}
		OpenWindow.document.write("</TABLE>\r\n");
	} else
	{
		OpenWindow.document.write("<INPUT type=\"hidden\" name=\"Logic\" value=\"0\">");
	}
	OpenWindow.document.write("<TABLE BORDER=0 CELLSPACING=2 CELLPADDING=2 WIDTH='100%'>\r\n");
	OpenWindow.document.write("<TR><td><br>");
	OpenWindow.document.write("<TR><td ALIGN=RIGHT WIDTH='50%'><INPUT type='submit' name='Save' value='Выполнить'>\r\n");
	OpenWindow.document.write("</form>\r\n");
	OpenWindow.document.write("<form method=\"post\" onSubmit=\"ViewCompValues();return false;\">\r\n");
	OpenWindow.document.write("<td ALIGN=LEFT WIDTH='50%'><INPUT type='submit' name='Exit' value='Отмена'>\r\n");
	OpenWindow.document.write("</form>\r\n");
	OpenWindow.document.write("</TABLE>\r\n");
	OpenWindow.document.write("</body></html>\r\n");
	OpenWindow.document.close();
	if ( OpenWindow.document.Save.CompValue.style.display == '' )
	{
		OpenWindow.document.Save.CompValue.focus();
	}
}
//FieldSelect

function Focus(formItem)
{
	error=0;
	curItem=formItem;
}

function CompValueError(formItem)
{
	error=1;
	alert("Недопустимое значение "+formItem.value);
	if ( formItem.style.display == '' )
	{
		formItem.focus();
	}
}

function AllCheck(compare,formItem)
{
	if ( formItem.value.indexOf("*") != -1 || formItem.value.indexOf("?") != -1 )
	{
		if ( compare != 'РВ' && compare != 'НР' )
		{
			CompValueError(formItem);
			return false;
		}
	}
	if ( compare == 'РП' || compare == 'НП' || compare == '' )
	{
		if ( formItem.value != "" )
		{
			CompValueError(formItem);
			return false;
		}
	} else
	{
		if ( formItem.value == "" )
		{
			CompValueError(formItem);
			return false;
		}
	}
	if ( compare == 'КРАТ РВ' || compare == 'КРАТ НР' || compare == 'КРАТ БР' || compare == 'КРАТ МР' )
	{
		if ( isNaN(parseFloat(formItem.value)) )
		{
			CompValueError(formItem);
			return false;
		}
	}
	error=0;
	curItem=0;
	return true;
}

function NumericCheck(compare,formItem,checkEmpty)
{
	if ( formItem.value == "" )
	{
		if ( checkEmpty )
		{
			return AllCheck(compare,formItem);
		}
		return true;
	}
	floatValue=parseFloat(formItem.value);
	if ( isNaN(floatValue) || floatValue.toString(10).length != formItem.value.length )
	{
		CompValueError(formItem);
		return false;
	}
	return AllCheck(compare,formItem);
}

function TextCheck(compare,formItem,checkEmpty)
{
	if ( formItem.value == "" )
	{
		if ( checkEmpty )
		{
			return AllCheck(compare,formItem);
		}
		return true;
	}
	return AllCheck(compare,formItem);
}

function ReqDateCheck(compare,formItem,checkEmpty)
{
	if ( formItem.value == "" )
	{
		if ( checkEmpty )
		{
			return AllCheck(compare,formItem);
		}
		return true;
	}
	var temp=formItem.value;
	var year="00";
	var month="00";
	var day="00";
	var from=0;
	var poinCount=0;
	dmy=new Array();
	for ( i=0; (next=temp.indexOf(".",from)) != -1; )
	{
		dmy[poinCount]=temp.substring(from,next);
		poinCount++;
		from=next+1;
	}
	dmy[poinCount]=temp.substring(from,temp.length);
	if ( poinCount >= 0 )
	{
		year=dmy[poinCount];
		poinCount--;
	} else
	{
		year="00";
	}
	if ( year.length > 4 || isNaN(parseInt(year,10)) )
	{
		CompValueError(formItem);
		return false;
	}
	year=parseInt(year,10);
	if ( year < 100 )
	{
		if ( year >= 0 && year <=30 )
		{
			year+=2000;
		} else
		{
			year+=1900;
		}
	}
	if ( year < 1900 )
	{
		CompValueError(formItem);
		return false;
	}
	if ( poinCount >= 0 )
	{
		month=dmy[poinCount];
		poinCount--;
	} else
	{
		month="00";
	}
	if ( month.length > 2 || isNaN(parseInt(month,10)) )
	{
		CompValueError(formItem);
		return false;
	}
	month=parseInt(month,10);
	if ( month < 0 || month > 12 )
	{
		CompValueError(formItem);
		return false;
	}
	if ( poinCount >= 0 )
	{
		day=dmy[poinCount];
		poinCount--;
	} else
	{
		day="00";
	}
	if ( day.length > 2 || isNaN(parseInt(day,10)) )
	{
		CompValueError(formItem);
		return false;
	}
	day=parseInt(day,10);
	daysInMonth=new Array();
	daysInMonth[0]=31;

	daysInMonth[1]=31;
	daysInMonth[2]=28;
	daysInMonth[3]=31;
	daysInMonth[4]=30;
	daysInMonth[5]=31;
	daysInMonth[6]=30;
	daysInMonth[7]=31;
	daysInMonth[8]=31;
	daysInMonth[9]=30;
	daysInMonth[10]=31;
	daysInMonth[11]=30;
	daysInMonth[12]=31;

  if ( year%4 != 0 && year != 100 )
	{
		daysInMonth[2]=28;
	} else
	{
		daysInMonth[2]=29;
	}
	if ( day < 0 || day > daysInMonth[month] )
	{
		CompValueError(formItem);
		return false;
	}
	year+=10000;
	year=year.toString();
	year=year.substring(1,year.length);
	month+=100;
	month=month.toString();
	month=month.substring(1,month.length);
	day+=100;
	day=day.toString();
	day=day.substring(1,day.length);
	formItem.value=day+"."+month+"."+year;
	return AllCheck(compare,formItem);
}

function ReqTimeCheck(compare,formItem,checkEmpty)
{
	if ( formItem.value == "" )
	{
		if ( checkEmpty )
		{
			return AllCheck(compare,formItem);
		}
		return true;
	}
	var temp=formItem.value;
	var hour;
	var minute;
	var marker;
	if ( (marker=temp.indexOf(":")) == -1 )
	{
		CompValueError(formItem);
		return false;
	}
	hour=temp.substring(0,marker);
	if ( hour.length > 2 || isNaN(parseInt(hour,10)) )
	{
		CompValueError(formItem);
		return false;
	}
	hour=parseInt(hour,10);
	minute=temp.substring(marker+1,temp.length);
	if ( minute.length > 2 || isNaN(parseInt(minute,10)) )
	{
		CompValueError(formItem);
		return false;
	}
	minute=parseInt(minute,10);
	if ( hour<0 || hour>23 || minute<0 || minute>59 )
	{
		CompValueError(formItem);
		return false;
	}
	hour+=100;
	hour=hour.toString();
	hour=hour.substring(1,hour.length);
	minute+=100;
	minute=minute.toString();
	minute=minute.substring(1,minute.length);
	formItem.value=hour+":"+minute;
	return AllCheck(compare,formItem);
}

function NewEditWinName(curWin)
{
	newEditWinName="InputEditWin";
	newEditWinNumber=0;
	if ( curWin.name.length > newEditWinName.length )
	{
		if ( curWin.name.substring(0,newEditWinName.length) == newEditWinName )
		{
			newEditWinNumber=parseInt(curWin.name.substring(newEditWinName.length,curWin.name.length),10)+1;
		}
	}
	newEditWinName+=newEditWinNumber;
	return newEditWinName;
}

function EditMulti(editField,fieldEditValue,javaFunctionCheck,FieldLength,FieldMaxLength,editText)
{
	ChildWin=window.open("",NewEditWinName(self),"width=700,height=400,resizable=yes,status=yes,scrollbars=yes");
	document.Info.ChildWinName.value=ChildWin.name;
	editFieldValue=new Array();
	valueCount=editField.options.length;
	for ( i=0; i < valueCount; i++ )
	{
		editFieldValue[i]=Convert('\x1b',"\\\"",editField.options[i].value);
	}
	WriteWin(self,ChildWin,editField,fieldEditValue,valueCount,editFieldValue,javaFunctionCheck,FieldLength,FieldMaxLength,editText);
}

function DeleteMulti(editField,fieldEditValue,valueNumber,javaFunctionCheck,FieldLength,FieldMaxLength)
{
	editFieldValue=new Array();
	valueCount=document.InputEdit.length-1;
	newI=0;
	for ( i=0; i < valueCount; i++ )
	{
		if ( i != valueNumber )
		{
			editFieldValue[newI++]=Convert("\"","\\\"",document.InputEdit.elements[i].value);
		}
	}
	valueCount--;
	WriteWin(opener,self,editField,fieldEditValue,valueCount,editFieldValue,javaFunctionCheck,FieldLength,FieldMaxLength,0);
}

function AddMulti(editField,fieldEditValue,FieldEdit,javaFunctionCheck,FieldLength,FieldMaxLength)
{
	editFieldValue=new Array();
	valueCount=document.InputEdit.length;
	for ( i=0; i < valueCount; i++ )
	{
		editFieldValue[i]=Convert("\"","\\\"",document.InputEdit.elements[i].value);
	}
	WriteWin(opener,self,editField,fieldEditValue,valueCount,editFieldValue,javaFunctionCheck,FieldLength,FieldMaxLength,0);
}

function WriteWin(parentWin,writeWin,editField,fieldEditValue,valueCount,editFieldValue,javaFunctionCheck,FieldLength,FieldMaxLength,editText)
{
	formCount=writeWin.document.forms.length;
	if ( formCount == 0 )
	{
		ChildValue=0;
		ChildWinNameValue='';
	} else
	{
		ChildValue=document.Info.Child.value;
		ChildWinNameValue=document.Info.ChildWinName.value;
	}
	writeWin.document.open();
	htmlBegin=parentWin.document.InputEdit.EditMultiWin.value;
	htmlBegin=Convert('\x1b',"\"",htmlBegin);
	from=0;
	next=htmlBegin.indexOf(' onUnload=\"',from);
	from=next+11;
	htmlBegin=htmlBegin.substring(0,from)+"if(parseInt(document.Info.Child.value,10)){document.Info.Child.value=0;ChildWin=window.open('',document.Info.ChildWinName.value,'resizable=yes,status=yes,scrollbars=yes');ChildWin.close();}"+htmlBegin.substring(from,htmlBegin.length-1);
	writeWin.document.write(htmlBegin);
	writeWin.document.write("<head><title>Значения множественного поля</title></head>\r\n");
	writeWin.document.write("<FORM name=\"Info\">\r\n");
	writeWin.document.write("<INPUT type=\"hidden\" name=\"Child\" value=\""+ChildValue+"\">\r\n");
	writeWin.document.write("<INPUT type=\"hidden\" name=\"ChildWinName\" value=\""+ChildWinNameValue+"\">\r\n");
	writeWin.document.write("<INPUT type=\"hidden\" name=\"EditMultiWin\" value=\"\">\r\n");
	writeWin.document.write("</FORM>\r\n");
	writeWin.document.write("<FORM name=\"InputEdit\">\r\n");
	writeWin.document.write("<TABLE BORDER=4 CELLSPACING=2 CELLPADDING=2 WIDTH=\"100%\">\r\n");
	writeWin.document.write("<TR><TH class=\"small\">N<TH class=\"small\">Значения поля\r\n");
	fieldID=editField.name.substring(5,editField.name.length);
	for ( i=0; i < valueCount; i++ )
	{
		writeWin.document.write("<tr><td class=\"small\">"+(i+1)+"<td class=\"small\"><INPUT class=\"smallinput\" name=\"FieldEdit"+i+"\" value=\"\" size=\""+FieldLength+"\" maxlength=\""+FieldMaxLength+"\"");
		writeWin.document.write(" onFocus=\"if(parseInt(document.Info.Child.value,10))ChildWin.focus();\"");
		if ( javaFunctionCheck == "" )
		{
			writeWin.document.write(">\r\n");
		} else
		{
			writeWin.document.write(" onBlur=\"if(cancel)return true;"+javaFunctionCheck+"('РВ',this,true);\">\r\n");
		}
		if ( editText == 1 )
		{
			writeWin.document.write("&nbsp;&nbsp;<a href=\"javascript:document.Info.Child.value='1';EditText('InputEdit.FieldEdit"+i+"','',document.Info.EditMultiWin);\" onFocus=\"if(parseInt(document.Info.Child.value,10))ChildWin.focus();\" onMouseOver=\"window.status='Редактировать текстовое значение в отдельном окне';return true;\" onMouseOut=\"window.status='';return true;\"><IMG src=\""+reqProtocol+"//"+parentWin.document.Info.HttpHost.value+"/TextEdit.gif\" BORDER=\"0\" ALT=\"Редактировать в отдельном окне\"></a>\r\n");
		}
		writeWin.document.write("&nbsp;&nbsp;<a href=\"javascript:DeleteMulti(opener.document.InputEdit."+editField.name+",opener.document.InputEdit."+fieldEditValue.name+","+i+",'"+javaFunctionCheck+"',"+FieldLength+","+FieldMaxLength+");\" onFocus=\"if(parseInt(document.Info.Child.value,10))ChildWin.focus();\" onMouseOver=\"window.status='Удалить значение';return true;\" onMouseOut=\"window.status='';return true;\"><IMG src=\""+reqProtocol+"//"+parentWin.document.Info.HttpHost.value+"/Delete.gif\" BORDER=\"0\" ALT=\"Удалить\"></a>\r\n");
	}
	writeWin.document.write("<tr><td class=\"small\">Новое<td class=\"small\"><INPUT class=\"smallinput\" name=\"FieldEdit"+i+"\" value=\"\" size=\""+FieldLength+"\" maxlength=\""+FieldMaxLength+"\"");
	writeWin.document.write(" onFocus=\"if(parseInt(document.Info.Child.value,10))ChildWin.focus();\"");
	if ( javaFunctionCheck == "" )
	{
		writeWin.document.write(">\r\n");
	} else
	{
		writeWin.document.write(" onBlur=\"if(!add)return true;"+javaFunctionCheck+"('РВ',this,true);\">\r\n");
	}
	if ( editText == 1 )
	{
		writeWin.document.write("&nbsp;&nbsp;<a href=\"javascript:document.Info.Child.value='1';EditText('InputEdit.FieldEdit"+i+"','',document.Info.EditMultiWin);\" onFocus=\"if(parseInt(document.Info.Child.value,10))ChildWin.focus();\" onMouseOver=\"window.status='Редактировать текстовое значение в отдельном окне';return true;\" onMouseOut=\"window.status='';return true;\"><IMG src=\""+reqProtocol+"//"+parentWin.document.Info.HttpHost.value+"/TextEdit.gif\" BORDER=\"0\" ALT=\"Редактировать в отдельном окне\"></a>\r\n");
	}
	writeWin.document.write("&nbsp;&nbsp;<a href=\"javascript:AddMulti(opener.document.InputEdit."+editField.name+",opener.document.InputEdit."+fieldEditValue.name+",document.InputEdit.FieldEdit"+i+",'"+javaFunctionCheck+"',"+FieldLength+","+FieldMaxLength+");\" onFocus=\"if(parseInt(document.Info.Child.value,10))ChildWin.focus();\" onMouseOver=\"document.InputEdit.FieldEdit"+i+".focus();add=1;window.status='Добавить значение';return true;\" onMouseOut=\"add=0;window.status='';return true;\"><IMG src=\""+reqProtocol+"//"+parentWin.document.Info.HttpHost.value+"/Add.gif\" BORDER=\"0\" ALT=\"Добавить\"></a>\r\n");
	writeWin.document.write("</table><br>\r\n");
	writeWin.document.write("<tr><td ALIGN=center><table WIDTH=\"100%\">\r\n");
	writeWin.document.write("<tr><td ALIGN=right><a href=\"javascript:SaveMulti(opener.document.InputEdit."+editField.name+",opener.document.InputEdit."+fieldEditValue.name+",opener.document.InputEdit.FieldChange"+fieldID+","+FieldLength+");self.close();\" onFocus=\"if(parseInt(document.Info.Child.value,10))ChildWin.focus();\" onMouseOver=\"window.status='Сохранить значения поля';return true;\" onMouseOut=\"window.status='';return true;\">Сохранить</a>&nbsp;&nbsp;\r\n");
	writeWin.document.write("<td ALIGN=left><a href=\"javascript:self.close();\" onFocus=\"if(parseInt(document.Info.Child.value,10))ChildWin.focus();\" onMouseOver=\"cancel=1;window.status='Отмена';return true;\" onMouseOut=\"cancel=0;window.status='';return true;\">Отмена</a>\r\n");
	writeWin.document.write("</table></FORM>\r\n");
	writeWin.document.write("</body>\r\n");
	writeWin.document.write("<SCRIPT LANGUAGE=\"javascript\">\r\n");
	writeWin.document.write("document.Info.EditMultiWin.value=opener.document.InputEdit.EditMultiWin.value;\r\n");
	for ( i=0; i < valueCount; i++ )
	{
		writeWin.document.write("document.InputEdit.FieldEdit"+i+".value=\""+editFieldValue[i]+"\";\r\n");
	}
	writeWin.document.write("add=0;\r\n");
	writeWin.document.write("cancel=0;\r\n");
	writeWin.document.write("opener.document.Info.Child.value=1;\r\n");
	writeWin.document.write('\x3c'+"/SCRIPT>\r\n");
	writeWin.document.write("</html>\r\n");
	writeWin.document.close();
}

function SaveMulti(editField,fieldEditValue,fieldChange,FieldLength)
{
	valueCount=document.InputEdit.length;
	if ( document.InputEdit.elements[valueCount-1].value == "" )
	{
		valueCount--;
	}
	editField.options.length=valueCount;
	fieldEditValue.value="";
	for ( i=0; i < valueCount; i++ )
	{
		editFieldValue=document.InputEdit.elements[i].value;
		editField.options[i].value=editFieldValue;
		if ( editFieldValue.length > parseInt(FieldLength,10) )
		{
			editField.options[i].text=editFieldValue.substring(0,FieldLength);
		} else
		{
			editField.options[i].text=editFieldValue;
		}
		editField.options[i].value=Convert("\"",'\x1b',editField.options[i].text);
		fieldEditValue.value+=document.InputEdit.elements[i].value+'\x1b';
	}
	fieldChange.value=1;
}

function EditMultiFile(editField,fieldEditValue,javaFunctionCheck,FieldLength,FieldMaxLength)
{
	ChildWin=window.open("",NewEditWinName(self),"width=700,height=400,resizable=yes,status=yes,scrollbars=yes");
	document.Info.ChildWinName.value=ChildWin.name;
	editFieldValue=new Array();
	valueCount=editField.options.length;
	for ( i=0; i < valueCount; i++ )
	{
		editFieldValue[i]=Convert('\x1b',"\\\"",editField.options[i].value);
	}
	WriteWinFile(self,ChildWin,editField,fieldEditValue,valueCount,editFieldValue,javaFunctionCheck,FieldLength,FieldMaxLength);
}

function ChangeMultiFile(editField,fieldEditValue,valueNumber,javaFunctionCheck,FieldLength,FieldMaxLength,newValue)
{
	editFieldValue=new Array();
	valueCount=document.InputEdit.length;
	for ( i=0; i < valueCount; i++ )
	{
		if ( i == valueNumber )
		{
			editFieldValue[i]=Convert("\"","\\\"",newValue);
		} else
		{
			editFieldValue[i]=Convert("\"","\\\"",document.InputEdit.elements[i].value);
		}
	}
	WriteWinFile(opener,self,editField,fieldEditValue,valueCount,editFieldValue,javaFunctionCheck,FieldLength,FieldMaxLength);
}

function DeleteMultiFile(editField,fieldEditValue,valueNumber,javaFunctionCheck,FieldLength,FieldMaxLength)
{
	editFieldValue=new Array();
	valueCount=document.InputEdit.length;
	newI=0;
	for ( i=0; i < valueCount; i++ )
	{
		if ( i != valueNumber )
		{
			editFieldValue[newI++]=Convert("\"","\\\"",document.InputEdit.elements[i].value);
		}
	}
	valueCount--;
	WriteWinFile(opener,self,editField,fieldEditValue,valueCount,editFieldValue,javaFunctionCheck,FieldLength,FieldMaxLength);
}

function AddMultiFile(editField,fieldEditValue,javaFunctionCheck,FieldLength,FieldMaxLength,newValue)
{
	editFieldValue=new Array();
	valueCount=document.InputEdit.length;
	for ( i=0; i < valueCount; i++ )
	{
		editFieldValue[i]=Convert("\"","\\\"",document.InputEdit.elements[i].value);
	}
	editFieldValue[valueCount++]=Convert("\"","\\\"",newValue);
	WriteWinFile(opener,self,editField,fieldEditValue,valueCount,editFieldValue,javaFunctionCheck,FieldLength,FieldMaxLength);
}

function EmptyFile()
{
	alert("Файл отсутствует");
}

function SendFile(parentWin,editField,fieldID,valueIndex)
{
	ChildWin=window.open("",NewEditWinName(self),"width=700,height=400,resizable=yes,status=yes,scrollbars=yes");
	document.Info.ChildWinName.value=ChildWin.name;
	ChildWin.document.open();
	ChildWin.document.write("<html>\r\n");
	ChildWin.document.write("<body onLoad=\"document.charset='windows-1251';\" onUnload=\"opener.document.Info.Child.value=0;\" text=\"#000000\" bgcolor=\"#C0C0C0\" link=\"#800000\">\r\n");
	ChildWin.document.write("<META http-equiv=\"Content-Type\" content=\"text/html; charset=windows-1251\">\r\n");
	ChildWin.document.write("<style>.small{font-family:arial;font-size:10pt}.smallinput{font-family:arial;font-size:9pt}</style>\r\n");
	ChildWin.document.write("<head><title>Выбор файла</title></head>\r\n");
	ChildWin.document.write("<FORM action=\""+parentWin.document.InputEdit.action+"\" enctype=\"multipart/form-data\" method=\"post\">\r\n");
	ChildWin.document.write("<INPUT type=\"hidden\" name=\"WorkingDirectory\" value=\""+parentWin.document.InputEdit.WorkingDirectory.value+"\">\r\n");
	ChildWin.document.write("<INPUT type=\"hidden\" name=\"FieldNumber\" value=\""+fieldID+"\">\r\n");
	ChildWin.document.write("<INPUT type=\"hidden\" name=\"ValueIndex\" value=\""+valueIndex+"\">\r\n");
	ChildWin.document.write("Задайте файл <INPUT type=\"file\" name=\"NewFile\">\r\n");
	ChildWin.document.write("<TABLE BORDER=0 CELLSPACING=0 WIDTH=\"100%\">\r\n");
	ChildWin.document.write("<tr><td><hr><td><hr></tr>\r\n");
	ChildWin.document.write("<tr><td ALIGN=center><INPUT type=\"submit\" name=\"SendFile\" value=\"Сохранить файл\">\r\n");
	ChildWin.document.write("&nbsp;&nbsp;<td ALIGN=left><INPUT type=\"button\" name=\"FileCancel\" value=\"Отмена\" onClick=\"self.close();\">\r\n");
	ChildWin.document.write("</table></FORM>\r\n");
	ChildWin.document.write("</body></html>\r\n");
	ChildWin.document.close();
}

function DeleteFile(parentWin,editField,fieldID,valueIndex)
{
	ChildWin=window.open("",NewEditWinName(self),"width=175,height=100,resizable=yes,status=yes,scrollbars=yes");
	document.Info.ChildWinName.value=ChildWin.name;
	ChildWin.document.open();
	ChildWin.document.write("<html>\r\n");
	ChildWin.document.write("<body onLoad=\"document.charset='windows-1251';\" onUnload=\"opener.document.Info.Child.value=0;\" text=\"#000000\" bgcolor=\"#C0C0C0\" link=\"#800000\">\r\n");
	ChildWin.document.write("<META http-equiv=\"Content-Type\" content=\"text/html; charset=windows-1251\">\r\n");
	ChildWin.document.write("<head><title>Удаление файла</title></head>\r\n");
	ChildWin.document.write("<META HTTP-EQUIV=\"Refresh\" Content=\"0; URL="+parentWin.document.InputEdit.action+"?WorkingDirectory="+parentWin.document.InputEdit.WorkingDirectory.value+"&FieldNumber="+fieldID+"&ValueIndex="+valueIndex+"&DeleteFile=Delete\">\r\n");
	ChildWin.document.write("</body></html>\r\n");
	ChildWin.document.close();
}

function WriteWinFile(parentWin,writeWin,editField,fieldEditValue,valueCount,editFieldValue,javaFunctionCheck,FieldLength,FieldMaxLength)
{
	formCount=writeWin.document.forms.length;
	if ( formCount == 0 )
	{
		ChildValue=0;
		ChildWinNameValue='';
	} else
	{
		ChildValue=document.Info.Child.value;
		ChildWinNameValue=document.Info.ChildWinName.value;
	}
	writeWin.document.open();
	htmlBegin=parentWin.document.InputEdit.EditMultiWin.value;
	htmlBegin=Convert('\x1b',"\"",htmlBegin);
	writeWin.document.write(htmlBegin);
	writeWin.document.write("<head><title>Значения множественного поля</title></head>\r\n");
	writeWin.document.write("<FORM name=\"Info\">\r\n");
	writeWin.document.write("<INPUT type=\"hidden\" name=\"Child\" value=\""+ChildValue+"\">\r\n");
	writeWin.document.write("<INPUT type=\"hidden\" name=\"ChildWinName\" value=\""+ChildWinNameValue+"\">\r\n");
	writeWin.document.write("</FORM>\r\n");
	writeWin.document.write("<FORM name=\"InputEdit\">\r\n");
	writeWin.document.write("<TABLE BORDER=4 CELLSPACING=2 CELLPADDING=2 WIDTH=\"100%\">\r\n");
	writeWin.document.write("<TR><TH class=\"small\">N<TH class=\"small\">Значения поля\r\n");
	fieldID=editField.name.substring(5,editField.name.length);
	for ( i=0; i < valueCount; i++ )
	{
		writeWin.document.write("<tr><td class=\"small\">"+(i+1)+"<td class=\"small\"><INPUT class=\"smallinput\" name=\"FieldEdit"+i+"\" value=\"\" size=\""+FieldLength+"\" maxlength=\""+FieldMaxLength+"\"");
		writeWin.document.write(" onFocus=\"if(parseInt(document.Info.Child.value,10))ChildWin.focus();\"");
		if ( javaFunctionCheck == "" )
		{
			writeWin.document.write(">\r\n");
		} else
		{
			writeWin.document.write(" onBlur=\"if(cancel)return true;"+javaFunctionCheck+"('РВ',this,true);\">\r\n");
		}
		writeWin.document.write("&nbsp;&nbsp;<a href=\"javascript:document.Info.Child.value='1';SendFile(opener,opener.document.InputEdit."+editField.name+","+fieldID+","+i+");\" onClick=\"if(parseInt(document.Info.Child.value,10)){ChildWin.focus();return false;}\" onMouseOver=\"if(parseInt(document.Info.Child.value,10))ChildWin.focus();window.status='Изменить значение';return true;\" onMouseOut=\"window.status='';return true;\"><IMG src=\""+reqProtocol+"//"+parentWin.document.Info.HttpHost.value+"/Select.gif\" BORDER=\"0\" ALT=\"Изменить\"></a>\r\n");
		writeWin.document.write("&nbsp;&nbsp;<a href=\"javascript:document.Info.Child.value='1';DeleteFile(opener,opener.document.InputEdit."+editField.name+","+fieldID+","+i+");\" onClick=\"if(parseInt(document.Info.Child.value,10)){ChildWin.focus();return false;}\" onMouseOver=\"if(parseInt(document.Info.Child.value,10))ChildWin.focus();window.status='Удалить значение';return true;\" onMouseOut=\"window.status='';return true;\"><IMG src=\""+reqProtocol+"//"+parentWin.document.Info.HttpHost.value+"/Delete.gif\" BORDER=\"0\" ALT=\"Удалить\"></a>\r\n");
	}
	writeWin.document.write("<tr><td class=\"small\">Новое<td class=\"small\">");
	writeWin.document.write("&nbsp;&nbsp;<a href=\"javascript:document.Info.Child.value='1';SendFile(opener,opener.document.InputEdit."+editField.name+","+fieldID+",-1);\" onClick=\"if(parseInt(document.Info.Child.value,10)){ChildWin.focus();return false;}\" onMouseOver=\"if(parseInt(document.Info.Child.value,10))ChildWin.focus();add=1;window.status='Добавить значение';return true;\" onMouseOut=\"add=0;window.status='';return true;\"><IMG src=\""+reqProtocol+"//"+parentWin.document.Info.HttpHost.value+"/Add.gif\" BORDER=\"0\" ALT=\"Добавить\"></a>\r\n");
	writeWin.document.write("</table><br>\r\n");
	writeWin.document.write("<tr><td ALIGN=center><table WIDTH=\"100%\">\r\n");
	writeWin.document.write("<tr><td ALIGN=right><a href=\"javascript:SaveFiles(opener.document.InputEdit."+editField.name+");\" onClick=\"if(parseInt(document.Info.Child.value,10)){ChildWin.focus();return false;}\" onMouseOver=\"if(parseInt(document.Info.Child.value,10))ChildWin.focus();window.status='Сохранить значения поля';return true;\" onMouseOut=\"window.status='';return true;\">Сохранить</a>&nbsp;&nbsp;\r\n");
	writeWin.document.write("<td ALIGN=left><a href=\"javascript:CancelFiles(opener.document.InputEdit."+editField.name+");\" onClick=\"if(parseInt(document.Info.Child.value,10)){ChildWin.focus();return false;}\" onMouseOver=\"if(parseInt(document.Info.Child.value,10))ChildWin.focus();cancel=1;window.status='Отмена';return true;\" onMouseOut=\"cancel=0;window.status='';return true;\">Отмена</a>\r\n");
	writeWin.document.write("</table></FORM>\r\n");
	writeWin.document.write("</body>\r\n");
	writeWin.document.write("<SCRIPT LANGUAGE=\"javascript\">\r\n");
	for ( i=0; i < valueCount; i++ )
	{
		writeWin.document.write("document.InputEdit.FieldEdit"+i+".value=\""+editFieldValue[i]+"\";\r\n");
	}
	writeWin.document.write("add=0;\r\n");
	writeWin.document.write("cancel=0;\r\n");
	writeWin.document.write("opener.document.Info.Child.value=1;\r\n");
	if ( formCount != 0 )
	{
		writeWin.document.write("ChildWin=window.open(\"\",document.Info.ChildWinName.value,\"width=700,height=400,resizable=yes,status=yes,scrollbars=yes\");\r\n");
	}
	writeWin.document.write('\x3c'+"/SCRIPT>\r\n");
	writeWin.document.write("</html>\r\n");
	writeWin.document.close();
}

function SaveFiles(editField)
{
	ChildWin=window.open("",NewEditWinName(self),"width=175,height=100,resizable=yes,status=yes,scrollbars=yes");
	document.Info.ChildWinName.value=ChildWin.name;
	ChildWin.document.open();
	ChildWin.document.write("<html>\r\n");
	ChildWin.document.write("<body onLoad=\"document.charset='windows-1251';\" onUnload=\"opener.document.Info.Child.value=0;\" text=\"#000000\" bgcolor=\"#C0C0C0\" link=\"#800000\">\r\n");
	ChildWin.document.write("<META http-equiv=\"Content-Type\" content=\"text/html; charset=windows-1251\">\r\n");
	ChildWin.document.write("<head><title>Сохранение</title></head>\r\n");
	fieldID=editField.name.substring(5,editField.name.length);
	ChildWin.document.write("<META HTTP-EQUIV=\"Refresh\" Content=\"0; URL="+opener.document.InputEdit.action+"?WorkingDirectory="+opener.document.InputEdit.WorkingDirectory.value+"&FieldNumber="+fieldID+"&SaveFiles=Save\">\r\n");
	ChildWin.document.write("</body></html>\r\n");
	ChildWin.document.close();
}

function CancelFiles(editField)
{
	ChildWin=window.open("",NewEditWinName(self),"width=175,height=100,resizable=yes,status=yes,scrollbars=yes");
	document.Info.ChildWinName.value=ChildWin.name;
	ChildWin.document.open();
	ChildWin.document.write("<html>\r\n");
	ChildWin.document.write("<body onLoad=\"document.charset='windows-1251';\" onUnload=\"opener.document.Info.Child.value=0;\" text=\"#000000\" bgcolor=\"#C0C0C0\" link=\"#800000\">\r\n");
	ChildWin.document.write("<META http-equiv=\"Content-Type\" content=\"text/html; charset=windows-1251\">\r\n");
	ChildWin.document.write("<head><title>Отмена</title></head>\r\n");
	fieldID=editField.name.substring(5,editField.name.length);
	ChildWin.document.write("<META HTTP-EQUIV=\"Refresh\" Content=\"0; URL="+opener.document.InputEdit.action+"?WorkingDirectory="+opener.document.InputEdit.WorkingDirectory.value+"&FieldNumber="+fieldID+"&CancelFiles=Cancel\">\r\n");
	ChildWin.document.write("</body></html>\r\n");
	ChildWin.document.close();
}

function SaveMultiFile(editField,fieldEditValue,fieldChange,FieldLength)
{
	valueCount=document.InputEdit.length;
	editField.options.length=valueCount;
	fieldEditValue.value="";
	for ( i=0; i < valueCount; i++ )
	{
		editFieldValue=document.InputEdit.elements[i].value;
		editField.options[i].value=editFieldValue;
		if ( editFieldValue.length )
		{
			if ( editFieldValue.length > parseInt(FieldLength,10) )
			{
				editField.options[i].text=editFieldValue.substring(0,FieldLength);
			} else
			{
				editField.options[i].text=editFieldValue;
			}
			editField.options[i].value=Convert("\"",'\x1b',editField.options[i].text);
		} else
		{
			editField.options[i].text="";
			editField.options[i].value="";
		}
		fieldEditValue.value+=document.InputEdit.elements[i].value+'\x1b';
	}
	fieldChange.value=1;
	self.close();
}

function EditMultiVoc(editField,fieldEditValue,vocField,javaFunctionCheck)
{
	ChildWin=window.open("",NewEditWinName(self),"width=700,height=400,resizable=yes,status=yes,scrollbars=yes");
	document.Info.ChildWinName.value=ChildWin.name;
	editFieldValue=new Array();
	valueCount=editField.options.length;
	for ( i=0; i < valueCount; i++ )
	{
		editFieldValue[i]=Convert("\"","\\\"",editField.options[i].value);
	}
	WriteWinVoc(self,ChildWin,editField,fieldEditValue,vocField,valueCount,editFieldValue,javaFunctionCheck);
}

function DeleteMultiVoc(editField,fieldEditValue,vocField,valueNumber,javaFunctionCheck)
{
	editFieldValue=new Array();
	valueCount=document.forms[0].length-1;
	newI=0;
	for ( i=0; i < valueCount; i++ )
	{
		if ( i != valueNumber )
		{
			editFieldValue[newI++]=Convert("\"","\\\"",document.forms[0].elements[i].value);
		}
	}
	valueCount--;
	WriteWinVoc(opener,self,editField,fieldEditValue,vocField,valueCount,editFieldValue,javaFunctionCheck);
}

function AddMultiVoc(editField,fieldEditValue,vocField,FieldEdit,javaFunctionCheck)
{
	editFieldValue=new Array();
	valueCount=document.forms[0].length;
	for ( i=0; i < valueCount; i++ )
	{
		editFieldValue[i]=Convert("\"","\\\"",document.forms[0].elements[i].value);
	}
	WriteWinVoc(opener,self,editField,fieldEditValue,vocField,valueCount,editFieldValue,javaFunctionCheck);
}

function WriteWinVoc(parentWin,writeWin,editField,fieldEditValue,vocField,valueCount,editFieldValue,javaFunctionCheck)
{
	writeWin.document.open();
	htmlBegin=parentWin.document.InputEdit.EditMultiWin.value;
	htmlBegin=Convert('\x1b',"\"",htmlBegin);
	writeWin.document.write(htmlBegin);
	writeWin.document.write("<head><title>Значения множественного поля</title></head>\r\n");
	writeWin.document.write("<FORM>\r\n");
	writeWin.document.write("<TABLE BORDER=4 CELLSPACING=2 CELLPADDING=2 WIDTH=\"100%\">\r\n");
	writeWin.document.write("<TR><TH class=\"small\">N<TH class=\"small\">Значения поля\r\n");
	for ( i=0; i < valueCount; i++ )
	{
		writeWin.document.write("<tr><td class=\"small\">"+(i+1)+"<td class=\"small\"><SELECT class=\"smallinput\" name=\"FieldEdit"+i+"\"");
		writeWin.document.write(" onFocus=\"findStrInVoc='';\" onkeydown=\"if(event.keyCode==8)if(findStrInVoc!=''){findStrInVoc=findStrInVoc.substring(0,findStrInVoc.length-1);SelectInVoc(this,'');}\" onkeypress=\"SelectInVoc(this,String.fromCharCode(event.keyCode));\">\r\n");
		from=0;
		next=vocField.value.indexOf('\x1e',from);
		selectCount=vocField.value.substring(from,next);
		from=next+1;
		for ( iSelect=0; iSelect < selectCount; iSelect++ )
		{
			next=vocField.value.indexOf('\x1e',from);
			value=Convert('\x1b',"\"",vocField.value.substring(from,next));
			vmPos=value.indexOf('\x1d',0);
			codeValue=value.substring(0,vmPos);
			terminValue=value.substring(vmPos+1,value.length);
			writeWin.document.write("<OPTION ");
			if ( editFieldValue[i] == codeValue )
			{
				writeWin.document.write("SELECTED ");
			}
			writeWin.document.write("value=\""+codeValue+"\">"+terminValue+"\r\n");
			from=next+1;
		}
		writeWin.document.write("</SELECT>\r\n");
		writeWin.document.write("&nbsp;&nbsp;<a href=\"javascript:DeleteMultiVoc(opener.document.InputEdit."+editField.name+",opener.document.InputEdit."+fieldEditValue.name+",opener.document.InputEdit."+vocField.name+","+i+",'"+javaFunctionCheck+"');\" onMouseOver=\"window.status='Удалить значение';return true;\" onMouseOut=\"window.status='';return true;\"><IMG src=\""+reqProtocol+"//"+parentWin.document.Info.HttpHost.value+"/Delete.gif\" BORDER=\"0\" ALT=\"Удалить\"></a>\r\n");
	}
	writeWin.document.write("<tr><td class=\"small\">Новое<td class=\"small\"><SELECT class=\"smallinput\" name=\"FieldEdit"+i+"\"");
	writeWin.document.write(" onFocus=\"Focus(this);\">\r\n");
	from=0;
	next=vocField.value.indexOf('\x1e',from);
	selectCount=vocField.value.substring(from,next);
	from=next+1;
	writeWin.document.write("<OPTION value=\"\">\r\n");
	for ( iSelect=0; iSelect < selectCount; iSelect++ )
	{
		next=vocField.value.indexOf('\x1e',from);
		value=Convert('\x1b',"\"",vocField.value.substring(from,next));
		vmPos=value.indexOf('\x1d',0);
		codeValue=value.substring(0,vmPos);
		terminValue=value.substring(vmPos+1,value.length);
		writeWin.document.write("<OPTION value=\""+codeValue+"\">"+terminValue+"\r\n");
		from=next+1;
	}
	writeWin.document.write("</SELECT>\r\n");
	writeWin.document.write("&nbsp;&nbsp;<a href=\"javascript:AddMultiVoc(opener.document.InputEdit."+editField.name+",opener.document.InputEdit."+fieldEditValue.name+",opener.document.InputEdit."+vocField.name+",document.forms[0].FieldEdit"+i+",'"+javaFunctionCheck+"');\" onMouseOver=\"document.forms[0].FieldEdit"+i+".focus();window.status='Добавить значение';return true;\" onMouseOut=\"window.status='';return true;\" onClick=\"if(document.forms[0].FieldEdit"+i+".value=='')return AllCheck('РВ',document.forms[0].FieldEdit"+i+");\"><IMG src=\""+reqProtocol+"//"+parentWin.document.Info.HttpHost.value+"/Add.gif\" BORDER=\"0\" ALT=\"Добавить\"></a>\r\n");
	writeWin.document.write("</table><br>\r\n");
	writeWin.document.write("<tr><td ALIGN=center><table WIDTH=\"100%\">\r\n");
	fieldID=editField.name.substring(5,editField.name.length);
	writeWin.document.write("<tr><td ALIGN=right><a href=\"javascript:SaveMultiVoc(opener.document.InputEdit."+editField.name+",opener.document.InputEdit."+fieldEditValue.name+",opener.document.InputEdit.FieldChange"+fieldID+");self.close();\" onMouseOver=\"window.status='Сохранить значения поля';return true;\" onMouseOut=\"window.status='';return true;\">Сохранить</a>&nbsp;&nbsp;\r\n");
	writeWin.document.write("<td ALIGN=left><a href=\"javascript:self.close();\" onMouseOver=\"window.status='Отмена';return true;\" onMouseOut=\"window.status='';return true;\">Отмена</a>\r\n");
	writeWin.document.write("</table></FORM>\r\n");
	writeWin.document.write("</body>\r\n");
	writeWin.document.write("<SCRIPT LANGUAGE=\"javascript\">\r\n");
	for ( i=0; i < valueCount; i++ )
	{
		writeWin.document.write("document.forms[0].FieldEdit"+i+".value=\""+editFieldValue[i]+"\";\r\n");
	}
	writeWin.document.write("opener.document.Info.Child.value=1;\r\n");
	writeWin.document.write('\x3c'+"/SCRIPT>\r\n");
	writeWin.document.write("</html>\r\n");
	writeWin.document.close();
}

function SaveMultiVoc(editField,fieldEditValue,fieldChange)
{
	valueCount=document.forms[0].length;
	if ( document.forms[0].elements[valueCount-1].options[document.forms[0].elements[valueCount-1].selectedIndex].value == "" )
	{
		valueCount--;
	}
	editField.options.length=valueCount;
	fieldEditValue.value="";
	for ( i=0; i < valueCount; i++ )
	{
		editField.options[i].value=document.forms[0].elements[i].options[document.forms[0].elements[i].selectedIndex].value;
		editField.options[i].text=document.forms[0].elements[i].options[document.forms[0].elements[i].selectedIndex].text;
		fieldEditValue.value+=document.forms[0].elements[i].options[document.forms[0].elements[i].selectedIndex].value+'\x1b';
	}
	fieldChange.value=1;
}

function CheckInputNecessary()
{
	for ( i=0; i < document.InputEdit.length; i++ )
	{
		if ( document.InputEdit.elements[i].name.substring(0,14) == 'FieldNecessary' )
		{
			if ( parseInt(document.InputEdit.elements[i].value,10) == 1 )
			{
				fieldID='FieldEdit'+document.InputEdit.elements[i].name.substring(14,document.InputEdit.elements[i].name.length);
				for ( j=0; j < document.InputEdit.length; j++ )
				{
					if ( document.InputEdit.elements[j].name == fieldID )
					{
						if ( document.InputEdit.elements[j].value == '' )
						{
							alert('Не заполнено обязательное для ввода поле');
							document.InputEdit.elements[j].focus();
							return false;
						}
					}
				}
			}
		}
	}
	return true;
}

function RecordSave()
{
	if ( !CheckInputNecessary() )
	{
		return false;
	}
	for ( i=0; i < document.InputEdit.length; i++ )
	{
		if ( document.InputEdit.elements[i].name.substring(0,11) == 'FieldChange' )
		{
			if ( parseInt(document.InputEdit.elements[i].value,10) == 1 )
			{
				break;
			}
		}
	}
	if ( i == document.InputEdit.length )
	{
		alert('Ничего не введено');
		return false;
	}
	return ClearRecordForm();
}

function ClearRecordForm()
{
	document.InputEdit.EditMultiWin.value='';
	document.InputEdit.EditMultiLinkWin.value='';
	document.InputEdit.EditMultiLinks.value='';
	for ( i=0; i < document.InputEdit.length; i++ )
	{
		if ( document.InputEdit.elements[i].name.substring(0,8) == 'FieldVoc' )
		{
			document.InputEdit.elements[i].value='';
		}
	}
	document.Info.WinClosed.value=1;
	return true;
}

function EditMultiLink()
{
	ChildWin=window.open("",NewEditWinName(self),"width=500,height=300,resizable=yes,status=yes,scrollbars=yes");
	document.Info.ChildWinName.value=ChildWin.name;
	ChildWin.document.open();
	htmlBegin=document.InputEdit.EditMultiLinkWin.value;
	htmlBegin=Convert('\x1b',"\"",htmlBegin);
	htmlBegin=Convert("%newEditWinName%","newEditWinName=\""+NewEditWinName(ChildWin)+"\";",htmlBegin);
	ChildWin.document.write(htmlBegin);
	editMultiLinks=document.InputEdit.EditMultiLinks.value;
	editMultiLinks=Convert('\x1e',"\"",editMultiLinks);
	editMultiLinks=Convert('\x1d',"'",editMultiLinks);
	ChildWin.document.write(editMultiLinks);
	ChildWin.document.write("</table><br>\r\n");
	ChildWin.document.write("<tr><td ALIGN=center><table WIDTH=\"100%\">\r\n");
	ChildWin.document.write("<tr><td ALIGN=center><a href=\"javascript:self.close();\" onMouseOver=\"window.status='Закрыть окно';return true;\" onMouseOut=\"window.status='';return true;\">Закрыть</a>\r\n");
	ChildWin.document.write("</table></FORM>\r\n");
	ChildWin.document.write("</body>\r\n");
	ChildWin.document.write("<SCRIPT LANGUAGE=\"javascript\">\r\n");
	ChildWin.document.write("parenWinName=opener.name;\r\n");
	ChildWin.document.write('\x3c'+"/SCRIPT>\r\n");
	ChildWin.document.write("</html>\r\n");
	ChildWin.document.close();
}

function AllViewCheck(form)
{
	viewCheckAll=form.ViewCheckAll.checked;
	for ( i=0; i < form.length; i++ )
	{
		if ( form.elements[i].name.substring(0,9) == 'ViewCheck' )
		{
			form.elements[i].checked=viewCheckAll;
		}
	}
}

function CheckQBENecessary()
{
	for ( i=0; i < document.QBE.length; i++ )
	{
		if ( document.QBE.elements[i].name.substring(0,14) == 'FieldNecessary' )
		{
			if ( document.QBE.elements[i+1].value == '' )
			{
				alert('Не задано обязательное условие');
				document.QBE.elements[i+1].focus();
				return false;
			}
		}
	}
	return true;
}

function EditText(fieldEditName,fieldChangeName,htmlBeginEl)
{
	ChildWin=window.open("",NewEditWinName(self),"width=900,height=600,resizable=yes,status=yes,scrollbars=yes");
	document.Info.ChildWinName.value=ChildWin.name;
	formCount=ChildWin.document.forms.length;
	if ( formCount == 0 )
	{
		ChildValue=0;
		ChildWinNameValue='';
	} else
	{
		ChildValue=document.Info.Child.value;
		ChildWinNameValue=document.Info.ChildWinName.value;
	}
	ChildWin.document.open();
	htmlBegin=htmlBeginEl.value;
	htmlBegin=Convert('\x1b',"\"",htmlBegin);
	ChildWin.document.write(htmlBegin);
	ChildWin.document.write("<head><title>Редактирование текстового значения</title></head>\r\n");
	ChildWin.document.write("<FORM name=\"Info\">\r\n");
	ChildWin.document.write("<INPUT type=\"hidden\" name=\"Child\" value=\""+ChildValue+"\">\r\n");
	ChildWin.document.write("<INPUT type=\"hidden\" name=\"ChildWinName\" value=\""+ChildWinNameValue+"\">\r\n");
	ChildWin.document.write("</FORM>\r\n");
	ChildWin.document.write("<FORM name=\"InputEdit\">\r\n");
	ChildWin.document.write("<TEXTAREA name=\"FieldEdit\" WARP=\"virtual\" COLS=\"80\" ROWS=\"25\">\r\n");
  ChildWin.document.write("</TEXTAREA>\r\n");
	ChildWin.document.write("<tr><td ALIGN=center><table WIDTH=\"100%\">\r\n");
	ChildWin.document.write("<tr><td ALIGN=right><a href=\"javascript:opener.document."+fieldEditName+".value=document.InputEdit.FieldEdit.value;");
	if ( fieldChangeName != '' )
	{
		ChildWin.document.write("opener.document."+fieldChangeName+".value=1;");
	}
	ChildWin.document.write("self.close();\" onMouseOver=\"window.status='Сохранить значения поля';return true;\" onMouseOut=\"window.status='';return true;\">Сохранить</a>&nbsp;&nbsp;\r\n");
	ChildWin.document.write("<td ALIGN=left><a href=\"javascript:self.close();\" onMouseOver=\"cancel=1;window.status='Отмена';return true;\" onMouseOut=\"cancel=0;window.status='';return true;\">Отмена</a>\r\n");
	ChildWin.document.write("</table></FORM>\r\n");
	ChildWin.document.write("</body>\r\n");
	ChildWin.document.write("<SCRIPT LANGUAGE=\"javascript\">\r\n");
	ChildWin.document.write("document.InputEdit.FieldEdit.value=opener.document."+fieldEditName+".value;\r\n");
	ChildWin.document.write("document.InputEdit.FieldEdit.focus();\r\n");
	ChildWin.document.write('\x3c'+"/SCRIPT>\r\n");
	ChildWin.document.write("</html>\r\n");
	ChildWin.document.close();
}

function SelectInVoc(selectEl,keyChar)
{
	findStrInVoc+=keyChar.toUpperCase();
	for ( findIndex=0; findIndex < selectEl.options.length; findIndex++ )
	{
		if ( selectEl.options[findIndex].text.toUpperCase().substring(0,findStrInVoc.length) == findStrInVoc )
		{
			if ( selectEl.selectedIndex != findIndex )
			{
				selectEl.selectedIndex=findIndex;
			}
			window.status=findStrInVoc;
			return;
		}
	}
	findStrInVoc=findStrInVoc.substring(0,findStrInVoc.length-keyChar.length);
	window.status=findStrInVoc;
}

function PlusClick(node)
{
	if(node.src==node.src.substring(0,node.src.length-8)+"Plus.gif")
	{
		node.src=node.src.substring(0,node.src.length-8)+"Minus.gif";
		node.parentNode.parentNode.nextSibling.style.display="";
	}
	else
	{
		node.src=node.src.substring(0,node.src.length-9)+"Plus.gif"
		node.parentNode.parentNode.nextSibling.style.display="none";
	}
}

