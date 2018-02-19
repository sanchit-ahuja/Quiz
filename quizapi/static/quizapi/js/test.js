// var baseurl = 'https://bits-apogee.org/2018/quiz';//baseurl for all requests made
var baseurl = 'http://localhost:8080';//baseurl for all requests made

//status codes for questions - [0=>current,1=>attempted,2=>visited,but not attempted,3=>unvisited]
//update - 0=>current,1=>attempted,2=>unvisited

var ham;

window.addEventListener("load", function(){

    var attemptedQuestions;

    $.ajax({
      type:'GET',
      url: baseurl+'/get_user_profile/',
      complete:function(xhr,textstatus){
        console.log(xhr.responseJSON);
        attemptedQuestions = xhr.responseJSON.questions_solved;
        console.log(attemptedQuestions);
        timeElem = document.getElementsByClassName('time')[0];
        //timeElem.innerHTML='00:00';
        time_total = 1800;
        //time_elapsed = 0;
        function timer() {
          var time = xhr.responseJSON.profile.time_spent;
          var min,sec;
          var timerInterval = setInterval(function() {
            // sec++;
            // if(sec==60)
            // {
            //   time_elapsed++;
            // }
            // sec = sec%60;
            // min = time_elapsed;

            if(time>=time_total || xhr.responseJSON.profile.is_complete){
                alert("Quiz over. Thanks for playing. Click OK to view leaderboard.");
                submit(true);
                clearInterval(timerInterval);
            }

            else{
              time++;

              if(time >= 60){
                min = parseInt(time/60);
                sec = time - (min*60);
              }
              else{
                min = 0;
                sec = time;
              }
              sec = sec.toString();
              min = min.toString();
              if(sec.length<2)
                sec='0'+sec;
              if(min.length<2)
                min='0'+min;
              timeElem.innerHTML=min+':'+sec+' (30:00)';
            }
          }, 1000);

        }
          timer();

          var questions;//object that stores questions with their options and their current status

          function getCookie(name) {
              var cookieValue = null;
             if (document.cookie && document.cookie != '') {
               var cookies = document.cookie.split(';');
               for (var i = 0; i < cookies.length; i++) {
               var cookie = jQuery.trim(cookies[i]);
               // Does this cookie string begin with the name we want?
               if (cookie.substring(0, name.length + 1) == (name + '=')) {
                   cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                   break;
                }
           }
          }
          return cookieValue;
          }

          $.ajax({//request for list of questions
              type:'GET',
              url: baseurl+'/question_list/',
              complete:function(xhr,textstatus){
                questions = xhr.responseJSON.questions;
                var currentQuesNo;

                numberOfQuestions = questions.length;

                var status = [];//statuses of all questions
                for(i=0;i<numberOfQuestions;i++){
                    status[i] = 2;
                }

                hamburger = document.getElementsByClassName('hamburger')[0];
                for(j=0;j<numberOfQuestions;j++){
                      var hamNum = document.createElement("div");
                    hamNum.className = "ham-numbers";
                    hamNum.innerHTML = "Q."+(document.getElementsByClassName('ham-numbers').length+1);
                  hamNum.classList.add('unvisited');

                    hamburger.appendChild(hamNum);
                }

                var respDiv = document.createElement('div');
                respDiv.style.height = "5vh";
                respDiv.style.width = "5vh";
                respDiv.style.position = "absolute";
                respDiv.style.top = "120vh";
                hamburger.appendChild(respDiv);

                for(q=0;q<attemptedQuestions.length;q++){
                  document.getElementsByClassName('ham-numbers')[attemptedQuestions[q].q_no - 1].classList.remove('unvisited');
                  document.getElementsByClassName('ham-numbers')[attemptedQuestions[q].q_no - 1].classList.add('attempted');
              }

              function updateQuestion(){
                 document.getElementsByClassName("question")[0].innerHTML = questions[currentQuesNo-1].text;
                 document.getElementsByClassName("question-number")[0].innerHTML = "Question "+currentQuesNo;
                 // document.getElementsByClassName("type")[0].innerHTML = currentQuesInfo.type;

               }

               //start with question 1
               currentQuesNo = 1;
              updateQuestion();

              $.ajax({
                  type:'GET',
                 url: baseurl+'/question/'+currentQuesNo+'/',
                 complete:function(xhr,textstatus){
                     var choices = xhr.responseJSON.choices;
                     var br = document.createElement('br');
                     document.getElementsByClassName('question')[0].appendChild(br);

                    //  if(questions .img != ""){
                    //           var img = document.createElement('img');
                    //           var br = document.createElement('br');

                    //           img.setAttribute('src',"questions.img");
                    //           img.className = "quesImg";

                    //           document.getElementsByClassName('question')[0].appendChild(img);
                    //           document.getElementsByClassName('question')[0].appendChild(br);
                    //       }


                     if(choices){
                          var formElem = document.createElement('form');
                          formElem.className = "options-form";
                          document.getElementsByClassName('question')[0].appendChild(formElem);

                         for(c=0;c<choices.length;c++){
                             var input = document.createElement('input');
                             input.setAttribute('type','radio');
                             input.setAttribute('value',choices[c].id);
                             input.setAttribute('name','options');

                             var label = document.createElement('label');
                             label.innerHTML = choices[c].c_text;

                             var br = document.createElement('br');

                             formElem.appendChild(input);
                             formElem.appendChild(label);
                             formElem.appendChild(br);
                         }
                     }
                     else{
                      var input = document.createElement('input');
                          input.setAttribute('type','text');
                          input.setAttribute('class','ftb-ans');
                          input.setAttribute('maxlength', '20');
                          input.setAttribute('placeholder','Write your answer here');

                          if(xhr.responseJSON.fillin) input.value = xhr.responseJSON.fillin;

                          document.getElementsByClassName('question')[0].appendChild(input);
                     }
                 },
                 error:function(xhr,textstatus,err){
                  console.log(err);
                 }
              });

              document.getElementsByClassName('ham-numbers')[currentQuesNo-1].classList.add('current');


              function skipQuestion(){
                  if(currentQuesNo == numberOfQuestions){
                      currentQuesNo = 1;
                      document.getElementsByClassName('ham-numbers')[numberOfQuestions-1].classList.remove('current');
                      document.getElementsByClassName('ham-numbers')[numberOfQuestions-1].classList.add('unvisited');
                  }
                  else{
                      currentQuesNo++;
                      document.getElementsByClassName('ham-numbers')[currentQuesNo-2].classList.remove('current');
                      document.getElementsByClassName('ham-numbers')[currentQuesNo-2].classList.add('unvisited');
                  }


                  document.getElementsByClassName('ham-numbers')[currentQuesNo-1].classList.add('current');

                  $.ajax({
                      type:'GET',
                     url: baseurl+'/question/'+currentQuesNo+'/',
                     complete:function(xhr,textstatus){
                         var choices = xhr.responseJSON.choices;
                         var br = document.createElement('br');
                     document.getElementsByClassName('question')[0].appendChild(br);

                        //  if(questions.img != ""){
                        //       var img = document.createElement('img');
                        //       var br = document.createElement('br');

                        //       img.setAttribute('src',"questions.img");
                        //       img.className = "quesImg";

                        //       document.getElementsByClassName('question')[0].appendChild(img);
                        //       document.getElementsByClassName('question')[0].appendChild(br);
                        //   }


                         if(choices){
                              var formElem = document.createElement('form');
                              formElem.className = "options-form";
                              document.getElementsByClassName('question')[0].appendChild(formElem);

                             for(c=0;c<choices.length;c++){
                                 var input = document.createElement('input');
                                 input.setAttribute('type','radio');
                                 input.setAttribute('value',choices[c].id);
                                 input.setAttribute('name','options');

                                 var label = document.createElement('label');
                                 label.innerHTML = choices[c].c_text;

                                 var br = document.createElement('br');

                                 formElem.appendChild(input);
                                 formElem.appendChild(label);
                                 formElem.appendChild(br);
                             }
                             if(xhr.responseJSON.selected){
                                  $('input[value='+xhr.responseJSON.selected.id+']').prop('checked','true');
                              }
                          }
                         else{
                          var input = document.createElement('input');
                          input.setAttribute('type','text');
                          input.setAttribute('class','ftb-ans');
                          input.setAttribute('maxlength', '20');
                          input.setAttribute('placeholder','Write your answer here');

                          if(xhr.responseJSON.fillin) input.value = xhr.responseJSON.fillin;

                          document.getElementsByClassName('question')[0].appendChild(input);
                         }
                     },
                     error:function(xhr,textstatus,err){
                      console.log(err);
                     }
                  });

                  updateQuestion();
              }

              function prevQuestion(){
                  if(currentQuesNo == 1){
                      currentQuesNo = numberOfQuestions;
                      document.getElementsByClassName('ham-numbers')[0].classList.remove('current');
                      document.getElementsByClassName('ham-numbers')[0].classList.add('unvisited');
                  }
                  else{
                      currentQuesNo--;
                      document.getElementsByClassName('ham-numbers')[currentQuesNo].classList.remove('current');
                      document.getElementsByClassName('ham-numbers')[currentQuesNo].classList.add('unvisited');
                  }


                  document.getElementsByClassName('ham-numbers')[currentQuesNo-1].classList.add('current');

                  $.ajax({
                      type:'GET',
                     url: baseurl+'/question/'+currentQuesNo+'/',
                     complete:function(xhr,textstatus){
                         var choices = xhr.responseJSON.choices;
                         var br = document.createElement('br');
                     document.getElementsByClassName('question')[0].appendChild(br);

                        //  if(questions.img != ""){
                        //       var img = document.createElement('img');
                        //       var br = document.createElement('br');

                        //       img.setAttribute('src',"questions.img");
                        //       img.className = "quesImg";

                        //       document.getElementsByClassName('question')[0].appendChild(img);
                        //       document.getElementsByClassName('question')[0].appendChild(br);
                        //   }
                         if(choices){
                          var formElem = document.createElement('form');
                          formElem.className = "options-form";
                          document.getElementsByClassName('question')[0].appendChild(formElem);

                         for(c=0;c<choices.length;c++){
                             var input = document.createElement('input');
                             input.setAttribute('type','radio');
                             input.setAttribute('value',choices[c].id);
                             input.setAttribute('name','options');

                             var label = document.createElement('label');
                             label.innerHTML = choices[c].c_text;

                             var br = document.createElement('br');

                             formElem.appendChild(input);
                             formElem.appendChild(label);
                             formElem.appendChild(br);
                             }
                             if(xhr.responseJSON.selected){
                                  $('input[value='+xhr.responseJSON.selected.id+']').prop('checked','true');
                              }
                          }
                         else{
                          var input = document.createElement('input');
                          input.setAttribute('type','text');
                          input.setAttribute('class','ftb-ans');
                          input.setAttribute('maxlength', '20');
                          input.setAttribute('placeholder','Write your answer here');

                          if(xhr.responseJSON.fillin) input.value = xhr.responseJSON.fillin;

                          document.getElementsByClassName('question')[0].appendChild(input);
                         }
                     },
                     error:function(xhr,textstatus,err){
                      console.log(err);
                     }
                  });

                  updateQuestion();

              }

              function saveQuestion(){
                  var idSubmitQues = questions[currentQuesNo-1].id;
                  var validSubmission = 0;

                  document.getElementsByClassName('ham-numbers')[currentQuesNo-1].classList.add('current');
                  status[currentQuesNo-1] = 1;
                  if($('input[name=options]').length){
                      if($('input[name=options]:checked').length){
                          validSubmission = 1;
                          $.ajax({
                              type:'POST',
                          url: baseurl+'/get_answer/',
                          data:{
                              q_id:questions[currentQuesNo-1].id,
                              c_id:$('input[name=options]:checked')[0].value,
                              csrfmiddlewaretoken:getCookie('csrftoken')
                          },
                          complete:function(xhr,textstatus){
                              console.log(xhr);


                          },
                          error:function(xhr,textstatus,err){
                              console.log(err);
                          }
                          });
                      }
                  }
                  else{
                      if($('.ftb-ans')[0].value != ""){
                          validSubmission = 1;
                          $.ajax({
                              type:'POST',
                          url: baseurl+'/get_answer/',
                          data:{
                              q_id:questions[currentQuesNo-1].id,
                              FIT_ans:$('.ftb-ans')[0].value,
                              csrfmiddlewaretoken:getCookie('csrftoken')
                          },
                          complete:function(xhr,textstatus){
                              console.log(xhr);
                          },
                          error:function(xhr,textstatus,err){
                              console.log(err);
                          }
                          });
                      }
                  }

                  if(validSubmission){
                      if(currentQuesNo == numberOfQuestions){
                          currentQuesNo = 1;
                          document.getElementsByClassName('ham-numbers')[numberOfQuestions-1].classList.remove('current');
                          document.getElementsByClassName('ham-numbers')[numberOfQuestions-1].classList.add('attempted');
                      }
                      else{
                          currentQuesNo++;
                          document.getElementsByClassName('ham-numbers')[currentQuesNo-2].classList.remove('current');
                          document.getElementsByClassName('ham-numbers')[currentQuesNo-2].classList.add('attempted');
                      }
                  }
                  else{
                      if(currentQuesNo == numberOfQuestions){
                          currentQuesNo = 1;
                          document.getElementsByClassName('ham-numbers')[numberOfQuestions-1].classList.remove('current');
                          document.getElementsByClassName('ham-numbers')[numberOfQuestions-1].classList.add('unvisited');
                      }
                      else{
                          currentQuesNo++;
                          document.getElementsByClassName('ham-numbers')[currentQuesNo-2].classList.remove('current');
                          document.getElementsByClassName('ham-numbers')[currentQuesNo-2].classList.add('unvisited');
                      }
                  }


                  $.ajax({
                      type:'GET',
                     url: baseurl+'/question/'+currentQuesNo+'/',
                     complete:function(xhr,textstatus){
                         var choices = xhr.responseJSON.choices;
                         var br = document.createElement('br');
                     document.getElementsByClassName('question')[0].appendChild(br);

                        //  if(questions.img != ""){
                        //       var img = document.createElement('img');
                        //       var br = document.createElement('br');

                        //       img.setAttribute('src',"questions.img");
                        //       img.className = "quesImg";

                        //       document.getElementsByClassName('question')[0].appendChild(img);
                        //       document.getElementsByClassName('question')[0].appendChild(br);
                        //   }
                         if(choices){
                              var formElem = document.createElement('form');
                              formElem.className = "options-form";
                              document.getElementsByClassName('question')[0].appendChild(formElem);

                             for(c=0;c<choices.length;c++){
                                 var input = document.createElement('input');
                                 input.setAttribute('type','radio');
                                 input.setAttribute('value',choices[c].id);
                                 input.setAttribute('name','options');

                                 var label = document.createElement('label');
                                 label.innerHTML = choices[c].c_text;

                                 var br = document.createElement('br');

                                 formElem.appendChild(input);
                                 formElem.appendChild(label);
                                 formElem.appendChild(br);
                             }
                             if(xhr.responseJSON.selected){
                                  $('input[value='+xhr.responseJSON.selected.id+']').prop('checked','true');
                              }
                          }
                         else{
                          var input = document.createElement('input');
                          input.setAttribute('type','text');
                          input.setAttribute('class','ftb-ans');
                          input.setAttribute('maxlength', '20');
                          input.setAttribute('placeholder','Write your answer here');

                          if(xhr.responseJSON.fillin) input.value = xhr.responseJSON.fillin;

                          document.getElementsByClassName('question')[0].appendChild(input);
                         }
                     },
                     error:function(xhr,textstatus,err){
                      console.log(xhr);
                     }
                  });

                  document.getElementsByClassName('ham-numbers')[currentQuesNo-1].classList.add('current');

                  updateQuestion();
              }

              function selectQues(e){


                  document.getElementsByClassName('ham-numbers')[currentQuesNo-1].classList.remove('current');
                  document.getElementsByClassName('ham-numbers')[currentQuesNo-1].classList.add('unvisited');

                  currentQuesNo = Array.from(document.getElementsByClassName("ham-numbers")).indexOf(e.target) + 1;

                  document.getElementsByClassName('ham-numbers')[currentQuesNo-1].classList.add('current');

                  $.ajax({
                      type:'GET',
                     url: baseurl+'/question/'+currentQuesNo+'/',
                     complete:function(xhr,textstatus){

                         var choices = xhr.responseJSON.choices;
                         var br = document.createElement('br');
                     document.getElementsByClassName('question')[0].appendChild(br);

                        //  if(questions.img != ""){
                        //       var img = document.createElement('img');
                        //       var br = document.createElement('br');

                        //       img.setAttribute('src',"questions.img");
                        //       img.className = "quesImg";

                        //       document.getElementsByClassName('question')[0].appendChild(img);
                        //       document.getElementsByClassName('question')[0].appendChild(br);
                        //   }
                         if(choices){
                              var formElem = document.createElement('form');
                              formElem.className = "options-form";
                              document.getElementsByClassName('question')[0].appendChild(formElem);

                             for(c=0;c<choices.length;c++){
                                 var input = document.createElement('input');
                                 input.setAttribute('type','radio');
                                 input.setAttribute('value',choices[c].id);
                                 input.setAttribute('name','options');

                                 var label = document.createElement('label');
                                 label.innerHTML = choices[c].c_text;

                                 var br = document.createElement('br');

                                 formElem.appendChild(input);
                                 formElem.appendChild(label);
                                 formElem.appendChild(br);
                             }

                              if(xhr.responseJSON.selected){
                                  $('input[value='+xhr.responseJSON.selected.id+']').prop('checked','true');
                              }
                          }
                         else{
                          var input = document.createElement('input');
                          input.setAttribute('type','text');
                          input.setAttribute('class','ftb-ans');
                          input.setAttribute('maxlength', '20');
                          input.setAttribute('placeholder','Write your answer here');

                          if(xhr.responseJSON.fillin) input.value = xhr.responseJSON.fillin;

                          document.getElementsByClassName('question')[0].appendChild(input);
                         }
                     },
                     error:function(xhr,textstatus,err){
                      console.log(xhr);
                     }
                  });

                  updateQuestion();
              }

              document.getElementsByClassName('legend-skip')[0].addEventListener('click', skipQuestion);
              document.getElementsByClassName('legend-back')[0].addEventListener('click', prevQuestion);
              document.getElementsByClassName('legend-next')[0].addEventListener('click', saveQuestion);

              for(h=0;h<document.getElementsByClassName('ham-numbers').length;h++){
                  document.getElementsByClassName('ham-numbers')[h].addEventListener('click', selectQues);
              }

              },
              error:function(xhr,textstatus,err){
                console.log(err);
              }
            });

            function logout(){
              var isLogout = confirm("Your answers will be saved, but you will lose the time alloted. Are you sure you want to logout?");

              if(isLogout){
                  $.ajax({
                      type:'GET',
                      url:baseurl+'/logout/',
                      complete:function(xhr,textstatus){
                        console.log(xhr.responseJSON);
                        if(xhr.responseJSON.status == 1) location.href = "https://bits-apogee.org";
                      },
                      error:function(xhr,textstatus,err){
                        console.log(err);
                      }
                    });
              }
              else return false;

            }

            document.getElementsByClassName('quit')[0].addEventListener('click',logout);

            function submit(submitBool){


                if(submitBool){
                  $.ajax({
                      type:'GET',
                      url:baseurl+'/submit/',
                      complete:function(xhr,textstatus){
                          document.getElementsByClassName('leaderboard')[0].style.top = "0";

                          $.ajax({
                              type:'GET',
                              url:baseurl+'/get_leaderboard/',
                              complete:function(xhr,textstatus){
                                  user = xhr.responseJSON.player;
                                  topPlayers = xhr.responseJSON.participants;

                                  document.getElementsByClassName("user-score")[0].innerHTML = "Your score is "+user.score;

                                  for(p=0;p<topPlayers.length;p++){
                                      var tr = document.createElement('tr');
                                      var tdRank = document.createElement('td');
                                      var tdEmail = document.createElement('td');
                                      var tdScore = document.createElement('td');

                                      tdRank.innerHTML = (p+1);
                                      tdEmail.innerHTML = topPlayers[p].email;
                                      tdScore.innerHTML = topPlayers[p].score;

                                      tr.appendChild(tdRank);
                                      tr.appendChild(tdEmail);
                                      tr.appendChild(tdScore);
                                      document.getElementsByClassName("ld-table")[0].appendChild(tr);
                                  }
                              },
                              error:function(xhr,textstatus,err){
                                  console.log(err);
                              }
                          })
                      },
                      error:function(xhr,textstatus,err){
                        console.log(err);
                      }
                    });
                }
                else return false;
              }

              document.getElementsByClassName('s')[0].addEventListener('click', function(){
                  var isSubmit = confirm("Your answers will be submitted and you won't be allowed to make any further changes. Are you sure you want to submit your answers and leave the quiz?")
                  submit(isSubmit);
              });

              document.getElementsByClassName('ld-logout')[0].addEventListener('click', function(){
                  $.ajax({
                      type:'GET',
                      url:baseurl+'/logout/',
                      complete:function(xhr,textstatus){
                        if(xhr.responseJSON.status == 1) location.href = "https://bits-apogee.org";
                      },
                      error:function(xhr,textstatus,err){
                        console.log(err);
                      }
                    });
              });
      },
      error:function(xhr,textstatus,err){
        console.log(err);
      }
    });


}, null);



