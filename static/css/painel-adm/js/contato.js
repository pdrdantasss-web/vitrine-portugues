document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "contato.js carregou"
        );


        const params =
            new URLSearchParams(
                window.location.search
            );


        const produto =
            params.get(
                "produto"
            );


        console.log(
            "Produto recebido:",
            produto
        );


        if (!produto) {
            return;
        }


        const subject =
            document.getElementById(
                "subject"
            );


        const message =
            document.getElementById(
                "message"
            );


        if (subject) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                "interesse-produto";


            option.textContent =
                "Tenho interesse em: " +
                produto;


            subject.appendChild(
                option
            );


            subject.value =
                "interesse-produto";

        }


        if (message) {

            message.value =
                "Olá! Tenho interesse no produto \"" +
                produto +
                "\". Gostaria de receber mais informações sobre disponibilidade, detalhes e como posso adquiri-lo.";

        }

    }
);