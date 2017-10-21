
// To preven multiple executions
var instance_cleverdate = null;

var CleverDate = function(opts){    

    var instance_current = this;  


    // LAUNCH THE FIRST START
    var init = function(){
        start();
    }
    
    // METHOD CALLED AT REGULAR INTERVALS IF DATE ELEMENTS EXIST ON THE PAGE
    var start = function(){
        
        // to prevent multiple executions
        if(instance_cleverdate == instance_current && $(selector).length > 0) {
            
            setTimeout(function(ref){                
                if(ref){                         
                    start();                    
                }
            },refreshInterval*1000, this);           
            analyse();
        }

    }

    // METHOD IF YOU WANT TO STOP PROCESS (uncommon)
    stop = function(){
        instance_current = null;
    }

    // GIVES A "S" FOR PLURIAL
    var plural_s = function(val){
        return (val > 1) ? 's' : '';
    }

    var is_are = function(val){
        return (val > 1) ? 'are' : 'is';
    }

    // METHOD GIVES DIFFERENCE BETWEEN 2 DATES
    var dateDiff = function(date1, date2){
        var diff = {}                           
        var tmp = date2 - date1;
    
        tmp = Math.floor(tmp/1000);             
        diff.sec = tmp % 60;                    // Extraction du nombre de secondes
    
        tmp = Math.floor((tmp-diff.sec)/60);    
        diff.min = tmp % 60;                    // Extraction du nombre de minutes
    
        tmp = Math.floor((tmp-diff.min)/60);    
        diff.hour = tmp % 24;                   // Extraction du nombre d'heures
        
        tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
        diff.day = tmp;
        
        return diff;
    }

    // FOR EACH DATE, ANALYSE AND TRANSFORM IF THAT'S POSSIBLE
    analyse = function (){  

         /* ----
        Calucations
        ----- */
        var date_current = new Date();
        
        
        
        // yesterday
        var date_yesterday = new Date(); date_yesterday.setDate(date_current.getDate()-1); 
        // Before yesterday
        var date_before_yesterday = new Date(); date_before_yesterday.setDate(date_current.getDate()-2); 
        
        var domSelector = document.querySelectorAll(selector);
        Array.prototype.forEach.call(domSelector, function(element, index){            

            // Get date with utc format
            var date = new Date(  element.getAttribute('data-cleverdate')  );
            var date_hour = (date.getHours()<10?'0':'') + date.getHours();
            var date_min = (date.getMinutes()<10?'0':'') + date.getMinutes();

            // If bad date given, stop the analyse
            if(!date){                
                return false;
            }
            
            // Checks
            var isToday = ""+date.getFullYear()+date.getMonth()+date.getDate()+"" == ""+date_current.getFullYear()+date_current.getMonth()+date_current.getDate()+"";
            var isYesterday = ""+date.getFullYear()+date.getMonth()+date.getDate()+"" == ""+date_yesterday.getFullYear()+date_yesterday.getMonth()+date_yesterday.getDate()+"";
            var isBeforeYesterday = ""+date.getFullYear()+date.getMonth()+date.getDate()+"" == ""+date_before_yesterday.getFullYear()+date_before_yesterday.getMonth()+date_before_yesterday.getDate()+"";

            var txt = "";

            // Saving inital date written si we have to do a come back
            if(! element.getAttribute('date-cleverdate-initial')){
                element.setAttribute('date-cleverdate-initial', element.innerHTML);                
            }
            
            diff = dateDiff(date, date_current);
            
            if(diff.day == 0 && diff.hour == 0 && diff.min == 0  && diff.sec <= 30){
                if(lang == 'fr') txt = "À l'instant";
                else if(lang == 'en') txt = "Just now";
            }
            else if(diff.day == 0 && diff.hour == 0 && diff.min == 0){                  
                if(lang == 'fr') txt = 'Il y a '+diff.sec+' secondes';
                else if(lang == 'en') txt = ''+diff.sec+' seconds ago';          
            }
            else if(diff.day == 0 && diff.hour == 0 ){                
                if(lang == 'fr') txt = 'Il y a '+diff.min+' minute'+plural_s(diff.min);
                else if(lang == 'en') txt = ''+diff.min+' minute'+plural_s(diff.min)+' ago';
            }
            else if(diff.day == 0 && diff.hour <= 3){                
                if(lang == 'fr') txt = 'Il y a '+diff.hour+' heure'+plural_s(diff.hour)+'' ;
                else if(lang == 'en') txt = ''+diff.hour+' hour'+plural_s(diff.hour)+' ago' ;
            }
            else if(isToday){
                if(lang == 'fr') txt= "Aujourd'hui à "+date_hour+":"+date_min;
                else if(lang == 'en') txt= "Today at "+date_hour+":"+date_min;                
            }
            else if(isYesterday){
                if(lang == 'fr') txt= "Hier à "+date_hour+":"+date_min;
                else if(lang == 'en') txt= "Yesterday at "+date_hour+":"+date_min;                
            }  
            else if(isBeforeYesterday && lang == 'fr'){
                txt= "Avant-hier à "+date_hour+":"+date_min;
            }
                       
            
            
            // If we can't show a clever date, put default date
            if(txt=="" && element.getAttribute('date-cleverdate-initial')){                   
                txt = element.getAttribute('date-cleverdate-initial');          
            }
                       
            if(element.innerHTML != txt)
                element.innerHTML = txt;  

            
        });      

    }


    /*
    ---------------
    CONSTRUCTOR
    ---------------
    */

    // If there is a new instance, we delete previous
    instance_cleverdate = null; 
    instance_cleverdate = this;

    var selector = (opts.selector) ? opts.selector : '[data-cleverdate]';
    var lang = (opts.lang) ? opts.lang : 'fr';
    var refreshInterval = (opts.refreshInterval) ? opts.refreshInterval : 10;


   
    // Call a firt start
    init();

}


// Launch
new CleverDate({});
