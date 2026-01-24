# Front end Runs on
[Port 5173](http://localhost:5173)
Backend end Runs on
[Port 8080] http://localhost:8080/

# For Unit Testing
- MacOS (cd to backend folder):
./mvnw clean package -DskipTests  
./mvnw test

- Windows (cd to backend folder): 
mvn clean package -DskipTests
mvn test

# How to run Springboot
- MacOS   
./mvnw spring-boot:run  
- Windows 
mvn spring-boot:run
- Java JDK 17+

# How to run React/Vite Frontend
- frontend % npm run dev
- Node.js & npm 

# How run Docker (it runs frontend and backend together)
- run at base of project
docker-compose up --build 
- Docker handles the entire build process

-if code is modified 
mvn clean package -DskipTests
docker-compose up --build 

# Extra Notes
- AWS creds stored in application properties
- Docker desktop installation is needed
- SQL data can be found at backend/src/main/resources/data.sql (DML)
- SQL Script can be found at sql.txt in project root (DDL)
- AWS password is private since we don't want to share AWS password on public repository. So we zipped and submitted
- You don't need SQL scripts since AWS and springboot handles it 
- AWS connected to our project through application properties

# Also Look at curl.txt for curl commands
By design OrderService test (1 out of 9 test) may fail due to 10 percent failure rate (that was built in), as specified by the handout

# Admin Username and password
admin@test.com
adminpass
