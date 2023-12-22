class Table {

    static GetTable(rows, fields, tableName, editing = true) {
        let index = 0;

        let tableHtml = '<article class="table">';
        let headerHtml = ''
        let rowsHtml = '';


        forEach(rows, (row, i) => {
            if (i == 0) {
                // table header
                headerHtml = `<section class="table-row table-header">
                    <div class="table-field">№</div>`;

                forEach(fields, key => {
                    if (key != 'id')
                        headerHtml += `<div class="table-field" data-field="${key}">${key}</div>`
                })
                headerHtml += `</section>`;
            }
            rowsHtml += Table.GetRow(tableName, row, fields, ++index, editing);
        })

        tableHtml += headerHtml;
        tableHtml += rowsHtml;
        tableHtml += `</article>`;

        return tableHtml;
    }
    static GetRow(tableName, row, fields, index, editing = true) {
        let rowsHtml = '';

        rowsHtml += `<section class="table-row" data-table="${tableName}" data-id="${row['id']}">`;
        rowsHtml += `<div class="table-field table-index non-select">${index} <span class="table-index-span"></div>`

        forEach(fields, key => {
            if (key != 'id')
                if (!editing)
                    rowsHtml += `<div class="table-field" data-field="${key}">${row[key]}</div>`
                else 
                    rowsHtml += `<div class="table-field" data-field="${key}">
                        <input value="${row[key]}" placeholder="value" name="table-field"/>
                    </div>`
        })

        rowsHtml += `</section>`;

        return rowsHtml;
    }


    static DynamicListeners(tableName) {
        Table.AddRow(tableName);
        Table.RemoveRow(tableName);
        Table.UpdateRow(tableName);
        Table.UpdateTable(tableName);
    }


    static AddRow(tableName) {
        const $table = $jsf(`#${tableName}View .table`);
        let fields;

        forEach(tablesInfo, tableInfo => {
            const name = tableInfo['name'];

            if (tableName == name)
                fields = tableInfo['fields']
        });

        $jsf(`#${tableName}View .new-row-btn`).onClick(async () => {
            let $rows = $table.find(`.table-row`);
            let row = await LocalDB.CreateRow(tableName);
            log(`id: ${row['id']}`);


            $table.appendChild(Table.GetRow(tableName, row, fields, $rows.size()));
            $table.find(`.table-row`).getJSF($rows.size()).onClick($e => {
                let id = parseInt($e.parent(`.table-row`).attr('data-id'));
                let tableName = $e.parent(`.table-row`).attr('data-table');
    
                LocalDB.DeleteRow(tableName, id);
                
                $e.text($e.parent().index())
                $e.parent(`.table`).get().removeChild($e.parent(`.table-row`).get())
            })
        })
    }

    static RemoveRow(tableName) {
        $jsf(`#${tableName}View .table-index`).onClick($e => {
            let id = parseInt($e.parent(`.table-row`).attr('data-id'));
            let tableName = $e.parent(`.table-row`).attr('data-table');

            LocalDB.DeleteRow(tableName, id);

            $e.parent(`.table`).get().removeChild($e.parent(`.table-row`).get());
            $jsf(`#${tableName}View .table-index`).eachJSF($e => {
                $e.text($e.parent().index());
            });
        })
    }

    static UpdateRow(tableName) {
        $jsf(`#${tableName}View`).find(`input`).onEvent('blur', $e => {
            let id = parseInt($e.parent(`.table-row`).attr('data-id'));
            let tableName = $e.parent(`.table-row`).attr('data-table');
            let field = $e.parent(`.table-field`).attr('data-field');

            LocalDB.UpdateRow(tableName, id, field, $e.value());
        })
    }


    static UpdateTable(tableName) {
        $jsf(`#${tableName}View .update-btn`).onClick(() => {
            $jsf(`#${tableName}View`).removeClass('active');
            DB.GetTables().then(data => {
                tables = data;
                LocalDB.SetObject(data);

                Views.RedrawViews();
                Views.ShowView(tableName);
            })
        })
    }
}