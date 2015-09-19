var app = angular.module('roast',['ngRoute']);


app.config(function($routeProvider,$locationProvider) {
        $routeProvider

            // route for the home page
            .when('/roast/:id', {
                templateUrl : '../views/roastPage.html',
                controller  : 'roastPageController'
            })
            
            .when('/', {
                templateUrl : '../views/roastTrending.html',
                controller  : 'roastTrendingController'
            })
            .when('/create', {
                templateUrl : '../views/roastCreate.html',
                controller  : 'roastCreateController'
            })
            .when('/roastList', {
                templateUrl : '../views/roastList.html',
                controller  : 'roastListController'
            })
            .when('/QandA/:id', {
                templateUrl : '../views/QandApage.html',
                controller  : 'QandApageController'
            })
            .when('/QandAlist', {
                templateUrl : '../views/QandAlist.html',
                controller  : 'QandAlistController'
            })
            .when('/replies/:id', {
                templateUrl : '../views/replyComments.html',
                controller  : 'replyCommentController'
            })
            .when('/repliesR/:id', {
                templateUrl : '../views/replyCommentsR.html',
                controller  : 'roastCommentController'
            })
            .when('/404', {
                templateUrl : 'views/404.html',
                controller  : 'errorController'
            })
            .when('/userInfo', {
                templateUrl : '/views/loadingUserData.html',
                controller : 'loadingDataController'
            })
            .otherwise({redirectTo:'/404'});
            
            $locationProvider.html5Mode(true);

        });


app.controller('roastIndexController', function($scope,$http,$location){

            $scope.goToCreate = function(){
                $location.path('/create');
                window.scrollTo(0,0);
                $scope.showToolBox();
            };
            $scope.goToTrending = function(){
                $location.path('/');
                window.scrollTo(0,0);
                $scope.showToolBox();
            };
            $scope.goToHome = function(){
                $location.path('/home');
                window.scrollTo(0,0);
                $scope.showToolBox();
            }
            $scope.goToRoasts = function(){
                $location.path('/roastList');
                window.scrollTo(0,0);
                $scope.showToolBox();
            }
            $scope.goToQnAPage = function(){
                $location.path('/QandAlist');
                window.scrollTo(0,0);
                $scope.showToolBox();
            }
            $scope.toolBoxActive = true;
            $scope.showToolBox = function () {
                $scope.toolBoxActive = !$scope.toolBoxActive;
            }
            $scope.hideToolBox = function(){
                $scope.toolBoxActive = true;
            }

            // code for social sharing

            me = this;
            me.coolWord = 'shizzlemnah';
            me.alert = function (message) {
                window.alert(message);
            };

            // code for custom modal
            $scope.modalOpen = false;
            
            $scope.loginModal = function(){
                   $scope.modalOpen = !$scope.modalOpen;
            }
            $scope.cancelModal = function(){
                $scope.modalOpen = false;
            }

            $scope.GoToGoogleLogin = function () {
                var googleLoginForm = document.forms.googleLogin;
                googleLoginForm.submit();
            }


            // code for getting user profile pic

            //if($scope.userName === null || $scope.userName === '' || angular.isUndefined($scope.userName)){
                           
            //}
            $scope.getMemberData = function(){
                $http.get('/memberData').success(function(data){
                    console.log(data);
                    if(data.length === 0){
                        $scope.getMemberData();
                    }
                    else if (data === '"NotLoggedIn"'){
                        $scope.isLoggedin = false;
                        $scope.imgUserBig = '/images/user.jpg'; 
                    }else{
                        $scope.isLoggedin = true;
                        $scope.userName = data[0].name;
                        $scope.email = data[0].email;
                        $scope.imgUserBig = data[0].imgUrlLg;
                        $scope.imgUserSmall = data[0].imgUrlXs;
                    }
                }).error(function(data){
                    console.log(data);
                })
            }

            $scope.getMemberData();            

            $scope.logout = function(){
                $scope.isLoggedin = false;
                $scope.userName = null;
                $scope.imgUserBig = '/images/user.jpg';
                $scope.imgUserSmall = null;
            }


    });




