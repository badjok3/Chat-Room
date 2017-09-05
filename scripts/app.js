$(() => {
    const app = Sammy('#content', function () {
        this.use('Handlebars', 'hbs');

        // HOME PAGE
        this.get('index.html', displayHome);
        this.get('#/home', displayHome);


        // REGISTER
        this.post('#/register', function (ctx) {

            let username = ctx.params.username;
            let password = ctx.params.password;
            let repeatPass = ctx.params.repeatPass;

            auth.register(username, password)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.showInfo(`Registered as "${username}"`);
                    $("#registerForm").trigger('reset');
                    ctx.redirect('#/catalog');
                })
                .catch(auth.handleError);
        });


        // LOGIN
        this.post('#/login', function (ctx) {

            let username = ctx.params.username;
            let password = ctx.params.password;

            auth.login(username, password)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.showInfo(`Logged in as "${username}"`);
                    $("#loginForm").trigger('reset');
                    ctx.redirect('#/catalog');
                })
                .catch(auth.handleError);
        });


        // LOGOUT LOGIC
        this.get('#/logout', function (ctx) {
            auth.logout()
                .then(function () {
                    sessionStorage.clear();
                    auth.showInfo('Logged out!');
                    ctx.redirect('#/home');
                })
                .catch(auth.handleError)
        });



        // PUBLIC CHATS VIEW
        this.get('#/allChats', function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/chats/allChats.hbs');
            });
        });



        // REUSED FUNCTIONS
        function displayHome(ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/welcome.hbs');
            });
        }


        // Handle notifications
        $(document).on({
            ajaxStart: () => $("#loadingBox").show(),
            ajaxStop: () => $('#loadingBox').fadeOut()
        });

        let errorBox = $('#errorBox');
        let infoBox = $('#infoBox');
        let loadingBox = $('#loadingBox');

        $(document).on({
            ajaxStart: () => loadingBox.show(),
            ajaxStop: () => loadingBox.hide()
        });

        infoBox.click((event) => $(event.target).hide());
        errorBox.click((event) => $(event.target).hide());

    });

    app.run();
});