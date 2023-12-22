class ProductCard {
    static GetCard(row, tableName) {
        let localRow = ProductCard.GetLocalRow(row, tableName);
        return `
            <div class="product-card" data-id="${row['id']}" data-name="${row['name']}" data-price="${row['price']}" data-tablename="${tableName}">
                <div class="product-info">
                    <span class="product-image" style="background-image: url('${row['image']}')"></span>
                    <div class="product-text">
                        <span class="product-price">${row['price']}  <span style="font-size: 12px">(only ${row['amount']} left)</span></span>
                        <span class="product-name">${row['name']}</span>
                    </div>
                </div>
                <div class="product-amount-control">
                    <button class="product-append${localRow ? ' inactive' : ''}">Append</button>
                    <div class="product-counter${localRow ? ' active' : ''}">
                        <span class="product-remove non-select">-</span>
                        <input class="product-amount" 
                            value="${localRow ? localRow['amount'] : '1'}"
                            name="cart-input"/>
                        <span class="product-add non-select">+</span>
                    </div>
                </div>
            </div>
        `;
    }
    static GetLocalRow(row, tableName) {
        let table = LocalDB.GetObject()[tableName];
        if (LocalDB.Find(table, row['id']) != null) {
            LocalDB.SetEmpty(false);
            log(row['id'] + ', ' + tableName)
        }
        return LocalDB.Find(table, row['id']);
    }
};