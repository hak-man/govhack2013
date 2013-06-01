package gov.pop;

import java.io.BufferedReader;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class BigMain {
	public static void main(String[] args) {
		File file = new File("pop.csv");
		BufferedReader reader = null;
		List<Suburb> suburbs = new ArrayList<Suburb>();
		try {
			reader = new BufferedReader(new FileReader(file));
			String text = null;
			while ((text = reader.readLine()) != null) {
				Suburb suburb = new Suburb(text);
				suburbs.add(suburb);
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		List<String> sqlOutput = new ArrayList<String>(); 

		for (Suburb suburb : suburbs) {
			int lga_id = suburb.getID();
			String name = suburb.getName();

			Map<Range, List<Projection>> projs = suburb.getProjections();
			for (Range range : projs.keySet()) {
				int lowerBound = range.getLower();
				int upperBound = range.getUpper();
				
				for (Projection projection : projs.get(range)) {
					int year = projection.getYear();
					int number = projection.getNumber();
					int total = projection.getTotal();
					double percentage = projection.getPercentage();
					// Generate Projection Table
					sqlOutput.add("INSERT INTO Population VALUES("
							+ lga_id + ", "
							+ name + ", "
							+ lowerBound + ", "
							+ upperBound + ", "
							+ year + ", "
							+ number + ", "
							+ total + ", "
							+ percentage
							+ ");");
				}
			}
		}
		
		// Create SQL output with commit
		int lineCounter = 0;
		for (String line : sqlOutput)
		{
			System.out.println(line);
			if (lineCounter++ == 100)
			{
				System.out.println("commit;");
				lineCounter = 0;
			}
		}
		System.out.println("commit;");
	}
}
