var time;
var element="#form-container"
var cptID=0;
class Form{
    constructor(){
        this.drawAdd();
        this.usedColors=[];
    }

    drawAdd(){
        $(element).append(`<a href="#form-container"><div class="add" ><span class="material-icons add-icon">add</span></div></a>`);
        $('.add').click(()=>this.createForm());
    }

    hideAdd(){
        $('.add').hide();
    }

    showAdd(){
        $('.add').show();
    }

    removeForm(){
        updateTime();
        $('#form').remove();
        this.showAdd();
        this.usedColors=[];
    }

    createForm(){
        this.hideAdd();
        let idTitle=genID();
        let idQuestion=genID();
        let html= `
            <fieldset class="section" id="form">
                <legend>Création du questionnaire</legend>

                <fieldset>
                    <legend>Titre du questionnaire</legend>
                    <div class="input-title">
                        <input type="text" class="${idTitle} title" placeholder="titre du questionnaire" id="${idTitle}" name="title">
                        <span><span class="${idTitle}">0</span>/${maxLengthTitle}</span>
                        <span class="error"></span>
                    <div>
                </fieldset>

                <fieldset>
                    <legend>Couleurs</legend>
                    <input type="color" id="color">
                    <span class="add-color-icon"><span class="material-icons icon icon-clickable">add_circle</span></span>
                    <span class="error error-color"></span>
                    <div id="colors-container"></div>
                </fieldset>

                <fieldset>
                    <legend>Questions</legend>
                    <div class="input-question">
                        <input type="text" class="${idQuestion}" id="${idQuestion}" placeholder="intitulé de la qustion">
                        <span><span class="${idQuestion}">0</span>/${maxLengthQuestion}</span>
                        <span class="add-question-icon"><span class="material-icons icon icon-clickable">add_circle</span></span>
                        <span class="error"></span>
                    </div>
                    <div id="questions-container"></div>
                    
                    
                </fieldset>

                <button id="cancle" class="button">annuler</button>
                <button id="create" class="button">Créer</button>
            </fieldset>
        `;
        $(element).append(html);
        this.addEventTextInput(idTitle);
        this.addEventTextInput(idQuestion);
        this.addEventColorInput();
        this.addEventQuestionInput();
        this.addEventButtons();
    }
    
        


    addEventTextInput(id){
        let thisObject= this;
        $('#'+id).on('input', function(){ 
            let nbChar= $(this).val().trim().length;
            $('.'+id).text(nbChar);

            let maxLength;
            let classParent= $(this).parent().attr('class');
            if(classParent.includes("input-title")){
                maxLength= maxLengthTitle;
            }
            else if(classParent.includes("input-color")){
                maxLength= maxLengthColor;
            }
            else if(classParent.includes("input-question")){
                maxLength= maxLengthQuestion;
            }
            else if(classParent.includes("input-answer")){
                maxLength= maxLengthAnswer;
            }
            else{
                alert('maxLength inconnu');
            }

            if(nbChar > maxLength) 
                $('.'+id).css('color','red');
            else                        
                $('.'+id).css('color','black');
        
        });
    }

    addEventDeleteColor(id){
        let thisObject=this;
        $('#'+id).click(function(){
            let parent= $(this).parent();  //
            if(parent.attr('class').includes("input-color")){
                let color= parent.attr('id');
                thisObject.usedColors= thisObject.usedColors.filter(value=> value!=color);
                parent.remove();
            }
        });
    }

    addEventDelete(idClick,idDelete){
        $('#'+idClick).click(function(){ 
            $('#'+idDelete).remove();
        });
    }


    addEventColorInput(){
        let thisObject= this;
        $('.add-color-icon').click(function(){
            if($('.input-color').length < maxNbColors){
                
                let color= $('#color').val();                
                if(thisObject.usedColors.indexOf(color) == -1){    //vérification couleur différente
                    thisObject.addColorInput(color);
                      
                    $('.error-color').text("");
                }
                else{
                    $('.error-color').text("* Veuillez choisir une couleur différente");
                }  
            }
            else{
                $('.error-color').text("* Vous avez atteint le nombre maximum de couleurs");
            }
                      
            
        });
    }

