canClose=false;
canDisplayNone=true;

function SetCanClose()
{
	canClose=true;
}

function BeforeRestore()
{
	if ( !canClose )
	{
		document.cookie="UserId=0";
	}
	if ( canDisplayNone )
	{
		DisplayNone();
	}
}

function SelfRestore()
{
	if ( !canClose )
	{
		alert("Это действие недопустимо!");
		Restore.submit();
	}
}

function DisplayNone()
{
	for ( i=0; i < document.all.length; i++ )
	{
		if ( document.all(i).type == 'submit' || document.all(i).type == 'button' || document.all(i).href )
		{
			document.all(i).style.display='none';
		}
	}
/*
	document.open();
	document.write("<html>\r\n");
	document.write("<body onLoad=\"document.charset='windows-1251';\" text=\"#000000\" bgcolor=\"#C0C0C0\" link=\"#800000\">\r\n");
	document.write("<META http-equiv=\"Content-Type\" content=\"text/html; charset=windows-1251\">\r\n");
	document.write("<style>.small{font-family:arial;font-size:10pt}.smallinput{font-family:arial;font-size:9pt}</style>\r\n");
	document.write("<head><title>Подождите немного...</title></head>\r\n");
	document.write("<H1>Подождите немного...</H1><BR>\r\n");
	document.write("</body></html>\r\n");
	document.close();
*/
}

