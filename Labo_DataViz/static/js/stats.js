$(document).ready(function(){

    var questionnaire;
    var nbParticipants=0;
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    $.ajax({
        type:"GET",
        url:"/getQuestionnaireById",
        datatype:"json",
        data:{ id : id, currentTime: new Date().getTime()},
        success: init
    }).fail(printError);          //envoyer un message d'error si la requête a échoué


    function init(response){
        questionnaire= response;
        //récupérer le nombre total de participants
        $.each(questionnaire['results'][questionnaire['questions'][0][0]], (i, answer)=>{nbParticipants+=answer['total'];});
        //créer le div des statistiques du questionnaire 
        createQuestionnaireElement();
        createQuestionElement();
        
        
    }

    function createQuestionnaireElement(){
        html=`<div class="questionnaire">`;
        html+=`<p class="update-span">Mise à jour ${timeToString(getTime())}</p>`;
        html+=`<span title="revenir vers le questionnaire" class="material-icons back-icon icon clickable-icon" onclick="document.location='questionnaire?id=${id}';">west</span>`;
        html+=`<span title="imprimer / télécharger le pdf" class="material-icons icon clickable-icon print-icon" onclick="window.print();"> print </span>`;
        html+=`<span title="mettre à jour" class="material-icons update-icon icon clickable-icon" onclick="document.location.reload(true);">autorenew</span>`;
        html+=`<p class="title-questionnaire">${questionnaire['title']}</p>`;
        html+=`<p class="time phrase">`;
        html+=`<span class="material-icons icon time-icon">access_time</span>`;    
        html+=`<span>Créé ${timeToString(questionnaire['time'])}</span>`;
        html+=`</p>`;
        html+=`<p class="nbTotal-phrase phrase">Le nombre total de participants à ce questionnaire : </p>`;
        html+=`<p class="nbTotal-number"></p>`;
        html+=`<p class="composition phrase">La composition des participants : </p>`;
        html+=`<canvas class="graph-questionnaire graph"></canvas>`;
        html+=`<p id="delete-line">
        <span class="material-icons">delete</span>
        <span class="text first-step" title="Attention ! la suppression est définitive">Supprimer définitivement ce questionniare</span><br>
        <button class="delete-buttons cancelButton"> annuler </button>
        <button class="delete-buttons deleteButton"> supprimer </button>
        </p>`;
        html+=`</div>`;
        $('.questionnaire-container').append(html);
        setTimeout(()=> {
            addAnimeNumber(nbParticipants,".nbTotal-number");
            createGraphQuestionnaire();
        }, 0);
        addEventDeleteOption();
        addEventCancelButton();
        addEventdeleteButton();
    }

    function addAnimeNumber(n,selector){
        anime({
            targets: $(selector)[0],
            innerHTML: [0, n],
            easing: 'easeOutCubic',
            round: 1 
        });
    }

    function addEventDeleteOption(){
        $('.first-step').click(function(){
            $("#delete-line > .text").replaceWith(`<span class="text second-step"> Êtes-vous sûr de vouloir supprimer ce questionnaire ? </span>`);
            $('.delete-buttons').show();
        });
       
    }

    function addEventCancelButton(){
        $('.cancelButton').click(function(){
            $("#delete-line > .text").replaceWith(`<span class="text first-step" title="Attention ! la suppression est définitive">Supprimer définitivement ce questionniare</span>`);
            $('.delete-buttons').hide();
            addEventDeleteOption();
        });
    }

    function addEventdeleteButton(){
        $('.deleteButton').click(function(){
            $.ajax({
                type:"POST",
                url:"/removeQuestionnaire",
                datatype:"json",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify({'id':id}),
                success: response => {
                    if(response == "succes")
                        document.location= "home_page";
                    else
                        alert("Error: le serveur a renvoyé une mauvaise réponse")
                }
            }).fail(printError);          //envoyer un message d'error si la requête a échoué
        });
    }

    function createGraphQuestionnaire(){
        let listLabels=[];
        let listData=[];
        let listColors=[];
        questionnaire['colors'].forEach(color => {
            let nb=0;
            $.each(questionnaire['results'][questionnaire['questions'][0][0]], (i, answer)=>{
                nb+= answer[color[1]];
            });
            let percent= 0;
            if(nbParticipants != 0)
                percent= Number.parseFloat((nb/nbParticipants)*100).toPrecision(3);
            listLabels.push(` ${color[1]} ( ${percent}% ) `);
            listData.push(nb);
            listColors.push(color[0]);
        });
        var ctx= $('.graph-questionnaire')[0].getContext('2d');
         
        let data = {
            datasets: [{
                data: listData,
                backgroundColor	: listColors,
                borderColor: listColors,
                borderWidth:0,
                hoverBorderWidth:7
               
            }],
        
            labels: listLabels
        };
        let options={
            animation:{
                animateScale: true,
                duration:1000,
                easing:'easeOutCubic'
            },
            legend:{
                labels:{
                    fontColor: 'black',
                    fontSize: 16                 
                },
                onClick:()=>{}
            },
            aspectRatio: 1.2    // plus petit = graph plus grande
        }
        var myPie = new Chart(ctx, {
            type: 'pie', //doughnut
            data: data,
            options: options
        });

    }

    function createQuestionElement(){
        let index=1;
        $.each(questionnaire['results'],(question,listAnswers)=>{
            html= `<div class="question">`;
            html+= `<p class="title-question">${index})  ${question}</p>`;
            html+= `<canvas id="first-graph${index}" class="graph-question graph"></canvas>`;
            html+= `<canvas id="second-graph${index}" class="graph-question graph"></canvas>`;
            html+= `</div>`;
            $('.questions-container').append(html);
            index++;
        });
        setTimeout(()=> {
            createFirstGraphQuestions();
            createSecondGraphQuestions();
        }, 0);
           
    }
    
    function createFirstGraphQuestions(){
        let index=1;
        $.each(questionnaire['questions'],(i,question_listAnswers)=>{  //pour chaque question
            listAnswers= question_listAnswers[1];
            let listTotal=[];
            let listAnswersText=[];
            let somTotal=0;
            $.each(listAnswers, (i, answer)=>{  //pour chaque réponse
                listColors= questionnaire['results'][question_listAnswers[0]][answer];
                listTotal.push(listColors['total']);
                somTotal+= listColors['total'];
            });

            $.each(listAnswers, (i,answer)=>{
                listColors= questionnaire['results'][question_listAnswers[0]][answer];
                let precent= 0;
                if(somTotal != 0)
                    precent= Number.parseFloat((listColors['total']/somTotal)*100).toPrecision(3);
                listAnswersText.push(answer+ ` ( ${precent}% ) `);
            });
            

            var ctx= $(`#first-graph${index}`)[0].getContext('2d');
            let data= {
                datasets: [{
                    data: listTotal,     //le total de chaque réponses
                    label: 'nombre de participants',               //un mot comme nbParticipants
                    backgroundColor:'rgba(73, 55, 173,.5)',
                    borderColor: 'rgb(73, 55, 173)',
                    borderWidth:3,
                    hoverBackgroundColor:'rgb(73, 55, 173)',
                    hoverBorderWidth:0,
                    barThickness: 'flex',
                    maxBarThickness:23
                }],
                labels:listAnswersText  //les réponses
            };
    
            let options= {
                scales: {
                    xAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero:true,
                            fontSize: 14,
                            fontColor:'black'
                        }            
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero:true,
                            fontSize: 16,
                            fontColor:'black'
                        }            
                    }]
                },
                legend:{
                    labels:{
                        fontColor: 'black',
                        fontSize: 16
                    },
                    display: false,
                    onClick:()=>{}
                },
                aspectRatio: 5    // plus petit = graph plus grand
         
            };
            
            var myBarChart = new Chart(ctx, {
                type: 'horizontalBar',
                data: data,
                options:options
            });

            index++;
        });
    }
     
    function createSecondGraphQuestions(){
        let index=1;
        // $.each(questionnaire['results'],(question,listAnswers)=>{
        $.each(questionnaire['questions'],(i,question_listAnswers)=>{
            listAnswers= question_listAnswers[1];
            var ctx= $(`#second-graph${index}`)[0].getContext('2d');

            let listAnswersText=[];

            $.each(listAnswers, (i,answer)=>{
                listAnswersText.push(answer);
            });
            

            let datasets=[];
            questionnaire['colors'].forEach((color)=>{
                let listData=[];
                $.each(listAnswers, (i,answer)=>{
                    listColors= questionnaire['results'][question_listAnswers[0]][answer];
                    listData.push(listColors[color[1]]);
                });

                dico= {
                    data: listData, 
                    label: color[1], 
                    backgroundColor: color[0],
                    barThickness: 'flex',
                    maxBarThickness: 20,
                }
                datasets.push(dico);
            });
            
            let data= {
                datasets: datasets,
                labels:listAnswersText  //les réponses
            };
    
            let options= {
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero:true,
                            fontSize: 16,
                            fontColor:'black'
                        }            
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero:true,
                            fontSize: 14,
                            fontColor:'black'
                        }            
                    }]
                },
                legend:{
                    labels:{
                        fontColor: 'black',
                        fontSize: 16
                                     
                    },
                    position:'left',
                    onClick:()=>{}
                },
                aspectRatio:  3.5   // plus petit = graph plus grand
         
            };
            
            var myBarChart = new Chart(ctx, {
                type: 'bar',
                data: data,
                options:options
            });

            index++;
        });
    }
     
});
 

function getTime(){
    let dico={}
    let date= new Date();
    dico['year']= date.getFullYear();
    dico['month']= date.getMonth()+1;
    dico['day']= date.getDate();
    dico['hour']= date.getHours();
    dico['minute']= date.getMinutes();
    dico['second']= date.getSeconds();
    return dico;
}

function timeToString(time){
    return `le ${timeFormat(time['day'])} / ${timeFormat(time['month'])} / ${time['year']} à ${timeFormat(time['hour'])}h${timeFormat(time['minute'])}`;
}

function timeFormat(time){
    if(time<10)
        time="0"+time;
    return time;
}

function printError(error){    //afficher la page d'erreur 
    
    console.error("status: "+error['status']+"\nstatusText: "+error['statusText']);
    $('body').replaceWith(error['responseText']);
    
}