    addColorInput(color){
        let id= genID();
        let idDelete= genID();
        let html=`
            <div class="input-color" id="${color}">
                <span class="material-icons icon icon-color" >bookmark</span>
                <input type="text" id="${id}" class="${id}" placeholder="critère / catégorie">
                <span><span class="${id}">0</span>/${maxLengthColor}</span>
                <span title="supprimer" id="${idDelete}" class="material-icons icon icon-clickable delete-icon delete-icon-color">cancel</span>
                <span class="error"></span>
            </div>
        `;
        $('#colors-container').append(html);
        $('.'+id).parent().children('.icon-color').css("color",color);
        this.usedColors.push(color);
        this.addEventTextInput(id);
        this.addEventDeleteColor(idDelete);
    }

    addEventQuestionInput(){
        let thisObject=this;
        $('.add-question-icon').click(function(){
            let error;
            let input= $('.input-question').children('input[type=text]');
            let val= input.val().trim();
            if(val.length >0 && val.length <= maxLengthQuestion && $('.delete-icon-question').length < maxNbQuestions){
                input.val("");
                error="";
                $("."+$(this).parent().children('input[type=text]').attr('class')).text("0");4
                let idAdd=genID();
                let idClickToDelete=genID();
                let idDelete=genID();
                let html=`
                    <fieldset id=${idDelete}>
                        <legend> ${val} <span title="supprimer" id="${idClickToDelete}" class="material-icons icon icon-clickable delete-icon delete-icon-question">cancel</span></legend>
                        <span class="add-answer-icon" id="${idAdd}"><span class="material-icons icon icon-clickable">add_circle</span></span>
                        <span class="error"></span>
                        <div id="${val}" class="answers-container"></div>  
                    </fieldset>
                `;
                $('#questions-container').append(html);
                thisObject.addEventAnswerInput(idAdd);
                thisObject.addEventDelete(idClickToDelete,idDelete);
            }
            else if(val.length == 0){
                error="* Vuillez écrire l'intitulé de la qustion";
            }
            else if(val.length > maxLengthQuestion){
                error="* La question est trop longue";
            }
            else{
                error="* Vous avez atteint le nombre maximum de questions";
            }
            $(this).parent().children('.error').text(error);

        });
    }

    addEventAnswerInput(id){
        let thisObject=this;
        $('#'+id).click(function(){
            let parent= $(this).parent();
            let error;
            if(parent.children('.answers-container').children('.input-answer').length < maxNbAnswers){
                error="";
                let id=genID();
                let idClickToDelete= genID();
                let idDelete= genID();
                let html=`
                    <div id="${idDelete}" class="input-answer">
                        <input type="text" class="${id}" id="${id}" placeholder="réponse">
                        <span><span class="${id}">0</span>/${maxLengthAnswer}</span>
                        <span id="${idClickToDelete}" title="supprimer" class="material-icons icon icon-clickable delete-icon delete-icon-answer">cancel</span>
                        <span class="error"></span>
                    </div>
                `;
                parent.children('.answers-container').append(html);
                thisObject.addEventTextInput(id);
                thisObject.addEventDelete(idClickToDelete,idDelete);
            }
            else{
                error="* Vous avez atteint le nombre maximum de réponses par queestion";
            }
            parent.children('.error').text(error);
        });

        
    }

    addEventButtons(){
        $('#cancle').click(()=>{this.removeForm()});
        $('#create').click(()=>{
            this.updateData();
            
        });

    }

