$(document).ready(function()
    {
        dateTimeFormat= 'yyyy-MM-dd HH:mm';
        
        $("#commentDialog").dialog({
            autoOpen: false,
            width: 350,
            height: 300
        });
        
        
        
        
        $(".nonEditable").each(function(){
            element = $(this)

            $(".nonEditable").attr("disabled", "disabled");
        
        });
           
        var InDate = trim($(".inDate").val());
        if (InDate == '') {
            $(".inDate").val(dateDisplayFormat);
        }

        //Bind date picker
        daymarker.bindElement(".inDate",
        {
            onSelect: function(date){
              
                $(".inDate").trigger('change');            

            },
            dateFormat:jsDateFormat
        });

 
        var OutDate = trim($(".outDate").val());
        if (OutDate == '') {
            $(".outDate").val(dateDisplayFormat);
        }

        //Bind date picker
        daymarker.bindElement(".outDate",
        {
            onSelect: function(date){
              
                $(".outDate").trigger('change');            

            },
            dateFormat:jsDateFormat
        });

 
       
       
       
        $(".cancel").click(function() {
            if(actionRecorder=="viewEmployee"){
                $('form#employeeRecordsForm').attr({
                    action:linkToViewEmployeeRecords+"?employeeId="+employeeId+"&date="+recordDate+"&trigger="+true
                });
            }
        
            if(actionRecorder=="viewMy"){
            
                $('form#employeeRecordsForm').attr({
                    action:linkToViewMyRecords+"?employeeId="+employeeId+"&date="+recordDate+"&trigger="+true
                });
            }   
        
            $('form#employeeRecordsForm').submit();
        });
        $(".save").click(function() {
           
            $('form#employeeRecordsForm').attr({
                action:linkToEdit+"?employeeId="+employeeId+"&date="+recordDate+"&formSubmitAction="+true+"&actionRecorder="+actionRecorder
            });
            $('form#employeeRecordsForm').submit();
        });
        
        
        
        $(".inDate").change(function(){
            element = $(this)
           
            idDate=element.attr('id');
            idArray= idDate.split("_");
            punchOutUtcTime=$("#punchOutUtcTime_"+idArray[2]).val();
            inTimezone=$("#attendance_InOffset_"+idArray[2]).val();
            inTime=   $("#attendance_punchInTime_"+idArray[2]).val();
            inDate=element.val();
     
            var flag4 = validateDateFormat(inDate);

            if(!flag4) {
                var errorStyle = "background-color:#FFDFDF;";
                element.attr('style', errorStyle);
                $('#btnSave').attr('disabled', 'disabled');
               
                $('#validationMsg').attr('class', "messageBalloon_failure");
                $('#validationMsg').html(errorForInvalidDateFormat);
            }
            else{
                $('#btnSave').removeAttr('disabled');
                element.removeAttr('style');
            }
            
           

            if(flag4){
                
                var flag1=validatePunchInTime(punchOutUtcTime,inTimezone,inTime,inDate);
                if(!flag1){
                    var errorStyle = "background-color:#FFDFDF;";
                    element.attr('style', errorStyle);
                    $('#btnSave').attr('disabled', 'disabled');
                    $('#validationMsg').attr('class', "messageBalloon_failure");
                    $('#validationMsg').html(errorForInvalidTime);
                }
                else{
                
                    $('#btnSave').removeAttr('disabled');
                    element.removeAttr('style');
                
                }
            
                if(flag1){
                    var flag3=validateForpunchInOverLapping(inTimezone,inTime, inDate);
                    if(!flag1){
                        var errorStyle = "background-color:#FFDFDF;";
                        element.attr('style', errorStyle);
                    
                    }
                    else{
                        element.removeAttr('style');
                    }
                
                }
            }
   
            
            
        });
        
        $(".icon").click(function() {
           

            $("#noteError").html("");
            $("#punchInOutNote").val("");
            classStr = $(this).attr("id").split("_");
            
         
            if(classStr[1]==2){
                $("#punchInOutNote").attr("disabled","disabled");
                $("#commentSave").hide();
            }
            else{
                $("#commentSave").show();
                $("#punchInOutNote").attr("disabled","");
            }
  
            $("#punchInOutNote").val($("#attendanceNote_"+classStr[1]+"_"+classStr[2]+"_"+classStr[0]).val());
       
            $("#commentDialog").dialog('open');


        });
        
        $("#commentCancel").click(function() {
            $("#commentDialog").dialog('close');
        });

        $("#commentSave").click(function() {
            var comment=  $("#punchInOutNote").val();
            if(comment.length > 250) {
                $('#noteError').html(commentError);
                return;
            }
            else{
          
  
                var id=classStr[0];
    
                var punchInOut=classStr[2];
                updateComment(comment,id,punchInOut);
                //   $("#punchInOutNote").val($("#attendanceNote_"+classStr[1]+"_"+classStr[2]+"_"+classStr[0]).val());
            
                $("#commentDialog").dialog('close');
            }
        });
        
        
        $(".outDate").change(function(){
            element = $(this)
           
            idDate=element.attr('id');
            idArray= idDate.split("_");
            punchInUtcTime=$("#punchInUtcTime_"+idArray[2]).val();
            outTimezone=$("#attendance_OutOffset_"+idArray[2]).val();
            outTime=   $("#attendance_punchOutTime_"+idArray[2]).val();
            outDate=element.val();
            
       
            var flag4 = validateDateFormat(outDate);

            if(!flag4) {
                var errorStyle = "background-color:#FFDFDF;";
                element.attr('style', errorStyle);
                $('#btnSave').attr('disabled', 'disabled');
               
                $('#validationMsg').attr('class', "messageBalloon_failure");
                $('#validationMsg').html(errorForInvalidDateFormat);
            }
            else{
                $('#btnSave').removeAttr('disabled');
                element.removeAttr('style');
            }
            
          
            if(flag4){
                
                var flag1=validatePunchOutTime(punchInUtcTime,outTimezone,outTime,outDate);

                if(!flag1){
                    var errorStyle = "background-color:#FFDFDF;";
                    element.attr('style', errorStyle);
                    $('#btnSave').attr('disabled', 'disabled');
                    $('#validationMsg').attr('class', "messageBalloon_failure");
                    $('#validationMsg').html(errorForInvalidTime);
                }
                else{
                
                    $('#btnSave').removeAttr('disabled');
                    element.removeAttr('style');
                
                }
            
            }
          
        });
        
        
         $(".outTime").change(function(){
             
             
             
             
             
         });
        
        
        
        
    });
    