app.controller('QandApageController', function ($scope,$http,$routeParams,$location,$interval) {


    $scope.postBlockActive = false;
    $scope.appreciated = false;
    $scope.appriValue = 'Appreciate';
    $scope.postAreply = false;
    $scope.appri = {};
    $scope.comment = {};
    $scope.newDataQ = {};
    $scope.repliesQ = {};
    $scope.hideTextArea = function () {
        $scope.postBlockActive = false;
        $scope.postAreply = false;
        $scope.comment.comment = null;
        $scope.editBox = false;
        $scope.editBoxQ = false;
        $scope.comment.anonymous = null;
    }
    $scope.showTextArea = function () {
        $scope.postBlockActive = true;
        //$scope.comment.anonymous = $scope.comment.anonymous;
        if($scope.userName === null || $scope.userName === '' || angular.isUndefined($scope.userName)){
            $scope.anony = true;
            $scope.comment.anonymous = 'Y';
            console.log('its working');
        }else{
            $scope.comment.name = $scope.userName;
            $scope.repliesQ.name = $scope.userName;
            $scope.comment.email = $scope.email;
            $scope.repliesQ.email = $scope.email;
            $scope.repliesQ.imgUrl = $scope.imgUserSmall;
            $scope.comment.imgUrl = $scope.imgUserSmall;
            $scope.anony = false;
        }
    }


    $scope.goToRepliesQ = function(qna){
        var replyPath = '/replies/' + $scope.questions.slug + qna._id;
        console.log(replyPath);
        $location.path(replyPath);
        window.scrollTo(0,0);
    }
    
    $scope.replyQ = function(qna){
        $scope.postBlockActive = true;
        $scope.postAreply = true;
        $scope.repliesQ.id = qna._id;
        $scope.repliesQ.name = 'Anonymous';
    }

    $scope.editBox = false;
    $scope.editBoxQ = false;
    $scope.commentObj = {};
    $scope.questionObj = {};
    $scope.editQComment = function(value){
        if(value.email === $scope.email){
            $scope.editBox = true;
            $scope.showTextArea();
            $scope.comment.comment = value.comment;
            console.log(value);
            $scope.commentObj.id = value._id;
        }
    };

    $scope.updateQcomment = function(){
        $scope.commentObj.comment = $scope.comment.comment;
        var commentID = '/editQComment/' + $routeParams.id;
        $http.post(commentID, $scope.commentObj).success(function(data){
            $scope.hideTextArea();
            $scope.fetchComments();
        }).error(function(data){

        })
    }

    $scope.editQuestion = function(value){
        if(value.email === $scope.email){
            $scope.editBoxQ = true;
            $scope.showTextArea();
            $scope.comment.comment = $scope.questions.question;
            $scope.questionObj.slug = $scope.questions.slug;
            $scope.questionObj.id = $scope.questions._id;
            $scope.questionObj.debate = $scope.questions.debate;
        }
    };

    $scope.updateQuestion = function(){
        $scope.questionObj.question = $scope.comment.comment;
        var questionID = '/editQuestion/' + $routeParams.id;
        $http.post(questionID, $scope.questionObj).success(function(data){
            $scope.hideTextArea();
            console.log(data);
            $scope.getQuestion();
        }).error(function(data){

        })
    }

    $scope.calcVote = function(){

        $scope.yesVotes = $scope.questions.yes;
        $scope.noVotes = $scope.questions.no;
        $scope.TotalVotes = $scope.yesVotes + $scope.noVotes;
            
        var yPercent = ($scope.yesVotes/$scope.TotalVotes)*100,
            nPercent = ($scope.noVotes/$scope.TotalVotes)*100;
        $scope.yRoundOff = Math.round(yPercent);
        $scope.nRoundOff = Math.round(nPercent);
    }

    // for getting debate title

    $scope.showVoteBlock = true;

    var debateID = '/debateTitle/' + $routeParams.id;
    $scope.getQuestion = function(){
        $http.get(debateID).success(function(data){
            console.log(data[0]);
            $scope.questions = data[0];

            if ($scope.questions.debate === "Y") {
                $scope.calcVote();
            }
            else{$scope.showVoteBlock = false;}

        }).error(function(data){
            console.log(data);
        });
    };
    $scope.getQuestion();

    $scope.goToCreateQ = function(){
        window.scrollTo(1000,1000);
        $location.path('/create');
    }

    $scope.voteObject = {};
    $scope.voteObject.id = $routeParams.id;

    $scope.vote = function(){

        $http.post('/vote', $scope.voteObject).success(function(data){
            console.log(data);
        }).error(function(data){

        })
    };

        var questionID = $routeParams.id;

        $scope.votedY = function(value){
            $scope.voteObject.value = 'Y';
            $scope.showVotes = true;
            window.localStorage[ questionID ] = 'true';
            $scope.yesVotes = $scope.questions.yes + 1;
            $scope.calcVote();
            $scope.vote();
            console.log()
        };
        $scope.votedN = function(value){
            $scope.voteObject.value = 'N';
            $scope.showVotes = true;
            window.localStorage[ questionID ] = 'true';
            $scope.noVotes = $scope.questions.no + 1;
            $scope.calcVote();
            $scope.vote();
        };

        if(window.localStorage[ questionID ] === 'true'){
            $scope.showVotes = true;
            console.log("its true localstorage")
        }


    $scope.comment.id = $routeParams.id;

    $scope.fetchComments = function(){
        console.log('intervals running');

        var commentID = '/debateComments/' + $routeParams.id;

            $http.get(commentID).success(function(data){
                $scope.QandA = data;
                if (data.length === 1){
                    $scope.newDataQ.oldDate = data[0].createdOn;
                }else if (data.length > 1){
                    $scope.newDataQ.oldDate = data[data.length - 1].createdOn;
                }
            }).error(function(data){

            });
    };

    $scope.fetchComments();

    // for fetching comments on regular intervals

    $scope.newCommentsQ = function (){
        console.log('new comments');
        $scope.newDataQ.id = $routeParams.id;
        $http.post('/newQcomments', $scope.newDataQ).success(function(data){

            if (data.length === 1){
                $scope.newDataQ.oldDate = data[0].createdOn;
            }else if (data.length > 1){
                $scope.newDataQ.oldDate = data[data.length - 1].createdOn;
            }

             angular.forEach( data, function( item ) {
                $scope.QandA.push( item )
            });
        }).error(function(data){

        })
    };
    
    $scope.stopPromise = $interval($scope.newCommentsQ, 10000);
    
    $scope.$on('$routeChangeStart', function(){
        console.log( 'Route Change Start' );
        $interval.cancel($scope.stopPromise);
   })

    // for posting comment

    $scope.qCommentChar = 2000;

    $scope.$watch('comment.comment', function() {
        if(angular.isDefined($scope.comment.comment)){
           $scope.qCommentChar = 2000 - $scope.comment.comment.length;
           if ($scope.qCommentChar === 0) {
                $scope.qCommentChar = 0;
           };
       };
    });

    var valid = null;

    $scope.post = function(){

        if ($scope.comment.comment === null || $scope.comment.comment === "" || angular.isUndefined($scope.comment.comment)) {
                valid = false
            }else{valid = true};

        if(valid === true){
            
            $scope.btnDisable = true;
            if ($scope.postAreply === false){
                console.log($scope.comment.anonymous);
                $http.post('/debateComment', $scope.comment).success(function(data){

                    if(data === '"failure"'){
                        window.alert('Bakchodi Nahi');
                    }else{
                        $scope.fetchComments();
                        $scope.hideTextArea();
                        $scope.comment.comment = null;
                        $scope.btnDisable = false;
                    }

                }).error(function(data){
                    if(data === '"failure"'){
                        window.alert('Bakchodi Nahi');
                    }
                });
            }else{
                $scope.repliesQ.anonymous = $scope.comment.anonymous;
                console.log($scope.comment.anonymous);
                $scope.repliesQ.comment = $scope.comment.comment;
                var debateID = '/debateReply/' + $routeParams.id;
                $http.post(debateID, $scope.repliesQ).success(function(data){
                    
                    if(data === '"failure"'){
                        window.alert('Bakchodi Nahi');
                    }else{
                        window.scrollTo(0,0);
                        $location.path('/replies/' + $routeParams.id + $scope.repliesQ.id);
                    }

                }).error(function(data){
                    if(data === '"failure"'){ 
                        window.alert('Bakchodi Nahi');
                    }
                });
            }
        };
    }   
   
});




