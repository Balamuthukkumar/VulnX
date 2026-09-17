import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class DatabaseTest {

    public static void main(String[] args) {

        String url = "jdbc:mysql://localhost:3306/vulnx";
        String username = "root";
        String password = "";

        try {
            Connection connection =
                    DriverManager.getConnection(url, username, password);

            System.out.println("Connected to VulnX database!");

            Statement statement = connection.createStatement();

            String sql = "SELECT * FROM labs";

            ResultSet result = statement.executeQuery(sql);

            while (result.next()) {

                int id = result.getInt("id");
                String name = result.getString("name");
                String description = result.getString("description");
                String difficulty = result.getString("difficulty");

                System.out.println(
                    id + " | " +
                    name + " | " +
                    difficulty
                );
            }

            result.close();
            statement.close();
            connection.close();

        } catch (Exception e) {
            System.out.println("Database operation failed!");
            e.printStackTrace();
        }
    }
}