    updateData(){
        let problem=false;
        let error;

        //le titre 
        let title= $('.title').val().trim();
        if(title.length != 0 && title.length <= maxLengthTitle){
            error="";
        }
        else{
            if(title.length > maxLengthTitle)
                error="* Le titre du questionnaire est trop longue";
            else
                error="* Veuillez remplir le nom du questionnaire";
            problem= true;
        }
        $('.title').parent().children('.error').text(error);

        //les couleurs 
        let listColors=[];
        if($(".input-color").length != 0){
            $('.error-color').text('');
            $.each( $(".input-color") , function(){
                let color= $(this).children('.icon-color').css('color');
                let text= $(this).children('input').val().trim();
                if(text.length != 0 && text.length <= maxLengthColor){
                    listColors.push([color,text]);
                    error="";
                }
                else{
                    if(text.length > maxLengthColor)
                        error="* Cette critère est trop longue";
                    else
                        error= "* Veuillez écrire la critère";
                    problem= true;
                }
                $(this).children('.error').text(error);
            });
        }
        else{
            $('.error-color').text('* Veuillez ajouter au moins une couleur');
            problem=true;
            
        }

        //les questions
        let listQuestions=[];
        if($(".answers-container").length != 0){                  //s'il y a au moins une question
            $('.input-question > .error').text('');
            $.each( $(".answers-container") , function(){          //pour chaque question
                  
                let question= $(this).attr('id').trim();
                let listAnswer=[];
                $.each( $(this).children('.input-answer') , function(){   //pour chaque réponse
                    let text= $(this).children('input[type=text]').val().trim();
                    if(text.length != 0 && text.length <= maxLengthAnswer){
                        error="";
                        listAnswer.push(text);
                    }
                    else{
                        if(text.length > maxLengthAnswer)
                            error="* Cette réponse est trop longue";
                        else
                            error="* Veuillez écrire la réponse";
                        problem= true;
                    }
                    $(this).children('.error').text(error);
                });
                if(listAnswer.length > 1){
                    listQuestions.push([question,listAnswer]);
                }
                
                if($(this).children('.input-answer').length < 2){    //il faut au moins deux réponses
                    $(this).parent().children('.error').text("* Veuillez ajouter au moins deux réponses")
                    problem= true;
                }
                else{
                    $(this).parent().children('.error').text("")
                }
                
            });
        }
        else{
            $('.input-question > .error').text('* Veuillez ajouter au moins une question');
            problem=true;
        }
        
                 
        if(!problem){
            let dico={
                'title': title,
                'colors': listColors,
                'questions': listQuestions
            };
            this.uploadQuestionnaire(dico);
            
        }

    }

    uploadQuestionnaire(questionnaire){
        let dico_result={};

        questionnaire['questions'].forEach(question =>{
            let dico_answer={};
            question[1].forEach(answer =>{
                let dico_color={};
                dico_color['total']=0;
                questionnaire['colors'].forEach(color => dico_color[color[1]]=0);
                dico_answer[answer]=dico_color;
            });
            dico_result[question[0]]=dico_answer;
        });
        
        let date= new Date();
        let id= date.getTime();
        updateTime();
        let dico_questionnaire={
            'title':questionnaire['title'],
            'time': time,
            'questions':questionnaire['questions'],
            'colors':questionnaire['colors'],
            'results':dico_result,
            'id':id
        }
        //requête ajax pour enregister dans la bdd et le recevoir avec un id comme data 
        $.ajax({
            type:"POST",
            url:'/uploadQuestionnaire',
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({'questionnaire':dico_questionnaire}),
            success: (response)=>{
                document.location= 'questionnaire?id='+dico_questionnaire['id']; 
            }
        }).fail(printError); 
        this.removeForm();
        document.location= 'questionnaire?id='+dico_questionnaire['id']; 
    }

}


function genID(){
    return cptID++;
}
  

function updateTime(){
    let dico={}
    let date= new Date();
    dico['year']= date.getFullYear();
    dico['month']= date.getMonth()+1;
    dico['day']= date.getDate();
    dico['hour']= date.getHours();
    dico['minute']= date.getMinutes();
    dico['second']= date.getSeconds();
    time= dico;
}

function printError(error){    //afficher la page d'erreur 
    
    console.error("status: "+error['status']+"\nstatusText: "+error['statusText']);
    $('body').replaceWith(error['responseText']);

}