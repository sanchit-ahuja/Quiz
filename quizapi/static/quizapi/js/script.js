// //code for logic starts here


function onSignIn(googleUser) {
  // $.ajax({
  //   type:'POST',
  //   url: baseurl+'/quiz/authenticate/',
  //   contentType:'application/x-www-form-urlencoded;charset=UTF-8',
  //   data:{
  //     id_token:googleUser.getAuthResponse().id_token
  //   },
  //   complete:function(xhr,textstatus){
  //     console.log(xhr);
  //   },
  //   error:function(xhr,textstatus,err){
  //     console.log(err);
  //   }
  // });

  document.getElementById('temp-input').value = googleUser.getAuthResponse().id_token;
  document.myform.submit();
}


// //status codes for questions - [0=>current,1=>attempted,2=>visited,but not attempted,3=>unvisited]
// // window.onload = function(){//request sent everytime the page loads
// //   $.ajax({
// //     type:'POST',
// //     url: baseurl+'/quiz/update_timer/',
// //     data:{
// //       time:800
// //     },
// //     complete:function(xhr,textstatus){
// //       console.log(xhr);
// //     },
// //     error:function(xhr,textstatus,err){
// //       console.log(err);
// //     }
// //   });
// // }

// // $.ajax({//request being used for login of the user
// //   type:'POST',
// //   url: baseurl+'/quiz/',
// //   data:{
// //     id_token:123
// //   },
// //   complete:function(xhr,textstatus){
// //     console.log(xhr);
// //   },
// //   error:function(xhr,textstatus,err){
// //     console.log(err);
// //   }
// // });

// // $.ajax({//request for list of questions
// //   type:'GET',
// //   url: baseurl+'/quiz/question_list/',
// //   complete:function(xhr,textstatus){
// //     console.log(xhr);
// //   },
// //   error:function(xhr,textstatus,err){
// //     console.log(err);
// //   }
// // });



// // $.ajax({
// //   type:'GET',
// //   url: baseurl+'/quiz/',
// //   complete:function(xhr,textstatus){
// //     console.log(xhr);
// //   },
// //   error:function(xhr,textstatus,err){
// //     console.log(err);
// //   }
// // });

// var questions = [];//object that stores questions with their options and their current status

// var numberOfQuestions = questions.length;

// var typesOfQuestion = [];

// for(i=0;i<numberOfQuestions;i++){//filling the typesOfQuestion array
//   if(typesOfQuestion.indexOf(questions[i].type)<0) typesOfQuestion[typesOfQuestion.length] = questions[i].type;
// }

// var currentQuesNo;//keeps track of the current question number

// var prevQuesStatus = 0;//keeps track of the status of question on which the user was before he clicked a new question => status of current question before its status became "current"

// //creating elements in hamburger
// var hamburger = document.getElementsByClassName("hamburger")[0];
// var quesInHam = [];//array that holds the index of questions that have been added to the ham

// for(i=0;i<typesOfQuestion.length;i++){
//   var hamType = document.createElement("div");
//   hamType.className = "ham-type";

//   var hamTypeText = document.createElement("span");
//   hamTypeText.className = "ham-type-text";
//   hamTypeText.innerHTML = typesOfQuestion[i];

//   hamburger.appendChild(hamType);
//   hamType.appendChild(hamTypeText);

//   for(j=0;j<numberOfQuestions;j++){
//     if(quesInHam.indexOf(j)<0 && questions[j].type == typesOfQuestion[i]){
//       var hamNum = document.createElement("div");
//       hamNum.className = "ham-numbers";
//       hamNum.innerHTML = "Q."+(quesInHam.length+1);

//       switch(questions[j].status){
//         case 0: hamNum.classList.add('current');
//             currentQuesNo = quesInHam.length+1;
//           break;
//         case 1: hamNum.classList.add('attempted');
//           break;
//         case 2: hamNum.classList.add('visited');
//           break;
//         case 3: hamNum.classList.add('unvisited');
//           break;
//       }

//       hamType.appendChild(hamNum);

//       quesInHam[quesInHam.length] = j;
//     }
//   }
// }

// // function updateQuestion(){
// //   currentQuesInfo = questions[quesInHam[currentQuesNo-1]];

// //   document.getElementsByClassName("question")[0].innerHTML = currentQuesInfo.statement;
// //   document.getElementsByClassName("question-number")[0].innerHTML = "Question "+currentQuesNo;
// //   document.getElementsByClassName("type")[0].innerHTML = currentQuesInfo.type;
// // }

// // window.onload = updateQuestion;

// // function nextQuestion(){


// //   updateQuestion();
// // }

// // function prevQuestion(){//goes to previous question without saving the current selected option
// //   if(prevQuesStatus == 0 || prevQuesStatus == 2 || prevQuesStatus == 3){
// //     questions[quesInHam[currentQuesNo-1]].status = 2;
// //     document.getElementsByClassName("ham-numbers")[currentQuesNo-1].className = "ham-numbers visited";
// //   }
// //   else{
// //     questions[quesInHam[currentQuesNo-1]].status = 1;
// //     document.getElementsByClassName("ham-numbers")[currentQuesNo-1].className = "ham-numbers attempted";
// //   }

// //   var quesNoPrev = currentQuesNo - 1;

// //   if(quesNoPrev < 1) quesNoPrev = numberOfQuestions;

// //   var initialStatusOfPrev = questions[quesInHam[quesNoPrev-1]].status;

