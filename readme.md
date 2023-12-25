/api: mvn clean install
/auth: JAVA_HOME=/usr/lib/jvm/java-1.17.0-openjdk-amd64 && mvn clean install

/: docker compose down && sudo rm dump.rdb && docker compose build --no-cache && docker compose up






// http://localhost:8081/auth/getAll/
// http://localhost:8081/auth/users/getAll/ 

DB.Request('/api/orders/', 'GET', null, 
LocalDB.GetToken()          
)