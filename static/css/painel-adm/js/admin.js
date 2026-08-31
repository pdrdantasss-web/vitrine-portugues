document.addEventListener(
    "DOMContentLoaded",
    function () {

        // ==============================
        // TOKEN
        // ==============================

        const token =
            localStorage.getItem(
                "access_token"
            );


        if (!token) {

            window.location.href =
                "/login-admin";

            return;

        }


        // ==============================
        // ELEMENTOS
        // ==============================

        const productForm =
            document.getElementById(
                "productForm"
            );


        const productName =
            document.getElementById(
                "productName"
            );


        const productDescription =
            document.getElementById(
                "productDescription"
            );


        const productPrice =
            document.getElementById(
                "productPrice"
            );


        const productImage =
            document.getElementById(
                "productImage"
            );


        const productsList =
            document.getElementById(
                "productsList"
            );


        const reloadProducts =
            document.getElementById(
                "reloadProducts"
            );


        const formMessage =
            document.getElementById(
                "formMessage"
            );


        const editingProductId =
            document.getElementById(
                "editingProductId"
            );


        const formTitle =
            document.getElementById(
                "formTitle"
            );


        const submitProductButton =
            document.getElementById(
                "submitProductButton"
            );


        const cancelEditButton =
            document.getElementById(
                "cancelEditButton"
            );


        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        // ==============================
        // VERIFICAR ELEMENTOS
        // ==============================

        if (
            !productForm ||
            !productName ||
            !productDescription ||
            !productPrice ||
            !productImage ||
            !productsList
        ) {

            console.error(
                "Elementos do painel não foram encontrados."
            );

            return;

        }


        // ==============================
        // MENSAGEM
        // ==============================

        function showMessage(
            message,
            type = "success"
        ) {

            if (!formMessage) {

                return;

            }


            formMessage.textContent =
                message;


            formMessage.className =
                `message show ${type}`;


            setTimeout(
                function () {

                    formMessage.textContent =
                        "";


                    formMessage.className =
                        "message";

                },
                4000
            );

        }


        // ==============================
        // CARREGAR PRODUTOS
        // ==============================

        async function loadProducts() {

            productsList.innerHTML =
                `
                <p class="loading-products">
                    Carregando produtos...
                </p>
                `;


            try {

                const response =
                    await fetch(
                        "/admin/produtos",
                        {
                            method:
                                "GET",

                            headers:
                                {
                                    "Authorization":
                                        `Bearer ${token}`
                                }
                        }
                    );


                if (!response.ok) {

                    if (
                        response.status === 401 ||
                        response.status === 403
                    ) {

                        localStorage.removeItem(
                            "access_token"
                        );


                        window.location.href =
                            "/login-admin";

                        return;

                    }


                    throw new Error(
                        "Erro ao carregar produtos."
                    );

                }


                const products =
                    await response.json();


                renderProducts(
                    products
                );

            }


            catch (error) {

                console.error(
                    error
                );


                productsList.innerHTML =
                    `
                    <p class="loading-products">
                        Erro ao carregar produtos.
                    </p>
                    `;

            }

        }


        // ==============================
        // RENDERIZAR PRODUTOS
        // ==============================

        function renderProducts(
            products
        ) {

            productsList.innerHTML =
                "";


            if (
                !products ||
                products.length === 0
            ) {

                productsList.innerHTML =
                    `
                    <p class="loading-products">
                        Nenhum produto cadastrado.
                    </p>
                    `;

                return;

            }


            products.forEach(
                function (product) {

                    const productElement =
                        document.createElement(
                            "div"
                        );


                    productElement.className =
                        "product-item";


                    let imageHTML =
                        "";


                    if (product.imagem) {

                        imageHTML =
                            `
                            <img
                                src="${product.imagem}"
                                alt="${product.nome}"
                                class="admin-product-image"
                            >
                            `;

                    }


                    productElement.innerHTML =
                        `
                        ${imageHTML}

                        <div class="product-info">

                            <h3>
                                ${product.nome}
                            </h3>


                            <p>
                                ${product.descricao}
                            </p>

                        </div>


                        <div class="product-actions">

                            <span class="product-price">

                                R$ ${Number(
                                    product.preco
                                ).toFixed(2)}

                            </span>


                            <button
                                type="button"
                                class="btn-edit"
                            >
                                Editar
                            </button>


                            <button
                                type="button"
                                class="btn-delete"
                            >
                                Excluir
                            </button>

                        </div>
                        `;


                    // ==============================
                    // EDITAR
                    // ==============================

                    const editButton =
                        productElement.querySelector(
                            ".btn-edit"
                        );


                    editButton.addEventListener(
                        "click",
                        function () {

                            startEdit(
                                product
                            );

                        }
                    );


                    // ==============================
                    // EXCLUIR
                    // ==============================

                    const deleteButton =
                        productElement.querySelector(
                            ".btn-delete"
                        );


                    deleteButton.addEventListener(
                        "click",
                        function () {

                            deleteProduct(
                                product.id
                            );

                        }
                    );


                    productsList.appendChild(
                        productElement
                    );

                }
            );

        }


        // ==============================
        // INICIAR EDIÇÃO
        // ==============================

        function startEdit(
            product
        ) {

            editingProductId.value =
                product.id;


            productName.value =
                product.nome;


            productDescription.value =
                product.descricao;


            productPrice.value =
                Number(
                    product.preco
                );


            // limpa o campo de imagem
            // para o usuário escolher outra,
            // caso queira trocar

            productImage.value =
                "";


            formTitle.textContent =
                "Editar Produto";


            submitProductButton.textContent =
                "SALVAR ALTERAÇÕES";


            cancelEditButton.hidden =
                false;


            window.scrollTo(
                {
                    top:
                        0,

                    behavior:
                        "smooth"
                }
            );

        }


        // ==============================
        // CANCELAR EDIÇÃO
        // ==============================

        function cancelEdit() {

            editingProductId.value =
                "";


            productForm.reset();


            formTitle.textContent =
                "Cadastrar Produto";


            submitProductButton.textContent =
                "CADASTRAR PRODUTO";


            cancelEditButton.hidden =
                true;

        }


        if (cancelEditButton) {

            cancelEditButton.addEventListener(
                "click",
                cancelEdit
            );

        }


        // ==============================
        // CADASTRAR / EDITAR
        // ==============================

        productForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const productId =
                    editingProductId.value;


                // ==============================
                // FORMDATA
                // ==============================

                const formData =
                    new FormData();


                formData.append(
                    "nome",
                    productName.value.trim()
                );


                formData.append(
                    "descricao",
                    productDescription.value.trim()
                );


                formData.append(
                    "preco",
                    productPrice.value
                );


                // ==============================
                // IMAGEM
                // ==============================

                if (
                    productImage.files.length > 0
                ) {

                    formData.append(
                        "imagem",
                        productImage.files[0]
                    );

                }


                // ==============================
                // URL E MÉTODO
                // ==============================

                let url =
                    "/admin/produtos";


                let method =
                    "POST";


                if (productId) {

                    url =
                        `/admin/produtos/${productId}`;


                    method =
                        "PUT";

                }


                // ==============================
                // BOTÃO
                // ==============================

                submitProductButton.disabled =
                    true;


                submitProductButton.textContent =
                    productId
                        ? "SALVANDO..."
                        : "CADASTRANDO...";


                try {

                    const response =
                        await fetch(
                            url,
                            {
                                method:
                                    method,

                                headers:
                                    {
                                        "Authorization":
                                            `Bearer ${token}`
                                    },

                                body:
                                    formData
                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        showMessage(
                            data.detail ||
                            "Erro ao salvar produto.",
                            "error"
                        );

                        return;

                    }


                    showMessage(
                        productId
                            ? "Produto atualizado com sucesso!"
                            : "Produto cadastrado com sucesso!",
                        "success"
                    );


                    cancelEdit();


                    await loadProducts();

                }


                catch (error) {

                    console.error(
                        error
                    );


                    showMessage(
                        "Erro ao conectar ao servidor.",
                        "error"
                    );

                }


                finally {

                    submitProductButton.disabled =
                        false;


                    submitProductButton.textContent =
                        editingProductId.value
                            ? "SALVAR ALTERAÇÕES"
                            : "CADASTRAR PRODUTO";

                }

            }
        );


        // ==============================
        // EXCLUIR PRODUTO
        // ==============================

        async function deleteProduct(
            productId
        ) {

            const confirmDelete =
                confirm(
                    "Deseja realmente excluir este produto?"
                );


            if (!confirmDelete) {

                return;

            }


            try {

                const response =
                    await fetch(
                        `/admin/produtos/${productId}`,
                        {
                            method:
                                "DELETE",

                            headers:
                                {
                                    "Authorization":
                                        `Bearer ${token}`
                                }
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.detail ||
                        "Erro ao excluir produto."
                    );

                    return;

                }


                showMessage(
                    "Produto removido com sucesso!",
                    "success"
                );


                await loadProducts();

            }


            catch (error) {

                console.error(
                    error
                );


                showMessage(
                    "Erro ao conectar ao servidor.",
                    "error"
                );

            }

        }


        // ==============================
        // ATUALIZAR
        // ==============================

        if (reloadProducts) {

            reloadProducts.addEventListener(
                "click",
                loadProducts
            );

        }


        // ==============================
        // LOGOUT
        // ==============================

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                function () {

                    localStorage.removeItem(
                        "access_token"
                    );

                }
            );

        }


        // ==============================
        // INICIAR
        // ==============================

        loadProducts();

    }
);