function validatePunchOutOverLapping(){


    $(".messageBalloon_success").remove();
    $('#validationMsg').removeAttr('class');
    $('#validationMsg').html("");

    var inTime=punchInTime;
    var timezone=timeZone;

    var outTime =$(".date").val()+" "+$(".time").val();

    var r = $.ajax({
        type: 'POST',
        url: linkForOverLappingValidation,
        data: "punchInTime="+inTime+"&punchOutTime="+outTime+"&employeeId="+employeeId+"&timezone="+timezone,
        async: false,

        success: function(msg){

            isValid = msg;
         
        }
    });


    var errorStyle = "background-color:#FFDFDF;";

    if (isValid==0) {

        $('.punchOutbutton').attr('disabled', 'disabled');
        $('#validationMsg').attr('class', "messageBalloon_failure");
        $('#validationMsg').html(errorForOverLappingTime);
        $(".time").attr('style', errorStyle);
        $("#attendance_date").attr('style', errorStyle);

    }

    return isValid;



}
    
    
    
    
    
    
function updateComment(comment,id,punchInOut){

        
    var r=$.ajax({
        type: 'POST',
        url: updateCommentlink,
        data: {
            id: id,
            comment:     comment,
            punchInOut:  punchInOut
        },
        async: false
    }).responseText;
    return r;
        
        
        
        
        
}

function validateForpunchInOverLapping(inTimezone,inTime, inDate){


    $(".messageBalloon_success").remove();
    $('#validationMsg').removeAttr('class');
    $('#validationMsg').html("");


    var inTime = inDate+" "+inTime;
    var timezone=inTimezone;
   
    var r = $.ajax({
        type: 'POST',
        url: linkForPunchInOverlappingValidation,
        data: "punchInTime="+inTime+"&employeeId="+employeeId+"&timezone="+timezone,
        async: false,

        success: function(msg){
            isValid = msg;
    
        }
    });

   
    if (isValid==0) {

        $('#btnSave').attr('disabled', 'disabled');
        $('#validationMsg').attr('class', "messageBalloon_failure");
        $('#validationMsg').html(errorForOverLappingTime);
    //        $(".time").attr('style', errorStyle);
    //        $("#attendance_date").attr('style', errorStyle);

    }

    return isValid;
}
function validateDateFormat(date) {
   
    var formtMonth;
    var formtDate;
   
    errFlag = false;
    $(".messageBalloon_success").remove();
    $('#validationMsg').removeAttr('class');
    $('#validationMsg').html("");

   
        
    var dateArray=date.split('-');
    
    
    //implement the when - is not there this breaks

    if((dateArray[1]<1)||(dateArray[1]>12)||(dateArray[2]>31)||(dateArray[2]<1)){
        
        $('#btnSave').attr('disabled', 'disabled');
            
        errFlag = true;
       
    }

    return !errFlag ;
}

function validateTimeFormat(time){
    var formtHour;
    var formtMin;
    errFlag = false;
    $(".messageBalloon_success").remove();
    $('#validationMsg').removeAttr('class');
    $('#validationMsg').html("");

    var timeArray=time.split(':')
    
    
    
    if((timeArray[0]>24)||(timeArray[0]<0)||(timeArray[1]>59)||(timeArray[1]<0)){

        $('#btnSave').attr('disabled', 'disabled');
        $('#validationMsg').attr('class', "messageBalloon_failure");
        $('#validationMsg').html(errorForInvalidTimeFormat);
        $(".time").attr('style', errorStyle);
        errFlag = true;

    }
    return !errFlag;
}