// //   prevQuesStatus = initialStatusOfPrev;
// //   currentQuesNo = quesNoPrev;
// //   questions[quesInHam[currentQuesNo-1]].status = 0;
// //   document.getElementsByClassName("ham-numbers")[currentQuesNo-1].className = "ham-numbers current";

// //   updateQuestion();
// // }

// // function skipQuestion(){//skip the current question irrespective of whether an option is selected or not
// //   if(prevQuesStatus == 0 || prevQuesStatus == 2 || prevQuesStatus == 3){
// //     questions[quesInHam[currentQuesNo-1]].status = 2;
// //     document.getElementsByClassName("ham-numbers")[currentQuesNo-1].className = "ham-numbers visited";
// //   }
// //   else{
// //     questions[quesInHam[currentQuesNo-1]].status = 1;
// //     document.getElementsByClassName("ham-numbers")[currentQuesNo-1].className = "ham-numbers attempted";
// //   }

// //   var quesNoNext = currentQuesNo + 1;

// //   if(quesNoNext > numberOfQuestions) quesNoNext = 1;

// //   var initialStatusOfNext = questions[quesInHam[quesNoNext-1]].status;

// //   prevQuesStatus = initialStatusOfNext;
// //   currentQuesNo = quesNoNext;
// //   questions[quesInHam[currentQuesNo-1]].status = 0;
// //   document.getElementsByClassName("ham-numbers")[currentQuesNo-1].className = "ham-numbers current";

// //   updateQuestion();
// // }

// // function goToQuesNo(e){//goes to selected question number without saving the current selected option
// //   if(prevQuesStatus == 0 || prevQuesStatus == 2 || prevQuesStatus == 3){
// //     questions[quesInHam[currentQuesNo-1]].status = 2;
// //     document.getElementsByClassName("ham-numbers")[currentQuesNo-1].className = "ham-numbers visited";
// //   }
// //   else{
// //     questions[quesInHam[currentQuesNo-1]].status = 1;
// //     document.getElementsByClassName("ham-numbers")[currentQuesNo-1].className = "ham-numbers attempted";
// //   }

// //   var quesNoClicked = Array.from(document.getElementsByClassName("ham-numbers")).indexOf(e.target) + 1;
// //   var initialStatusOfClicked = questions[quesInHam[quesNoClicked-1]].status;

// //   prevQuesStatus = initialStatusOfClicked;
// //   currentQuesNo = quesNoClicked;
// //   questions[quesInHam[currentQuesNo-1]].status = 0;
// //   document.getElementsByClassName("ham-numbers")[currentQuesNo-1].className = "ham-numbers current";

// //   updateQuestion();
// // }

// // for(i=0;i<numberOfQuestions;i++){
// //   document.getElementsByClassName("ham-numbers")[i].addEventListener("click", goToQuesNo);
// // }

// //code for logic ends here

// // function begin(){
// // 	document.getElementsByClassName("main")[0].style.top = "0vh";
// // }

// var c=0;
// function ham(){
// 	if(c==0){
// 			document.getElementsByClassName("hamburger")[0].style.right = "0vw";
// 			document.getElementsByClassName("img")[0].style.transform = "rotateY(180deg)";
//       document.getElementsByClassName("back")[0].style.right = "70%";
//       setTimeout(function() {
//         for(i=0;i<48;i++){
//           document.getElementsByClassName("ham-numbers")[i].style.height = "30px";
//           document.getElementsByClassName("ham-numbers")[i].style.width = "30px";
//           document.getElementsByClassName("ham-numbers")[i].style.opacity = "1";
//           document.getElementsByClassName("ham-numbers")[i].style.margin = "10px";
//         }
//       }, 400);
//       c=1;
// 		}

// 	else{
// 		document.getElementsByClassName("hamburger")[0].style.right = "-70vw";
// 		document.getElementsByClassName("img")[0].style.transform = "rotateY(0deg)";
//     document.getElementsByClassName("back")[0].style.right = "0%";

//     setTimeout(function () {
//         for(j=0;j<48;j++){
//           document.getElementsByClassName("ham-numbers")[j].style.height = "0px";
//           document.getElementsByClassName("ham-numbers")[j].style.width = "0px";
//           document.getElementsByClassName("ham-numbers")[j].style.opacity = "0";
//           document.getElementsByClassName("ham-numbers")[j].style.margin = "25px";
//         }
//       }, 300);
// 		c=0;
// 	}
// }

//   time = document.getElementsByClassName('time')[0];
//   time.innerHTML='00:00';
//   time_total = 60;
//   time_elapsed = 0;
//   function timer() {
//   	sec = 0;
//   	min = 0;
//   	setInterval(function() {
//   		sec++;
//   		if(sec==60)
//   		{
//   			time_elapsed++;
//   		}
//   		sec = sec%60;
//   		min = time_elapsed;
//   		sec = sec.toString();
//   		min = min.toString();
//   		if(sec.length<2)
//   			sec='0'+sec;
//   		if(min.length<2)
//   			min='0'+min;
//   		time.innerHTML=min+':'+sec;
//   		sec=parseInt(sec);
//   		min=parseInt(min);
//       if(min==time_total)
//         alert("time up")
//   	}, 1000);
//   }

// document.getElementsByClassName("begin-button")[0].addEventListener("click", begin);
// //document.getElementsByClassName("begin-button")[0].addEventListener("click", timer);
// document.getElementsByClassName("back")[0].addEventListener("click", ham);
