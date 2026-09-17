import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class LabRepository {

    public static List<Lab> getAllLabs() {

        List<Lab> labs = new ArrayList<>();

        String sql = "SELECT * FROM labs";

        try (Connection connection = Database.getConnection();
             Statement statement = connection.createStatement();
             ResultSet result = statement.executeQuery(sql)) {

            while (result.next()) {

                Lab lab = new Lab(
                    result.getInt("id"),
                    result.getString("name"),
                    result.getString("description"),
                    result.getString("difficulty")
                );

                labs.add(lab);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return labs;
    }
}