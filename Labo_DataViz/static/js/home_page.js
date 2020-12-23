var form;
$(document).ready(function(){

        addSearchByPeriod();
        addProfilElements();
        form= new Form();  
        
});


function displayQuestionnaires(listQuestionnaires){
    $('#questionnaires-container').empty();
    let html=`<ol class="articles">`;
    listQuestionnaires.forEach(questionnaire => {
        let nbParticipants= getNbParticipants(questionnaire);
        let str=`
            <h2 class="articles__title">${questionnaire['title']}</h2>
            <p>${nbParticipants} Participants</p>
            <div class="articles__footer">
                <p>${getHour(questionnaire['time'])}</p><time>${getDate(questionnaire['time'])}</time>
            </div>
        `;

        html+=`
            <li class="articles__article" style="--animation-order:3" onclick="document.location='questionnaire?id=${questionnaire['id']}';">
                <a class="articles__link">
                    <div class="articles__content articles__content--lhs">
                        ${str}
                    </div>
                    <div class="articles__content articles__content--rhs" aria-hidden="true">
                        ${str}
                    </div>
                </a>
            </li>
        `;    
        
    });
    html+=`</ol>`;
    $('#questionnaires-container').append(html);
    
}

function addSearchByPeriod(){
    let date= getTime();
    let html=`
        <div id="reportrange" style="background: #fff; cursor: pointer; padding: 5px 10px; border: 1px solid #ccc; width: 70%">
            <i class="fa fa-caret-down"></i>
            &nbsp&nbsp;<span></span>&nbsp&nbsp;
            <i class="fa fa-calendar"></i>
        </div>
    `;
    $('#search-container').append(html);

    var lastOpended={start:moment().subtract(-1,'day'),end:moment().subtract(-1,'day')}
    function isLastOpended(start,end){
        return start.format('DD/MM/YYYY')==lastOpended['start'].format('DD/MM/YYYY') && end.format('DD/MM/YYYY')==lastOpended['end'].format('DD/MM/YYYY');
    }
    function writeDate(start,end){
        if(isLastOpended(start,end))
            $('#reportrange span').html("Derniers ouverts");
        else
            $('#reportrange span').html(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
    }

    function cb(start, end) {
        
        writeDate(start,end);

        if(isLastOpended(start,end)){
            $.ajax({
                type:"GET",
                url:"/getQuestionnaireRecent",
                datayype: 'json',
                data: {limit: 5},
                success: response => {
                    displayQuestionnaires(response['data']);
                }
            }).fail(printError);          //envoyer un message d'error si la requête a échoué
        }
        else{
            let startDate= new Date(start).getTime();
            let endDate= new Date(end).getTime();
            $.ajax({
                type:"GET",
                url:"/getQuestionnaireByDate",
                datayype: 'json',
                data: {
                    startDate: startDate, 
                    endDate: endDate 
                },
                success: response => {
                    displayQuestionnaires(response['data'].reverse());
                }
            }).fail(printError);          //envoyer un message d'error si la requête a échoué
        }
        
    }
    var ranges={
        'Derniers ouverts': [lastOpended['start'], lastOpended['end']],
        'Aujourd\'hui': [moment().startOf('day'), moment().endOf('day')],
        'Hier': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Cette semaine': [moment().startOf('week'), moment().endOf('week')],
        'La semaine dernière': [moment().subtract(1,'week').startOf('week'), moment().subtract(1,'month').endOf('month')],
        'Ce mois': [moment().startOf('month'), moment().endOf('month')],
        'Le mois dernier': [moment().subtract(1,'month').startOf('month'), moment().subtract(1,'month').endOf('month')],
        'Les 6 derniers mois': [moment().subtract(5,'month'), moment()],
    }
    let thisYear='En '+moment().year();
    let LastYear='En '+moment().subtract(1,'year').year();
    let LastLastYear='En '+moment().subtract(2,'year').year();
    ranges[thisYear]=[moment().startOf('year'), moment().endOf('year')];
    ranges[LastYear]=[moment().subtract(1,'year').startOf('year'), moment().subtract(1,'year').endOf('year')];
    ranges[LastLastYear]=[moment().subtract(2,'year').startOf('year'), moment().subtract(2,'year').endOf('year')];

    
    $('#reportrange').daterangepicker({
        startDate :moment().subtract(-1,'day'),
        endDate:moment().subtract(-1,'day'),
        applyButtonClasses: 'applyButton date-range-button',
        cancelButtonClasses: 'calcelButton date-range-button',
        ranges: ranges ,
        "locale": {
            "format": "DD / MM / YYYY",
            "separator": " - ",
            "applyLabel": "Chercher >>",
            "cancelLabel": "Annuler",
            "fromLabel": "De",
            "toLabel": "À",
            "customRangeLabel": "Personnalisé",
            "weekLabel": "Semaine",
            "daysOfWeek": [
                "LUN.",
                "MAR.",
                "MER.",
                "JEU.",
                "VEN.",
                "SAM.",
                "DIM."
            ],
            "monthNames": [
                "Janvier",
                "Février",
                "Mars",
                "Avril",
                "Mai",
                "Juin",
                "Juillet",
                "Août",
                "Septembre",
                "Octobre",
                "Novembre",
                "Décembre"
            ],
            "firstDay": 0
        },
    }, cb);

    cb(lastOpended['start'], lastOpended['end']); 

    $('.applyButton').click(function(){
        form.removeForm();
    });                        

}

function addProfilElements(){

    $.ajax({
        type:"GET",
        url:"/get_session",
        success: session => {
            let identifiant= session['identifiant']
            let html=`

                <p class="profil-element">
                    <span class="material-icons profil-element-icon">account_circle</span>
                    <span class="identifiant-label">${identifiant}</span>
                </p>

                <p class="profil-element profil-element-clickable deconnexion" onclick="deconnexion()">
                    <i class="fa fa-power-off profil-element-icon" aria-hidden="true"></i>
                    Deconnexion
                </p>
                
                <p class="profil-element profil-element-clickable add-account">
                    <span class="material-icons profil-element-icon"> person_add </span>
                    <a href="inscription">Ajouter un compte administrateur</a>
                </p>
                
            `;
            $('#profil-elements').append(html);
        }
    }).fail(printError);          //envoyer un message d'error si la requête a échoué


    
    
}

function deconnexion(){
    $.ajax({
        type:"GET",
        url:'/deconnexion',
        success: response=>{
            document.location.reload(true);
        }
    }).fail(printError);
}


function printError(error){    //afficher la page d'erreur 
    
    console.error("status: "+error['status']+"\nstatusText: "+error['statusText']);
    $('body').replaceWith(error['responseText']);

}

function getNbParticipants(questionnaire){
    let total=0;
    $.each(questionnaire['results'][questionnaire['questions'][0][0]], (i, answer)=>{total+=answer['total'];});
    return total;
}

function getTime(){
    let dico={}
    let date= new Date();
    dico['year']= date.getFullYear();
    dico['month']= timeFormat(date.getMonth()+1);
    dico['day']= timeFormat(date.getDate());
    dico['hour']= timeFormat(date.getHours());
    dico['minute']= timeFormat(date.getMinutes());
    dico['second']= timeFormat(date.getSeconds());
    return dico;
}
function timeFormat(time){
    if(time<10)
        time="0"+time;
    return time;
}

function getHour(time){
    return `${timeFormat(time['hour'])}h${timeFormat(time['minute'])}`;
}

function getDate(time){
    return date= timeFormat(time['day']) +' '+ monthToString(time['month'])+' '+time['year'];
    
}

function monthToString(month){
    let str;
    switch (month){
        case 1: str="Janvier"; break;
        case 2: str="Février"; break;
        case 3: str="Mars"; break;
        case 4: str="Avril"; break;
        case 5: str="Mai"; break;
        case 6: str="Juin"; break;
        case 7: str="Juillet"; break;
        case 8: str="Août"; break;
        case 9: str="Septembre"; break;
        case 10: str="Octobre"; break;
        case 11: str="Octobre"; break;
        case 12: str="Décembre"; break;
        default: str='None';
    }

    return str;
}