app.controller('roastPageController', function ($scope,$http,$location,$routeParams,$interval){

    var roastID = '/roastTitle/' + $routeParams.id;

    $http.get(roastID).success(function(data){
        $scope.roastTitle = data[0];
    }).error(function(data){
        console.log(data);
    });

    $scope.roast = {};
    $scope.newDataR = {};
    $scope.repliesR = {};
    $scope.postBlockActive = false;
    $scope.appreciated = false;
    $scope.postR = false;
    $scope.appriValue = 'Appreciate';
    $scope.hideTextArea = function () {
        $scope.postBlockActive = false;
        $scope.rComment.comment = null;
        $scope.postR = false;
        $scope.rComment.anonymous = null;
    }
    $scope.showTextArea = function () {
        $scope.postBlockActive = true;
        if($scope.userName === null || $scope.userName === '' || angular.isUndefined($scope.userName)){
            $scope.anony = true;
            $scope.rComment.anonymous = 'Y';
            console.log('its working');
        }else{
            $scope.rComment.name = $scope.userName;
            $scope.repliesR.name = $scope.userName;
            $scope.rComment.email = $scope.email;
            $scope.repliesR.email = $scope.email;
            $scope.repliesR.imgUrl = $scope.imgUserSmall;
            $scope.rComment.imgUrl = $scope.imgUserSmall;
            $scope.anony = false;
        }
    }
    
    /*$scope.anonyClicked = function (value) {
        console.log(value);
    }

    $scope.postBlockActive = false;
    $scope.textFocus = function () {
        $scope.postBlkActv = true;
    };*/

    $scope.goToRepliesR = function(qna){
        var replyPath = '/repliesR/' + $scope.roastTitle.slug + qna._id;
        console.log(replyPath);
        $location.path(replyPath);
        window.scrollTo(0,0);
    }

    $scope.replyR = function(value){
        $scope.postBlockActive = true;
        $scope.postR = true;
        $scope.repliesR.id = value._id;
        $scope.repliesR.name = 'Anonymous';
    }


    $scope.editBox = false;
    $scope.roastObj = {};

    $scope.editRComment = function(value){
        $scope.editBox = true;
        $scope.showTextArea();
        $scope.rComment.comment = value.comment;
        console.log(value);
        $scope.roastObj.id = value._id;
    };

    $scope.btnDisable = false;
    $scope.updateRcomment = function(){
        $scope.btnDisable = true;
        $scope.roastObj.comment = $scope.rComment.comment;
        var commentID = '/editRComment/' + $routeParams.id;
        $http.post(commentID, $scope.roastObj).success(function(data){
            $scope.hideTextArea();
            $scope.fetchRComments();
            $scope.btnDisable = false;
        }).error(function(data){

        })
    }

    var commentID = '/roastComments/' + $routeParams.id;

    $scope.fetchRComments = function(){
        $http.get(commentID).success(function(data){
            
            $scope.roasts = data;

            if (data.length === 1){
                $scope.newDataR.oldDate = data[0].createdOn;
            }else if (data.length > 1){
                $scope.newDataR.oldDate = data[data.length - 1].createdOn;
            }

        }).error(function(data){

        });
    };

    $scope.fetchRComments();

    // for fetching comments on regular intervals

    var newCommentsR = function (){
        console.log('new comments');
        $scope.newDataR.id = $routeParams.id;
        $http.post('/newRcomments', $scope.newDataR).success(function(data){

            if (data.length === 1){
                $scope.newDataR.oldDate = data[0].createdOn;
            }else if (data.length > 1){
                $scope.newDataR.oldDate = data[data.length - 1].createdOn;
            }

            angular.forEach( data, function( item ) {
                $scope.roasts.push( item )
            });
        }).error(function(data){

        })
    };

   $scope.stopPromise = $interval(newCommentsR, 10000);

   $scope.$on('$routeChangeStart', function(){
        $interval.cancel($scope.stopPromise);
   })


    $scope.rComment = {};
    
    if($scope.userName === null || $scope.userName === '' || angular.isUndefined($scope.userName)){
        $scope.rComment.name = 'Anonymous';
        $scope.rComment.imgUrl = '../images/user.png';
    }else{
        $scope.rComment.name = $scope.userName;
        $scope.repliesR.imgUrl = $scope.imgUserSmall;
        $scope.rComment.imgUrl = $scope.imgUserSmall;
    }
    $scope.rComment.id = $routeParams.id;

    $scope.rCommentChar = 2000;

    $scope.$watch('rComment.comment', function() {
        if(angular.isDefined($scope.rComment.comment)){
           $scope.rCommentChar = 2000 - $scope.rComment.comment.length;
           if ($scope.rCommentChar === 0) {
                $scope.rCommentChar = 0;
           };
       };
    });

    var valid = null;

    $scope.postRComment = function(){

        console.log($scope.postR);
    
        if ($scope.rComment.comment === null || $scope.rComment.comment === "" || angular.isUndefined($scope.rComment.comment)) {
                valid = false
        }else{valid = true};

        if (valid === true){

            $scope.btnDisable = true;
            if ($scope.postR === false){

                console.log('comments clicked');
                $http.post('/roastComment', $scope.rComment).success(function(data){

                    if(data === '"failure"'){
                        window.alert('Bakchodi Nahi');
                    }else{
                        newCommentsR();
                        $scope.hideTextArea();
                        $scope.rComment.comment = null;
                        $scope.btnDisable = false;
                    };

                }).error(function(data){
                    if(data === '"failure"'){
                        window.alert('Bakchodi Nahi');
                    }
                });
            }else{
                    $scope.repliesR.comment = $scope.rComment.comment;
                    $scope.repliesR.anonymous = $scope.rComment.anonymous;
                    var debateID = '/roastReply/' + $routeParams.id;
                    $http.post(debateID, $scope.repliesR).success(function(data){
                        
                        if(data === '"failure"'){
                            window.alert('Bakchodi Nahi');
                        }else{
                            window.scrollTo(0,0);
                            $location.path('/repliesR/' + $routeParams.id + $scope.repliesR.id);
                        }

                    }).error(function(data){
                        if(data === '"failure"'){ 
                            window.alert('Bakchodi Nahi');
                        }
                    });
            }
        };
    };

});

