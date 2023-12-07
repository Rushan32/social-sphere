import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class CSVReader {
    private final String csvFile;

    // Constructor that takes the path to the CSV file as input
    public CSVReader(String csvFile) {
        this.csvFile = csvFile;
    }

    // Method to read the CSV file and return its contents as a list of string arrays
    public List<String[]> readCSV() {
        List<String[]> rows = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader(csvFile))) {
            String line;
            // Read each line of the CSV file
            while ((line = br.readLine()) != null) {
                // Split the line into values using a comma as the delimiter
                String[] values = line.split(",", -1); // Use -1 to keep empty values

                // Trim whitespace from each value and add it to the list
                for (int i = 0; i < values.length; i++) {
                    values[i] = values[i].trim();
                }
                rows.add(values);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return rows;
    }
}
