class CartAmount {
    static SetUp() {
        CartAmount.itemAmount = $jsf('.table-row').size() - 1;

        CartAmount.InputListener();
        CartAmount.AddListener();
        CartAmount.RemoveListener();

        CartAmount.UpdateTotalPrice();
    }

    static InputListener() {
        $jsf(`#cartView input`)
            .onEvent('blur', $e => {
                let id = parseInt($e.parent(`.table-row`).attr('data-id'));
                let tableName = $e.parent(`.table-row`).attr('data-tablename');

                $e.value($e.value().replace(/^$|^0$/g, '1'));

                LocalDB.SetAmount(tableName, id, parseInt($e.value()));

                CartAmount.UpdatePrice($e, parseInt($e.value()));
                CartAmount.UpdateTotalPrice();
            })
            .onEvent('input', $e => {
                $e.value($e.value().replace(/[^0-9]+|^0[0-9]+/g, ''));
            })
    }

    static AddListener() {
        $jsf(`.cart-add`).onClick(($e) => {
            let $parent = $e.parent();
            let $amount = $parent.find('.cart-amount');
            let currentAmount = parseInt($amount.value()) + 1;
            
            let $price = $e.parent(`.table-row`).find('.cart-price');
            let price = $price.attr('data-price');

            $amount.value(currentAmount)

            CartAmount.UpdatePrice($e, currentAmount);
            CartAmount.UpdateTotalPrice(price);

            // set currentAmount of instance in DB !
            let id = parseInt($e.parent(`.table-row`).attr('data-id'));
            let tableName = $e.parent(`.table-row`).attr('data-tablename');
            LocalDB.IncreaseAmount(tableName, id)
        })
    }
    static RemoveListener() {
        $jsf(`.cart-remove`).onClick(($e) => {
            let $parent = $e.parent();
            let $amount = $parent.find('.cart-amount');
            let currentAmount = parseInt($amount.value()) - 1 || 1;

            let $price = $e.parent(`.table-row`).find('.cart-price');
            let price = $price.attr('data-price');

            $amount.value(currentAmount);

            CartAmount.UpdatePrice($e, currentAmount);
            CartAmount.UpdateTotalPrice(-1 * price);

            // set currentAmount of instance in DB !
            let id = parseInt($e.parent(`.table-row`).attr('data-id'));
            let tableName = $e.parent(`.table-row`).attr('data-tablename');
            LocalDB.SetAmount(tableName, id, currentAmount)
        })
    }


    static UpdateTotalPrice(diff = null) {
        if (diff != null) {
            let total = parseFloat($jsf(`.total-price span`).text());
            total += parseFloat(diff);
            $jsf(`.total-price span`).text(`${Math.ceil(total * 100) / 100} $`);
            return;
        }
        const cartObj = LocalDB.GetObject();
        let total = 0;

        forEach(cartObj, table => {
            forEach(table, row => {
                total += parseFloat(row['price']) * parseInt(row['amount']) 
            })
        })

        total = Math.ceil(total * 100) / 100;

        $jsf(`.total-price span`).text(`${total} $`);

        // change dollar to rub and euros here
    }


    static UpdatePrice($e, amount) {
        let $price = $e.parent(`.table-row`).find('.cart-price');
        let price = $price.attr('data-price');
        $price.text(`${
            Math.ceil(
                    amount
                    * parseFloat(price)
                    * 100
                ) / 100
            } ${price[price.length - 1]}
        `)
    }

    static UpdateHeader() {
        CartAmount.itemAmount--;
        if (CartAmount.itemAmount == 0)
                $jsf('.cart-buttons button').addClass('disabled')
                && $jsf('#cartView .header-text').text('Your cart is empty');
        else
            $jsf('.cart-buttons button').removeClass('disabled')
            && $jsf('#cartView .header-text').text(`Your cart contains ${CartAmount.itemAmount} ${CartAmount.itemAmount == 1 ? 'item' : 'items'}`);
    }
}