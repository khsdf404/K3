class Views { 
    static SetUp() {
        // tables = [books, food]
        forEach(tablesInfo, tableInfo => {
            const tableName = tableInfo['name'];
            const tableImage = tableInfo['image'];

            if (tables[tableName]) {
                Views.DrawAsideButton(tableName, tableImage);
                Views.DrawView(tables[tableName], tableName);
                ProductAmount.SetUp(tableName);
            }
        })


        let $viewBtns = $jsf(`aside article, header section button, .header-logo`);
        $viewBtns.onClick($e => {
            $viewBtns.removeClass('active');
            $e.addClass('active');
            Views.ShowView($e.attr('data-name'));
        })
        return;  
    }

    static DrawView(rows, tableName) {
        let html = `<section id="${tableName}View" class="product-view">`;
        for (let i = 0; i < rows.length; i++)
            html += ProductCard.GetCard(rows[i], tableName);
        html += '</section>'
        $jsf(`#views`).appendChild(html);
    }
    static RemoveView(tableName) {
        let $views = $jsf(`#views`);

        $views.get().removeChild($views.find(`#${tableName}View`).get())
    }
    static ShowView(name) {
        // arr = getStuff(name) ......
        $jsf('.active').eachJSF($e => {
            if ($e.id() == 'cartView') {
                forEach(tablesInfo, tableInfo => {
                    const tableName = tableInfo['name'];
                    
                    Views.RemoveView(tableName);
                    Views.DrawView(tables[tableName], tableName);
                    ProductAmount.SetUp(tableName);
                })
            }
        })

        $jsf(`#views section`).removeClass('active');
        $jsf(`#${name}View`).addClass('active');

        if (name == 'cart') {
            CartView.DrawView();
            CartView.DynamicListeners();
        }
    }

    static DrawAsideButton(tableName, tableImage) {
        $jsf('aside').appendChild(`
            <article data-name="${tableName}">
                <span class="sidebar-icon" style="background-image: url('${tableImage}')"></span>
                <span class="sidebar-label non-select">${tableName}</span>
            </article>
        `);
    }
};