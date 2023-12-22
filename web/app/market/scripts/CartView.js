class CartView {
    static SetUp() {
        this.StaticListeners();
    }
    static DrawView() {
        $jsf(`#cartView .table`).ihtml((() => {
            let cartObj = LocalDB.GetObject();
            let index = 0;

            let tableHtml = `
                <section class="table-row table-header">
                    <div class="table-field">№</div>
                    <div class="table-field">Product name</div>
                    <div class="table-field">Amount</div>
                    <div class="table-field">Total price</div>
                </section>
            `;
            let cellsHtml = '';


            forEach(cartObj, (table, i) => {
                forEach(table, item => {
                    cellsHtml += `
                        <section class="table-row" data-tablename="${Object.keys(cartObj)[i]}" data-id="${item['id']}">
                            <div class="table-field cart-index">${++index} <span class="cart-index-span"></span></div>
                            <div class="table-field cart-name">${item['name']}</div>
                            <div class="table-field cart-counter">
                                <span class="cart-remove non-select">-</span>
                                <input class="cart-amount non-select" value="${item['amount']}"/>
                                <span class="cart-add non-select">+</span>
                            </div>
                            <div class="table-field cart-price" data-price="${item['price']}">${
                                Math.ceil(
                                        parseFloat(item['amount']) 
                                        * parseFloat(item['price']) 
                                        * 100
                                    ) / 100
                                } 
                                ${item['price'][item['price'].length - 1]}
                            </div>
                        </section>
                    `
                })
            })


            if (cellsHtml == '')
                $jsf('.cart-buttons button').addClass('disabled')
                && $jsf('#cartView .header-text').text('Your cart is empty');
            else
                $jsf('.cart-buttons button').removeClass('disabled')
                && $jsf('#cartView .header-text').text(`Your cart contains ${index} ${index == 1 ? 'item' : 'items'}`);


            return tableHtml += cellsHtml;
        })());
    }
    static DynamicListeners() {
        CartAmount.SetUp();
        $jsf(`.table-row .cart-index`).onClick($e => {
            let id = parseInt($e.parent(`.table-row`).attr('data-id'));
            let tableName = $e.parent(`.table-row`).attr('data-tablename');
            LocalDB.SetAmount(tableName, id, 0);

            CartAmount.UpdateHeader()
            CartAmount.UpdateTotalPrice();
            $e.parent(`.table`).get().removeChild($e.parent(`.table-row`).get())
        })
    }
    static StaticListeners() {
        $jsf(`#placeOrder`).onClick(($e) => {
            if ($e.hasClass('disabled')) return;

            DB.CreateOrder().then(order => {
               if (order == null) return;

                $jsf('.cart-buttons button').addClass('disabled')
                && $jsf('#cartView .header-text').text('Your cart is empty');

                LocalDB.SetObject({});

                $jsf(`.table-row`).not(`.table-header`).ohtml(``);
                CartAmount.UpdateTotalPrice();
            });
        })
        $jsf(`#clearCart`).onClick($e => {
            if ($e.hasClass('disabled')) return;

            $jsf('.cart-buttons button').addClass('disabled')
            && $jsf('#cartView .header-text').text('Your cart is empty');

            $jsf(`.table-row`).not(`.table-header`).ohtml(``);

            LocalDB.SetObject({});
            CartAmount.UpdateTotalPrice();
        })
    }
}

CartView.SetUp();