function strToTime(str, format) {

    yearVal = '';
    monthVal = '';
    dateVal = '';
    hourVal = '';
    minuteVal = '';
    aVal = '';

    if (str.length != format.length) {
        return false;
    }

    j=0;
    for (i=0; i<format.length; i++) {

        ch = format.charAt(j);
        sCh = str.charAt(i);

        if (ch == 'd') {
            dateVal = dateVal.toString()+sCh;
        } else if (ch == 'M') {
            monthVal = monthVal.toString()+sCh;
        } else if (ch == 'y') {
            yearVal = yearVal.toString()+sCh;
        } else if (ch == 'H') {
            hourVal = hourVal.toString()+sCh;
        } else if (ch == 'h') {
            hourVal = hourVal.toString()+sCh;
            if (hourVal > 12) return false;
        } else if (ch == 'm') {
            minuteVal = minuteVal.toString()+sCh;
        } else if (ch == 'a') {
            sCh = sCh+str.charAt(i+1);
            if (sCh == 'PM') {
                hourVal+=12;
            } else if (sCh != 'AM') {
                return false;
            }
            i++;
        } else {
            if (ch != sCh) {
                return false;
            }
        }
        j++;
    }

    if ((monthVal < 1) || (monthVal > 12) || (dateVal < 1) || (dateVal > 31) || (hourVal > 24) || (minuteVal > 59)) {
        return false;
    }
    date = new Date(yearVal, monthVal-1, dateVal, hourVal, minuteVal);


    return date.getTime();

}

function validatePunchInTime(punchOutUtcTime,inTimezone,inTime,date){
    
    var dateArray=date.split('-');
    
    if(dateArray[1].search([0])== -1){
        if((dateArray[1]==11) || (dateArray[1]==12)){
            formtMonth=dateArray[1];
        }
        else{
            formtMonth="0"+dateArray[1];
        }

    }

    else{

        formtMonth=dateArray[1];
    }

    if(dateArray[2]<= 9){
        if(dateArray[2].search([0])== -1){
            formtDate="0"+dateArray[2];
        }

        else{
            formtDate=dateArray[2]
        }

    }

    else{
        formtDate=dateArray[2];
    }


    var formtedFullDate=dateArray[0]+"-"+formtMonth+"-"+formtDate;
  
    var timeArray=inTime.split(':')
    
    if(timeArray[0]<10){
        if(timeArray[0].search([0])== -1){

            formtHour="0"+timeArray[0];
        }
        else{

            formtHour=timeArray[0];
        }

    }

    else{
        formtHour=timeArray[0];
    }

    if(timeArray[1]<10){

        if(timeArray[1].search([0])== -1){

            formtMin="0"+timeArray[1];
        }

        else{

            formtMin=timeArray[1];
        }

    }

    else{

        formtMin=timeArray[1];  
    }

    var formtdFullTime=formtHour+":"+formtMin;


    var outTime = strToTime(punchOutUtcTime, dateTimeFormat);
    var inTimeTemp = strToTime(formtedFullDate+" "+formtdFullTime, dateTimeFormat);
    var inTime=inTimeTemp-inTimezone*3600*1000;

    if (inTime > outTime) {

        errFlag = true;
    }
    return !errFlag;
}


function validatePunchOutTime(punchInUtcTime,outTimezone,outTime,outDate){
        
    var dateArray=outDate.split('-');
    
    if(dateArray[1].search([0])== -1){
        if((dateArray[1]==11) || (dateArray[1]==12)){
            formtMonth=dateArray[1];
        }
        else{
            formtMonth="0"+dateArray[1];
        }

    }

    else{

        formtMonth=dateArray[1];
    }

    if(dateArray[2]<= 9){
        if(dateArray[2].search([0])== -1){
            formtDate="0"+dateArray[2];
        }

        else{
            formtDate=dateArray[2]
        }

    }

    else{
        formtDate=dateArray[2];
    }


    var formtedFullDate=dateArray[0]+"-"+formtMonth+"-"+formtDate;
  
    var timeArray=outTime.split(':')
    
    if(timeArray[0]<10){
        if(timeArray[0].search([0])== -1){

            formtHour="0"+timeArray[0];
        }
        else{

            formtHour=timeArray[0];
        }

    }

    else{
        formtHour=timeArray[0];
    }

    if(timeArray[1]<10){

        if(timeArray[1].search([0])== -1){

            formtMin="0"+timeArray[1];
        }

        else{

            formtMin=timeArray[1];
        }

    }

    else{

        formtMin=timeArray[1];  
    }

    var formtdFullTime=formtHour+":"+formtMin;


    var inTime = strToTime(punchInUtcTime, dateTimeFormat);
    var outTimeTemp = strToTime(formtedFullDate+" "+formtdFullTime, dateTimeFormat);
  
;
    var outTime=outTimeTemp-outTimezone*3600*1000;
  
    if (inTime > outTime) {

        errFlag = true;
    }
    return !errFlag;
        
        
        
}
    
  
 