app.controller('roastTrendingController', function($scope,$location,$http,$routeParams){

    $http.get('/trendingDebates').success(function(data){
        console.log(data[0]);
        $scope.questions = data;

    }).error(function(data){
        console.log(data);
    })

    $http.get('/trendingRoasts').success(function(data){
        console.log(data[0]);
        $scope.trending = data;

    }).error(function(data){
        console.log(data);
    });

    $scope.goToRoast = function(trends){
         window.scrollTo(0,0);
         console.log(trends);
         var roastID = '/roast/' + trends.slug; 
        $location.path(roastID);
    }

    $scope.goToDebate = function(question){

        window.scrollTo(0,0);
        var debateID = '/QandA/' + question.slug;
        
        $location.path(debateID);
    }

});


app.controller('roastCreateController', function($scope,$http,$location,$routeParams){

    console.log("trending page");

    $scope.roast = {};
    $scope.debate = {};
    $scope.debate.yes = 1;
    $scope.debate.no = 1;
    $scope.debate.createdOn = new Date();
    $scope.nameChar = 50;
    $scope.descChar = 150;
    $scope.qDescChar = 300;
    $scope.qChar1 = 150;
    $scope.qChar2 = 150;
    $scope.btnDisable1 = false;
    $scope.btnDisable2 = false;

    $scope.$watch('roast.name', function() {
        if(angular.isDefined($scope.roast.name)){
           $scope.nameChar = 50 - $scope.roast.name.length;
           if ($scope.nameChar === 0) {
                $scope.nameChar = 0;
           };
       };
    });
    $scope.$watch('roast.quote', function() {
        if(angular.isDefined($scope.roast.quote)){
           $scope.descChar = 150 - $scope.roast.quote.length;
           if ($scope.descChar === 0) {
                $scope.descChar = 0;
           };
       };
    });
    $scope.$watch('debate.question1', function() {
        if(angular.isDefined($scope.debate.question1)){
            $scope.qChar1 = 150 - $scope.debate.question1.length;
            if ($scope.qChar1 === 0) {
                $scope.qChar1 = 0;
            };
        };
    });
    $scope.$watch('debate.description', function() {
        if(angular.isDefined($scope.debate.description)){
            $scope.qDescChar = 300 - $scope.debate.description.length;
            if ($scope.qDescChar === 0) {
                $scope.qDescChar = 0;
            };
        };
    });
    $scope.$watch('debate.question2', function() {
        if(angular.isDefined($scope.debate.question2)){
            $scope.qChar2 = 150 - $scope.debate.question2.length;
            if ($scope.qChar2 === 0) {
                $scope.qChar2 = 0;
            };
        };
    });

    $scope.yChar = 10;
    $scope.nChar = 10;

    $scope.$watch('debate.yBtnValue', function() {
        if(angular.isDefined($scope.debate.yBtnValue)){
            $scope.yChar = 10 - $scope.debate.yBtnValue.length;
            if ($scope.yChar === 0) {
                $scope.yChar = 0;
            };
        };
    });

    $scope.$watch('debate.nBtnValue', function() {
        if(angular.isDefined($scope.debate.nBtnValue)){
            $scope.nChar = 10 - $scope.debate.nBtnValue.length;
            if ($scope.nChar === 0) {
                $scope.nChar = 0;
            };
        };
    });

    $scope.showtext = false;
    $scope.debate.yBtnValue = "Yes";
    $scope.debate.nBtnValue = "No";

    $scope.editY = function(){
        $scope.showtext = true;
    }
    $scope.doneBtn = function(){
        $scope.showtext = false;
    }

    $scope.single = function(image) {
                    var formData = new FormData();
                    formData.append('image', image, image.name);
                    $http.post('upload', formData, {
                        headers: { 'Content-Type': false },
                        transformRequest: angular.identity
                    }).success(function(result) {
                        $scope.uploadedImgSrc = result.src;
                        $scope.sizeInBytes = result.size;
                    });
                };

    var valid  = null;

    $scope.postRoast = function(){

            if ($scope.roast.name === null || $scope.roast.name === "" || angular.isUndefined($scope.roast.name)) {
                valid = false;
            }else 
            if ($scope.roast.quote === null || $scope.roast.quote === "" || angular.isUndefined($scope.roast.quote)) {
                valid = false
            }else{valid = true};

        if (valid === true) {
            $scope.roast.email = $scope.email;
            $scope.btnDisable = true;
            $scope.waiting = true;
            $http.post('/createRoast', $scope.roast).success(function(data){
                $scope.waiting = false;
                var roastID = '/roast/' + data.slug;
                $location.path(roastID);
            }).error(function(data){
                $scope.waiting = false;
            })
        };
    };

    var validQ = null;
    $scope.duplicateQ = false;

    $scope.postQuestion = function(){

         if ($scope.debate.question === null || $scope.debate.question === "" || angular.isUndefined($scope.debate.question)) {
                validQ = false
        }else{validQ = true};

        if(validQ === true){
            $scope.debate.email = $scope.email;
            $scope.btnDisable = true;
            $scope.waiting = true;
            $http.post('/createDebate', $scope.debate).success(function(data){
                $scope.waiting = false;
                console.log(data)
                    if (angular.isDefined(data[0])) {
                        var debateID = '/QandA/' + data[0].slug;
                        $location.path(debateID);
                    }else{
                        var debateID = '/QandA/' + data.slug;
                        $location.path(debateID);
                    }
            }).error(function(data){
                $scope.waiting = false;
            })
        };
    };

    $scope.postQuestion1 = function(){
        $scope.debate.question = $scope.debate.question1;
        $scope.postQuestion();
    };
    $scope.postQuestion2 = function(){
        $scope.debate.question = $scope.debate.question2;
        $scope.debate.debate = "Y";
        $scope.postQuestion();
    };

});



