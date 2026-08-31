document.addEventListener(
    "DOMContentLoaded",
    function () {

        const formLogin =
            document.getElementById(
                "loginForm"
            );

        const email =
            document.getElementById(
                "email"
            );

        const senha =
            document.getElementById(
                "password"
            );

        const loginMessage =
            document.getElementById(
                "loginMessage"
            );

        const button =
            formLogin.querySelector(
                ".login-button"
            );


        if (!formLogin) {

            console.error(
                "Formulário não encontrado"
            );

            return;

        }


        formLogin.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                console.log(
                    "SUBMIT FUNCIONOU"
                );

                loginMessage.textContent =
                    "Entrando...";

                button.disabled =
                    true;


                try {

                    const response =
                        await fetch(
                            "/auth/login",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({
                                        email:
                                            email.value.trim(),

                                        senha:
                                            senha.value
                                    })
                            }
                        );


                    console.log(
                        "STATUS:",
                        response.status
                    );


                    const data =
                        await response.json();


                    console.log(
                        "RESPOSTA:",
                        data
                    );


                    if (!response.ok) {

                        loginMessage.textContent =
                            data.detail ||
                            "Email ou senha incorretos.";

                        button.disabled =
                            false;

                        return;

                    }


                    if (!data.access_token) {

                        loginMessage.textContent =
                            "Token não recebido.";

                        button.disabled =
                            false;

                        return;

                    }


                    localStorage.setItem(
                        "access_token",
                        data.access_token
                    );


                    loginMessage.textContent =
                        "Login realizado!";


                    setTimeout(
                        function () {

                            window.location.href =
                                "/admin";

                        },
                        500
                    );

                }

                catch (error) {

                    console.error(
                        "ERRO:",
                        error
                    );

                    loginMessage.textContent =
                        "Erro ao conectar.";

                    button.disabled =
                        false;

                }

            }
        );

    }
);