class ProductAmount {
    static SetUp(tableName) {
        let $view = $jsf(`#${tableName}View`);
        ProductAmount.InputListener($view, tableName);
        ProductAmount.AppendListener($view, tableName);
        ProductAmount.AddListener($view, tableName);
        ProductAmount.RemoveListener($view, tableName);
    }

    static InputListener($view, tableName) {
        $view
            .find(`input`)
            .onEvent('blur', $e => {
                let id = parseInt($e.parent(`.product-card`).attr('data-id'));
                LocalDB.SetAmount(tableName, id, parseInt($e.value()) || 0);
                if ($e.value() == '' || $e.value() == '0')
                    ProductAmount.DisableCounter($e);
            })
            .onEvent('input', $e => {
                $e.value($e.value().replace(/[^0-9]+|^0[0-9]+/g, ''));
            })
    }

    static AppendListener($view, tableName) {
        $view.find(`.product-append`).onClick(($e) => {
            ProductAmount.EnableCounter($e);

            let $parent = $e.parent();
            let $amount = $parent.find('.product-amount');
            $amount.value(1)
    
            // append 1 instance in DB !
            let $productCart = $e.parent(`.product-card`);
            let obj = {
                'id': parseInt($productCart.attr('data-id')),
                'name': $productCart.attr('data-name'),
                'price': $productCart.attr('data-price'),
                'amount': 1
            }
            LocalDB.CreateRow(tableName, obj)
        })
    }

    static AddListener($view, tableName) {
        $view.find(`.product-add`).onClick(($e) => {
            let $parent = $e.parent();
            let $amount = $parent.find('.product-amount');
            let currentAmount = parseInt($amount.value()) + 1;
            $amount.value(currentAmount)

            // set currentAmount of instance in DB !
            let id = parseInt($e.parent(`.product-card`).attr('data-id'));
            LocalDB.IncreaseAmount(tableName, id)
        })
    }
    static RemoveListener($view, tableName) {
        $view.find(`.product-remove`).onClick(($e) => {
            let $parent = $e.parent();
            let $amount = $parent.find('.product-amount');
            let currentAmount = parseInt($amount.value()) - 1;

            if (currentAmount != 0) $amount.value(currentAmount);

            if (currentAmount == 0) ProductAmount.DisableCounter($e);

            // set currentAmount of instance in DB !
            let id = parseInt($e.parent(`.product-card`).attr('data-id'));
            LocalDB.DecreaseAmount(tableName, id)
        })
    }



    static EnableCounter($e) {
        $e.addClass('inactive');
        let $parent = $e.parent();
        $parent.find('.product-counter').addClass('active');
    }
    static DisableCounter($e) {
        let $parent = $e.parent();
        $parent.removeClass('active');
        $parent.parent().find('.product-append').removeClass('inactive');
    }
}