app.controller('roastListController', function($scope,$http,$location,$routeParams){

    $http.get('/allRoasts').success(function(data){
        console.log("inside roast list");
        $scope.roastList = data;
    }).error(function(data){
        //console.log(data);
    })

    $scope.goToRoast = function(content){
         window.scrollTo(0,0);
         var roastID = '/roast/' + content.slug;
        $location.path(roastID);
    }
    
});



app.controller('QandAlistController', function($http,$scope,$location,$routeParams){

    $http.get('/allDebates').success(function(data){
        console.log(data[0]);
        $scope.questions = data;

    }).error(function(data){
        console.log(data);
    })

    $scope.goToDebate = function(question){

        window.scrollTo(0,0);
        var debateID = '/QandA/' + question.slug;
        
        $location.path(debateID);
    }
})

app.controller('replyCommentController', function($scope,$http,$routeParams,$interval){

    console.log('Its in loop');
    
    $scope.comment = {};
    $scope.repliesQ = {};

    $scope.postBlockActive = false;
    $scope.appreciated = false;
    $scope.appriValue = 'Appreciate';
    $scope.hideTextArea = function () {
        $scope.postBlockActive = false;
        $scope.repliesQ.comment = null;
        $scope.repliesQ.anonymous = null;
    }
    $scope.showTextArea = function () {
        $scope.postBlockActive = true;
        if($scope.userName === null || $scope.userName === '' || angular.isUndefined($scope.userName)){
            $scope.repliesQ.name = 'Anonymous';
            $scope.anony = true;
            $scope.repliesQ.anonymous = 'Y';
            console.log('its working');
        }else{
            $scope.repliesQ.name = $scope.userName;
            $scope.repliesQ.email = $scope.email;
            $scope.repliesQ.imgUrl = $scope.imgUserSmall;
            $scope.anony = false;
        }
    }
   

    $scope.comment.id = $routeParams.id;

    console.log('Its in loop');

    $scope.fetchRepliesQ = function(){
        console.log('intervals running');

        var replyID = '/debateReplies/' + $routeParams.id;

            $http.get(replyID).success(function(data){
                $scope.replyContent = data;
                $scope.repliesGot = data[0].replies;
                console.log(data);
                /*if (data.length === 1){
                    $scope.newDataQ.oldDate = data[0].createdOn;
                }else if (data.length > 1){
                    $scope.newDataQ.oldDate = data[data.length - 1].createdOn;
                }*/
            }).error(function(data){

            });
    };

    $scope.fetchRepliesQ();

    $scope.repliesQ.name = 'Anonymous';
    $scope.btnDisable = false;

    $scope.postReplyQ = function(){
                $scope.btnDisable = true;
                $scope.repliesQ.id = 'replyPage';
                var debateID = '/debateReply/' + $routeParams.id;
                $http.post(debateID, $scope.repliesQ).success(function(data){
                    
                    if(data === '"failure"'){
                        window.alert('Bakchodi Nahi');
                    }else{
                        $scope.btnDisable = false;
                        $scope.hideTextArea();
                        $scope.fetchRepliesQ();
                    }

                }).error(function(data){
                    if(data === '"failure"'){ 
                        window.alert('Bakchodi Nahi');
                    }
                });
    };

    $scope.stopPromise = $interval($scope.fetchRepliesQ, 30000);

    $scope.$on('$routeChangeStart', function(){
        $interval.cancel($scope.stopPromise);
   });

});


