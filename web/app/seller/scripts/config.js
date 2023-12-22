const tablesInfo = [
    {
        'name': 'books',
        'image': '/src/icons/books.png',
        'fields': ['name', 'author', 'amount', 'price', 'image', 'template']
    },
    {
        'name': 'food',
        'image': '/src/icons/food.png',
        'fields': ['name', 'calories', 'amount', 'price', 'image', 'template']
    },
    // {
    //     'name': 'devices',
    //     'image': '/src/icons/devices.png'
    // },
    // {
    //     'name': 'clothes',
    //     'image': '/src/icons/clothes.png'
    // },
    {
        'name': 'slaves',
        'image': '/src/icons/niggers.png',
        'fields': ['name', 'prisoner', 'amount', 'price', 'image', 'template']
    }
]
let tables;

DB.Redirect().then(async () => {

    DB.GetTables().then(data => {
        tables = data;
        log(data)
        Views.SetUp();
    })

});








