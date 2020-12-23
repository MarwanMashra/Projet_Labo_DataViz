$(document).ready(function(){
    

  var session;
  //Les variables globales
  var marginTop=120;
  var heightQuestionElement=60;
  var widthQuestionElement = 200;
  var heightQuestionnaireElement=50;
  var widthtQuestionnaireElement= 600;
  var paddingQuestionnaireV= 10;
  var paddingQuestionnaireH= 50;
  var scrollHeight= document.documentElement.scrollHeight;
  var scrollWidth= document.documentElement.scrollWidth;
  var maxHeight= scrollHeight  - marginTop - heightQuestionElement; 
  var marginLeft=scrollWidth/10;
  var marginRight= 150;
  var sizeColorElement= 60;
  var maxWidth= scrollWidth  - marginLeft - marginRight - sizeColorElement;
  var sizeAnswerCircle= 20;
  var percentQuestionAnswer= .7;
  var heightAnswerLabel= heightQuestionElement*percentQuestionAnswer;
  var widthAnswerLabel= widthQuestionElement*percentQuestionAnswer;
  var spaceLabelCircle= 10;
  var ropeWidth= 3;
  var cptID=0;
  var answersEventActive= false;
  var durationDrawLine= 300;
  var durationRemoveLine= 400;  
  

  /************************************************ Les Classes ************************************************/
    
  class Questionnaire {
    constructor(questionnaire){
      this.id= questionnaire['id'];
      this.title= questionnaire['title'];
      this.time= questionnaire['time'];
      this.listQuestions= this.genListQuestions(questionnaire['questions']);        //une liste d'instances de l'objet Question
      this.colors= this.genColors(questionnaire['colors']);                         //une instance de l'objet Colors
      this.results= questionnaire['results'];
      this.draw();
      this.rope= new Rope(this);
    }

    
    genListQuestions(listQuestions){

        let list=[];
        let space= (maxWidth - listQuestions.length*widthQuestionElement)/ (listQuestions.length +1);
        let positionX= marginLeft + sizeColorElement + space;
        let positionY= marginTop;
        
        listQuestions.forEach(question => {
            list.push(new Question(question[0],question[1],new Point(positionX,positionY)));
            positionX+= widthQuestionElement + space;
        });

        $('body').append(`<button class='submit' style="left:${positionX}px;top:${maxHeight/2 + marginTop }px;"> Valider </button>`);

        let size= (scrollHeight)/6;
        let submitButton= $('.submit')[0].getBoundingClientRect();
        let top= (submitButton['y']+submitButton['height']) + ((scrollHeight - (submitButton['y']+submitButton['height']))/2) - 128/1.5;
        $('body').append(`
        <div id="qrcodde-container" style="width:${size}px;left:${positionX}px;top:${top}px;">
            <div id="qrcode"></div>
            <p style="font-weight:bold;">Répondez via votre smartphone</p>
        </div>
        `);
        var qrcode = new QRCode("qrcode", {
            text: window.location.href,
            width: size,
            height: size,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        return list;
    }

    genColors(listcolors){
      return new Colors(listcolors);
    }

    draw(){
        $('body').append(`<div class="questionnaire" style="height:${heightQuestionnaireElement}px;widtht:${widthtQuestionnaireElement}px;top:${(marginTop - heightQuestionnaireElement)/2 - paddingQuestionnaireV}px;padding:${paddingQuestionnaireV}px ${paddingQuestionnaireH}px;">${this.title}</div> `);
        let left= scrollWidth/2 - $('.questionnaire')[0].getBoundingClientRect()['width']/2;
        $('.questionnaire').css('left',left);
        addAccountElements(this.id);
        
    }
   
    
  }
  
  class Question {
    constructor(text,listAnswers,position){
      
      this.text=text;
      this.position=position;
      this.id="question"+genID();
      this.draw();
      this.listAnswers = this.genListAnswers(listAnswers);          //une liste d'instances de l'objet Answer
    }
    
    genListAnswers(listAnswers){
      let list=[];
      let heightQ= $('#'+this.id)[0].getBoundingClientRect()['height'];
      let widthQ= $('#'+this.id)[0].getBoundingClientRect()['width'];
      let heightAnswerBox= heightAnswerLabel + sizeAnswerCircle*2 + spaceLabelCircle;
      let space= (scrollHeight - marginTop - heightQ - listAnswers.length*heightAnswerBox)/ (listAnswers.length+1);
      let positionXAnswer= this.position.x + widthQ/2 - sizeAnswerCircle;
    
      let positionXLabel= this.position.x + (widthQ*(1 - percentQuestionAnswer))/2 ;
      let positionYLabel= marginTop + heightQ + space;      
      listAnswers.forEach(element => {
        let positionYAnswer= positionYLabel + heightAnswerLabel + spaceLabelCircle;
        list.push(new Answer(element,this,new Point(positionXAnswer, positionYAnswer)));
        let label= new Label(element,this,new Point(positionXLabel,positionYLabel));
        positionYLabel+= heightAnswerBox + space;
      });
      return list;
    }
    
    draw(){
      $('body').append(`<div class="question" id="${this.id}" style="left:${this.position.x}px;top:${this.position.y}px;width:${widthQuestionElement}px;height:${heightQuestionElement}px;"><span>${this.text}</span></div>`);
    }
  
  }
  
  class Answer {
    constructor(text,question,position){
      this.text=text;
      this.question= question;
      this.position=position;
      this.startPoint= new Point(this.position.x + sizeAnswerCircle*2 -2,this.position.y + sizeAnswerCircle);
      this.endPoint= new Point(this.position.x + 5,this.position.y + sizeAnswerCircle);
      this.id = "answer"+genID();
      this.draw();
    }
    
    draw(){
      $('body').append(`<svg id="${this.id}" class="answer" style="position:absolute;left:${this.position.x}px;top:${this.position.y}px" xmlns="http://www.w3.org/2000/svg"> <circle class="answer-circle not-active" cx="${sizeAnswerCircle}" cy="${sizeAnswerCircle}" r="${sizeAnswerCircle}"  /></svg> `);
    }

  
  }

  class Label {
      constructor(text,question,position){
          this.text= text;
          this.question= question;
          this.position= position;
          this.id= "label"+genID();
          this.draw();
      }

      draw(){
          $('body').append(`<div id="${this.id}" class="answer-label" style="left:${this.position.x}px;top:${this.position.y}px;height:${heightAnswerLabel}px;width:auto;min-width:${widthAnswerLabel}px;"><span>${this.text}</span></div>`);
          let widthLabel= $('#'+this.id)[0].getBoundingClientRect()['width'];
          if(widthLabel > widthAnswerLabel){
            let widthQ= $('#'+this.question.id)[0].getBoundingClientRect()['width'];
            let positionX= this.question.position.x + (widthQ - widthLabel)/2;
            $('#'+this.id).css('left',positionX);
          }
        
        }
  }
  
  class Line{
      constructor(pointSrc,pointDst,color){
          this.pointSrc=pointSrc;                   //le point source de la ligne
          this.pointDst=pointDst;                   //le point destination de la ligne
          this.color=color;                         //la couleur de la ligne
          this.id="line"+genID();
          this.draw();
      }

      draw(){
          drawLine(this.pointSrc.x,this.pointSrc.y,this.pointDst.x,this.pointDst.y,this.color,this.id);
      }

      remove(){
          removeLine(this.id);
      }
  }

  function drawLine(x,y,dx,dy,color,id){
      let line= `<svg class="line-container"><line class="line" id="${id}" x1="${x}" y1="${y}" x2="${dx}" y2="${dy}" style="position:absolute;stroke:${color};stroke-width:${ropeWidth}"/></svg>`; 
      $('body').append(line);

      anime({
          targets: '#'+id,
          strokeDashoffset: [anime.setDashoffset, 0],
          easing: 'easeInCubic',
          duration: durationDrawLine    
      });
  }

  function removeLine(id){
        anime({
            targets: '#'+id,
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'easeInCubic',
            direction: 'reverse',
            duration: durationRemoveLine
        });
        setTimeout(()=> {
            $('#'+id).remove();
            $('#'+id).parent().remove();
        }, durationRemoveLine+100);
      
  }

 
  class Colors{                                       //un objet qui gère l'ensemble de couleurs
    constructor(list){                                //list doit être de la forme [[couleur1,critère1],[couleur2,critère2]....]
        this.listColors= this.genListColor(list);     //une liste d'instances de l'objet Color
        this.draw();
    }

    genListColor(list){
        let myList=[];
        let space= (maxHeight - list.length*sizeColorElement)/(list.length + 1);
        let positionX= marginLeft;
        let positionY= marginTop + heightQuestionElement + paddingQuestionnaireV + space;
        list.forEach(element => {
            myList.push(new Color(element[0],element[1],new Point(positionX,positionY)));
            positionY+= sizeColorElement + space;
        });

        return myList;
    }

    draw(){
        this.listColors.forEach(color => {
            color.draw();
        });
    }

      
  }

  class Color{
      constructor(color,text,position){
          this.color=color;
          this.text=text;
          this.position=position;
          this.id="color"+genID();
      }

      draw(){
          $('body').append(`<div class="color" id="${this.id}" style="left:${this.position.x}px;top:${this.position.y}px;width:${sizeColorElement}px;height:${sizeColorElement}px;background-color:${this.color}"></div>`);
          $('body').append(`<div class="color-label" style="left:${marginLeft*.15}px;top:${this.position.y+sizeColorElement*.2}px;width:${marginLeft*.7}px;height:${sizeColorElement*.6}px;"><span>${this.text}</span></div>`);
        }
  }



  class Rope{
      constructor(questionnaire){
          this.questionnaire= questionnaire;
          this.color=null;
          this.answers=[]; 
          this.lines=[];
          this.addEventClickColors();
      }

      addAnswer(answer){
            let pDst= answer.endPoint;                                                  
            let pSrc = new Point(0,0);
            if (this.answers.length == 0){
                pSrc.x= this.color.position.x + sizeColorElement - 5;   
                pSrc.y= this.color.position.y + sizeColorElement/2 +5;  // le +5 est pour le box shadow
            }
            else{
                let lastAnswer= this.answers[this.answers.length - 1];
                pSrc= lastAnswer.startPoint;
            }

            this.lines.push(new Line(pSrc,pDst,this.color.color));
            this.answers.push(answer);
            if(this.answers.length == this.questionnaire.listQuestions.length){
                setTimeout(()=> {
                    this.addEventSubmit();
                }, durationDrawLine);
            }
        }

        addAnswers(list){
            list.forEach(answer => {
                this.addAnswer(answer);
            });
        }

        removeLastAnswer(){
            if(this.lines.length > 0 && this.answers.length > 0){
                this.answers.length = this.answers.length-1;
                this.lines[this.lines.length - 1].remove();
                this.lines.length = this.lines.length-1;
            }
            
        }

        removeAllAnswers(){
            while (this.answers.length != 0) {
                this.removeLastAnswer();
            } 
        }

        setAnswer(answer){
            //l'index de la question dans la liste des questions
            let indexQuestion= this.questionnaire.listQuestions.indexOf(answer.question);
            
            if(indexQuestion == this.answers.length){
                this.addAnswer(answer);
                if(indexQuestion+1 < this.questionnaire.listQuestions.length){
                    this.activateAnswers(this.questionnaire.listQuestions[indexQuestion+1].listAnswers);
                }
            }
            else if(indexQuestion < this.answers.length && answer.id != this.answers[indexQuestion].id){
                
                let listOherAnswers=[];
                for (let i = this.answers.length-1; i > indexQuestion; i--){    //sauvgarder les autres réponses
                    listOherAnswers.push(this.answers[i]);
                    this.removeLastAnswer();
                }
                this.removeLastAnswer();       //supprimer la réponse à modifier
                setTimeout(()=> {
                    this.addAnswer(answer);     //ajouter le nouvelle réponses
                    this.addAnswers(listOherAnswers.reverse());   //ajouter les autres réponses

                }, durationRemoveLine);
                
            }
            
            
            
        }

        setColor(color){
            this.color=color
            let list= [];
            this.answers.forEach(answer => list.push(answer));
            this.removeAllAnswers();
            this.addAnswers(list);
            
        }

        removeColor(){
            $('#'+this.color.id).removeClass('shadow');
            this.color=null;
            $( "body" ).off( "click", ".answer > circle");
            answersEventActive= false;
        }

        addEventClickColors(){
            $( "body" ).on( "click", ".color", handler );
            let thisObject= this;
            
            function handler(){

                //récupérer d'id de la couleur choisie
                let id=$(this).attr("id");

                //s'il y a déjà une couleur choisi, on lui enlève le shadow
                if(thisObject.color){       
                    $('#'+thisObject.color.id).removeClass('shadow');
                } 

                //mettre à jour la couleur
                let newColor= getElementById(id,thisObject.questionnaire.colors.listColors);
                thisObject.setColor(newColor);
                $('#'+thisObject.color.id).addClass('shadow');

                //animation du click des couleurs
                $( "body" ).off( "click", ".color", handler );
                let duration=100;
                anime({
                    targets: '#'+id,
                    scale: (1.2),
                    duration: duration,   
                    direction: 'alternate',
                    easing: 'easeInOutBack',
                });  
                setTimeout(function () {
                    $( "body" ).on( "click", ".color", handler );
                }, duration*1.7); 

                //activer l'évenement click pour les réponses 
                if(!answersEventActive){
                    thisObject.addEventClickAnswers();
                    thisObject.activateAnswers(thisObject.questionnaire.listQuestions[0].listAnswers);
                    answersEventActive= true;
                }
                    
            }

        }

        addEventClickAnswers(){
            $( "body" ).on( "click", ".answer > circle", handler );
            let thisObject= this;
            
            function handler(){
                $( "body" ).off( "click", ".answer > circle", handler );
                //récupérer d'id de la réponse choisie
                let id=$(this).parent().attr("id");
                
                //liste de toutes les réponses
                let listAnswers= [];
                thisObject.questionnaire.listQuestions.forEach(question => question.listAnswers.forEach(answer => listAnswers.push(answer)));

                //chercher l'objet réponse correspendant
                let answer= getElementById(id,listAnswers);
                thisObject.setAnswer(answer);

                let durration=durationDrawLine;   //par défaut, c'est le temps de dessiner une ligne
                let indexQuestion= thisObject.questionnaire.listQuestions.indexOf(answer.question);
                //si on change une ancienne réponse, on ajoute le temps de supprimer les anciennes lignes 
                if(indexQuestion == thisObject.answers.length){ 
                    durration+= durationRemoveLine;
                }
                setTimeout(function () {
                    $( "body" ).on( "click", ".answer > circle", handler );
                }, durration); 
            }

        }

        sendResults(){   //sendResult envoie le résultat au serveur pour être stocké et renvoie en retour le nouveau résultat (sync)
            let list_question_answer= [];
            this.answers.forEach(answer => list_question_answer.push([answer.question.text, answer.text]));
            $.ajax({
                type:"POST",
                url:'/sendResults',
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify({'list_question_answer':list_question_answer,'color':this.color.text,'id':this.questionnaire.id}),
                // success: ()=>this.questionnaire.updateResults()
            }).fail(printError);  
        }

        addEventSubmit(){
            $('.submit').addClass('submit-active');
            let thisObject=this;
            $( "body" ).on( "click", ".submit-active", submit );

            function submit(){
                thisObject.sendResults();
                
                $( "body" ).off( "click", ".submit-active", submit );
                $('.submit').removeClass('submit-active');
                thisObject.removeAllAnswers();
                // thisObject.questionnaire.showResults();
                thisObject.removeColor();
                thisObject.deactivateAllAnswers();
            }

        }

        activateAnswers(listAnswers){
            
            listAnswers.forEach(answer=>{
                $('#'+answer.id+' > circle').removeClass('not-active');
            });
        }
        deactivateAllAnswers(){
            this.questionnaire.listQuestions.forEach(question=>{
                question.listAnswers.forEach(answer=>{
                    $('#'+answer.id+' > circle').addClass('not-active');
                });
            });
        }

        


  }

  class Point{
      constructor(x,y){
          this.x=x;
          this.y=y;
      }
  }    
  
  function getElementById(id,list){
      let o= null;
      list.forEach(element => {            
          if(element.id == id){
              o= Object.create(element);
          }
      });
      if(!o)  alert('ERROR: element is not in the list !!!');
      return o;
  }

    function genID(){
      return cptID++;
    }

    function printError(error){    //afficher la page d'erreur 
		
		console.error("status: "+error['status']+"\nstatusText: "+error['statusText']);
		$('body').replaceWith(error['responseText']);
		
    }

    /**************************************************************************************************************/

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    $.ajax({
        type:"GET",
        url:"/getQuestionnaireById",
        datatype:"json",
        data:{ id : id , currentTime: new Date().getTime()},
        success: init
    }).fail(printError);          //envoyer un message d'error si la requête a échoué

    function init(questionnaire){       
        var q= new Questionnaire(questionnaire);
    }


    function addAccountElements(id){
        let title= $('.questionnaire')[0]
        let titleInfo= title.getBoundingClientRect();
        $.ajax({
            type:"GET",
            url:"/get_session",
            success: response => {
                session = response;
                if('identifiant' in session)
                    addAdminElements(id,titleInfo['x'],titleInfo['y']);
                else
                    addUserElements(id,titleInfo['x'],titleInfo['y']);
            }
        }).fail(printError);          //envoyer un message d'error si la requête a échoué
    }
    
    function addAdminElements(id,totalSpace,top_margin){

        $('body').append(`<div title="Page d'accueil" class="button home" style="margin-top:${top_margin}px;"><span class="material-icons icon">home</span></div>`);
        $('.home').click(()=>{
            document.location= "/";
        });
        $('body').append(`<div title="Page de statistiques" class="button stats" style="margin-top:${top_margin}px;"><i class="fa fa-bar-chart icon"></i></div>`);
        $('.stats').click(()=>{
            document.location= "stats?id="+id;
        });
        $('body').append(`<div title="Déconnexion" class="button deconnexion" style="margin-top:${top_margin}px;"><i class="fa fa-power-off icon" aria-hidden="true"></i></div>`);
        $('.deconnexion').click(()=>{
            $.ajax({
                type:"GET",
                url:'/deconnexion',
                success: response=>{
                    document.location.reload(true);
                }
            }).fail(printError);
        });

        let width = 59;
        let space= (totalSpace - width*2)/3;
        left= $('.home')[0].getBoundingClientRect()['x']+space;
        $('.home').css('left',left);
        left+= width+ space;
        $('.stats').css('left',left);

        let right= (totalSpace/2) - $('.deconnexion')[0].getBoundingClientRect()['width']/3;
        $('.deconnexion').css('right',right);
        
    }
    
    function addUserElements(id,totalSpace,top_margin){
        $('body').append(`<div title="Connexion" class="button connexion" style="margin-top:${top_margin}px;"><span class="material-icons icon">account_box</span></div>`);
        $('.connexion').click(()=>{
            document.location= "connexion";
        });
        let right= (totalSpace/2) - $('.connexion')[0].getBoundingClientRect()['width']/3;
        $('.connexion').css('right',right);
    }
    
    
  });