app.controller('roastCommentController', function($scope,$http,$routeParams,$interval){

    console.log('Its in loop');

    $scope.repliesR = {};

    $scope.postBlockActive = false;
    $scope.appreciated = false;
    $scope.appriValue = 'Appreciate';
    $scope.hideTextArea = function () {
        $scope.postBlockActive = false;
        $scope.repliesR.comment = null;
        $scope.repliesR.anonymous = null;
    }
    $scope.showTextArea = function () {
        $scope.postBlockActive = true;
        if($scope.userName === null || $scope.userName === '' || angular.isUndefined($scope.userName)){
            $scope.repliesR.name = 'Anonymous';
            $scope.anony = true;
            $scope.repliesR.anonymous = 'Y';
            console.log('its working');
        }else{
            $scope.repliesR.name = $scope.userName;
            $scope.repliesR.email = $scope.email;
            $scope.repliesR.imgUrl = $scope.imgUserSmall;
            $scope.anony = false;
        }
    }
    
    $scope.fetchRepliesR = function(){
        console.log('intervals running');

        var replyID = '/roastReplies/' + $routeParams.id;

            $http.get(replyID).success(function(data){
                $scope.replyContent = data;
                $scope.repliesGot = data[0].replies;
                console.log(data);
                /*if (data.length === 1){
                    $scope.newDataQ.oldDate = data[0].createdOn;
                }else if (data.length > 1){
                    $scope.newDataQ.oldDate = data[data.length - 1].createdOn;
                }*/
            }).error(function(data){

            });
    };

    $scope.fetchRepliesR();

    $scope.repliesR.name = 'Anonymous';
    $scope.btnDisable = false;

    $scope.postReplyR = function(){
                $scope.btnDisable = true;
                $scope.repliesR.id = 'replyPage';
                var debateID = '/roastReply/' + $routeParams.id;
                $http.post(debateID, $scope.repliesR).success(function(data){
                    
                    if(data === '"failure"'){
                        window.alert('Bakchodi Nahi');
                    }else{
                        $scope.btnDisable = false;
                        $scope.hideTextArea();
                        $scope.fetchRepliesR();
                    }

                }).error(function(data){
                    if(data === '"failure"'){ 
                        window.alert('Bakchodi Nahi');
                    }
                });
    };

    $scope.stopPromise = $interval($scope.fetchRepliesQ, 30000);

    $scope.$on('$routeChangeStart', function(){
        $interval.cancel($scope.stopPromise);
   });

});