function begin(){
	document.getElementsByClassName("main")[0].style.top = "0vh";
}

var flag=0;
ham = function(){
	if(flag==0){
      var i,j;
			document.getElementsByClassName("hamburger")[0].style.right = "0vw";
			document.getElementsByClassName("img")[0].style.transform = "rotateY(180deg)";
      document.getElementsByClassName("back")[0].style.right = "70%";
      setTimeout(function() {
        for(i=0;i<document.getElementsByClassName("ham-numbers").length;i++){
          document.getElementsByClassName("ham-numbers")[i].style.height = "30px";
          document.getElementsByClassName("ham-numbers")[i].style.width = "30px";
          document.getElementsByClassName("ham-numbers")[i].style.opacity = "1";
          document.getElementsByClassName("ham-numbers")[i].style.margin = "4px";
          document.getElementsByClassName("ham-numbers")[i].style.lineHeight = "30px";
        }
      }, 400);
      flag=1;
		}

	else{
		document.getElementsByClassName("hamburger")[0].style.right = "-70vw";
		document.getElementsByClassName("img")[0].style.transform = "rotateY(0deg)";
    document.getElementsByClassName("back")[0].style.right = "0%";

    setTimeout(function () {
        for(j=0;j<document.getElementsByClassName("ham-numbers").length;j++){
          document.getElementsByClassName("ham-numbers")[j].style.height = "0px";
          document.getElementsByClassName("ham-numbers")[j].style.width = "0px";
          document.getElementsByClassName("ham-numbers")[j].style.opacity = "0";
          document.getElementsByClassName("ham-numbers")[j].style.margin = "25px";
        }
      }, 300);
		flag=0;
	}
}

document.getElementsByClassName("back")[0].addEventListener("click" , ham);

  //function to clear options (backend remaining)
//   function clear(){
//   if(document.getElementsByName("options"))
//   for(i=0;i<document.getElementsByName("options").length;i++)
//     document.getElementsByName("options")[i].checked = false;

//   if(document.getElementsByClassName("ftb-ans"))
//   for(i=0;i<document.getElementsByClassName("ftb-ans").length;i++)
//     document.getElementsByClassName("ftb-ans")[i].value = "";

// }
