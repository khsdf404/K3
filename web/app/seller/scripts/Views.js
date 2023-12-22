class Views { 
    static views = ['books', 'food'];

    static SetUp() {
        // tables = [books, food]
        forEach(tablesInfo, tableInfo => {
            const tableName = tableInfo['name'];
            const tableImage = tableInfo['image'];
            const tableFields = tableInfo['fields'];

            Views.DrawAsideButton(tableName, tableImage);
            Views.DrawView(tables[tableName] || [], tableFields, tableName);
            Table.DynamicListeners(tableName);
        })


        let $viewBtns = $jsf(`aside article, header section button, .header-logo`);
        $viewBtns.onClick($e => {
            $viewBtns.removeClass('active');
            $e.addClass('active');
            Views.ShowView($e.attr('data-name'));
        })
        return;  
    }

    static DrawView(rows, fields, tableName) {
        let html = `<section id="${tableName}View" class="product-view">
        <div class="header">
            <span class="header-text">Your ${tableName}:</span>
            <div class="table-buttons">
                <button class="new-row-btn">Add new</button>
                <button class="update-btn">Update</button>
            </div>
        </div>`;
        html += Table.GetTable(rows, fields, tableName);
        html += '</section>'
        $jsf(`#views`).appendChild(html);
    }
    static RedrawViews() {
        forEach(tablesInfo, tableInfo => {
            const tableName = tableInfo['name'];
            const tableFields = tableInfo['fields'];
            
            Views.RemoveView(tableName);
            Views.DrawView(tables[tableName], tableFields, tableName);
            Table.DynamicListeners(tableName);

        })
    }


    static ShowView(tableName) {
        // arr = getStuff(name) ......
        $jsf('.active').eachJSF($e => {
            if ($e.id() == 'cartView') {
                Views.RedrawViews();
            }
        })

        $jsf(`#views section`).removeClass('active');
        $jsf(`#${tableName}View`).addClass('active');
    }


    static RemoveView(tableName) {
        let $views = $jsf(`#views`);

        $views.get().removeChild($views.find(`#${tableName}View`).get())
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

