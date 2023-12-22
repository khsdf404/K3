const tablesInfo = [
    {
        'name': 'books',
        'image': '/src/icons/books.png'
    },
    {
        'name': 'food',
        'image': '/src/icons/food.png'
    },
    {
        'name': 'devices',
        'image': '/src/icons/devices.png'
    },
    {
        'name': 'clothes',
        'image': '/src/icons/clothes.png'
    },
    {
        'name': 'slaves',
        'image': '/src/icons/niggers.png'
    }
]
let tables;

DB.Redirect().then(async () => {
    
    if (!localStorage['cart'] || !localStorage['cart'][0]) {
        await DB.GetCart().then(data => {
            log(data == null)
            if (data == null)
                localStorage['cart'] = JSON.stringify({})
            else
                localStorage['cart'] = data.json;
        })
    }
    
    
    DB.GetTables().then(data => {
        tables = data;
        log(data)
        Views.SetUp();
    })

});








