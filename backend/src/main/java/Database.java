import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {

    public static Connection getConnection() throws SQLException {

        String host = System.getenv("MYSQLHOST");
        String port = System.getenv("MYSQLPORT");
        String database = System.getenv("MYSQLDATABASE");
        String username = System.getenv("MYSQLUSER");
        String password = System.getenv("MYSQLPASSWORD");

        String url = "jdbc:mysql://" + host + ":" + port + "/" + database;

        return DriverManager.getConnection(url, username, password);
    }
}