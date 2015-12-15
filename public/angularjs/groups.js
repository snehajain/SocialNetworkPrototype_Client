var app = angular.module("groupsPage",['ngSanitize']);
		//app.config();
		app.controller('groupsPageController',function($scope, $http, $sce, $location, $window){
			$scope.members = [];
			$scope.membersIds = [];
			$scope.searchUser = function(userName) {
				$http.get('/searchUser?userName=' + userName ).success(function(data) {
				console.log("Success in Posts GET!!\n");
				$scope.userList = data.userResults;
				}); 
			}

			$scope.addUser = function(user) {
				console.log("In addUser");
				$scope.members.push(user);
				$scope.membersIds.push(user.userid)
			}

			$scope.removeUser = function(user) {
				console.log("In removeUser");
				for(var i=0; i<$scope.members.length; i++) {
					if($scope.members[i].userid==user.userid) {
						$scope.members.splice(i,1);
						$scope.membersIds.splice(i,1);
						console.log("removed " +user.userid);
						break;
					}
				}
			}
			$scope.createGroup = function() {
				if(!($scope.newGroup&&$scope.newGroup.groupname)) {
					$scope.noGroupNameError = "Group Name cannot be Empty";
					return;
				} else  {
					$scope.noGroupNameError ="";
				}
				if(!$scope.newGroup.groupdesc) {
					$scope.newGroup.groupdesc ='';
				}
				$scope.newGroup["members"] = $scope.members;
				$http({
					url:'/createGroup',
					method:'POST',
					data: {"groupData":$scope.newGroup},
					responseType: "json",
					headers: {'Content-Type': 'application/json'}
				}).success(function(data){
					$window.location.href='/groupProfile?groupId='+ data.groupId;
				}).error(function(data){
					console.log("Post Error");
				});
			}

			$scope.resetCreate= function() {
				$scope.newGroup={}; 
				$scope.members=[]; 
				$scope.membersIds=[]; 
				$scope.userList=[];
				$scope.userName = '';
				$scope.noGroupNameError = '';
			}

			$scope.loadUserGroupData = function() {
				$http.get('/getMyGroups').success(function(data) {
				console.log("Success in loadMyGroupData!!\n" );
				$scope.userGroupList = data.myGroups;
				$scope.otherGroupList = data.otherGroups;
				$scope.friendGroupList = data.friendGroupList;
				});
			}
		});