app.controller('errorController', function($scope){

});

app.controller('loadingDataController', function($scope, $location, $http, UserInfoProvider){
    $http.get('/user/me').success( function(data ) {
        console.log( data );

        UserInfoProvider.setData( data.google );
        $location.path('/');
    })
    .error( function (data ) {
        console.log( data );
    });
})

// directives start here 


app.directive('myMaxlength', function() {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ngModelCtrl) {
      var maxlength = Number(attrs.myMaxlength);
      function fromUser(text) {
          if (text.length > maxlength) {
            var transformedInput = text.substring(0, maxlength);
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
            return transformedInput;
          } 
          return text;
      }
      ngModelCtrl.$parsers.push(fromUser);
    }
  }; 
});


// dirctive for image upload

app.directive('image', function($q) {
        'use strict'

        var URL = window.URL || window.webkitURL;

        var getResizeArea = function () {
            var resizeAreaId = 'fileupload-resize-area';

            var resizeArea = document.getElementById(resizeAreaId);

            if (!resizeArea) {
                resizeArea = document.createElement('canvas');
                resizeArea.id = resizeAreaId;
                resizeArea.style.visibility = 'hidden';
                document.body.appendChild(resizeArea);
            }

            return resizeArea;
        }

        var resizeImage = function (origImage, options) {
            var maxHeight = options.resizeMaxHeight || 300;
            var maxWidth = options.resizeMaxWidth || 250;
            var quality = options.resizeQuality || 0.7;
            var type = options.resizeType || 'image/jpg';

            var canvas = getResizeArea();

            var height = origImage.height;
            var width = origImage.width;

            // calculate the width and height, constraining the proportions
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round(height *= maxWidth / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round(width *= maxHeight / height);
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            //draw image on canvas
            var ctx = canvas.getContext("2d");
            ctx.drawImage(origImage, 0, 0, width, height);

            // get the data from canvas as 70% jpg (or specified type).
            return canvas.toDataURL(type, quality);
        };

        var createImage = function(url, callback) {
            var image = new Image();
            image.onload = function() {
                callback(image);
            };
            image.src = url;
        };

        var fileToDataURL = function (file) {
            var deferred = $q.defer();
            var reader = new FileReader();
            reader.onload = function (e) {
                deferred.resolve(e.target.result);
            };
            reader.readAsDataURL(file);
            return deferred.promise;
        };


        return {
            restrict: 'A',
            scope: {
                image: '=',
                resizeMaxHeight: '@?',
                resizeMaxWidth: '@?',
                resizeQuality: '@?',
                resizeType: '@?',
            },
            link: function postLink(scope, element, attrs, ctrl) {

                var doResizing = function(imageResult, callback) {
                    createImage(imageResult.url, function(image) {
                        var dataURL = resizeImage(image, scope);
                        imageResult.resized = {
                            dataURL: dataURL,
                            type: dataURL.match(/:(.+\/.+);/)[1],
                        };
                        callback(imageResult);
                    });
                };

                var applyScope = function(imageResult) {
                    scope.$apply(function() {
                        //console.log(imageResult);
                        if(attrs.multiple)
                            scope.image.push(imageResult);
                        else
                            scope.image = imageResult; 
                    });
                };


                element.bind('change', function (evt) {
                    //when multiple always return an array of images
                    if(attrs.multiple)
                        scope.image = [];

                    var files = evt.target.files;
                    for(var i = 0; i < files.length; i++) {
                        //create a result object for each file in files
                        var imageResult = {
                            file: files[i],
                            url: URL.createObjectURL(files[i])
                        };

                        fileToDataURL(files[i]).then(function (dataURL) {
                            imageResult.dataURL = dataURL;
                        });

                        if(scope.resizeMaxHeight || scope.resizeMaxWidth) { //resize image
                            doResizing(imageResult, function(imageResult) {
                                applyScope(imageResult);
                            });
                        }
                        else { //no resizing
                            applyScope(imageResult);
                        }
                    }
                });
            }
        };
    });


// this for social sharing

app.factory('socialLinker', [
        '$window', '$location', function ($window, $location) {
        return function (urlFactory) {
            return function (scope, element, attrs) {
                var getCurrentUrl, handler, popupWinAttrs;
                popupWinAttrs = "status=no, width=" + (scope.socialWidth || 640) + ", height=" + (scope.socialWidth || 480) + ", resizable=yes, toolbar=no, menubar=no, scrollbars=no, location=no, directories=no";
                getCurrentUrl = function () {
                    return attrs.customUrl || $location.absUrl();
                };
                attrs.$observe('customUrl', function () {
                    var url;
                    url = urlFactory(scope, getCurrentUrl());
                    if (element[0].nodeName === 'A' && ((attrs.href == null) || attrs.href === '')) {
                        return element.attr('href', url);
                    }
                });
                element.attr('rel', 'nofollow');
                handler = function (e) {
                    var url, win;
                    e.preventDefault();
                    url = urlFactory(scope, getCurrentUrl());
                    return win = $window.open(url, 'popupwindow', popupWinAttrs).focus();
                };
                if (attrs.customHandler != null) {
                    element.on('click', handler = function (event) {
                        var url;
                        url = urlFactory(scope, getCurrentUrl());
                        element.attr('href', url);
                        return scope.handler({
                            $event: event,
                            $url: url
                        });
                    });
                } else {
                    element.on('click', handler);
                }
                return scope.$on('$destroy', function () {
                    return element.off('click', handler);
                });
            };
        };
    }]);

        app.directive('socialFacebook', [
        'socialLinker', function (linker) {
        return {
            restrict: 'ACEM',
            scope: {
                handler: '&customHandler'
            },
            link: linker(function (scope, url) {
                var shareUrl;
                shareUrl = ["https://facebook.com/sharer.php?"];
                shareUrl.push("u=" + (encodeURIComponent(url)));
                return shareUrl.join('');
            })
        };
    }]).directive('socialTwitter', [
        'socialLinker', function (linker) {
        return {
            restrict: 'ACEM',
            scope: angular.extend({
                status: '@status'
            },{
                handler: '&customHandler'
            }),
            link: linker(function (scope, url) {
                scope.status || (scope.status = "India Roasts, an Online Debate and celeb Roasting! - " + url);
                return "https://twitter.com/intent/tweet?text=" + (encodeURIComponent(scope.status));
            })
        };
    }]).directive('socialGplus', [
        'socialLinker', function (linker) {
        return {
            restrict: 'ACEM',
            scope:{
                handler: '&customHandler'
            },
            link: linker(function (scope, url) {
                return "https://plus.google.com/share?url=" + (encodeURIComponent(url));
            })
        };
    }])

    app.service('UserInfoProvider', function($http){
        this.data = null;
        var self = this;

        this.setData = function( data ) {
            self.data = data;
        };

        this.getUserName = function () {
            return self.data.name;
        };

        this.getUserEmail = function () {
            return self.data.email;
        };

        this.logout = function () {
            $http.post('/logout');
            self.data = null;
        };
    });
