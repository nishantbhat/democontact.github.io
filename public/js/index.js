var myApp = angular.module('myApp', ['ngRoute', 'LocalStorageModule', 'ngToast'])

//ng-route config
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'default.html',
            })
            .when('/contact-info/:contact_index', {
                templateUrl: 'contact_info.html',
                controller: 'contactInfoCtrl'
            })
            .when('/list', {
                templateUrl: '../../Messagesent.html',
                controller: 'messagesentctrl'
            })
            .otherwise({redirectTo: '/home'});
    })

    // controllers
    .controller('navCtrl', function ($scope, localStorageService, $location) {
        $scope.nav = {
            navItems: ['home'],
            selectedIndex: 0,
            navClick: function ($index) {
                $scope.nav.selectedIndex = $index;

            }
        };
    })
//home controller to load contacts
    .controller('homeCtrl', function ($scope, ContactService, localStorageService, ngToast) {
        $scope.contacts = ContactService.getContacts();
        $scope.visibility = localStorageService.get("showdata")
    })

//contact info conteroller to send message and show user data

    .controller('contactInfoCtrl', function ($scope, $routeParams, $http, ngToast) {
        $scope.otp = Math.floor(100000 + Math.random() * 900000);
        $scope.user_message_info = "Hi, Your OTP is: ";
        $scope.message = $scope.user_message_info + $scope.otp;
        var index = $routeParams.contact_index;
        $scope.currentContact = $scope.contacts[index];
        $scope.SendMessage = function (data, number, name) {
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            var sending_data = {
                message: data,
                phone: number,
                name: name,
                dt: dateTime
            }
            var response = $http.post('http://localhost:8000/user/SendMessage', sending_data);
            response.success(function (data, status, headers, config) {
                if (data != '2' && data != '' && data != undefined) {
                    $scope.loads = JSON.parse(JSON.stringify(data, null, null), null);
                    ngToast.create("Message Sent Sucessfully")
                } else {
                    ngToast.create("We are using free twilo account so unverified number cant send message to verify your number contact +917829709236.")
                }
            });

        }

    })

   //message sent controller to load messages already sent
    .controller('messagesentctrl', function ($scope, $location, $http, ngToast) {
        console.log("hello")
        var response = $http.get('http://localhost:8000/user/ReadMessage');
        response.success(function (data, status, headers, config) {
            console.log(data)
            if (data != '1' && data != '' && data != undefined) {
                $scope.loads = JSON.parse(JSON.stringify(data, null, null), null);
                if($scope.loads.messages_details.length==0){
                    ngToast.create("No Message Sent..")
                }
            } else {
                ngToast.create("No Message Sent..")
            }
        });

    })


    // directives
    .directive('contact', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'contact.html'
        }
    })




    // services to store static contacts

    .factory('ContactService', [function () {
        var factory = {};

        factory.getContacts = function () {
            return contactList;
        }


        // contact list, usually would be a separate database
        var contactList = [
            {
                id: 0,
                name: 'Ravi',
                email: 'Ravi@mail.com',
                phone: '+917829709236',
                url: 'www.google.com',
                notes: 'Winter is coming.'
            },
            {
                id: 1,
                name: 'Ramesh',
                email: 'Ramesh@mail.com',
                phone: '+917829709236',
                url: 'www.google.co.in',
                notes: 'Reluctant to pay iron price.'
            },
            {
                id: 2,
                name: 'Prasanna',
                email: 'Prasanna@mail.com',
                phone: '+917829709236',
                url: 'www.google.uk',
                notes: 'Loyal brother of the watch.'
            },
            {
                id: 3,
                name: 'Amit',
                email: 'Amit@mail.com',
                phone: '+917829709236',
                url: 'www.google.in',
                notes: 'Knows nothing.'
            },
            {
                id: 4,
                name: 'Sushil',
                email: 'Sushil@mail.com',
                phone: '+917829709236',
                url: 'www.google.us',
                notes: 'Has a list of names.'
            },
            {
                id: 5,
                name: 'Swati',
                email: 'Swati@mail.com',
                phone: '+917829709236',
                url: 'www.amazon.in',
                notes: 'Lost in the friend-zone.'
            },
            {
                id: 6,
                name: 'Shruti',
                email: 'Shruti@mail.com',
                phone: '+917829709236',
                url: 'www.flipcart.in',
                notes: 'Currently drunk.'
            },
            {
                id: 7,
                name: 'Sindhu',
                email: 'Sindhu@mail.com',
                phone: '+917829709236',
                url: 'www.snapdeal.in',
                notes: 'Nobody expects the Stannish inquisition.'
            },
            {
                id: 8,
                name: 'Kaveri',
                email: 'Kaveri@mail.com',
                phone: '+917829709236',
                url: 'www.qwerty.com',
                notes: 'Hodor? Hodor... Hodor!'
            },
            {
                id: 9,
                name: 'Ashwin',
                email: 'Ashwin@mail.com',
                phone: '+917829709236',
                url: 'www.mobile91.in',
                notes: 'Keeper of kings.'
            },
            {
                id: 10,
                name: 'John',
                email: 'John@mail.com',
                phone: '+917829709236',
                url: 'www.yahoo.in',
                notes: 'Do not cross her.'
            },
            {
                id: 11,
                name: 'Kisan Network',
                email: 'kisannetwork@mail.com',
                phone: '+919971792703',
                url: 'www.kisannetwork.com'
            },
        ];

        return factory;
    }]);