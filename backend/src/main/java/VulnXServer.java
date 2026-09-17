import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

public class VulnXServer {

    public static void main(String[] args) throws IOException {

        createUsersTable();

        HttpServer server = HttpServer.create(
                new InetSocketAddress(8080), 0);

        // ================================
        // LABS API
        // ================================

        server.createContext("/api/labs", exchange -> {

            List<Lab> labs = LabRepository.getAllLabs();

            StringBuilder json = new StringBuilder("[\n");

            for (int i = 0; i < labs.size(); i++) {

                Lab lab = labs.get(i);

                json.append("  {\n");
                json.append("    \"id\": ").append(lab.getId()).append(",\n");
                json.append("    \"name\": \"").append(lab.getName()).append("\",\n");
                json.append("    \"description\": \"")
                        .append(lab.getDescription()).append("\",\n");
                json.append("    \"difficulty\": \"")
                        .append(lab.getDifficulty()).append("\"\n");
                json.append("  }");

                if (i < labs.size() - 1) {
                    json.append(",");
                }

                json.append("\n");
            }

            json.append("]");

            sendResponse(exchange, json.toString());
        });


        // ================================
        // SQL INJECTION LAB
        // ================================

        server.createContext("/api/login", exchange -> {

            if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
                sendResponse(exchange, "Method not allowed");
                return;
            }

            String body = new String(
                    exchange.getRequestBody().readAllBytes(),
                    StandardCharsets.UTF_8
            );

            String username = getValue(body, "username");
            String password = getValue(body, "password");

            try (Connection connection = Database.getConnection()) {

                // INTENTIONALLY VULNERABLE QUERY
                // This is only for the local VulnX learning lab.

                String sql =
                        "SELECT * FROM users WHERE username = '"
                        + username
                        + "' AND password = '"
                        + password
                        + "'";

                Statement statement = connection.createStatement();

                ResultSet result = statement.executeQuery(sql);

                if (result.next()) {

                    sendResponse(
                            exchange,
                            "LOGIN SUCCESSFUL! You found the SQL Injection vulnerability."
                    );

                } else {

                    sendResponse(
                            exchange,
                            "Login failed. Try investigating how the input is processed."
                    );
                }

            } catch (Exception e) {

                sendResponse(
                        exchange,
                        "Database error: " + e.getMessage()
                );
            }
        });


        server.start();

        System.out.println(
                "VulnX server running at http://localhost:8080");
    }


    // ================================
    // CREATE LAB USERS
    // ================================

    private static void createUsersTable() {

        String sql =
                "CREATE TABLE IF NOT EXISTS users (" +
                "id INT AUTO_INCREMENT PRIMARY KEY," +
                "username VARCHAR(50)," +
                "password VARCHAR(50)" +
                ")";

        try (Connection connection = Database.getConnection();
             Statement statement = connection.createStatement()) {

            statement.executeUpdate(sql);

            statement.executeUpdate(
                    "INSERT IGNORE INTO users (id, username, password) " +
                    "VALUES (1, 'admin', 'vulnx123')"
            );

            System.out.println("Users table ready.");

        } catch (Exception e) {

            e.printStackTrace();
        }
    }


    // ================================
    // READ FORM DATA
    // ================================

    private static String getValue(String body, String key) {

        try {

            for (String pair : body.split("&")) {

                String[] parts = pair.split("=", 2);

                if (parts.length == 2 &&
                        parts[0].equals(key)) {

                    return URLDecoder.decode(
                            parts[1],
                            StandardCharsets.UTF_8
                    );
                }
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return "";
    }


    // ================================
    // SEND RESPONSE
    // ================================

    private static void sendResponse(
            com.sun.net.httpserver.HttpExchange exchange,
            String response) throws IOException {

        exchange.getResponseHeaders()
                .set("Content-Type", "text/plain; charset=UTF-8");

        byte[] data = response.getBytes(StandardCharsets.UTF_8);

        exchange.sendResponseHeaders(200, data.length);

        try (OutputStream output = exchange.getResponseBody()) {

            output.write(data);
        }
    }
}