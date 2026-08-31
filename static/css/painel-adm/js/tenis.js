document.addEventListener(
"DOMContentLoaded",
function () {


    // ==============================
    // ELEMENTOS
    // ==============================

    const productsGrid =
        document.getElementById(
            "catalogo"
        );


    const noProducts =
        document.getElementById(
            "noProducts"
        );


    // ==============================
    // VERIFICAR CONTAINER
    // ==============================

    if (!productsGrid) {

        console.error(
            "Container de produtos não encontrado."
        );

        return;

    }


    // ==============================
    // FORMATAR PREÇO
    // ==============================

    function formatPrice(
        price
    ) {

        return Number(
            price
        ).toLocaleString(
            "pt-BR",
            {
                style:
                    "currency",

                currency:
                    "BRL"
            }
        );

    }


    // ==============================
    // CARREGAR PRODUTOS
    // ==============================

    async function carregarProdutos() {

        productsGrid.innerHTML =
            `
            <p class="loading-products">
                Carregando produtos...
            </p>
            `;


        try {

            const response =
                await fetch(
                    "/produtos"
                );


            if (!response.ok) {

                throw new Error(
                    "Erro ao buscar produtos."
                );

            }


            const produtos =
                await response.json();


            productsGrid.innerHTML =
                "";


            // ==============================
            // SEM PRODUTOS
            // ==============================

            if (
                !produtos ||
                produtos.length === 0
            ) {

                if (noProducts) {

                    noProducts.hidden =
                        false;

                }


                return;

            }


            // ==============================
            // ESCONDER MENSAGEM
            // ==============================

            if (noProducts) {

                noProducts.hidden =
                    true;

            }


            // ==============================
            // RENDERIZAR PRODUTOS
            // ==============================

            produtos.forEach(
                function (produto) {

                    const productCard =
                        document.createElement(
                            "a"
                        );


                    productCard.href =
                        `/produto/${produto.id}`;


                    productCard.className =
                        "product-card";


                    const imagem =
                        produto.imagem ||
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800";


                    productCard.innerHTML =
                        `
                        <div class="product-image">

                            <img
                                src="${imagem}"
                                alt="${produto.nome}"
                                loading="lazy"
                            >

                        </div>


                        <div class="product-info">

                            <div>

                                <h3>
                                    ${produto.nome}
                                </h3>


                                <p>
                                    ${
                                        produto.descricao ||
                                        "Confira este modelo exclusivo."
                                    }
                                </p>

                            </div>


                            <span class="product-arrow">
                                →
                            </span>

                        </div>


                        <div class="product-footer">

                            <span>
                                Ver produto
                            </span>


                            <strong>
                                ${formatPrice(
                                    produto.preco
                                )}
                            </strong>

                        </div>
                        `;


                    productsGrid.appendChild(
                        productCard
                    );

                }
            );

        }


        catch (error) {

            console.error(
                "Erro ao carregar produtos:",
                error
            );


            productsGrid.innerHTML =
                `
                <div class="products-error">

                    <span>
                        NÃO FOI POSSÍVEL CARREGAR
                    </span>


                    <p>
                        Tente novamente mais tarde.
                    </p>

                </div>
                `;


            if (noProducts) {

                noProducts.hidden =
                    true;

            }

        }

    }


    // ==============================
    // INICIAR
    // ==============================

    carregarProdutos();

}


);
