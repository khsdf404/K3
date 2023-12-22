/api: mvn clean install
/auth: mvn clean install

/: docker compose down && sudo rm dump.rdb && docker compose build --no-cache && docker compose up






// http://localhost:8081/auth/getAll/
// http://localhost:8081/auth/users/getAll/ 

DB.Request('/api/orders/', 'GET', null, 
LocalDB.GetToken()          
)